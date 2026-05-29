import { createContext, useCallback, useContext, useEffect, useState } from "react";
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
    const [initializing, setInitializing] = useState(true);

    const loadUserData = useCallback(async (user) => {
        if (!user) {
            setAuthUser(null);
            setProfile(null);
            setProviderProfile(null);
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
    }, []);

    useEffect(() => {
        let mounted = true;

        async function bootstrap() {
            try {
                const sessionResult = await Promise.race([
                    supabase.auth.getSession(),
                    new Promise((_, reject) =>
                        setTimeout(
                            () => reject(new Error("Auth session timeout")),
                            8000
                        )
                    ),
                ]);

                if (mounted) {
                    await loadUserData(sessionResult.data.session?.user ?? null);
                }
            } catch {
                if (mounted) {
                    setAuthUser(null);
                    setProfile(null);
                    setProviderProfile(null);
                }
            } finally {
                if (mounted) {
                    setInitializing(false);
                }
            }
        }

        bootstrap();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === "INITIAL_SESSION" || !mounted) return;
            await loadUserData(session?.user ?? null);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, [loadUserData]);

    const value = {
        authUser,
        profile,
        providerProfile,
        initializing,
        loading: initializing,
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
