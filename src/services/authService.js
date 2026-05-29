import { supabase } from "@/lib/supabase";
import { formatAuthError, normalizeEmail } from "@/lib/authErrors";
import { createProfile, getProfileById } from "@/services/profileService";
import {
    createProviderProfile,
    getProviderProfileById,
} from "@/services/providerService";

const MIN_PASSWORD_LENGTH = 6;

function assertPassword(password) {
    if (!password || password.length < MIN_PASSWORD_LENGTH) {
        const err = new Error(
            `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
        );
        err.code = "weak_password";
        throw err;
    }
}

function metadataFromFormData(formData) {
    const meta = {
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        role: formData.role,
        city: formData.city,
    };

    if (formData.role === "provider") {
        meta.category = formData.category;
        meta.bio = formData.bio;
        meta.skills = formData.skills;
    }

    return meta;
}

function formDataFromMetadata(metadata = {}) {
    return {
        fullName: metadata.full_name,
        phoneNumber: metadata.phone_number,
        role: metadata.role ?? "customer",
        city: metadata.city,
        category: metadata.category,
        bio: metadata.bio,
        skills: metadata.skills,
    };
}

async function createProfileRecords(userId, formData) {
    await createProfile({
        id: userId,
        full_name: formData.fullName,
        phone_number: formData.phoneNumber || null,
        role: formData.role,
        city: formData.city || null,
        avatar_url: null,
    });

    if (formData.role === "provider") {
        await createProviderProfile({
            provider_id: userId,
            category: formData.category,
            bio: formData.bio || null,
            skills: formData.skills ?? [],
        });
    }
}

export async function ensureUserProfile(user) {
    if (!user?.id) return null;

    const existing = await getProfileById(user.id);
    if (existing) {
        if (existing.role === "provider") {
            const provider = await getProviderProfileById(user.id);
            if (!provider && user.user_metadata?.category) {
                const formData = formDataFromMetadata(user.user_metadata);
                await createProviderProfile({
                    provider_id: user.id,
                    category: formData.category,
                    bio: formData.bio || null,
                    skills: formData.skills ?? [],
                });
            }
        }
        return existing;
    }

    const formData = formDataFromMetadata(user.user_metadata);
    if (!formData.fullName) return null;

    await createProfileRecords(user.id, formData);
    return getProfileById(user.id);
}

export async function login(email, password) {
    const normalizedEmail = normalizeEmail(email);
    assertPassword(password);

    const { data, error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
    });

    if (error) {
        const err = new Error(formatAuthError(error));
        err.code = error.code ?? error.error_code;
        throw err;
    }

    if (data.user) {
        await ensureUserProfile(data.user);
    }

    return data;
}

export async function registerUser(formData) {
    const email = normalizeEmail(formData.email);
    assertPassword(formData.password);

    const { data, error } = await supabase.auth.signUp({
        email,
        password: formData.password,
        options: {
            data: metadataFromFormData(formData),
        },
    });

    if (error) {
        const err = new Error(formatAuthError(error));
        err.code = error.code ?? error.error_code;
        throw err;
    }

    const userId = data.user?.id;

    if (userId && data.session) {
        try {
            await createProfileRecords(userId, formData);
        } catch (profileError) {
            const err = new Error(
                profileError.message ??
                    "Account created but profile setup failed. Try signing in."
            );
            err.code = profileError.code;
            throw err;
        }
    }

    return data;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
        const err = new Error(formatAuthError(error));
        err.code = error.code ?? error.error_code;
        throw err;
    }
}
