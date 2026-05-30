/** Demo reviews shown when a provider has no reviews in Supabase yet. */

const POSITIVE_REVIEW_TEMPLATES = [
    {
        customerName: "Altin K.",
        rating: 5,
        comment:
            "Excellent work — arrived on time, explained everything clearly, and left the place spotless. Highly recommend!",
        daysAgo: 5,
    },
    {
        customerName: "Ermira H.",
        rating: 5,
        comment:
            "Very professional and friendly. The job was done faster than expected and the quality was outstanding.",
        daysAgo: 18,
    },
    {
        customerName: "Besart M.",
        rating: 5,
        comment:
            "We've used this tradesperson twice now. Fair pricing, great communication, and reliable results every time.",
        daysAgo: 32,
    },
    {
        customerName: "Dritan S.",
        rating: 4,
        comment:
            "Solid experience from start to finish. Small follow-up was handled quickly — would book again.",
        daysAgo: 47,
    },
    {
        customerName: "Arbnora B.",
        rating: 5,
        comment:
            "Super helpful and knowledgeable. Took care of the issue properly and gave honest advice for the future.",
        daysAgo: 61,
    },
    {
        customerName: "Fatmir G.",
        rating: 5,
        comment:
            "Prompt response, tidy work, and great attention to detail. One of the best local tradespeople we've hired.",
        daysAgo: 74,
    },
];

function hashString(value) {
    let hash = 0;
    const str = String(value ?? "");
    for (let i = 0; i < str.length; i += 1) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

function daysAgoIso(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
}

export function getMockReviewsForProvider(providerId) {
    const offset = hashString(providerId) % 2;
    const slice = POSITIVE_REVIEW_TEMPLATES.slice(offset, offset + 4);

    return slice.map((template, index) => ({
        id: `mock-review-${providerId}-${index}`,
        provider_id: providerId,
        rating: template.rating,
        comment: template.comment,
        created_at: daysAgoIso(template.daysAgo + index * 3),
        profiles: {
            full_name: template.customerName,
        },
    }));
}

export function getMockReviewStats(providerId) {
    const reviews = getMockReviewsForProvider(providerId);
    const count = reviews.length;
    const avgRating = Number(
        (reviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1)
    );
    return { count, avgRating };
}

export function withMockReviewsIfEmpty(providerId, reviews) {
    if (reviews?.length > 0) {
        return reviews;
    }
    return getMockReviewsForProvider(providerId);
}

export function withMockStatsIfEmpty(providerId, reviewStats) {
    if (reviewStats?.count > 0) {
        return reviewStats;
    }
    return getMockReviewStats(providerId);
}
