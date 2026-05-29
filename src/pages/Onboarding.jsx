import { Link } from "react-router-dom";
import { ArrowRight, Home, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

const highlights = [
    {
        icon: Home,
        title: "Homeowners",
        description: "Find trusted tradespeople for repairs and projects.",
    },
    {
        icon: Wrench,
        title: "Tradespeople",
        description: "Offer your services and connect with local clients.",
    },
];

export default function Onboarding() {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
            <div className="flex w-full max-w-md flex-col gap-10">
                <header className="flex flex-col items-center gap-4 text-center">
                    <div className="flex items-center gap-2 font-medium">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Home className="size-4" />
                        </div>
                        <span className="text-sm tracking-tight">
                            Home Services
                        </span>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-2xl font-medium tracking-tight text-balance">
                            Home help, one tap away
                        </h1>
                        <p className="text-sm text-muted-foreground text-pretty">
                            A simple marketplace to book tradespeople or grow
                            your service business.
                        </p>
                    </div>
                </header>

                <ul className="space-y-3">
                    {highlights.map(({ icon: Icon, title, description }) => (
                        <li
                            key={title}
                            className="flex gap-3 rounded-xl border bg-background/80 px-4 py-3 ring-1 ring-foreground/10"
                        >
                            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <Icon className="size-4 text-muted-foreground" />
                            </div>
                            <div className="space-y-0.5 text-left">
                                <p className="text-sm font-medium">{title}</p>
                                <p className="text-sm text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>

                <div className="flex flex-col gap-2">
                    <Button asChild size="lg" className="w-full">
                        <Link to="/register">
                            Get started
                            <ArrowRight className="size-4" />
                        </Link>
                    </Button>
                    <Button
                        asChild
                        variant="outline"
                        size="lg"
                        className="w-full"
                    >
                        <Link to="/login">Sign in</Link>
                    </Button>
                </div>

                <p className="text-center text-xs text-muted-foreground">
                    Free to join. No commitment until you book.
                </p>
            </div>
        </div>
    );
}
