export const BOOKING_STATUSES = {
    pending: {
        label: "Pending",
        className: "bg-amber-500/15 text-amber-800 dark:text-amber-200",
    },
    accepted: {
        label: "Accepted",
        className: "bg-emerald-500/15 text-emerald-800 dark:text-emerald-200",
    },
    rejected: {
        label: "Declined",
        className: "bg-red-500/15 text-red-800 dark:text-red-200",
    },
    completed: {
        label: "Completed",
        className: "bg-primary/10 text-primary",
    },
    cancelled: {
        label: "Cancelled",
        className: "bg-muted text-muted-foreground",
    },
};

export function getStatusConfig(status) {
    return BOOKING_STATUSES[status] ?? BOOKING_STATUSES.pending;
}
