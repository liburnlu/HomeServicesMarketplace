import { getMockReviewStats } from "@/data/mockReviews";
import { supabase } from "@/lib/supabase";

const CATEGORY_ID_MAP = {
    plumber: "plumbing",
    plumbing: "plumbing",
    electrician: "electrical",
    electrical: "electrical",
    painter: "painting",
    painting: "painting",
    cleaner: "cleaning",
    cleaning: "cleaning",
    handyman: "handyman",
    hvac: "hvac",
    landscaping: "landscaping",
};

function categoryToId(category) {
    const key = category?.trim().toLowerCase() ?? "";
    if (CATEGORY_ID_MAP[key]) return CATEGORY_ID_MAP[key];
    for (const [needle, id] of Object.entries(CATEGORY_ID_MAP)) {
        if (key.includes(needle)) return id;
    }
    return "general";
}

export function mapProviderRow(row, reviewStats = {}) {
    const profile = row.profiles ?? {};
    const providerId = row.provider_id ?? profile.id;

    return {
        id: providerId,
        name: profile.full_name ?? "Unknown",
        category: categoryToId(row.category),
        categoryLabel: row.category ?? "Tradesperson",
        city: profile.city ?? "",
        rating: reviewStats.avgRating ?? 4.5,
        reviewCount: reviewStats.count ?? 0,
        verified: true,
        priceFrom: 25,
        responseTime: "Within 24 hours",
        bio: row.bio ?? "",
        skills: row.skills ?? [],
        avatarUrl: profile.avatar_url ?? null,
    };
}

function buildReviewStats(reviews) {
    const statsByProvider = {};
    for (const review of reviews ?? []) {
        if (!review.provider_id) continue;
        if (!statsByProvider[review.provider_id]) {
            statsByProvider[review.provider_id] = { total: 0, count: 0 };
        }
        statsByProvider[review.provider_id].total += review.rating;
        statsByProvider[review.provider_id].count += 1;
    }
    return statsByProvider;
}

export async function listProviders() {
    const { data, error } = await supabase
        .from("provider_profiles")
        .select(
            `
            *,
            profiles (
                id,
                full_name,
                city,
                avatar_url
            )
        `
        )
        .order("updated_at", { ascending: false });

    if (error) throw error;

    let statsByProvider = {};
    try {
        const { data: reviews, error: reviewsError } = await supabase
            .from("reviews")
            .select("provider_id, rating");

        if (!reviewsError) {
            statsByProvider = buildReviewStats(reviews);
        }
    } catch {
        // Reviews are optional for the listing — don't block providers
    }

    return (data ?? []).map((row) => {
        const stats = statsByProvider[row.provider_id];
        const reviewStats = stats
            ? {
                  count: stats.count,
                  avgRating: Number((stats.total / stats.count).toFixed(1)),
              }
            : getMockReviewStats(row.provider_id);
        return mapProviderRow(row, reviewStats);
    });
}

export async function getProviderDetail(providerId) {
    const { data, error } = await supabase
        .from("provider_profiles")
        .select(
            `
            *,
            profiles (
                id,
                full_name,
                city,
                avatar_url,
                phone_number
            )
        `
        )
        .eq("provider_id", providerId)
        .maybeSingle();

    if (error) throw error;
    if (!data) return null;

    let reviewStats = {};
    try {
        const { data: reviews, error: reviewsError } = await supabase
            .from("reviews")
            .select("rating")
            .eq("provider_id", providerId);

        if (!reviewsError && reviews?.length) {
            const count = reviews.length;
            const avgRating = Number(
                (
                    reviews.reduce((sum, r) => sum + r.rating, 0) / count
                ).toFixed(1)
            );
            reviewStats = { count, avgRating };
        } else {
            reviewStats = getMockReviewStats(providerId);
        }
    } catch {
        reviewStats = getMockReviewStats(providerId);
    }

    return mapProviderRow(data, reviewStats);
}

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

export async function updateProviderProfile(providerId, updates) {
    const { data, error } = await supabase
        .from("provider_profiles")
        .update(updates)
        .eq("provider_id", providerId)
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function saveProviderProfile(providerId, fields, existing) {
    if (existing) {
        return updateProviderProfile(providerId, fields);
    }
    return createProviderProfile({
        provider_id: providerId,
        ...fields,
    });
}
