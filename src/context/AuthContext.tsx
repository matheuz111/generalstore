// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
const SESSION_KEY = "kidstore_session";

interface User {
  id?:      number;
  username: string;
  email:    string;
}

interface AuthContextType {
  user:     User | null;
  loading:  boolean;
  register: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  login:    (identifier: string, password: string)              => Promise<{ success: boolean; error?: string }>;
  logout:   () => void;
  changePassword: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user,    setUser]    = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar sesión guardada al iniciar
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SESSION_KEY);
      if (stored) setUser(JSON.parse(stored));
    } catch {
      localStorage.removeItem(SESSION_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Registro ── */
  const register = async (username: string, email: string, password: string) => {
    try {
      const res  = await fetch(`${BACKEND_URL}/auth/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ username, email, password }),
      });
      const data = await res.json();

      if (!res.ok) return { success: false, error: data.error || "Error al registrar." };

      const publicUser: User = data.user;
      localStorage.setItem(SESSION_KEY, JSON.stringify(publicUser));
      setUser(publicUser);
      return { success: true };
    } catch {
      return { success: false, error: "No se pudo conectar con el servidor." };
    }
  };

  /* ── Login ── */
  const login = async (identifier: string, password: string) => {
    try {
      const res  = await fetch(`${BACKEND_URL}/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ identifier, password }),
      });
      const data = await res.json();

      if (!res.ok) return { success: false, error: data.error || "Credenciales incorrectas." };

      const publicUser: User = data.user;
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
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};