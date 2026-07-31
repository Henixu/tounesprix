"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "@/services/auth";
import { TOKEN_STORAGE_KEY } from "@/services/api";
import type { LoginPayload, RegisterPayload, UserRole } from "@/services/auth";

const USER_STORAGE_KEY = "tounesprix_user";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

type AuthContextValue = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginPayload) => Promise<AuthUser>;
  register: (data: RegisterPayload) => Promise<AuthUser>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = window.localStorage.getItem(TOKEN_STORAGE_KEY);
    const storedUser = window.localStorage.getItem(USER_STORAGE_KEY);

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      } catch {
        window.localStorage.removeItem(TOKEN_STORAGE_KEY);
        window.localStorage.removeItem(USER_STORAGE_KEY);
      }
    }

    setIsLoading(false);
  }, []);

  const persistSession = useCallback((nextUser: AuthUser, nextToken: string) => {
    window.localStorage.setItem(TOKEN_STORAGE_KEY, nextToken);
    window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const login = useCallback(
    async (data: LoginPayload) => {
      const response = await authService.login(data);
      const nextUser: AuthUser = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
      };
      persistSession(nextUser, response.token);
      return nextUser;
    },
    [persistSession],
  );

  const register = useCallback(
    async (data: RegisterPayload) => {
      const response = await authService.register(data);
      const nextUser: AuthUser = {
        id: response.id,
        name: response.name,
        email: response.email,
        role: response.role,
      };
      persistSession(nextUser, response.token);
      return nextUser;
    },
    [persistSession],
  );

  const logout = useCallback(() => {
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
    window.localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, token, isLoading, login, register, logout }),
    [user, token, isLoading, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit etre utilise a l'interieur d'un AuthProvider");
  }
  return context;
}
