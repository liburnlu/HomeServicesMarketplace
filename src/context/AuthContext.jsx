import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    ensureUserProfile,
    login as loginWithPassword,
    logout as signOut,
    registerUser,
} from "@/services/authService";
import { getProfileById } from "@/services/profileService.js";
import { getProviderProfileById } from "@/services/providerService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [authUser, setAuthUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [providerProfile, setProviderProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    async function loadUserData(user) {
        if (!user) {
            setAuthUser(null);
            setProfile(null);
            setProviderProfile(null);
            setLoading(false);
            return;
        }

        setAuthUser(user);

        try {
            let userProfile = await getProfileById(user.id);

            if (!userProfile) {
                userProfile = await ensureUserProfile(user);
            }

            setProfile(userProfile);

            if (userProfile?.role === "provider") {
                const provider = await getProviderProfileById(user.id);
                setProviderProfile(provider);
            } else {
                setProviderProfile(null);
            }
        } catch {
            setProfile(null);
            setProviderProfile(null);
        }

        setLoading(false);
    }

    useEffect(() => {
        async function initAuth() {
            const { data } = await supabase.auth.getUser();
            await loadUserData(data.user);
        }

        initAuth();

        const { data: listener } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                setLoading(true);
                await loadUserData(session?.user ?? null);
            }
        );

        return () => {
            listener?.subscription?.unsubscribe();
        };
    }, []);

    const value = {
        authUser,
        profile,
        providerProfile,
        loading,
        isLoggedIn: !!authUser,
        isCustomer: profile?.role === "customer",
        isProvider: profile?.role === "provider",
        login: loginWithPassword,
        register: registerUser,
        logout: signOut,
        reloadUser: () => loadUserData(authUser),
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}