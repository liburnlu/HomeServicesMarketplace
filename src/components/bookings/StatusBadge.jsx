import { Badge } from "@/components/ui/badge";
import { getStatusConfig } from "@/lib/bookingStatus";
import { cn } from "@/lib/utils";

export default function StatusBadge({ status }) {
    const config = getStatusConfig(status);

    return (
        <Badge className={cn("border-0", config.className)}>
            {config.label}
        </Badge>
    );
}
