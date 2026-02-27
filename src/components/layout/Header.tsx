// src/components/layout/Header.tsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useLang } from "../../context/LangContext";
import { useAuth } from "../../context/AuthContext";
import LangToggle from "../ui/LangToggle";

interface HeaderProps {
  onCartClick: () => void;
}

const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();
  return (
    <div className="flex gap-1.5">
      {(["PEN", "USD", "EUR"] as const).map((lib) => (
        <button
          key={lib}
          onClick={() => setCurrency(lib)}
          className={`px-2 py-1 rounded font-bold text-xs transition-colors ${
            currency === lib
              ? "bg-blue-600 text-white"
              : "bg-white/10 text-gray-300 hover:bg-white/20"
          }`}
        >
          {lib}
        </button>
      ))}
    </div>
  );
};

const AccountMenu = () => {
  const { user, logout } = useAuth();
  const { t }            = useLang();
  const navigate         = useNavigate();
  const [open, setOpen]  = useState(false);
  const menuRef          = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (!user) {
    return (
      <Link
        to="/mi-cuenta/login"
        className="cursor-pointer select-none hover:text-blue-400 transition hidden sm:block text-sm font-medium"
        style={{ fontFamily: "BurbankSmall" }}
      >
        {t("header", "myAccount")}
      </Link>
    );
  }

  const dropItems = [
    { icon: "👤", labelKey: "dropProfile",     tab: "profile"     },
    { icon: "📦", labelKey: "dropOrders",      tab: "orders"      },
    { icon: "⚙️", labelKey: "dropPreferences", tab: "preferences" },
    { icon: "🔐", labelKey: "dropSecurity",    tab: "security"    },
  ];

  return (
    <div className="relative hidden sm:block" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer select-none hover:text-blue-400 transition text-sm font-medium"
        style={{ fontFamily: "BurbankSmall" }}
      >
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black">
          {user.username[0].toUpperCase()}
        </div>
        <span className="max-w-[80px] truncate">{user.username}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-xs text-gray-400"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: -8,  scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-3 w-52 bg-[#0b1120] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Info usuario */}
            <div className="px-4 py-3 border-b border-white/10 bg-white/5">
              <p className="text-xs text-gray-400">{t("account", "dropConnectedAs")}</p>
              <p className="font-bold text-sm truncate">{user.username}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>

            {/* Links */}
            <div className="py-1">
              {dropItems.map(({ icon, labelKey, tab }) => (
                <button
                  key={tab}
                  onClick={() => {
                    setOpen(false);
                    navigate("/mi-cuenta", { state: { tab } });
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition cursor-pointer text-left"
                >
                  <span>{icon}</span>
                  <span>{t("account", labelKey)}</span>
                </button>
              ))}
            </div>

            {/* Cerrar sesión */}
            <div className="border-t border-white/10 py-1">
              <button
                onClick={() => { setOpen(false); logout(); navigate("/"); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition cursor-pointer text-left"
              >
                <span>🚪</span>
                <span>{t("account", "logout")}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Header = ({ onCartClick }: HeaderProps) => {
  const { cartItems } = useCart();
  const { t }         = useLang();
  const totalItems    = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-white">

        <Link
          to="/"
          className="flex items-center gap-4 select-none cursor-pointer hover:opacity-90 transition"
        >
          <img src="/images/logo.png" alt="KIDSTORE"
            className="w-16 h-16 object-contain" draggable={false} />
          <span
            className="text-[2.75rem] font-black tracking-[0.15em] uppercase leading-none"
            style={{ fontFamily: "'Rubik Spray Paint', system-ui" }}
          >
            KIDSTORE
          </span>
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium">
          <CurrencySelector />
          <LangToggle />
          <AccountMenu />
          <button
            onClick={onCartClick}
            className="relative text-xl cursor-pointer select-none hover:text-blue-400 transition"
            aria-label={t("cart", "close")}
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-2 py-0.5 rounded-full font-bold leading-none">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;