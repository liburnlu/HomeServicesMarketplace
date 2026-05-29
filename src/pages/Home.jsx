import { useEffect, useMemo, useState } from "react";
import { ShieldCheck, Star, Users } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProviderCard from "@/components/home/ProviderCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SERVICE_CATEGORIES } from "@/data/mockData";
import { isSupabaseConfigured } from "@/lib/supabase";
import { listProviders } from "@/services/providerService";

const TRUST_STATS = [
    { icon: Users, label: "2,400+ jobs posted" },
    { icon: Star, label: "4.8 avg. rating" },
    { icon: ShieldCheck, label: "Verified tradespeople" },
];

export default function Home() {
    const [providers, setProviders] = useState([]);
    const [loadError, setLoadError] = useState(null);
    const [loadingProviders, setLoadingProviders] = useState(true);
    const [serviceQuery, setServiceQuery] = useState("");
    const [locationQuery, setLocationQuery] = useState("");
    const [activeCategory, setActiveCategory] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let active = true;

        async function loadProviders() {
            setLoadingProviders(true);
            setLoadError(null);

            if (!isSupabaseConfigured) {
                if (active) {
                    setLoadError(
                        "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env, then restart npm run dev."
                    );
                    setLoadingProviders(false);
                }
                return;
            }

            try {
                const data = await listProviders();
                if (active) setProviders(data);
            } catch (err) {
                if (active) {
                    const message =
                        err.name === "AbortError"
                            ? "Request timed out. Check your connection and Supabase keys in .env."
                            : err.message ??
                              "Could not load tradespeople from Supabase.";
                    setLoadError(message);
                }
            } finally {
                if (active) setLoadingProviders(false);
            }
        }

        loadProviders();
        return () => {
            active = false;
        };
    }, [reloadKey]);

    const filteredProviders = useMemo(() => {
        const service = serviceQuery.trim().toLowerCase();
        const location = locationQuery.trim().toLowerCase();

        return providers.filter((provider) => {
            const matchesCategory =
                !activeCategory || provider.category === activeCategory;

            const matchesService =
                !service ||
                provider.categoryLabel.toLowerCase().includes(service) ||
                provider.bio.toLowerCase().includes(service) ||
                provider.name.toLowerCase().includes(service) ||
                provider.skills?.some((skill) =>
                    skill.toLowerCase().includes(service)
                ) ||
                SERVICE_CATEGORIES.find((c) => c.id === provider.category)
                    ?.label.toLowerCase()
                    .includes(service);

            const matchesLocation =
                !location || provider.city.toLowerCase().includes(location);

            return matchesCategory && matchesService && matchesLocation;
        });
    }, [activeCategory, serviceQuery, locationQuery, providers]);

    return (
        <AppShell
            variant="browse"
            serviceQuery={serviceQuery}
            onServiceQueryChange={setServiceQuery}
            locationQuery={locationQuery}
            onLocationQueryChange={setLocationQuery}
            className="space-y-10 py-8 md:py-10"
        >
            <section className="space-y-6">
                <div className="max-w-2xl space-y-2">
                    <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
                        Find trusted tradespeople near you
                    </h1>
                    <p className="text-sm text-muted-foreground md:text-base">
                        Compare ratings, read reviews, and hire locally —
                        like Checkatrade, built for your area.
                    </p>
                </div>

                <div className="flex flex-col gap-2 rounded-xl border bg-muted/40 p-4 ring-1 ring-foreground/10 sm:flex-row sm:items-center">
                    <Input
                        value={serviceQuery}
                        onChange={(e) => setServiceQuery(e.target.value)}
                        placeholder="e.g. Plumber, electrician, painter"
                        className="h-10 flex-1 bg-background"
                    />
                    <Input
                        value={locationQuery}
                        onChange={(e) => setLocationQuery(e.target.value)}
                        placeholder="City or postcode"
                        className="h-10 bg-background sm:w-48"
                    />
                    <Button type="button" className="h-10 shrink-0 sm:px-6">
                        Find pros
                    </Button>
                </div>

                <ul className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                    {TRUST_STATS.map(({ icon: Icon, label }) => (
                        <li
                            key={label}
                            className="inline-flex items-center gap-1.5"
                        >
                            <Icon className="size-3.5" />
                            {label}
                        </li>
                    ))}
                </ul>
            </section>

            <CategoryGrid
                categories={SERVICE_CATEGORIES}
                activeCategory={activeCategory}
                onCategoryChange={setActiveCategory}
            />

            <section aria-labelledby="providers-heading">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2
                            id="providers-heading"
                            className="text-sm font-medium tracking-tight"
                        >
                            Top-rated near you
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {loadingProviders
                                ? "Loading tradespeople…"
                                : `${filteredProviders.length} tradesperson${
                                      filteredProviders.length === 1 ? "" : "s"
                                  } available`}
                        </p>
                    </div>
                    {(activeCategory || serviceQuery || locationQuery) && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                setActiveCategory(null);
                                setServiceQuery("");
                                setLocationQuery("");
                            }}
                        >
                            Clear filters
                        </Button>
                    )}
                </div>

                {loadError && (
                    <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-8 text-center">
                        <p className="text-sm font-medium text-destructive">
                            {loadError}
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="mt-4"
                            onClick={() => setReloadKey((k) => k + 1)}
                        >
                            Try again
                        </Button>
                    </div>
                )}

                {!loadError && loadingProviders && (
                    <p className="mt-4 text-sm text-muted-foreground">
                        Fetching provider profiles from Supabase…
                    </p>
                )}

                {!loadError && !loadingProviders && filteredProviders.length > 0 && (
                    <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredProviders.map((provider) => (
                            <li key={provider.id}>
                                <ProviderCard provider={provider} />
                            </li>
                        ))}
                    </ul>
                )}

                {!loadError &&
                    !loadingProviders &&
                    filteredProviders.length === 0 && (
                        <div className="mt-4 rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center">
                            <p className="text-sm font-medium">
                                No tradespeople match your search
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Try another category or broaden your location.
                            </p>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => {
                                    setActiveCategory(null);
                                    setServiceQuery("");
                                    setLocationQuery("");
                                }}
                            >
                                Reset search
                            </Button>
                        </div>
                    )}
            </section>
        </AppShell>
    );
}
