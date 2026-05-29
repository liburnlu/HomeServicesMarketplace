import { Link } from "react-router-dom";
import {
    CalendarDays,
    LayoutDashboard,
    LogOut,
    Mail,
    MapPin,
    Phone,
    User,
    Wrench,
} from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import ProviderAvatar from "@/components/providers/ProviderAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Account() {
    const navigate = useNavigate();
    const {
        authUser,
        profile,
        providerProfile,
        isCustomer,
        isProvider,
        logout,
        initializing,
    } = useAuth();

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    if (initializing) {
        return null;
    }

    return (
        <AppShell title="Account" subtitle="Your profile & settings">
            <div className="mx-auto max-w-lg space-y-6">
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
                                    {isProvider ? "Tradesperson" : "Homeowner"}
                                </Badge>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Details</CardTitle>
                        <CardDescription>
                            Information from your registration
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex gap-3">
                            <Mail className="size-4 shrink-0 text-muted-foreground" />
                            <span>{authUser?.email}</span>
                        </div>
                        {profile?.phone_number && (
                            <div className="flex gap-3">
                                <Phone className="size-4 shrink-0 text-muted-foreground" />
                                <span>{profile.phone_number}</span>
                            </div>
                        )}
                        {profile?.city && (
                            <div className="flex gap-3">
                                <MapPin className="size-4 shrink-0 text-muted-foreground" />
                                <span>{profile.city}</span>
                            </div>
                        )}
                        {isProvider && providerProfile && (
                            <>
                                <div className="flex gap-3">
                                    <Wrench className="size-4 shrink-0 text-muted-foreground" />
                                    <span>{providerProfile.category}</span>
                                </div>
                                {providerProfile.bio && (
                                    <p className="rounded-lg bg-muted/50 p-3 text-muted-foreground">
                                        {providerProfile.bio}
                                    </p>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Quick links</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        {isCustomer && (
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
                        )}
                        {isProvider && (
                            <Button
                                asChild
                                variant="outline"
                                className="justify-start gap-2"
                            >
                                <Link to="/dashboard">
                                    <LayoutDashboard className="size-4" />
                                    Job inbox
                                </Link>
                            </Button>
                        )}
                        <Button
                            asChild
                            variant="outline"
                            className="justify-start gap-2"
                        >
                            <Link to="/home">
                                <User className="size-4" />
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
