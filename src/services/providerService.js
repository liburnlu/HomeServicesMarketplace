import { supabase } from "@/lib/supabase";

export async function getProviderProfileById(providerId) {
    const { data, error } = await supabase
        .from("provider_profiles")
        .select("*")
        .eq("provider_id", providerId)
        .maybeSingle();

    if (error) throw error;
    return data;
}

export async function createProviderProfile(providerProfile) {
    const { data, error } = await supabase
        .from("provider_profiles")
        .insert(providerProfile)
        .select()
        .single();

    if (error) throw error;
    return data;
}