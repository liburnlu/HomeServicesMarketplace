import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const USER_ROLES = {
    CUSTOMER: "customer",
    PROVIDER: "provider",
};

export default function RegisterForm({ embedded = false }) {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [role, setRole] = useState(USER_ROLES.CUSTOMER);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);

        const registerData = {
            fullName: String(formData.get("fullName") ?? "").trim(),
            email: String(formData.get("email") ?? "").trim(),
            password: formData.get("password"),
            phoneNumber: formData.get("phoneNumber") || null,
            city: formData.get("city") || null,
            role: formData.get("role"),
        };

        if (registerData.role === USER_ROLES.PROVIDER) {
            registerData.category = formData.get("category");
            registerData.bio = formData.get("bio") || null;
            registerData.skills = formData
                .get("skills")
                ?.split(",")
                .map((skill) => skill.trim())
                .filter(Boolean);
        }

        try {
            const data = await register(registerData);
            if (!data.session) {
                setError(
                    "Account created. Check your email to confirm your address, then sign in. (Avoid addresses like test@gmail.com — Supabase rejects them.)"
                );
                return;
            }
            navigate("/home");
        } catch (err) {
            setError(err.message ?? "Registration failed. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }

    const form = (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="fullName">Full name</Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            type="text"
                            placeholder="John Doe"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your.name@gmail.com"
                            autoComplete="email"
                            required
                        />
                        <p className="text-xs text-muted-foreground">
                            Use a real email you can access. Addresses like{" "}
                            <span className="font-medium">test@gmail.com</span> are
                            blocked by Supabase.
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            minLength={6}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phoneNumber">Phone number</Label>
                        <Input
                            id="phoneNumber"
                            name="phoneNumber"
                            type="tel"
                            placeholder="+389 XX XXX XXX"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                            id="city"
                            name="city"
                            type="text"
                            placeholder="Skopje"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">I am a</Label>
                        <select
                            id="role"
                            name="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value={USER_ROLES.CUSTOMER}>
                                Homeowner
                            </option>
                            <option value={USER_ROLES.PROVIDER}>
                                Tradesperson
                            </option>
                        </select>
                    </div>

                    {role === USER_ROLES.PROVIDER && (
                        <div className="space-y-4 rounded-md border p-4">
                            <div className="space-y-2">
                                <Label htmlFor="category">Service category</Label>
                                <Input
                                    id="category"
                                    name="category"
                                    type="text"
                                    placeholder="Electrician, Plumber, Painter..."
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="skills">Skills</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    type="text"
                                    placeholder="wiring, repairs, installation"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="bio">Bio</Label>
                                <textarea
                                    id="bio"
                                    name="bio"
                                    placeholder="Short description about your service experience"
                                    className="flex min-h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                />
                            </div>
                        </div>
                    )}

                    {error && (
                        <p className="text-sm text-destructive" role="alert">
                            {error}
                        </p>
                    )}

                    <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? "Creating account…" : "Create account"}
                    </Button>
                </form>
    );

    if (embedded) {
        return form;
    }

    return (
        <Card className="w-full max-w-lg">
            <CardHeader>
                <CardTitle>Create account</CardTitle>
                <CardDescription>
                    Join as a homeowner looking for services or a tradesperson
                    offering them.
                </CardDescription>
            </CardHeader>

            <CardContent>{form}</CardContent>
        </Card>
    );
}