import { useState } from "react";
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
import { updateProfile } from "@/services/profileService";
import { saveProviderProfile } from "@/services/providerService";

function parseSkills(value) {
    if (!value || typeof value !== "string") return [];
    return value
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
}

export default function ProfileEditForm({ isProvider = false, role }) {
    const isTradesperson = role === "provider" || isProvider;
    const { authUser, profile, providerProfile, reloadUser } = useAuth();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const skillsValue = (providerProfile?.skills ?? []).join(", ");

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const fullName = String(formData.get("fullName") ?? "").trim();

        if (!fullName) {
            setError("Full name is required.");
            setSubmitting(false);
            return;
        }

        try {
            await updateProfile(authUser.id, {
                full_name: fullName,
                phone_number: String(formData.get("phoneNumber") ?? "").trim() || null,
                city: String(formData.get("city") ?? "").trim() || null,
            });

            if (isTradesperson) {
                const category = String(formData.get("category") ?? "").trim();
                if (!category) {
                    setError("Service category is required.");
                    setSubmitting(false);
                    return;
                }

                await saveProviderProfile(
                    authUser.id,
                    {
                        category,
                        bio: String(formData.get("bio") ?? "").trim() || null,
                        skills: parseSkills(formData.get("skills")),
                    },
                    providerProfile
                );
            }

            await reloadUser();
            setSuccess(true);
        } catch (err) {
            setError(err.message ?? "Could not save profile.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Edit profile</CardTitle>
                <CardDescription>
                    {isTradesperson
                        ? "Update your contact details and service information. Email cannot be changed here."
                        : "Update your name, phone, and city for bookings. Email cannot be changed here."}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form
                    key={`${profile?.id}-${providerProfile?.provider_id ?? "c"}`}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    <div className="space-y-2">
                        <Label htmlFor="profile-email">Email</Label>
                        <Input
                            id="profile-email"
                            type="email"
                            value={authUser?.email ?? ""}
                            disabled
                            className="bg-muted"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full name</Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            defaultValue={profile?.full_name ?? ""}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone number</Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            defaultValue={profile?.phone_number ?? ""}
                            placeholder="+389 XX XXX XXX"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            name="city"
                            defaultValue={profile?.city ?? ""}
                            placeholder="Skopje"
                        />
                    </div>

                    {isTradesperson && (
                        <div className="space-y-4 rounded-lg border p-4">
                            <p className="text-sm font-medium">Service details</p>

                            <div className="space-y-2">
                                <Label htmlFor="category">Service category</Label>
                                <Input
                                    id="category"
                                    name="category"
                                    defaultValue={providerProfile?.category ?? ""}
                                    placeholder="Electrician, Plumber, Painter…"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="skills">Skills</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    defaultValue={skillsValue}
                                    placeholder="wiring, repairs, installation"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Separate skills with commas
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    name="bio"
                                    defaultValue={providerProfile?.bio ?? ""}
                                    placeholder="Short description of your experience"
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-destructive" role="alert">
                            {error}
                        </p>
                    )}

                    {success && (
                        <p className="text-sm text-emerald-700 dark:text-emerald-300">
                            Profile saved successfully.
                        </p>
                    )}

                    <Button type="submit" disabled={submitting} className="w-full">
                        {submitting ? "Saving…" : "Save changes"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
