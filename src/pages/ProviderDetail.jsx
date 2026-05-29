import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    BadgeCheck,
    Calendar,
    MapPin,
    Star,
    Wrench,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import ProviderAvatar from "@/components/providers/ProviderAvatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { getProviderDetail } from "@/services/providerService";
import { getProviderReviews } from "@/services/reviewService";
import { formatDateShort } from "@/lib/format";

export default function ProviderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isLoggedIn, isCustomer, profile, authUser } = useAuth();
    const [provider, setProvider] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const [providerData, reviewData] = await Promise.all([
                    getProviderDetail(id),
                    getProviderReviews(id),
                ]);
                if (!cancelled) {
                    setProvider(providerData);
                    setReviews(reviewData ?? []);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message ?? "Could not load profile.");
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [id]);

    function handleBook() {
        if (!isLoggedIn) {
            navigate("/login", { state: { from: `/providers/${id}/book` } });
            return;
        }
        if (profile && !isCustomer) {
            navigate("/dashboard");
            return;
        }
        navigate(`/providers/${id}/book`);
    }

    if (loading) {
        return (
            <AppShell title="Tradesperson" backTo="/home">
                <p className="text-sm text-muted-foreground">Loading profile…</p>
            </AppShell>
        );
    }

    if (error || !provider) {
        return (
            <AppShell title="Not found" backTo="/home">
                <Card>
                    <CardContent className="py-10 text-center">
                        <p className="text-sm text-muted-foreground">
                            {error ?? "This tradesperson could not be found."}
                        </p>
                        <Button asChild className="mt-4" variant="outline">
                            <Link to="/home">Back to browse</Link>
                        </Button>
                    </CardContent>
                </Card>
            </AppShell>
        );
    }

    const isOwnProfile = authUser?.id === provider.id;

    return (
        <AppShell
            title={provider.name}
            subtitle={provider.categoryLabel}
            backTo="/home"
        >
            <div className="space-y-6">
                <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/8 via-background to-muted/40 p-6 md:p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
                        <ProviderAvatar
                            name={provider.name}
                            avatarUrl={provider.avatarUrl}
                            size="xl"
                        />
                        <div className="min-w-0 flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <h2 className="text-2xl font-medium tracking-tight">
                                    {provider.name}
                                </h2>
                                {provider.verified && (
                                    <BadgeCheck className="size-5 text-primary" />
                                )}
                            </div>
                            <p className="text-muted-foreground">
                                {provider.categoryLabel}
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm">
                                <span className="inline-flex items-center gap-1.5">
                                    <Star className="size-4 fill-primary text-primary" />
                                    <span className="font-medium">
                                        {provider.rating}
                                    </span>
                                    <span className="text-muted-foreground">
                                        ({provider.reviewCount} reviews)
                                    </span>
                                </span>
                                <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                                    <MapPin className="size-4" />
                                    {provider.city || "Local area"}
                                </span>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {provider.skills?.map((skill) => (
                                    <Badge
                                        key={skill}
                                        className="bg-muted text-foreground"
                                    >
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {!isOwnProfile && (
                        <div className="mt-6 flex flex-wrap gap-2">
                            <Button size="lg" onClick={handleBook}>
                                <Calendar className="size-4" />
                                Book this tradesperson
                            </Button>
                        </div>
                    )}
                </section>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    About
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm leading-relaxed text-muted-foreground">
                                    {provider.bio ||
                                        "No bio provided yet."}
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Reviews
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {reviews.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No reviews yet. Be the first to book and
                                        leave feedback.
                                    </p>
                                ) : (
                                    reviews.map((review) => (
                                        <div
                                            key={review.id}
                                            className="rounded-lg border bg-muted/20 p-4"
                                        >
                                            <div className="flex items-center justify-between gap-2">
                                                <p className="text-sm font-medium">
                                                    {review.profiles?.full_name ??
                                                        "Customer"}
                                                </p>
                                                <span className="inline-flex items-center gap-1 text-sm">
                                                    <Star className="size-3.5 fill-primary text-primary" />
                                                    {review.rating}
                                                </span>
                                            </div>
                                            {review.comment && (
                                                <p className="mt-2 text-sm text-muted-foreground">
                                                    {review.comment}
                                                </p>
                                            )}
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                {formatDateShort(
                                                    review.created_at
                                                )}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <aside className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Quick facts
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Hourly from
                                    </span>
                                    <span className="font-medium">
                                        €{provider.priceFrom}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">
                                        Response
                                    </span>
                                    <span className="font-medium">
                                        {provider.responseTime}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Wrench className="size-4 shrink-0" />
                                    {provider.categoryLabel}
                                </div>
                            </CardContent>
                        </Card>

                        {!isOwnProfile && (
                            <Card className="border-primary/20 bg-primary/5">
                                <CardContent className="space-y-3 pt-6">
                                    <p className="text-sm font-medium">
                                        Ready to hire?
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Describe your job and pick a time. The
                                        tradesperson will confirm your request.
                                    </p>
                                    <Button
                                        className="w-full"
                                        onClick={handleBook}
                                    >
                                        Request booking
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </aside>
                </div>
            </div>
        </AppShell>
    );
}
