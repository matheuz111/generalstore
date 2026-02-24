// src/pages/account/AccountRegister.tsx
import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";

const AccountRegister = () => {
  const { register } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);
  const [loading,  setLoading]  = useState(false);

  const redirectTo = (location.state as { from?: string })?.from || "/mi-cuenta";

  const handleRegister = async () => {
    setError("");
    if (!username || !email || !password) { setError(t("account", "fillAll")); return; }
    setLoading(true);
    const created = await register(username, email, password);
    setLoading(false);
    if (!created) { setError(t("account", "userExists")); return; }
    setSuccess(true);
    setTimeout(() => navigate(redirectTo, { replace: true }), 2500);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24 text-white">
      <h2 className="text-4xl font-black mb-8 uppercase text-center tracking-widest" style={{ fontFamily: "BurbankBig" }}>
        {t("account", "register")}
      </h2>
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5 backdrop-blur-xl">
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2">{error}</div>
        )}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 text-green-400 text-sm rounded-lg px-4 py-3 space-y-1">
            <p className="font-semibold">{t("account", "created")}</p>
            <p>📩 {t("account", "sentEmail")} <b>{email}</b></p>
            <p className="text-xs text-gray-300">{t("account", "redirecting")}</p>
          </div>
        )}
        {!success && (
          <>
            <input placeholder={t("account", "username")} value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-black/40 px-4 py-3 rounded-lg outline-none border border-white/10 focus:border-blue-500 transition" />
            <input type="email" placeholder={t("account", "email")} value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/40 px-4 py-3 rounded-lg outline-none border border-white/10 focus:border-blue-500 transition" />
            <input type="password" placeholder={t("account", "password")} value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 px-4 py-3 rounded-lg outline-none border border-white/10 focus:border-blue-500 transition" />
            <button onClick={handleRegister} disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-3 rounded-xl font-semibold transition cursor-pointer">
              {loading ? t("account", "creating") : t("account", "registerMe")}
            </button>
            <p className="text-sm text-center text-gray-400">
              {t("account", "haveAccount")}{" "}
              <Link to="/mi-cuenta/login" className="text-blue-400 hover:text-blue-300 transition cursor-pointer">
                {t("account", "signIn")}
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AccountRegister;