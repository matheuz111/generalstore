// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

const BACKEND_URL   = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
const SESSION_KEY   = "kidstore_session";
const ADMIN_KEY     = "kidstore_admin_session";
// Token fijo que el cliente envía en x-admin-key para las rutas protegidas del admin
// Debe coincidir con ADMIN_SESSION_TOKEN en el .env del backend
const ADMIN_TOKEN   = import.meta.env.VITE_ADMIN_SESSION_TOKEN || "kidstore-admin-secret-2025";

interface User {
  id?:      number;
  username: string;
  email:    string;
  phone?:   string;
  role?:    "user" | "admin";
}

interface AuthContextType {
  user:           User | null;
  loading:        boolean;
  isAdmin:        boolean;
  register:       (username: string, email: string, password: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  login:          (identifier: string, password: string)                               => Promise<{ success: boolean; error?: string; isAdmin?: boolean }>;
  logout:         () => void;
  changePassword: (currentPassword: string, newPassword: string)                       => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const ADMIN_SESSION_TOKEN = ADMIN_TOKEN;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restaurar sesión al cargar
  useEffect(() => {
    try {
      // Revisar sesión admin primero
      const adminStored = sessionStorage.getItem(ADMIN_KEY);
      if (adminStored) {
        setUser({ ...JSON.parse(adminStored), role: "admin" });
        setLoading(false);
        return;
      }
      // Sesión de usuario normal
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem(SESSION_KEY);
      sessionStorage.removeItem(ADMIN_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Login unificado ──
     Si el email es de dominio admin → prueba /admin/login
     Si no → prueba /auth/login normal */
  const login = async (identifier: string, password: string) => {
    const adminDomain = import.meta.env.VITE_ADMIN_DOMAIN || "kidstoreperu.com";
    const isAdminEmail = identifier.includes("@") && identifier.endsWith(`@${adminDomain}`);

    if (isAdminEmail) {
      // ── Intento de login como admin ──
      try {
        const res  = await fetch(`${BACKEND_URL}/admin/login`, {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ email: identifier, password }),
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          return { success: false, error: data.error || "Credenciales incorrectas." };
        }

        const adminUser: User = { ...data.admin, role: "admin" };
        sessionStorage.setItem(ADMIN_KEY, JSON.stringify(adminUser));
        setUser(adminUser);
        return { success: true, isAdmin: true };
      } catch {
        return { success: false, error: "No se pudo conectar con el servidor." };
      }
    }

    // ── Login normal de usuario ──
    try {
      const res  = await fetch(`${BACKEND_URL}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ identifier, password }),
      });
      const data = await res.json();

      if (!res.ok) return { success: false, error: data.error || "Credenciales incorrectas." };

      const publicUser: User = { ...data.user, role: "user" };
      localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
      setUser(publicUser);
      return { success: true, isAdmin: false };
    } catch {
      return { success: false, error: "No se pudo conectar con el servidor." };
    }
  };

  /* ── Registro ── */
  const register = async (username: string, email: string, password: string, phone?: string) => {
    try {
      const res  = await fetch(`${BACKEND_URL}/auth/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username, email, password, phone }),
      });
      const data = await res.json();

      if (!res.ok) return { success: false, error: data.error || "Error al registrar." };

      const publicUser: User = { ...data.user, role: "user" };
      localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
      setUser(publicUser);
      return { success: true };
    } catch {
      return { success: false, error: "No se pudo conectar con el servidor." };
    }
  };

  /* ── Cambiar contraseña ── */
  const changePassword = async (currentPassword: string, newPassword: string) => {
    if (!user) return { success: false, error: "No hay sesión activa." };
    try {
      const res  = await fetch(`${BACKEND_URL}/auth/change-password`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username: user.username, currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      return { success: true };
    } catch {
      return { success: false, error: "No se pudo conectar con el servidor." };
    }
  };

  /* ── Logout ── */
  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(ADMIN_KEY);
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, register, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};