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

    const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("provider_id, rating");

    if (reviewsError) throw reviewsError;

    const statsByProvider = {};
    for (const review of reviews ?? []) {
        if (!review.provider_id) continue;
        if (!statsByProvider[review.provider_id]) {
            statsByProvider[review.provider_id] = { total: 0, count: 0 };
        }
        statsByProvider[review.provider_id].total += review.rating;
        statsByProvider[review.provider_id].count += 1;
    }

    return (data ?? []).map((row) => {
        const stats = statsByProvider[row.provider_id];
        const reviewStats = stats
            ? {
                  count: stats.count,
                  avgRating: Number((stats.total / stats.count).toFixed(1)),
              }
            : {};
        return mapProviderRow(row, reviewStats);
    });
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