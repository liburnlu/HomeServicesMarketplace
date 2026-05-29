import { useState } from "react";
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

const USER_ROLES = {
    CUSTOMER: "customer",
    PROVIDER: "provider",
};

export default function RegisterForm() {
    const [role, setRole] = useState(USER_ROLES.CUSTOMER);

    function handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);

        const registerData = {
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            password: formData.get("password"),
            phoneNumber: formData.get("phoneNumber"),
            city: formData.get("city"),
            role: formData.get("role"),
        };

        if (registerData.role === USER_ROLES.PROVIDER) {
            registerData.providerProfile = {
                category: formData.get("category"),
                bio: formData.get("bio"),
                skills: formData
                    .get("skills")
                    ?.split(",")
                    .map((skill) => skill.trim())
                    .filter(Boolean),
            };
        }

        console.log(registerData);

        // Later flow:
        // 1. supabase.auth.signUp({ email, password })
        // 2. insert into public.profiles using returned user.id
        // 3. if role === "provider", insert into public.provider_profiles
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Create account</CardTitle>
                <CardDescription>
                    Register as a customer or service provider.
                </CardDescription>
            </CardHeader>

            <CardContent>
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
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="••••••••"
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
                        <Label htmlFor="role">Account type</Label>
                        <select
                            id="role"
                            name="role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value={USER_ROLES.CUSTOMER}>Customer</option>
                            <option value={USER_ROLES.PROVIDER}>Provider</option>
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

                    <Button type="submit" className="w-full">
                        Register
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}