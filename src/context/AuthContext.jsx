import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Safety check for missing environment variables
        if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
            console.error('Supabase environment variables are missing! The app will not function correctly.');
            setIsLoading(false);
            return;
        }

        // Safety timeout to prevent infinite loading state
        const timer = setTimeout(() => {
            if (isLoading) {
                console.warn('Auth session check timed out.');
                setIsLoading(false);
            }
        }, 5000);

        // Check active sessions and sets the user
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
            clearTimeout(timer);
        }).catch(err => {
            console.error('Error fetching session:', err);
            setIsLoading(false);
            clearTimeout(timer);
        });

        // Listen for changes on auth state (log in, log out, etc.)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            setIsLoading(false);
        });

        return () => {
            subscription.unsubscribe();
            clearTimeout(timer);
        };
    }, []);

    // Exposed functionality
    const value = {
        user,
        session,
        isLoading,
        signUp: (data) => supabase.auth.signUp(data),
        signInWithPassword: (data) => supabase.auth.signInWithPassword(data),
        signInWithGithub: () => {
            const redirectTo = window.location.origin + (import.meta.env.BASE_URL || '/');
            return supabase.auth.signInWithOAuth({ 
                provider: 'github',
                options: { redirectTo }
            });
        },
        signInWithGoogle: () => {
            const redirectTo = window.location.origin + (import.meta.env.BASE_URL || '/');
            return supabase.auth.signInWithOAuth({ 
                provider: 'google',
                options: { redirectTo }
            });
        },
        signOut: () => supabase.auth.signOut(),
    };

    return (
        <AuthContext.Provider value={value}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
