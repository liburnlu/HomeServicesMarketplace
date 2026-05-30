import { Link, useNavigate } from "react-router-dom";
import { Briefcase, LogOut, User, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function ProviderHeader() {
    const navigate = useNavigate();
    const { profile, initializing, logout } = useAuth();

    async function handleLogout() {
        await logout();
        navigate("/login");
    }

    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 md:h-16 md:px-6">
                <Link
                    to="/provider"
                    className="flex shrink-0 items-center gap-2 font-medium"
                >
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Wrench className="size-4" />
                    </div>
                    <span className="hidden text-sm sm:inline">
                        Tradesperson hub
                    </span>
                </Link>

                <nav className="ml-auto flex items-center gap-1">
                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="hidden md:inline-flex"
                    >
                        <Link to="/provider/jobs">
                            <Briefcase className="size-4 sm:mr-1" />
                            <span className="hidden lg:inline">Job inbox</span>
                        </Link>
                    </Button>
                    {initializing ? (
                        <span className="px-2 text-xs text-muted-foreground">
                            …
                        </span>
                    ) : (
                        <>
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="gap-1.5"
                            >
                                <Link to="/provider/account">
                                    <User className="size-4" />
                                    <span className="hidden max-w-24 truncate sm:inline">
                                        {profile?.full_name ?? "Account"}
                                    </span>
                                </Link>
                            </Button>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="hidden sm:inline-flex"
                                onClick={handleLogout}
                                aria-label="Sign out"
                            >
                                <LogOut className="size-4" />
                            </Button>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
