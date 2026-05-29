import { useCallback, useEffect, useState } from "react";
import { Briefcase, Inbox } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import BookingCard from "@/components/bookings/BookingCard";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import {
    getProviderBookings,
    updateBookingStatus,
} from "@/services/bookingService";

export default function ProviderDashboard() {
    const { authUser, providerProfile, profile } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const loadBookings = useCallback(async (userId) => {
        if (!userId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await getProviderBookings(userId);
            setBookings(data ?? []);
        } catch (err) {
            setError(err.message ?? "Could not load jobs.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authUser?.id) return;
        loadBookings(authUser.id);
    }, [authUser?.id, loadBookings]);

    async function handleStatus(bookingId, status) {
        setActionLoading(true);
        try {
            await updateBookingStatus(bookingId, status);
            await loadBookings(authUser.id);
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    }

    const pending = bookings.filter((b) => b.status === "pending");
    const active = bookings.filter((b) => b.status === "accepted");
    const past = bookings.filter((b) =>
        ["completed", "cancelled", "rejected"].includes(b.status)
    );

    function renderSection(title, items, emptyMessage) {
        return (
            <section className="space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground">
                    {title}
                </h2>
                {items.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                        {emptyMessage}
                    </p>
                ) : (
                    <ul className="space-y-4">
                        {items.map((booking) => (
                            <li key={booking.id}>
                                <BookingCard
                                    booking={booking}
                                    view="provider"
                                    actionLoading={actionLoading}
                                    onAccept={(id) =>
                                        handleStatus(id, "accepted")
                                    }
                                    onReject={(id) =>
                                        handleStatus(id, "rejected")
                                    }
                                    onComplete={(id) =>
                                        handleStatus(id, "completed")
                                    }
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        );
    }

    return (
        <AppShell
            title="Job inbox"
            subtitle={
                providerProfile?.category
                    ? `${profile?.full_name} · ${providerProfile.category}`
                    : profile?.full_name
            }
        >
            <div className="mb-6 grid gap-3 sm:grid-cols-3">
                <Card className="bg-primary/5">
                    <CardContent className="flex items-center gap-3 pt-6">
                        <Inbox className="size-8 text-primary" />
                        <div>
                            <p className="text-2xl font-medium">
                                {pending.length}
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
                                {active.length}
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
                            <p className="text-2xl font-medium">{past.length}</p>
                            <p className="text-xs text-muted-foreground">
                                Completed / closed
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {loading && (
                <p className="text-sm text-muted-foreground">Loading jobs…</p>
            )}

            {error && (
                <p className="mb-4 text-sm text-destructive" role="alert">
                    {error}
                </p>
            )}

            {!loading && (
                <div className="space-y-8">
                    {renderSection(
                        "New requests",
                        pending,
                        "No pending requests right now."
                    )}
                    {renderSection(
                        "Active jobs",
                        active,
                        "No active jobs."
                    )}
                    {renderSection("History", past, "No past jobs yet.")}
                </div>
            )}
        </AppShell>
    );
}
