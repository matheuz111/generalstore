// src/pages/account/AccountLogin.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";

const AdminDomain = import.meta.env.VITE_ADMIN_DOMAIN || "kidstoreperu.com";

const AccountLogin = () => {
  const { login }  = useAuth();
  const { t }      = useLang();
  const navigate   = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password,   setPassword]   = useState("");
  const [error,      setError]      = useState("");
  const [loading,    setLoading]    = useState(false);

  // Detecta si parece un email admin para mostrar hint
  const looksLikeAdmin = identifier.includes("@") && identifier.endsWith(`@${AdminDomain}`);

  const handleLogin = async () => {
    setError("");
    if (!identifier || !password) { setError(t("account", "fillAll")); return; }
    setLoading(true);

    const result = await login(identifier, password);
    setLoading(false);

    if (!result.success) {
      setError(result.error || t("account", "wrongCredentials"));
      return;
    }

    // Redirigir según rol
    if (result.isAdmin) {
      navigate("/kidstore-admin", { replace: true });
    } else {
      navigate("/mi-cuenta", { replace: true });
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24 text-white">
      <h2
        className="text-4xl font-black mb-8 uppercase text-center tracking-widest"
        style={{ fontFamily: "BurbankBig" }}
      >
        {t("account", "login")}
      </h2>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5 backdrop-blur-xl">

        {/* Hint admin */}
        {looksLikeAdmin && (
          <div className="bg-blue-500/10 border border-blue-500/25 text-blue-400 text-xs rounded-xl px-4 py-3 flex items-center gap-2">
            <span>🔐</span>
            <span>Detectamos un correo de administrador. Serás redirigido al panel admin.</span>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder={t("account", "userOrEmail")}
          value={identifier}
          onChange={e => setIdentifier(e.target.value)}
          className="w-full bg-black/40 px-4 py-3 rounded-lg outline-none border border-white/10 focus:border-blue-500 transition"
        />

        <input
          type="password"
          placeholder={t("account", "password")}
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          className="w-full bg-black/40 px-4 py-3 rounded-lg outline-none border border-white/10 focus:border-blue-500 transition"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-3 rounded-xl font-semibold transition cursor-pointer"
        >
          {loading
            ? <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t("account", "entering")}
              </span>
            : t("account", "enter")}
        </button>

        <p className="text-sm text-center text-gray-400">
          {t("account", "noAccount")}{" "}
          <Link to="/mi-cuenta/register" className="text-blue-400 hover:text-blue-300 transition cursor-pointer">
            {t("account", "signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AccountLogin;