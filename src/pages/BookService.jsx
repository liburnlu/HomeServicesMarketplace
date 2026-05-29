import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import ProviderAvatar from "@/components/providers/ProviderAvatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { createBooking } from "@/services/bookingService";
import { getProviderDetail } from "@/services/providerService";

export default function BookService() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { authUser } = useAuth();
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        getProviderDetail(id)
            .then(setProvider)
            .catch(() => setProvider(null))
            .finally(() => setLoading(false));
    }, [id]);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const scheduledFor = formData.get("scheduledFor");
        const estimatedPrice = formData.get("estimatedPrice");

        try {
            await createBooking({
                customer_id: authUser.id,
                provider_id: id,
                job_description: formData.get("jobDescription"),
                scheduled_for: new Date(scheduledFor).toISOString(),
                estimated_price: estimatedPrice
                    ? Number(estimatedPrice)
                    : null,
                status: "pending",
            });
            setSuccess(true);
            setTimeout(() => navigate("/bookings"), 1500);
        } catch (err) {
            setError(err.message ?? "Could not create booking.");
        } finally {
            setSubmitting(false);
        }
    }

    const minDateTime = new Date();
    minDateTime.setHours(minDateTime.getHours() + 1);
    const minValue = minDateTime.toISOString().slice(0, 16);

    if (loading) {
        return (
            <AppShell title="Book service" backTo={`/providers/${id}`}>
                <p className="text-sm text-muted-foreground">Loading…</p>
            </AppShell>
        );
    }

    if (!provider) {
        return (
            <AppShell title="Book service" backTo="/home">
                <p className="text-sm text-destructive">
                    Tradesperson not found.
                </p>
            </AppShell>
        );
    }

    return (
        <AppShell
            title="Request booking"
            subtitle={provider.name}
            backTo={`/providers/${id}`}
        >
            <div className="mx-auto max-w-xl space-y-6">
                <Card className="border-primary/15 bg-gradient-to-r from-primary/5 to-transparent">
                    <CardContent className="flex items-center gap-4 pt-6">
                        <ProviderAvatar
                            name={provider.name}
                            avatarUrl={provider.avatarUrl}
                            size="md"
                        />
                        <div>
                            <p className="font-medium">{provider.name}</p>
                            <p className="text-sm text-muted-foreground">
                                {provider.categoryLabel} · {provider.city}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {success ? (
                    <Card className="border-emerald-500/30 bg-emerald-500/5">
                        <CardContent className="py-8 text-center">
                            <p className="font-medium text-emerald-800 dark:text-emerald-200">
                                Booking request sent!
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Redirecting to your bookings…
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Job details</CardTitle>
                            <CardDescription>
                                Tell them what you need and when. They&apos;ll
                                accept or decline your request.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="jobDescription">
                                        What do you need done?
                                    </Label>
                                    <Textarea
                                        id="jobDescription"
                                        name="jobDescription"
                                        placeholder="e.g. Fix a leaking kitchen tap and replace washers…"
                                        required
                                        minLength={10}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="scheduledFor">
                                        Preferred date & time
                                    </Label>
                                    <Input
                                        id="scheduledFor"
                                        name="scheduledFor"
                                        type="datetime-local"
                                        min={minValue}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="estimatedPrice">
                                        Budget estimate (€, optional)
                                    </Label>
                                    <Input
                                        id="estimatedPrice"
                                        name="estimatedPrice"
                                        type="number"
                                        min="0"
                                        step="1"
                                        placeholder="50"
                                    />
                                </div>

                                {error && (
                                    <p
                                        className="text-sm text-destructive"
                                        role="alert"
                                    >
                                        {error}
                                    </p>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={submitting}
                                >
                                    {submitting
                                        ? "Sending request…"
                                        : "Send booking request"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppShell>
    );
}
