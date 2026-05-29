import { Link } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";
import SiteHeader from "@/components/layout/SiteHeader";
import BottomNav from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function AppShell({
    children,
    variant = "browse",
    title,
    subtitle,
    backTo = "/home",
    serviceQuery,
    onServiceQueryChange,
    locationQuery,
    onLocationQueryChange,
    className,
}) {
    const isBrowse = variant === "browse";

    return (
        <div className="min-h-svh bg-background">
            {isBrowse ? (
                <SiteHeader
                    serviceQuery={serviceQuery}
                    onServiceQueryChange={onServiceQueryChange}
                    locationQuery={locationQuery}
                    onLocationQueryChange={onLocationQueryChange}
                />
            ) : (
                <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
                    <div className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-4 md:h-16 md:px-6">
                        <Button
                            asChild
                            variant="ghost"
                            size="icon-sm"
                            className="shrink-0"
                        >
                            <Link to={backTo} aria-label="Go back">
                                <ArrowLeft className="size-4" />
                            </Link>
                        </Button>
                        <div className="min-w-0 flex-1">
                            {title && (
                                <h1 className="truncate text-sm font-medium md:text-base">
                                    {title}
                                </h1>
                            )}
                            {subtitle && (
                                <p className="truncate text-xs text-muted-foreground">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                        <Button asChild variant="ghost" size="icon-sm">
                            <Link to="/home" aria-label="Home">
                                <Home className="size-4" />
                            </Link>
                        </Button>
                    </div>
                </header>
            )}

            <div
                className={cn(
                    "mx-auto max-w-6xl px-4 pb-24 md:px-6 md:pb-10",
                    isBrowse ? "" : "py-6 md:py-8",
                    className
                )}
            >
                {children}
            </div>

            <BottomNav />
        </div>
    );
}
