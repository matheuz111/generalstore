// src/pages/admin/AdminDashboard.tsx
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, ADMIN_SESSION_TOKEN } from "../../context/AuthContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

/* ── Tipos ── */
interface OrderItem {
  id: string; name: string; price: number; quantity: number; image?: string;
}
interface Order {
  orderId:       number;
  userEmail:     string;
  items:         OrderItem[];
  total:         number;
  currency:      string;
  paymentMethod: string;
  status:        string;
  formData:      Record<string, string>;
  createdAt:     string;
  updatedAt?:    string;
}

const SYMBOLS: Record<string, string> = { PEN: "S/", USD: "$", EUR: "€" };

const STATUS_CFG = {
  pending:    { label: "Pendiente",   emoji: "⏳", bg: "bg-yellow-500/15", text: "text-yellow-400", border: "border-yellow-500/30", dot: "bg-yellow-400" },
  processing: { label: "Procesando", emoji: "⚙️", bg: "bg-blue-500/15",   text: "text-blue-400",   border: "border-blue-500/30",   dot: "bg-blue-400"   },
  delivered:  { label: "Entregado",  emoji: "✅", bg: "bg-green-500/15",  text: "text-green-400",  border: "border-green-500/30",  dot: "bg-green-400"  },
  cancelled:  { label: "Cancelado",  emoji: "❌", bg: "bg-red-500/15",    text: "text-red-400",    border: "border-red-500/30",    dot: "bg-red-400"    },
};

const METHOD_ICONS: Record<string, string> = {
  yape: "💜", plin: "💚", transferencia: "🏦", binance: "🟡",
};

/* ════════════════════════════════════════
   GUARD: redirige si no es admin
════════════════════════════════════════ */
const useAdminGuard = () => {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/mi-cuenta/login", { replace: true });
    }
  }, [user, isAdmin, loading, navigate]);

  return { user, isAdmin, loading };
};

