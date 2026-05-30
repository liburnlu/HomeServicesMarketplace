import { Link, Navigate, useNavigate } from "react-router-dom";
import { CalendarDays, Home, LogOut } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import AuthLoadingScreen from "@/components/AuthLoadingScreen";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import ProviderAvatar from "@/components/providers/ProviderAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

export default function Account() {
    const navigate = useNavigate();
    const { authUser, profile, isProvider, logout, initializing } = useAuth();

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    if (initializing) {
        return <AuthLoadingScreen message="Loading account…" />;
    }

    if (isProvider) {
        return <Navigate to="/provider/account" replace />;
    }

    return (
        <AppShell title="Account" subtitle="Your profile & settings">
            <div className="mx-auto max-w-lg space-y-6">
                <header className="space-y-1 md:hidden">
                    <h1 className="text-2xl font-medium tracking-tight">
                        Account
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Your homeowner profile & settings
                    </p>
                </header>

                <Card className="overflow-hidden">
                    <div className="h-20 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
                    <CardContent className="relative pt-0">
                        <div className="-mt-10 flex flex-col items-center text-center sm:flex-row sm:items-end sm:text-left">
                            <ProviderAvatar
                                name={profile?.full_name}
                                avatarUrl={profile?.avatar_url}
                                size="lg"
                                className="ring-4 ring-card"
                            />
                            <div className="mt-4 sm:mt-0 sm:ml-4 sm:pb-1">
                                <h2 className="text-xl font-medium">
                                    {profile?.full_name ?? "Your account"}
                                </h2>
                                <Badge className="mt-2 bg-primary/10 text-primary">
                                    Homeowner
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <ProfileEditForm role="homeowner" />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Quick links</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <Button
                            asChild
                            variant="outline"
                            className="justify-start gap-2"
                        >
                            <Link to="/bookings">
                                <CalendarDays className="size-4" />
                                My bookings
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="justify-start gap-2"
                        >
                            <Link to="/home">
                                <Home className="size-4" />
                                Browse tradespeople
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Button
                    variant="destructive"
                    className="w-full gap-2"
                    onClick={handleLogout}
                >
                    <LogOut className="size-4" />
                    Sign out
                </Button>
            </div>
        </AppShell>
    );
}
