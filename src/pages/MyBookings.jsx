import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Plus } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import BookingCard from "@/components/bookings/BookingCard";
import ReviewDialog from "@/components/bookings/ReviewDialog";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import {
    getCustomerBookings,
    updateBookingStatus,
} from "@/services/bookingService";

export default function MyBookings() {
    const { authUser } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [reviewBooking, setReviewBooking] = useState(null);

    const loadBookings = useCallback(async (userId) => {
        if (!userId) {
            setLoading(false);
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const data = await getCustomerBookings(userId);
            setBookings(data ?? []);
        } catch (err) {
            setError(err.message ?? "Could not load bookings.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!authUser?.id) return;
        loadBookings(authUser.id);
    }, [authUser?.id, loadBookings]);

    async function handleCancel(bookingId) {
        setActionLoading(true);
        try {
            await updateBookingStatus(bookingId, "cancelled");
            await loadBookings(authUser.id);
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(false);
        }
    }

    const pending = bookings.filter((b) => b.status === "pending");
    const active = bookings.filter((b) =>
        ["accepted"].includes(b.status)
    );
    const past = bookings.filter((b) =>
        ["completed", "cancelled", "rejected"].includes(b.status)
    );

    function renderSection(title, items) {
        if (items.length === 0) return null;
        return (
            <section className="space-y-3">
                <h2 className="text-sm font-medium text-muted-foreground">
                    {title}
                </h2>
                <ul className="space-y-4">
                    {items.map((booking) => (
                        <li key={booking.id}>
                            <BookingCard
                                booking={booking}
                                view="customer"
                                actionLoading={actionLoading}
                                onCancel={handleCancel}
                                onReview={setReviewBooking}
                            />
                        </li>
                    ))}
                </ul>
            </section>
        );
    }

    return (
        <AppShell title="My bookings" subtitle="Track your service requests">
            {loading && (
                <p className="text-sm text-muted-foreground">Loading bookings…</p>
            )}

            {error && (
                <p className="mb-4 text-sm text-destructive" role="alert">
                    {error}
                </p>
            )}

            {!loading && bookings.length === 0 && (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center py-12 text-center">
                        <div className="flex size-14 items-center justify-center rounded-full bg-muted">
                            <CalendarDays className="size-7 text-muted-foreground" />
                        </div>
                        <p className="mt-4 font-medium">No bookings yet</p>
                        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                            Browse tradespeople and send your first job request.
                        </p>
                        <Button asChild className="mt-6">
                            <Link to="/home">
                                <Plus className="size-4" />
                                Find a tradesperson
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {!loading && bookings.length > 0 && (
                <div className="space-y-8">
                    {renderSection("Awaiting response", pending)}
                    {renderSection("Confirmed", active)}
                    {renderSection("Past", past)}
                </div>
            )}

            {reviewBooking && (
                <ReviewDialog
                    booking={reviewBooking}
                    onClose={() => setReviewBooking(null)}
                    onSubmitted={() => loadBookings(authUser.id)}
                />
            )}
        </AppShell>
    );
}
