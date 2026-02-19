import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";

interface User {
  username: string;
  email: string;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  register: (
    username: string,
    email: string,
    password: string
  ) => boolean;
  login: (
    identifier: string,
    password: string
  ) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(
  null
);

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(
    null
  );

  /* ================= CARGAR SESIÓN AL INICIAR ================= */
  useEffect(() => {
    const storedUser = localStorage.getItem(
      "kidstore_user"
    );
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(
          "kidstore_user"
        );
      }
    }
  }, []);

  /* ================= REGISTRO ================= */
  const register = (
    username: string,
    email: string,
    password: string
  ) => {
    const users: StoredUser[] = JSON.parse(
      localStorage.getItem(
        "kidstore_users"
      ) || "[]"
    );

    const exists = users.some(
      (u) =>
        u.username === username ||
        u.email === email
    );

    if (exists) return false;

    const newUser: StoredUser = {
      username,
      email,
      password,
    };

    users.push(newUser);

    localStorage.setItem(
      "kidstore_users",
      JSON.stringify(users)
    );

    const publicUser: User = {
      username,
      email,
    };

    localStorage.setItem(
      "kidstore_user",
      JSON.stringify(publicUser)
    );

    setUser(publicUser);
    return true;
  };

  /* ================= LOGIN ================= */
  const login = (
    identifier: string,
    password: string
  ) => {
    const users: StoredUser[] = JSON.parse(
      localStorage.getItem(
        "kidstore_users"
      ) || "[]"
    );

    const found = users.find(
      (u) =>
        (u.username === identifier ||
          u.email === identifier) &&
        u.password === password
    );

    if (!found) return false;

    const publicUser: User = {
      username: found.username,
      email: found.email,
    };

    localStorage.setItem(
      "kidstore_user",
      JSON.stringify(publicUser)
    );

    setUser(publicUser);
    return true;
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.removeItem(
      "kidstore_user"
    );
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }
  return ctx;
};
