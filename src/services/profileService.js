import { assertSingleRow, wrapSupabaseError } from "@/lib/supabaseRow";
import { supabase } from "@/lib/supabase";

export async function getProfileById(userId) {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function createProfile(profile) {
    const { data, error } = await supabase
        .from("profiles")
        .insert(profile)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function updateProfile(userId, updates) {
    const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .maybeSingle();

    if (error) {
        throw wrapSupabaseError(
            error,
            "Could not update your profile. Add a Supabase policy allowing users to update their own profile row."
        );
    }

    return assertSingleRow(
        data,
        "Profile was not updated. Ensure you are signed in and row-level security allows updates to your profile."
    );
}