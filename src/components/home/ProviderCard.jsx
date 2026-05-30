import { Link, useNavigate } from "react-router-dom";
import { BadgeCheck, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

function getInitials(name) {
    return name
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export default function ProviderCard({ provider }) {
    const navigate = useNavigate();
    const { authUser, isLoggedIn, isCustomer, profile } = useAuth();
    const isOwnProfile = authUser?.id === provider.id;
    const bookPath = `/providers/${provider.id}/book`;

    function handleRequestQuote() {
        if (!isLoggedIn) {
            navigate("/login", {
                state: { from: { pathname: bookPath } },
            });
            return;
        }
        if (profile && !isCustomer) {
            navigate("/dashboard");
            return;
        }
        navigate(bookPath);
    }

    return (
        <Card size="sm" className="h-full">
            <CardHeader className="flex-row items-start gap-3 space-y-0">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                    {getInitials(provider.name)}
                </div>
                <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="truncate">{provider.name}</CardTitle>
                        {provider.verified && (
                            <BadgeCheck
                                className="size-4 shrink-0 text-primary"
                                aria-label="Verified tradesperson"
                            />
                        )}
                    </div>
                    <CardDescription className="line-clamp-1">
                        {provider.categoryLabel}
                    </CardDescription>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1">
                            <Star className="size-3.5 fill-primary text-primary" />
                            {provider.rating}
                            <span>({provider.reviewCount})</span>
                        </span>
                        <span className="inline-flex items-center gap-1">
                            <MapPin className="size-3.5" />
                            {provider.city}
                        </span>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                    {provider.bio}
                </p>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div>
                        <dt className="text-muted-foreground">From</dt>
                        <dd className="font-medium">€{provider.priceFrom}/hr</dd>
                    </div>
                    <div>
                        <dt className="text-muted-foreground">Response</dt>
                        <dd className="font-medium">{provider.responseTime}</dd>
                    </div>
                </dl>
            </CardContent>

            <CardFooter className="gap-2">
                {!isOwnProfile && (
                    <Button
                        className="flex-1"
                        size="sm"
                        onClick={handleRequestQuote}
                    >
                        Request quote
                    </Button>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    className={isOwnProfile ? "flex-1" : undefined}
                    asChild
                >
                    <Link to={`/providers/${provider.id}`}>View profile</Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