/* ════════════════════════════════════════
   BADGE DE ESTADO
════════════════════════════════════════ */
const StatusBadge = ({ status }: { status: string }) => {
  const cfg = STATUS_CFG[status as keyof typeof STATUS_CFG] || STATUS_CFG.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border} whitespace-nowrap`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
};

/* ════════════════════════════════════════
   MODAL DETALLE + EDICIÓN
════════════════════════════════════════ */
const OrderModal = ({
  order, onClose, onSave,
}: {
  order: Order;
  onClose: () => void;
  onSave: (orderId: number, status: string) => Promise<void>;
}) => {
  const [editStatus, setEditStatus] = useState(order.status);
  const [saving,     setSaving]     = useState(false);
  const [saved,      setSaved]      = useState(false);
  const symbol = SYMBOLS[order.currency] ?? "S/";

  const dirty = editStatus !== order.status;

  const handleSave = async () => {
    if (!dirty) { onClose(); return; }
    setSaving(true);
    await onSave(order.orderId, editStatus);
    setSaving(false);
    setSaved(true);
    setTimeout(onClose, 900);
  };

  // Datos extra del formulario (excluir nombre, email ya mostrados)
  const extraFields = Object.entries(order.formData || {}).filter(
    ([k, v]) => !["name", "email"].includes(k) && k !== "notes" && v
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ scale: 0.94, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.94, y: 24 }}
        transition={{ type: "spring", stiffness: 340, damping: 30 }}
        className="relative w-full max-w-lg bg-[#080e1c] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-white/8 bg-gradient-to-r from-blue-600/10 to-transparent">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h3 className="font-black text-xl text-white" style={{ fontFamily: "BurbankBig" }}>
                Pedido #{order.orderId}
              </h3>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-xs text-gray-500">
              {new Date(order.createdAt).toLocaleString("es-PE", {
                day: "2-digit", month: "long", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/10 text-gray-500 hover:text-white transition cursor-pointer shrink-0">
            ✕
          </button>
        </div>

        {/* Body scrollable */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">

          {/* Cliente */}
          <div className="bg-white/4 rounded-xl p-4 space-y-1.5">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-2">👤 Cliente</p>
            <p className="text-sm font-bold text-white">{order.formData?.name || "—"}</p>
            <p className="text-xs text-gray-400">{order.userEmail}</p>
            {order.formData?.phone && (
              <p className="text-xs text-gray-400">📞 {order.formData.phone}</p>
            )}
          </div>

          {/* Productos */}
          <div className="bg-white/4 rounded-xl p-4">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-3">🎮 Productos</p>
            <div className="space-y-2.5">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {item.image && (
                      <img src={item.image} alt={item.name}
                        className="w-8 h-8 rounded-lg object-contain bg-black/40 shrink-0" />
                    )}
                    <span className="text-sm text-gray-200 truncate">{item.name}</span>
                    <span className="text-xs text-gray-600 shrink-0">×{item.quantity}</span>
                  </div>
                  <span className="text-sm text-blue-400 font-bold shrink-0">
                    {symbol} {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-white/8 mt-4 pt-3 flex justify-between items-center">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Total</span>
              <span className="text-xl font-black text-green-400">
                {symbol} {Number(order.total).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Pago */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/4 rounded-xl p-4">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-1.5">💳 Pago</p>
              <p className="text-sm font-bold text-yellow-400 capitalize">
                {METHOD_ICONS[order.paymentMethod] || "💳"} {order.paymentMethod}
              </p>
            </div>
            <div className="bg-white/4 rounded-xl p-4">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-1.5">💱 Moneda</p>
              <p className="text-sm font-bold text-purple-400">{order.currency}</p>
            </div>
          </div>

          {/* Datos del juego */}
          {extraFields.length > 0 && (
            <div className="bg-white/4 rounded-xl p-4">
              <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-3">📋 Datos del pedido</p>
              <div className="space-y-2">
                {extraFields.map(([key, value]) => (
                  <div key={key} className="flex justify-between gap-4 text-sm">
                    <span className="text-gray-500 capitalize shrink-0">
                      {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                    </span>
                    <span className="text-white font-semibold text-right break-all">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notas */}
          {order.formData?.notes && (
            <div className="bg-amber-500/5 border border-amber-500/15 rounded-xl p-4">
              <p className="text-[10px] text-amber-500/60 uppercase tracking-widest font-bold mb-1.5">📝 Notas del cliente</p>
              <p className="text-sm text-amber-200/70 leading-relaxed">{order.formData.notes}</p>
            </div>
          )}

          {/* ── CAMBIAR ESTADO ── */}
          <div className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-4">
            <p className="text-[10px] text-blue-400/60 uppercase tracking-widest font-bold mb-3">
              ✏️ Actualizar estado del pedido
            </p>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(STATUS_CFG).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setEditStatus(key)}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold border transition cursor-pointer ${
                    editStatus === key
                      ? `${cfg.bg} ${cfg.text} ${cfg.border}`
                      : "bg-white/4 text-gray-500 border-white/8 hover:bg-white/8 hover:text-white"
                  }`}
                >
                  <span className="text-base">{cfg.emoji}</span>
                  {cfg.label}
                  {editStatus === key && (
                    <span className={`ml-auto w-2 h-2 rounded-full ${cfg.dot}`} />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/8 bg-black/20 flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition cursor-pointer text-sm font-semibold">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm transition cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2 ${
              saved
                ? "bg-green-600 text-white"
                : dirty
                  ? "bg-blue-600 hover:bg-blue-500 text-white"
                  : "bg-white/10 text-gray-400 hover:bg-white/15 hover:text-white"
            } disabled:opacity-60`}
          >
            {saving
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Guardando...</>
              : saved
                ? "✅ Estado actualizado"
                : dirty
                  ? "Guardar cambios"
                  : "Sin cambios"
            }
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ════════════════════════════════════════
   DASHBOARD PRINCIPAL
════════════════════════════════════════ */
const AdminDashboard = () => {
  const { user, isAdmin, loading: authLoading } = useAdminGuard();
  const { logout } = useAuth();
  const navigate   = useNavigate();

  const [orders,       setOrders]       = useState<Order[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [search,       setSearch]       = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMethod, setFilterMethod] = useState("all");
  const [sortDir,      setSortDir]      = useState<"desc" | "asc">("desc");
  const [selected,     setSelected]     = useState<Order | null>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${BACKEND_URL}/admin/orders`, {
        headers: { "x-admin-key": ADMIN_SESSION_TOKEN },
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders);
    } catch {
      console.error("Error cargando pedidos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) fetchOrders();
  }, [isAdmin, fetchOrders]);

  // Cmd/Ctrl+K para foco en búsqueda
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const handleStatusChange = async (orderId: number, status: string) => {
    try {
      await fetch(`${BACKEND_URL}/admin/orders/status`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": ADMIN_SESSION_TOKEN },
        body:    JSON.stringify({ orderId, status }),
      });
      // Actualizar localmente — el cliente verá el cambio en su próxima consulta
      setOrders(prev => prev.map(o => o.orderId === orderId ? { ...o, status } : o));
      if (selected?.orderId === orderId) setSelected(prev => prev ? { ...prev, status } : null);
    } catch {
      console.error("Error actualizando estado");
    }
  };

  const handleLogout = () => { logout(); navigate("/mi-cuenta/login"); };

  /* ── Filtrado y búsqueda ── */
  const filtered = orders
    .filter(o => {
      const q = search.toLowerCase().trim();
      if (q) {
        const inId    = String(o.orderId).includes(q);
        const inEmail = o.userEmail.toLowerCase().includes(q);
        const inName  = (o.formData?.name || "").toLowerCase().includes(q);
        const inProd  = o.items.some(i => i.name.toLowerCase().includes(q));
        if (!inId && !inEmail && !inName && !inProd) return false;
      }
      if (filterStatus !== "all" && o.status !== filterStatus) return false;
      if (filterMethod !== "all" && o.paymentMethod !== filterMethod) return false;
      return true;
    })
    .sort((a, b) => {
      const d = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === "desc" ? -d : d;
    });

  /* ── Stats ── */
  const stats = {
    total:      orders.length,
    pending:    orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    delivered:  orders.filter(o => o.status === "delivered").length,
    revenuePEN: orders.filter(o => o.currency === "PEN").reduce((s, o) => s + Number(o.total), 0),
  };

  if (authLoading) return (
    <div className="min-h-screen bg-[#050a14] flex items-center justify-center">
      <span className="w-8 h-8 border-2 border-gray-800 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050a14] text-white"
      style={{ backgroundImage: "radial-gradient(ellipse 80% 40% at 50% 0%, #0a1828 0%, transparent 70%)" }}>

      {/* ════════════ HEADER ════════════ */}
      <header className="sticky top-0 z-30 border-b border-white/8 bg-[#050a14]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center font-black text-sm shadow-lg shadow-blue-500/25">
              K
            </div>
            <div>
              <h1 className="font-black text-sm tracking-widest uppercase leading-none" style={{ fontFamily: "BurbankBig" }}>
                KidStore <span className="text-blue-400">Admin</span>
              </h1>
              <p className="text-[10px] text-gray-600 mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={fetchOrders}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white bg-white/4 hover:bg-white/8 border border-white/8 px-3 py-2 rounded-lg transition cursor-pointer">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
              Actualizar
            </button>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-500/8 hover:bg-red-500/15 border border-red-500/15 px-3 py-2 rounded-lg transition cursor-pointer">
              🚪 Salir
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-7">

        {/* ════════════ STATS ════════════ */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { icon: "📦", label: "Total",       value: stats.total,                            color: "text-white"       },
            { icon: "⏳", label: "Pendientes",  value: stats.pending,                          color: "text-yellow-400"  },
            { icon: "⚙️", label: "Procesando",  value: stats.processing,                       color: "text-blue-400"    },
            { icon: "✅", label: "Entregados",  value: stats.delivered,                        color: "text-green-400"   },
            { icon: "💰", label: "Ingresos PEN",value: `S/ ${stats.revenuePEN.toFixed(2)}`,   color: "text-emerald-400" },
          ].map((s, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              className="bg-white/4 border border-white/8 rounded-xl p-4"
            >
              <p className="text-xl mb-2">{s.icon}</p>
              <p className={`text-xl font-black ${s.color} leading-none`}>{s.value}</p>
              <p className="text-[10px] text-gray-600 mt-1.5 uppercase tracking-wider">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* ════════════ FILTROS ════════════ */}
        <div className="flex flex-wrap gap-2 items-center">

          {/* Búsqueda */}
          <div className="relative flex-1 min-w-[240px]">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              ref={searchRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar por N° pedido, email, nombre o producto..."
              className="w-full bg-white/4 border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-600 focus:border-blue-500/60 outline-none transition"
            />
            {search && (
              <button onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 cursor-pointer text-xs">
                ✕
              </button>
            )}
          </div>

          {/* Estado */}
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="bg-white/4 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white focus:border-blue-500/60 outline-none cursor-pointer appearance-none">
            <option value="all"       className="bg-[#080e1c]">Todos los estados</option>
            <option value="pending"   className="bg-[#080e1c]">⏳ Pendientes</option>
            <option value="processing"className="bg-[#080e1c]">⚙️ Procesando</option>
            <option value="delivered" className="bg-[#080e1c]">✅ Entregados</option>
            <option value="cancelled" className="bg-[#080e1c]">❌ Cancelados</option>
          </select>

          {/* Método de pago */}
          <select value={filterMethod} onChange={e => setFilterMethod(e.target.value)}
            className="bg-white/4 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-white focus:border-blue-500/60 outline-none cursor-pointer appearance-none">
            <option value="all"           className="bg-[#080e1c]">Todos los métodos</option>
            <option value="yape"          className="bg-[#080e1c]">💜 Yape</option>
            <option value="plin"          className="bg-[#080e1c]">💚 Plin</option>
            <option value="transferencia" className="bg-[#080e1c]">🏦 Transferencia</option>
            <option value="binance"       className="bg-[#080e1c]">🟡 Binance</option>
          </select>

          {/* Orden */}
          <button onClick={() => setSortDir(d => d === "desc" ? "asc" : "desc")}
            className="flex items-center gap-1.5 bg-white/4 border border-white/8 rounded-xl px-3 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/8 transition cursor-pointer">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d={sortDir === "desc" ? "M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" : "M3 4h13M3 8h9m-9 4h9m4-4l-4-4m0 0l-4 4m4-4v12"}/>
            </svg>
            {sortDir === "desc" ? "Más recientes" : "Más antiguos"}
          </button>

          <span className="text-xs text-gray-600 ml-auto">
            {filtered.length} de {orders.length} pedidos
          </span>
        </div>

        {/* ════════════ LISTA ════════════ */}
        {loading ? (
          <div className="flex items-center justify-center py-32 gap-3 text-gray-600">
            <span className="w-5 h-5 border-2 border-gray-800 border-t-blue-500 rounded-full animate-spin" />
            Cargando pedidos...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-32">
            <p className="text-5xl mb-4">📭</p>
            <p className="text-gray-600 font-semibold">
              {search || filterStatus !== "all" || filterMethod !== "all"
                ? "No se encontraron pedidos con esos filtros"
                : "Aún no hay pedidos registrados"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {filtered.map((order, i) => {
                const symbol = SYMBOLS[order.currency] ?? "S/";
                return (
                  <motion.div
                    key={order.orderId}
                    layout
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: Math.min(i * 0.025, 0.25) }}
                    onClick={() => setSelected(order)}
                    className="bg-white/3 hover:bg-white/6 border border-white/6 hover:border-white/12 rounded-xl px-5 py-4 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-4 flex-wrap">

                      {/* N° Pedido */}
                      <div className="min-w-[72px]">
                        <p className="text-[10px] text-gray-700 uppercase tracking-wider">Pedido</p>
                        <p className="font-black text-sm text-white">#{order.orderId}</p>
                      </div>

                      {/* Cliente */}
                      <div className="flex-1 min-w-[150px]">
                        <p className="text-[10px] text-gray-700 uppercase tracking-wider">Cliente</p>
                        <p className="font-semibold text-sm text-white truncate max-w-[200px]">
                          {order.formData?.name || "—"}
                        </p>
                        <p className="text-xs text-gray-600 truncate max-w-[200px]">{order.userEmail}</p>
                      </div>

                      {/* Productos resumidos */}
                      <div className="hidden md:block flex-1 min-w-[130px]">
                        <p className="text-[10px] text-gray-700 uppercase tracking-wider">Productos</p>
                        <p className="text-xs text-gray-500 truncate max-w-[180px]">
                          {order.items.map(i => i.name).join(", ")}
                        </p>
                      </div>

                      {/* Pago */}
                      <div className="hidden sm:block min-w-[90px]">
                        <p className="text-[10px] text-gray-700 uppercase tracking-wider">Pago</p>
                        <p className="text-xs font-semibold text-yellow-400 capitalize">
                          {METHOD_ICONS[order.paymentMethod] || "💳"} {order.paymentMethod}
                        </p>
                      </div>

                      {/* Total */}
                      <div className="min-w-[80px]">
                        <p className="text-[10px] text-gray-700 uppercase tracking-wider">Total</p>
                        <p className="font-black text-sm text-blue-400">
                          {symbol} {Number(order.total).toFixed(2)}
                        </p>
                      </div>

                      {/* Estado */}
                      <div>
                        <StatusBadge status={order.status} />
                      </div>

                      {/* Fecha */}
                      <div className="hidden lg:block min-w-[80px] text-right">
                        <p className="text-[10px] text-gray-700 uppercase tracking-wider">Fecha</p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString("es-PE", {
                            day: "2-digit", month: "short", year: "2-digit"
                          })}
                        </p>
                      </div>

                      <svg className="w-4 h-4 text-gray-700 group-hover:text-gray-400 transition shrink-0 ml-auto"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/>
                      </svg>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ════════════ MODAL ════════════ */}
      <AnimatePresence>
        {selected && (
          <OrderModal
            order={selected}
            onClose={() => setSelected(null)}
            onSave={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;