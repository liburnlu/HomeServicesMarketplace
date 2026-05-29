import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { createReview } from "@/services/reviewService";
import { cn } from "@/lib/utils";

export default function ReviewDialog({ booking, onClose, onSubmitted }) {
    const [rating, setRating] = useState(5);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        const formData = new FormData(e.currentTarget);

        try {
            await createReview({
                booking_id: booking.id,
                customer_id: booking.customer_id,
                provider_id: booking.provider_id,
                rating,
                comment: formData.get("comment") || null,
            });
            onSubmitted?.();
            onClose();
        } catch (err) {
            setError(err.message ?? "Could not submit review.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 sm:items-center">
            <Card className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4">
                <CardHeader>
                    <CardTitle>Leave a review</CardTitle>
                    <CardDescription>
                        How was your experience with this job?
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label>Rating</Label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((value) => (
                                    <button
                                        key={value}
                                        type="button"
                                        onClick={() => setRating(value)}
                                        className="rounded p-1 transition-colors hover:bg-muted"
                                        aria-label={`${value} stars`}
                                    >
                                        <Star
                                            className={cn(
                                                "size-7",
                                                value <= rating
                                                    ? "fill-primary text-primary"
                                                    : "text-muted-foreground/40"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="comment">Comment (optional)</Label>
                            <Textarea
                                id="comment"
                                name="comment"
                                placeholder="Share what went well…"
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-destructive">{error}</p>
                        )}

                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                className="flex-1"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-1"
                                disabled={submitting}
                            >
                                {submitting ? "Submitting…" : "Submit review"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
