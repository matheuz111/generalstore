// src/pages/OrderSuccess.tsx
import { useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLang } from "../context/LangContext";
import { useAuth } from "../context/AuthContext";

interface OrderItem { id: string; name: string; price: number; quantity: number }
interface OrderData {
  orderId: number;
  user: { username: string; email: string } | null;
  items: OrderItem[];
  paymentMethod: string;
  formData: Record<string, string>;
  total: number;
  currency: string;
  createdAt: string;
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending:    { label: "⏳ Pendiente",   color: "text-yellow-400" },
  processing: { label: "⚙️ Procesando", color: "text-blue-400"   },
  delivered:  { label: "✅ Entregado",   color: "text-green-400"  },
  cancelled:  { label: "❌ Cancelado",   color: "text-red-400"    },
};

const OrderSuccess = () => {
  const navigate  = useNavigate();
  const { t }     = useLang();
  const { user }  = useAuth();
  const savedRef  = useRef(false);

  const order: OrderData | null = JSON.parse(
    localStorage.getItem("kidstore_last_order") || "null"
  );

  useEffect(() => { if (!order) navigate("/"); }, [order, navigate]);

  /* ── Guardar en backend si el usuario está logueado ── */
  useEffect(() => {
    if (!order || !user || savedRef.current) return;
    savedRef.current = true;

    fetch(`${BACKEND_URL}/orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        order: {
          orderId:       order.orderId,
          items:         order.items,
          total:         order.total,
          currency:      order.currency || "PEN",
          paymentMethod: order.paymentMethod,
          formData:      order.formData,
          status:        "pending",
          createdAt:     order.createdAt,
        },
      }),
    }).catch(() => {
      // Fallo silencioso — el pedido ya se guardó en localStorage
    });
  }, [order, user]);

  if (!order) return null;

  const statusInfo = STATUS_LABELS[order.formData?.status || "pending"];
  const SYMBOLS: Record<string, string> = { PEN: "S/", USD: "$", EUR: "€" };
  const symbol = SYMBOLS[order.currency] ?? "S/";

  const whatsappMessage = encodeURIComponent(
    `🧾 *NUEVO PEDIDO - KIDSTORE*\n\n📌 Pedido N°: ${order.orderId}\n👤 Cliente: ${order.user?.username || "Invitado"}\n📧 Email: ${order.user?.email || "No registrado"}\n\n🛒 Productos:\n${order.items.map((i) => `• ${i.name} x${i.quantity} - ${symbol} ${(i.price * i.quantity).toFixed(2)}`).join("\n")}\n\n💳 Método de pago: ${order.paymentMethod}\n💰 Total: ${symbol} ${order.total.toFixed(2)}\n\n⏰ Fecha: ${new Date(order.createdAt).toLocaleString()}`
  );

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-white px-6 text-center">
      <h1 className="text-5xl font-black mb-6 uppercase" style={{ fontFamily: "BurbankBig" }}>
        {t("orderSuccess", "title")}
      </h1>
      <p className="text-gray-300 max-w-xl mb-10">
        {t("orderSuccess", "subtitle")} #{order.orderId}
      </p>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-xl w-full text-left mb-10">
        <div className="flex items-center justify-between mb-4">
          <p>
            <strong>{t("orderSuccess", "totalLabel")}</strong>{" "}
            <span className="text-blue-400">{symbol} {order.total.toFixed(2)}</span>
          </p>
          <span className={`text-sm font-semibold ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>

        <p className="mb-4">
          <strong>{t("orderSuccess", "methodLabel")}</strong> {order.paymentMethod}
        </p>

        {!user && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs rounded-lg px-3 py-2 mb-4">
            💡 ¿Quieres ver el historial de tus pedidos?{" "}
            <Link to="/mi-cuenta/register" className="underline font-semibold">
              Crea una cuenta
            </Link>
          </div>
        )}

        <div className="border-t border-white/10 pt-4">
          <p className="font-semibold mb-2">{t("orderSuccess", "products")}</p>
          <ul className="text-sm text-gray-300 space-y-1">
            {order.items.map((item) => (
              <li key={item.id} className="flex justify-between">
                <span>• {item.name} x{item.quantity}</span>
                <span className="text-blue-400">{symbol} {(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <a
          href={`https://wa.me/51983454837?text=${whatsappMessage}`}
          target="_blank" rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-500 px-8 py-4 rounded-xl font-bold transition cursor-pointer"
        >
          {t("orderSuccess", "whatsapp")}
        </a>
        <Link to="/" className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl font-bold transition cursor-pointer">
          {t("orderSuccess", "back")}
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;