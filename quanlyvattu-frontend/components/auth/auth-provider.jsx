'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { clearStoredSession, getStoredSession, setStoredSession } from '@/lib/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function boot() {
      const stored = getStoredSession();
      if (!stored?.accessToken) {
        if (mounted) setLoading(false);
        return;
      }

      try {
        const user = await api.auth.me(stored.accessToken);
        const nextSession = {
          accessToken: stored.accessToken,
          user,
        };
        setStoredSession(nextSession);
        if (mounted) setSession(nextSession);
      } catch {
        clearStoredSession();
        if (mounted) setSession(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();
    return () => {
      mounted = false;
    };
  }, []);

  async function login(email, password) {
    const result = await api.auth.login({ email, password });
    setStoredSession(result);
    setSession(result);
    return result;
  }

  async function refresh() {
    if (!session?.accessToken) return null;
    const user = await api.auth.me(session.accessToken);
    const nextSession = { accessToken: session.accessToken, user };
    setStoredSession(nextSession);
    setSession(nextSession);
    return nextSession;
  }

  function logout() {
    clearStoredSession();
    setSession(null);
  }

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      token: session?.accessToken || null,
      permissions: session?.user?.permissions || [],
      loading,
      login,
      logout,
      refresh,
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
