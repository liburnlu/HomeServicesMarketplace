import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import GuestOnlyRoute from "@/components/GuestOnlyRoute";
import ProviderLayout from "@/components/layout/ProviderLayout";
import Onboarding from "@/pages/Onboarding.jsx";
import Login from "@/pages/Login.jsx";
import Register from "@/pages/Register.jsx";
import Home from "@/pages/Home.jsx";
import ProviderDetail from "@/pages/ProviderDetail.jsx";
import BookService from "@/pages/BookService.jsx";
import MyBookings from "@/pages/MyBookings.jsx";
import Account from "@/pages/Account.jsx";
import ProviderHome from "@/pages/provider/ProviderHome.jsx";
import ProviderJobs from "@/pages/provider/ProviderJobs.jsx";
import ProviderAccount from "@/pages/provider/ProviderAccount.jsx";

function App() {
    return (
        <Routes>
            {/* Public — homeowner marketplace */}
            <Route path="/" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/providers/:id" element={<ProviderDetail />} />

            {/* Auth pages */}
            <Route
                path="/login"
                element={
                    <GuestOnlyRoute>
                        <Login />
                    </GuestOnlyRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <GuestOnlyRoute>
                        <Register />
                    </GuestOnlyRoute>
                }
            />

            {/* Tradesperson portal */}
            <Route
                path="/provider"
                element={
                    <ProtectedRoute requireRole="provider">
                        <ProviderLayout />
                    </ProtectedRoute>
                }
            >
                <Route index element={<ProviderHome />} />
                <Route path="jobs" element={<ProviderJobs />} />
                <Route path="account" element={<ProviderAccount />} />
            </Route>

            {/* Legacy dashboard URL */}
            <Route
                path="/dashboard"
                element={<Navigate to="/provider/jobs" replace />}
            />

            {/* Protected — homeowners */}
            <Route
                path="/account"
                element={
                    <ProtectedRoute>
                        <Account />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/providers/:id/book"
                element={
                    <ProtectedRoute requireRole="customer">
                        <BookService />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/bookings"
                element={
                    <ProtectedRoute requireRole="customer">
                        <MyBookings />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
