import { supabase } from "@/lib/supabase";

export async function createReview(review) {
    const { data, error } = await supabase
        .from("reviews")
        .insert(review)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getProviderReviews(providerId) {
    const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles(*)")
        .eq("provider_id", providerId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
}