import { Link } from "react-router-dom";
import { Home, MapPin, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SiteHeader({
    serviceQuery,
    onServiceQueryChange,
    locationQuery,
    onLocationQueryChange,
}) {
    function handleSubmit(e) {
        e.preventDefault();
    }

    return (
        <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
            <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 md:h-16 md:px-6">
                <Link
                    to="/home"
                    className="flex shrink-0 items-center gap-2 font-medium"
                >
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Home className="size-4" />
                    </div>
                    <span className="hidden text-sm sm:inline">
                        Home Services
                    </span>
                </Link>

                <form
                    onSubmit={handleSubmit}
                    className="hidden flex-1 items-center gap-2 md:flex"
                >
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={serviceQuery}
                            onChange={(e) => onServiceQueryChange(e.target.value)}
                            placeholder="What service do you need?"
                            className="h-9 pl-8"
                        />
                    </div>
                    <div className="relative w-44">
                        <MapPin className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={locationQuery}
                            onChange={(e) => onLocationQueryChange(e.target.value)}
                            placeholder="City or postcode"
                            className="h-9 pl-8"
                        />
                    </div>
                    <Button type="submit" size="sm" className="h-9 px-4">
                        Search
                    </Button>
                </form>

                <nav className="ml-auto flex items-center gap-1">
                    <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                        <Link to="/home">Browse</Link>
                    </Button>
                    <Button variant="outline" size="sm" className="gap-1.5">
                        <User className="size-4" />
                        <span className="hidden sm:inline">Account</span>
                    </Button>
                </nav>
            </div>

            <form
                onSubmit={handleSubmit}
                className="flex gap-2 border-t px-4 py-2 md:hidden"
            >
                <Input
                    value={serviceQuery}
                    onChange={(e) => onServiceQueryChange(e.target.value)}
                    placeholder="Service"
                    className="h-9 flex-1"
                />
                <Input
                    value={locationQuery}
                    onChange={(e) => onLocationQueryChange(e.target.value)}
                    placeholder="Location"
                    className="h-9 w-28"
                />
                <Button type="submit" size="sm" className="h-9 shrink-0">
                    <Search className="size-4" />
                </Button>
            </form>
        </header>
    );
}
