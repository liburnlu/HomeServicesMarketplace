import { withMockReviewsIfEmpty } from "@/data/mockReviews";
import { assertSingleRow, wrapSupabaseError } from "@/lib/supabaseRow";
import { supabase } from "@/lib/supabase";

export async function createReview(review) {
    const { data, error } = await supabase
        .from("reviews")
        .insert(review)
        .select()
        .maybeSingle();

    if (error) {
        throw wrapSupabaseError(error, "Could not submit your review.");
    }

    return assertSingleRow(data, "Review was not saved. Check Supabase policies on reviews.");
}

export async function getProviderReviews(providerId) {
    const { data, error } = await supabase
        .from("reviews")
        .select("*, profiles(*)")
        .eq("provider_id", providerId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return withMockReviewsIfEmpty(providerId, data ?? []);
}