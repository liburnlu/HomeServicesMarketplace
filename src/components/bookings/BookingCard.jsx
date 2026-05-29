import { Link } from "react-router-dom";
import { Calendar, MapPin, User } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import StatusBadge from "@/components/bookings/StatusBadge";
import ProviderAvatar from "@/components/providers/ProviderAvatar";
import { formatDate } from "@/lib/format";

export default function BookingCard({
    booking,
    view = "customer",
    onAccept,
    onReject,
    onComplete,
    onCancel,
    onReview,
    actionLoading,
}) {
    const isCustomer = view === "customer";
    const providerProfile = booking.provider_profiles;
    const providerName =
        providerProfile?.profiles?.full_name ??
        providerProfile?.category ??
        "Tradesperson";
    const customerName = booking.profiles?.full_name ?? "Customer";

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex-row items-start gap-3 space-y-0 border-b bg-muted/30 pb-4">
                {isCustomer ? (
                    <ProviderAvatar
                        name={providerName}
                        avatarUrl={providerProfile?.profiles?.avatar_url}
                        size="md"
                    />
                ) : (
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-muted">
                        <User className="size-6 text-muted-foreground" />
                    </div>
                )}
                <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <CardTitle className="text-base">
                            {isCustomer ? providerName : customerName}
                        </CardTitle>
                        <StatusBadge status={booking.status} />
                    </div>
                    <CardDescription className="line-clamp-2">
                        {booking.job_description}
                    </CardDescription>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                    <div className="flex gap-2">
                        <Calendar className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <div>
                            <dt className="text-xs text-muted-foreground">
                                Scheduled
                            </dt>
                            <dd className="font-medium">
                                {formatDate(booking.scheduled_for)}
                            </dd>
                        </div>
                    </div>
                    {booking.estimated_price != null && (
                        <div>
                            <dt className="text-xs text-muted-foreground">
                                Estimate
                            </dt>
                            <dd className="font-medium">
                                €{Number(booking.estimated_price).toFixed(0)}
                            </dd>
                        </div>
                    )}
                    {isCustomer && providerProfile?.profiles?.city && (
                        <div className="flex gap-2 sm:col-span-2">
                            <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div>
                                <dt className="text-xs text-muted-foreground">
                                    Location
                                </dt>
                                <dd>{providerProfile.profiles.city}</dd>
                            </div>
                        </div>
                    )}
                </dl>

                <div className="flex flex-wrap gap-2">
                    {view === "provider" && booking.status === "pending" && (
                        <>
                            <Button
                                size="sm"
                                disabled={actionLoading}
                                onClick={() => onAccept?.(booking.id)}
                            >
                                Accept job
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                disabled={actionLoading}
                                onClick={() => onReject?.(booking.id)}
                            >
                                Decline
                            </Button>
                        </>
                    )}
                    {view === "provider" && booking.status === "accepted" && (
                        <Button
                            size="sm"
                            disabled={actionLoading}
                            onClick={() => onComplete?.(booking.id)}
                        >
                            Mark completed
                        </Button>
                    )}
                    {view === "customer" && booking.status === "pending" && (
                        <Button
                            size="sm"
                            variant="outline"
                            disabled={actionLoading}
                            onClick={() => onCancel?.(booking.id)}
                        >
                            Cancel request
                        </Button>
                    )}
                    {view === "customer" &&
                        booking.status === "completed" &&
                        onReview && (
                            <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => onReview(booking)}
                            >
                                Leave review
                            </Button>
                        )}
                    {isCustomer && providerProfile?.provider_id && (
                        <Button asChild size="sm" variant="ghost">
                            <Link
                                to={`/providers/${providerProfile.provider_id}`}
                            >
                                View tradesperson
                            </Link>
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
