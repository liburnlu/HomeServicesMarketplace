import { Link, useLocation } from "react-router-dom";
import { Briefcase, LayoutDashboard, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
    { to: "/provider", label: "Home", icon: LayoutDashboard, end: true },
    { to: "/provider/jobs", label: "Jobs", icon: Briefcase },
    { to: "/provider/account", label: "Account", icon: User },
];

export default function ProviderBottomNav() {
    const location = useLocation();

    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur md:hidden"
            aria-label="Tradesperson navigation"
        >
            <ul className="mx-auto flex max-w-lg">
                {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => {
                    const active = end
                        ? location.pathname === to
                        : location.pathname.startsWith(to);

                    return (
                        <li key={to} className="flex-1">
                            <Link
                                to={to}
                                className={cn(
                                    "flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                                    active
                                        ? "text-primary"
                                        : "text-muted-foreground"
                                )}
                            >
                                <Icon
                                    className={cn(
                                        "size-5",
                                        active && "stroke-[2.5px]"
                                    )}
                                />
                                {label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
