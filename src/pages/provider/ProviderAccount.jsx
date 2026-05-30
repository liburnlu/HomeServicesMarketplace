import { Link } from "react-router-dom";
import { Briefcase, LogOut, Wrench } from "lucide-react";
import ProfileEditForm from "@/components/profile/ProfileEditForm";
import ProviderAvatar from "@/components/providers/ProviderAvatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProviderAccount() {
    const navigate = useNavigate();
    const { authUser, profile, logout } = useAuth();

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    return (
        <div className="mx-auto max-w-lg space-y-6">
            <header className="space-y-1">
                <h1 className="text-2xl font-medium tracking-tight">Account</h1>
                <p className="text-sm text-muted-foreground">
                    Your tradesperson profile & settings
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
                                Tradesperson
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ProfileEditForm role="provider" isProvider />

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
                        <Link to="/provider/jobs">
                            <Briefcase className="size-4" />
                            Job inbox
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        className="justify-start gap-2"
                    >
                        <Link to={`/providers/${authUser?.id}`}>
                            <Wrench className="size-4" />
                            View public profile
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
    );
}
