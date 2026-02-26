// src/pages/AccountDashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useLang } from "../context/LangContext";
import { useCurrency } from "../context/CurrencyContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
const SYMBOLS: Record<string, string> = { PEN: "S/", USD: "$", EUR: "€" };

type Tab = "profile" | "orders" | "security" | "preferences";

interface OrderItem { id: string; name: string; price: number; quantity: number }
interface Order {
  orderId: number;
  items: OrderItem[];
  total: number;
  currency: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string }> = {
  pending:    { label: "Pendiente",   bg: "bg-yellow-500/15", text: "text-yellow-400"  },
  processing: { label: "Procesando", bg: "bg-blue-500/15",   text: "text-blue-400"    },
  delivered:  { label: "Entregado",  bg: "bg-green-500/15",  text: "text-green-400"   },
  cancelled:  { label: "Cancelado",  bg: "bg-red-500/15",    text: "text-red-400"     },
};

/* ════════════════════════════════════════
   TAB: ÓRDENES
════════════════════════════════════════ */
const OrdersTab = ({ email }: { email: string }) => {
  const [orders, setOrders]   = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetch(`${BACKEND_URL}/orders/${encodeURIComponent(email)}`)
      .then(r => r.json())
      .then(data => { if (data.success) setOrders(data.orders); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [email]);

  if (loading) return (
    <div className="flex items-center justify-center py-16 gap-3 text-gray-400">
      <span className="w-5 h-5 border-2 border-gray-600 border-t-blue-500 rounded-full animate-spin" />
      Cargando órdenes...
    </div>
  );

  if (orders.length === 0) return (
    <div className="text-center py-16 text-gray-500">
      <p className="text-4xl mb-4">📦</p>
      <p className="font-semibold text-white">Aún no tienes pedidos</p>
      <p className="text-sm mt-1">Tus compras aparecerán aquí una vez que realices un pedido.</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const symbol = SYMBOLS[order.currency] ?? "S/";
        const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
        const isOpen = expanded === order.orderId;

        return (
          <div key={order.orderId}
            className="border border-white/10 rounded-xl overflow-hidden bg-white/3">

            {/* Header de la orden */}
            <button
              onClick={() => setExpanded(isOpen ? null : order.orderId)}
              className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition cursor-pointer text-left"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="font-bold text-sm">Pedido #{order.orderId}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString("es-PE", {
                      day: "2-digit", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${status.bg} ${status.text}`}>
                  {status.label}
                </span>
                <span className="text-blue-400 font-bold text-sm">
                  {symbol} {Number(order.total).toFixed(2)}
                </span>
                <span className="text-gray-500 text-xs">
                  {isOpen ? "▲" : "▼"}
                </span>
              </div>
            </button>

            {/* Detalle expandible */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 border-t border-white/10 pt-4 space-y-3">
                    <div className="flex gap-6 text-xs text-gray-400">
                      <span>💳 <span className="text-white capitalize">{order.paymentMethod}</span></span>
                      <span>💱 <span className="text-white">{order.currency}</span></span>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-300">• {item.name} <span className="text-gray-500">x{item.quantity}</span></span>
                          <span className="text-blue-400">{symbol} {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

/* ════════════════════════════════════════
   TAB: SEGURIDAD
════════════════════════════════════════ */
const SecurityTab = ({ username }: { username: string }) => {
  const { changePassword } = useAuth();
  const [current,  setCurrent]  = useState("");
  const [newPass,  setNewPass]  = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [msg,      setMsg]      = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [loading,  setLoading]  = useState(false);

  const handleChange = async () => {
    setMsg(null);
    if (!current || !newPass || !confirm) {
      setMsg({ type: "err", text: "Completa todos los campos." }); return;
    }
    if (newPass.length < 6) {
      setMsg({ type: "err", text: "La nueva contraseña debe tener al menos 6 caracteres." }); return;
    }
    if (newPass !== confirm) {
      setMsg({ type: "err", text: "Las contraseñas no coinciden." }); return;
    }

    setLoading(true);
    const result = await changePassword(current, newPass);
    setLoading(false);

    if (!result.success) {
      setMsg({ type: "err", text: result.error || "Error al cambiar la contraseña." });
      return;
    }

    setCurrent(""); setNewPass(""); setConfirm("");
    setMsg({ type: "ok", text: "✅ Contraseña actualizada correctamente." });
  };

  return (
    <div className="max-w-md space-y-5">
      <p className="text-sm text-gray-400">Cambia tu contraseña de acceso a KidStore.</p>

      {msg && (
        <motion.div
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
          className={`text-sm rounded-lg px-4 py-3 border ${
            msg.type === "ok"
              ? "bg-green-500/10 border-green-500/30 text-green-400"
              : "bg-red-500/10 border-red-500/30 text-red-400"
          }`}
        >
          {msg.text}
        </motion.div>
      )}

      {[
        { label: "Contraseña actual",   val: current, set: setCurrent },
        { label: "Nueva contraseña",    val: newPass, set: setNewPass },
        { label: "Confirmar contraseña",val: confirm, set: setConfirm },
      ].map(({ label, val, set }) => (
        <div key={label} className="space-y-1">
          <label className="text-xs text-gray-400 uppercase tracking-wider pl-1">{label}</label>
          <input
            type="password" value={val} onChange={e => set(e.target.value)}
            className="w-full bg-black/40 px-4 py-3 rounded-lg border border-white/10 focus:border-blue-500 outline-none transition"
          />
        </div>
      ))}

      <button
        onClick={handleChange} disabled={loading}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-6 py-3 rounded-xl font-semibold transition cursor-pointer"
      >
        {loading ? "Actualizando..." : "Cambiar contraseña"}
      </button>
    </div>
  );
};

/* ════════════════════════════════════════
   TAB: PREFERENCIAS
════════════════════════════════════════ */
const PreferencesTab = () => {
  const { lang, setLang }         = useLang();
  const { currency, setCurrency } = useCurrency();

  // Preferencias guardadas en localStorage
  const [emailNotif, setEmailNotif] = useState(() =>
    localStorage.getItem("kidstore_pref_notif") !== "false"
  );
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("kidstore_pref_theme") || "dark"
  );
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("kidstore_pref_notif", String(emailNotif));
    localStorage.setItem("kidstore_pref_theme",  theme);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-md space-y-7">
      <p className="text-sm text-gray-400">Personaliza tu experiencia en KidStore.</p>

      {/* Idioma */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-wider">Idioma</label>
        <div className="flex gap-3">
          {(["ES", "EN"] as const).map((l) => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer border ${
                lang === l
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              {l === "ES" ? "🇵🇪 Español" : "🇺🇸 English"}
            </button>
          ))}
        </div>
      </div>

      {/* Moneda */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-wider">Moneda</label>
        <div className="flex gap-3">
          {(["PEN", "USD", "EUR"] as const).map((c) => (
            <button key={c} onClick={() => setCurrency(c)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer border ${
                currency === c
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              {c === "PEN" ? "S/ PEN" : c === "USD" ? "$ USD" : "€ EUR"}
            </button>
          ))}
        </div>
      </div>

      {/* Notificaciones */}
      <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4">
        <div>
          <p className="font-semibold text-sm">Notificaciones por email</p>
          <p className="text-xs text-gray-500 mt-0.5">Recibe confirmaciones y novedades</p>
        </div>
        <button
          onClick={() => setEmailNotif(!emailNotif)}
          className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
            emailNotif ? "bg-blue-600" : "bg-white/10"
          }`}
        >
          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${
            emailNotif ? "left-7" : "left-1"
          }`} />
        </button>
      </div>

      {/* Tema */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400 uppercase tracking-wider">Tema visual</label>
        <div className="flex gap-3">
          {[
            { id: "dark",  label: "🌙 Oscuro" },
            { id: "light", label: "☀️ Claro (próximamente)" },
          ].map(({ id, label }) => (
            <button key={id}
              onClick={() => id === "dark" && setTheme(id)}
              disabled={id === "light"}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer border disabled:opacity-40 disabled:cursor-not-allowed ${
                theme === id
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSave}
        className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-semibold transition cursor-pointer active:scale-[0.98]"
      >
        {saved ? "✅ Guardado" : "Guardar preferencias"}
      </button>
    </div>
  );
};

/* ════════════════════════════════════════
   DASHBOARD PRINCIPAL
════════════════════════════════════════ */
const AccountDashboard = () => {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const { t }            = useLang();
  const [activeTab, setActiveTab] = useState<Tab>("profile");

  if (!user) { navigate("/mi-cuenta/login"); return null; }

  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: "profile",     icon: "👤", label: "Perfil"       },
    { id: "orders",      icon: "📦", label: "Mis Pedidos"  },
    { id: "security",    icon: "🔐", label: "Seguridad"    },
    { id: "preferences", icon: "⚙️", label: "Preferencias" },
  ];

  return (
    <div className="max-w-5xl mx-auto px-6 py-20 text-white">

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-widest"
            style={{ fontFamily: "BurbankBig" }}>
            Mi Cuenta
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Bienvenido, <span className="text-blue-400 font-semibold">{user.username}</span>
          </p>
        </div>
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 px-5 py-2.5 rounded-xl font-semibold text-sm transition cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>

      <div className="grid md:grid-cols-[220px_1fr] gap-8">

        {/* Sidebar tabs */}
        <nav className="space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-left transition cursor-pointer ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Contenido */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-7 backdrop-blur-xl min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.18 }}
            >
              {activeTab === "profile" && (
                <div className="space-y-5">
                  <h2 className="text-xl font-bold text-blue-400">Información de Perfil</h2>
                  <div className="space-y-4">
                    <div className="bg-black/30 rounded-xl px-5 py-4 flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl font-black">
                        {user.username[0].toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold">{user.username}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-black/20 rounded-xl px-4 py-3">
                        <p className="text-gray-500 text-xs mb-1">Usuario</p>
                        <p className="font-semibold">{user.username}</p>
                      </div>
                      <div className="bg-black/20 rounded-xl px-4 py-3">
                        <p className="text-gray-500 text-xs mb-1">Correo</p>
                        <p className="font-semibold">{user.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "orders" && <OrdersTab email={user.email} />}

              {activeTab === "security" && <SecurityTab username={user.username} />}

              {activeTab === "preferences" && <PreferencesTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;