import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthLoadingScreen from "@/components/AuthLoadingScreen";

export default function GuestOnlyRoute({ children, redirectTo }) {
    const { isLoggedIn, initializing, isProvider } = useAuth();
    const destination = redirectTo ?? (isProvider ? "/provider" : "/home");

    if (initializing) {
        return <AuthLoadingScreen />;
    }

    if (isLoggedIn) {
        return <Navigate to={destination} replace />;
    }

    return children;
}
