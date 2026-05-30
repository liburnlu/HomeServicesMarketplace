import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Briefcase,
    ExternalLink,
    Inbox,
    MapPin,
    Wrench,
} from "lucide-react";
import ProviderAvatar from "@/components/providers/ProviderAvatar";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { getProviderBookings } from "@/services/bookingService";

export default function ProviderHome() {
    const { authUser, profile, providerProfile } = useAuth();
    const [counts, setCounts] = useState({ pending: 0, active: 0, past: 0 });
    const [loading, setLoading] = useState(true);

    const loadCounts = useCallback(async (userId) => {
        if (!userId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const bookings = await getProviderBookings(userId);
            const list = bookings ?? [];
            setCounts({
                pending: list.filter((b) => b.status === "pending").length,
                active: list.filter((b) => b.status === "accepted").length,
                past: list.filter((b) =>
                    ["completed", "cancelled", "rejected"].includes(b.status)
                ).length,
            });
        } catch {
            setCounts({ pending: 0, active: 0, past: 0 });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authUser?.id) return;
        loadCounts(authUser.id);
    }, [authUser?.id, loadCounts]);

    const firstName = profile?.full_name?.split(" ")[0] ?? "there";

    return (
        <div className="space-y-8">
            <section className="space-y-2">
                <h1 className="text-2xl font-medium tracking-tight md:text-3xl">
                    Hello, {firstName}
                </h1>
                <p className="text-sm text-muted-foreground md:text-base">
                    Manage job requests and grow your local service business.
                </p>
            </section>

            <div className="grid gap-3 sm:grid-cols-3">
                <Card className="bg-primary/5">
                    <CardContent className="flex items-center gap-3 pt-6">
                        <Inbox className="size-8 text-primary" />
                        <div>
                            <p className="text-2xl font-medium">
                                {loading ? "—" : counts.pending}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                New requests
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 pt-6">
                        <Briefcase className="size-8 text-muted-foreground" />
                        <div>
                            <p className="text-2xl font-medium">
                                {loading ? "—" : counts.active}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                In progress
                            </p>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="flex items-center gap-3 pt-6">
                        <Briefcase className="size-8 text-muted-foreground" />
                        <div>
                            <p className="text-2xl font-medium">
                                {loading ? "—" : counts.past}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                Completed / closed
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                    <CardTitle className="text-base">Job inbox</CardTitle>
                    <CardDescription>
                        Review new requests, accept jobs, and mark work complete.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button asChild className="gap-2">
                        <Link to="/provider/jobs">
                            Open job inbox
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Your public profile</CardTitle>
                    <CardDescription>
                        This is how homeowners see you on the marketplace.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <ProviderAvatar
                        name={profile?.full_name}
                        avatarUrl={profile?.avatar_url}
                        size="lg"
                    />
                    <div className="min-w-0 flex-1 space-y-2 text-sm">
                        <p className="font-medium">
                            {profile?.full_name ?? "Your profile"}
                        </p>
                        {providerProfile?.category && (
                            <p className="inline-flex items-center gap-1.5 text-muted-foreground">
                                <Wrench className="size-4 shrink-0" />
                                {providerProfile.category}
                            </p>
                        )}
                        {profile?.city && (
                            <p className="inline-flex items-center gap-1.5 text-muted-foreground">
                                <MapPin className="size-4 shrink-0" />
                                {profile.city}
                            </p>
                        )}
                        {providerProfile?.bio && (
                            <p className="line-clamp-3 text-muted-foreground">
                                {providerProfile.bio}
                            </p>
                        )}
                        <Button asChild variant="outline" size="sm" className="gap-2">
                            <Link to={`/providers/${authUser?.id}`}>
                                <ExternalLink className="size-4" />
                                Preview profile
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
