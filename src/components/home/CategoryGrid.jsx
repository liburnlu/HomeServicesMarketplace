import { cn } from "@/lib/utils";

export default function CategoryGrid({
    categories,
    activeCategory,
    onCategoryChange,
}) {
    return (
        <section aria-labelledby="categories-heading">
            <h2
                id="categories-heading"
                className="text-sm font-medium tracking-tight"
            >
                Browse by trade
            </h2>
            <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
                {categories.map(({ id, label, icon: Icon }) => {
                    const isActive = activeCategory === id;

                    return (
                        <li key={id}>
                            <button
                                type="button"
                                onClick={() =>
                                    onCategoryChange(isActive ? null : id)
                                }
                                className={cn(
                                    "flex w-full flex-col items-center gap-2 rounded-xl border px-2 py-3 text-center transition-colors",
                                    isActive
                                        ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                                        : "bg-card ring-1 ring-foreground/10 hover:bg-muted/50"
                                )}
                            >
                                <span
                                    className={cn(
                                        "flex size-9 items-center justify-center rounded-lg",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "bg-muted text-muted-foreground"
                                    )}
                                >
                                    <Icon className="size-4" />
                                </span>
                                <span className="text-xs leading-tight font-medium">
                                    {label}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
