import { supabase } from "@/lib/supabase";

export async function getProfileById(userId) {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

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