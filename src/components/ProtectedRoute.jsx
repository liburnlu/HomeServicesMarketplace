import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthLoadingScreen from "@/components/AuthLoadingScreen";

export default function ProtectedRoute({
    children,
    requireRole,
    redirectTo = "/login",
}) {
    const { isLoggedIn, initializing, profile, isCustomer, isProvider } =
        useAuth();
    const location = useLocation();

    if (initializing) {
        return <AuthLoadingScreen />;
    }

    if (!isLoggedIn) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    if (requireRole && !profile) {
        return <Navigate to="/account" replace />;
    }

    if (requireRole === "customer" && !isCustomer) {
        return <Navigate to="/provider" replace />;
    }

    if (requireRole === "provider" && !isProvider) {
        return <Navigate to="/bookings" replace />;
    }

    return children;
}
