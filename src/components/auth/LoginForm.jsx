import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import RegisterForm from "@/components/auth/RegisterForm";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const AUTH_MODES = {
    LOGIN: "login",
    REGISTER: "register",
};

export default function LoginForm({ defaultMode = AUTH_MODES.LOGIN }) {
    const navigate = useNavigate();
    const location = useLocation();
    const redirectTo = location.state?.from?.pathname ?? "/home";
    const { login } = useAuth();
    const [mode, setMode] = useState(defaultMode);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleLoginSubmit(e) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const email = String(formData.get("email") ?? "").trim();
        const password = formData.get("password");

        try {
            await login(email, password);
            navigate(redirectTo, { replace: true });
        } catch (err) {
            setError(err.message ?? "Sign in failed. Check your email and password.");
        } finally {
            setSubmitting(false);
        }
    }

    const isLogin = mode === AUTH_MODES.LOGIN;

    return (
        <Card
            className={cn(
                "w-full",
                isLogin ? "max-w-md" : "max-w-lg"
            )}
        >
            <CardHeader className="space-y-4">
                <div className="space-y-1">
                    <CardTitle>Home Services Marketplace</CardTitle>
                    <CardDescription>
                        {isLogin
                            ? "Sign in to book tradespeople or manage your services."
                            : "Create an account as a homeowner or tradesperson."}
                    </CardDescription>
                </div>

                <div
                    role="tablist"
                    aria-label="Authentication mode"
                    className="grid grid-cols-2 gap-1 rounded-lg border bg-muted p-1"
                >
                    <Button
                        type="button"
                        role="tab"
                        aria-selected={isLogin}
                        variant={isLogin ? "default" : "ghost"}
                        className="w-full"
                        onClick={() => setMode(AUTH_MODES.LOGIN)}
                    >
                        Sign in
                    </Button>
                    <Button
                        type="button"
                        role="tab"
                        aria-selected={!isLogin}
                        variant={!isLogin ? "default" : "ghost"}
                        className="w-full"
                        onClick={() => setMode(AUTH_MODES.REGISTER)}
                    >
                        Create account
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {isLogin ? (
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="login-email">Email</Label>
                            <Input
                                id="login-email"
                                name="email"
                                type="email"
                                placeholder="your.name@gmail.com"
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="login-password">Password</Label>
                            <Input
                                id="login-password"
                                name="password"
                                type="password"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                minLength={6}
                                required
                            />
                        </div>

                        {error && (
                            <p className="text-sm text-destructive" role="alert">
                                {error}
                            </p>
                        )}

                        <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting ? "Signing in…" : "Sign in"}
                        </Button>
                    </form>
                ) : (
                    <RegisterForm embedded />
                )}
            </CardContent>
        </Card>
    );
}
