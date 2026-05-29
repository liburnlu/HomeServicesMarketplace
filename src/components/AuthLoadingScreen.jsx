export default function AuthLoadingScreen({ message = "Loading…" }) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-3 bg-background">
            <div
                className="size-8 animate-spin rounded-full border-2 border-primary border-t-transparent"
                aria-hidden
            />
            <p className="text-sm text-muted-foreground">{message}</p>
        </div>
    );
}
