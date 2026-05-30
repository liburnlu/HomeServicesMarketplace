import { Outlet } from "react-router-dom";
import ProviderShell from "@/components/layout/ProviderShell";

export default function ProviderLayout() {
    return (
        <ProviderShell>
            <Outlet />
        </ProviderShell>
    );
}
