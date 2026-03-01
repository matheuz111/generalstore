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

const AccountMenu = ({ onClose, mobile = false }: { onClose?: () => void; mobile?: boolean }) => {
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

  const dropItems = [
    { icon: "👤", labelKey: "dropProfile",     tab: "profile"     },
    { icon: "📦", labelKey: "dropOrders",      tab: "orders"      },
    { icon: "⚙️", labelKey: "dropPreferences", tab: "preferences" },
    { icon: "🔐", labelKey: "dropSecurity",    tab: "security"    },
  ];

  // ── Versión móvil: inline, sin dropdown ──
  if (mobile) {
    if (!user) {
      return (
        <Link
          to="/mi-cuenta/login"
          onClick={onClose}
          className="flex items-center gap-3 text-sm text-gray-300 hover:text-white transition font-medium"
        >
          <span>👤</span>
          {t("header", "myAccount")}
        </Link>
      );
    }
    return (
      <div className="space-y-1">
        <div className="flex items-center gap-3 px-1 pb-2 border-b border-white/10 mb-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-black shrink-0">
            {(user.username ?? user.email ?? "U")[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm truncate">{user.username}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        {dropItems.map(({ icon, labelKey, tab }) => (
          <button
            key={tab}
            onClick={() => { onClose?.(); navigate("/mi-cuenta", { state: { tab } }); }}
            className="w-full flex items-center gap-3 py-2 text-sm text-gray-300 hover:text-white transition cursor-pointer text-left"
          >
            <span>{icon}</span>
            <span>{t("account", labelKey)}</span>
          </button>
        ))}
        <button
          onClick={() => { onClose?.(); logout(); navigate("/"); }}
          className="w-full flex items-center gap-3 py-2 text-sm text-red-400 hover:text-red-300 transition cursor-pointer text-left border-t border-white/10 mt-1 pt-3"
        >
          <span>🚪</span>
          <span>{t("account", "logout")}</span>
        </button>
      </div>
    );
  }

  // ── Versión desktop: dropdown ──
  if (!user) {
    return (
      <Link
        to="/mi-cuenta/login"
        onClick={onClose}
        className="cursor-pointer select-none hover:text-blue-400 transition text-sm font-medium flex items-center gap-2"
        style={{ fontFamily: "BurbankSmall" }}
      >
        <span>👤</span>
        {t("header", "myAccount")}
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 cursor-pointer select-none hover:text-blue-400 transition text-sm font-medium"
        style={{ fontFamily: "BurbankSmall" }}
      >
        <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-black shrink-0">
          {(user.username ?? user.email ?? "U")[0].toUpperCase()}
        </div>
        <span className="max-w-[80px] truncate">{user.username ?? user.email}</span>
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
            <div className="px-4 py-3 border-b border-white/10 bg-white/5">
              <p className="text-xs text-gray-400">{t("account", "dropConnectedAs")}</p>
              <p className="font-bold text-sm truncate">{user.username}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
            <div className="py-1">
              {dropItems.map(({ icon, labelKey, tab }) => (
                <button
                  key={tab}
                  onClick={() => { setOpen(false); navigate("/mi-cuenta", { state: { tab } }); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition cursor-pointer text-left"
                >
                  <span>{icon}</span>
                  <span>{t("account", labelKey)}</span>
                </button>
              ))}
            </div>
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
  const { cartItems }       = useCart();
  const { t }               = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-3 text-white">

        {/* ── Logo ── */}
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-2 sm:gap-4 select-none cursor-pointer hover:opacity-90 transition shrink-0"
        >
          <img src="/images/logo.png" alt="KIDSTORE"
            className="w-10 h-10 sm:w-14 sm:h-14 object-contain" draggable={false} />
          <span
            className="text-xl sm:text-3xl font-black tracking-[0.15em] uppercase leading-none"
            style={{ fontFamily: "'Rubik Spray Paint', system-ui" }}
          >
            KIDSTORE
          </span>
        </Link>

        {/* ── Derecha: desktop ── */}
        <div className="hidden md:flex items-center gap-4 text-sm font-medium">
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

        {/* ── Derecha: móvil (carrito + hamburguesa) ── */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={onCartClick}
            className="relative text-xl cursor-pointer select-none hover:text-blue-400 transition"
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-2 py-0.5 rounded-full font-bold leading-none">
                {totalItems}
              </span>
            )}
          </button>

          {/* Hamburguesa */}
          <button
            onClick={() => setMobileOpen(v => !v)}
            className="flex flex-col justify-center gap-1.5 w-8 h-8 cursor-pointer"
            aria-label="Menú"
          >
            <motion.span
              animate={mobileOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 bg-white rounded-full origin-center transition-all"
            />
            <motion.span
              animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-0.5 w-6 bg-white rounded-full"
            />
            <motion.span
              animate={mobileOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
              className="block h-0.5 w-6 bg-white rounded-full origin-center transition-all"
            />
          </button>
        </div>
      </div>

      {/* ── Menú móvil desplegable ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-black/90 backdrop-blur-xl border-t border-white/10"
          >
            <div className="px-5 py-4 space-y-4">

              {/* Divisa */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Moneda</p>
                <CurrencySelector />
              </div>

              {/* Idioma */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-2 font-bold">Idioma</p>
                <LangToggle />
              </div>

              {/* Cuenta */}
              <div className="border-t border-white/10 pt-4">
                <p className="text-xs text-gray-500 uppercase tracking-widest mb-3 font-bold">Cuenta</p>
                <AccountMenu mobile onClose={() => setMobileOpen(false)} />
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;