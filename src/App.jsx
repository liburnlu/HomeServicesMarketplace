import "./App.css";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import GuestOnlyRoute from "@/components/GuestOnlyRoute";
import Onboarding from "@/pages/Onboarding.jsx";
import Login from "@/pages/Login.jsx";
import Register from "@/pages/Register.jsx";
import Home from "@/pages/Home.jsx";
import ProviderDetail from "@/pages/ProviderDetail.jsx";
import BookService from "@/pages/BookService.jsx";
import MyBookings from "@/pages/MyBookings.jsx";
import ProviderDashboard from "@/pages/ProviderDashboard.jsx";
import Account from "@/pages/Account.jsx";

function App() {
    return (
        <Routes>
            {/* Public — no account required */}
            <Route path="/" element={<Onboarding />} />
            <Route path="/home" element={<Home />} />
            <Route path="/providers/:id" element={<ProviderDetail />} />

            {/* Auth pages — signed-in users go to home */}
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

            {/* Protected — must be signed in */}
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
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute requireRole="provider">
                        <ProviderDashboard />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
