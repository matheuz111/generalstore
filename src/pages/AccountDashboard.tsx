// src/pages/AccountDashboard.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";

const AccountDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useLang();

  if (!user) { navigate("/mi-cuenta/login"); return null; }

  return (
    <div className="max-w-5xl mx-auto px-6 py-24 text-white">
      <h1 className="text-5xl font-black uppercase tracking-widest mb-10" style={{ fontFamily: "BurbankBig" }}>
        {t("account", "title")}
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h2 className="text-xl font-bold mb-4 text-blue-400">{t("account", "profile")}</h2>
          <div className="space-y-3 text-sm">
            <p><span className="text-gray-400">{t("account", "userLabel")}</span> <b>{user.username}</b></p>
            <p><span className="text-gray-400">{t("account", "emailLabel")}</span> <b>{user.email}</b></p>
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="mt-6 bg-red-600 hover:bg-red-500 transition px-5 py-2 rounded-xl font-semibold cursor-pointer"
          >
            {t("account", "logout")}
          </button>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h2 className="text-xl font-bold mb-4 text-blue-400">{t("account", "options")}</h2>
          <ul className="space-y-3 text-sm">
            <li className="text-gray-400">{t("account", "orders")}</li>
            <li className="text-gray-400">{t("account", "security")}</li>
            <li className="text-gray-400">{t("account", "preferences")}</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;