import { supabase } from "@/lib/supabase";
import { createProfile } from "@/services/profileService";
import { createProviderProfile } from "@/services/providerService";

export async function login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) throw error;
    return data;
}

export async function registerUser(formData) {
    const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
    });

    if (error) throw error;

    const userId = data.user.id;

    await createProfile({
        id: userId,
        full_name: formData.fullName,
        phone_number: formData.phoneNumber,
        role: formData.role,
        city: formData.city,
        avatar_url: null,
    });

    if (formData.role === "provider") {
        await createProviderProfile({
            provider_id: userId,
            category: formData.category,
            bio: formData.bio,
            skills: formData.skills,
        });
    }

    return data;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
}