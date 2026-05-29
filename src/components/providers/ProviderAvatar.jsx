import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/format";

export default function ProviderAvatar({
    name,
    avatarUrl,
    size = "md",
    className,
}) {
    const sizes = {
        sm: "size-10 text-xs",
        md: "size-14 text-sm",
        lg: "size-20 text-lg",
        xl: "size-24 text-xl",
    };

    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt=""
                className={cn(
                    "shrink-0 rounded-full object-cover ring-2 ring-background",
                    sizes[size],
                    className
                )}
            />
        );
    }

    return (
        <div
            className={cn(
                "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 font-medium text-primary ring-2 ring-background",
                sizes[size],
                className
            )}
        >
            {getInitials(name)}
        </div>
    );
}
