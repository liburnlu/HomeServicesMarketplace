import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthLoadingScreen from "@/components/AuthLoadingScreen";

export default function GuestOnlyRoute({ children, redirectTo = "/home" }) {
    const { isLoggedIn, initializing } = useAuth();

    if (initializing) {
        return <AuthLoadingScreen />;
    }

    if (isLoggedIn) {
        return <Navigate to={redirectTo} replace />;
    }

    return children;
}
