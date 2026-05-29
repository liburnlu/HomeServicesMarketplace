import { Link, useLocation, useNavigate } from "react-router-dom";
import { CalendarDays, Home, LayoutDashboard, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const BASE_ITEMS = [
    { to: "/home", label: "Browse", icon: Home },
    { to: "/bookings", label: "Bookings", icon: CalendarDays, auth: true },
    { to: "/account", label: "Account", icon: User, auth: true },
];

export default function BottomNav() {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn, isProvider, initializing } = useAuth();

    const items = [...BASE_ITEMS];
    if (isLoggedIn && isProvider) {
        items.splice(2, 0, {
            to: "/dashboard",
            label: "Jobs",
            icon: LayoutDashboard,
            auth: true,
        });
    }

    function handleNavClick(e, item) {
        if (item.auth && !isLoggedIn && !initializing) {
            e.preventDefault();
            navigate("/login", { state: { from: { pathname: item.to } } });
        }
    }

    return (
        <nav
            className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 backdrop-blur md:hidden"
            aria-label="Main navigation"
        >
            <ul className="mx-auto flex max-w-lg">
                {items.map((item) => {
                    const { to, label, icon: Icon } = item;
                    const active =
                        location.pathname === to ||
                        (to !== "/home" && location.pathname.startsWith(to));

                    return (
                        <li key={to} className="flex-1">
                            <Link
                                to={to}
                                onClick={(e) => handleNavClick(e, { to, auth: item.auth })}
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
