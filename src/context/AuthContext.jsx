import { createContext, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
    ensureUserProfile,
    login as loginWithPassword,
    logout as signOut,
    registerUser,
} from "@/services/authService";
import { getProfileById } from "@/services/profileService";
import { getProviderProfileById } from "@/services/providerService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [authUser, setAuthUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [providerProfile, setProviderProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const lastLoadedUserId = useRef(null);

    async function loadUserData(user, force = false) {
        if (!user) {
            lastLoadedUserId.current = null;
            setAuthUser(null);
            setProfile(null);
            setProviderProfile(null);
            setLoading(false);
            return;
        }

        if (!force && lastLoadedUserId.current === user.id) {
            setLoading(false);
            return;
        }

        lastLoadedUserId.current = user.id;
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
        } catch (error) {
            console.error("Failed to load user data:", error);
            setProfile(null);
            setProviderProfile(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        let mounted = true;

        async function initAuth() {
            setLoading(true);

            const { data, error } = await supabase.auth.getSession();

            if (!mounted) return;

            if (error) {
                console.error("Auth session error:", error);
                await loadUserData(null);
                return;
            }

            await loadUserData(data.session?.user ?? null);
        }

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!mounted) return;

            loadUserData(session?.user ?? null, true);
        });

        initAuth();

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    async function login(email, password) {
        setLoading(true);

        const result = await loginWithPassword(email, password);

        if (result?.data?.user) {
            await loadUserData(result.data.user, true);
        } else {
            setLoading(false);
        }

        return result;
    }

    async function register(...args) {
        setLoading(true);

        const result = await registerUser(...args);

        if (result?.data?.user) {
            await loadUserData(result.data.user, true);
        } else {
            setLoading(false);
        }

        return result;
    }

    async function logout() {
        setLoading(true);
        await signOut();
        await loadUserData(null, true);
    }

    const value = {
        authUser,
        profile,
        providerProfile,
        loading,
        isLoggedIn: !!authUser,
        isCustomer: profile?.role === "customer",
        isProvider: profile?.role === "provider",
        login,
        register,
        logout,
        reloadUser: () => loadUserData(authUser, true),
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