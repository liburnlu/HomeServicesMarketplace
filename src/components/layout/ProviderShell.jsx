import ProviderHeader from "@/components/layout/ProviderHeader";
import ProviderBottomNav from "@/components/layout/ProviderBottomNav";
import { cn } from "@/lib/utils";

export default function ProviderShell({ children, className }) {
    return (
        <div className="min-h-svh bg-background">
            <ProviderHeader />
            <main
                className={cn(
                    "mx-auto max-w-6xl px-4 py-6 pb-24 md:px-6 md:py-8 md:pb-10",
                    className
                )}
            >
                {children}
            </main>
            <ProviderBottomNav />
        </div>
    );
}
