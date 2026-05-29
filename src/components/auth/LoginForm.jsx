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
import RegisterForm from "@/components/auth/RegisterForm";
import { cn } from "@/lib/utils";

const AUTH_MODES = {
    LOGIN: "login",
    REGISTER: "register",
};

export default function LoginForm({ defaultMode = AUTH_MODES.LOGIN }) {
    const navigate = useNavigate();
    const [mode, setMode] = useState(defaultMode);

    function handleLoginSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email");
        const password = formData.get("password");

        console.log({ email, password });

        // later: Supabase login here
        navigate("/home");
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
                                placeholder="you@example.com"
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
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full">
                            Sign in
                        </Button>
                    </form>
                ) : (
                    <RegisterForm embedded />
                )}
            </CardContent>
        </Card>
    );
}
