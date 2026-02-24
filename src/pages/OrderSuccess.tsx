// src/pages/OrderSuccess.tsx
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useLang } from "../context/LangContext";

interface OrderItem { id: string; name: string; price: number; quantity: number }
interface OrderData {
  orderId: number;
  user: { username: string; email: string } | null;
  items: OrderItem[];
  paymentMethod: string;
  formData: Record<string, string>;
  total: number;
  createdAt: string;
}

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { t } = useLang();

  const order: OrderData | null = JSON.parse(
    localStorage.getItem("kidstore_last_order") || "null"
  );

  useEffect(() => { if (!order) navigate("/"); }, [order, navigate]);
  if (!order) return null;

  const whatsappMessage = encodeURIComponent(
    `🧾 *NUEVO PEDIDO - KIDSTORE*\n\n📌 Pedido N°: ${order.orderId}\n👤 Cliente: ${order.user?.username || "Invitado"}\n📧 Email: ${order.user?.email || "No registrado"}\n\n🛒 Productos:\n${order.items.map((i) => `• ${i.name} x${i.quantity} - S/ ${(i.price * i.quantity).toFixed(2)}`).join("\n")}\n\n💳 Método de pago: ${order.paymentMethod}\n💰 Total: S/ ${order.total.toFixed(2)}\n\n⏰ Fecha: ${new Date(order.createdAt).toLocaleString()}`
  );

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-white px-6 text-center">
      <h1 className="text-5xl font-black mb-6 uppercase" style={{ fontFamily: "BurbankBig" }}>
        {t("orderSuccess", "title")}
      </h1>
      <p className="text-gray-300 max-w-xl mb-10">
        {t("orderSuccess", "subtitle").replace("{{id}}", String(order.orderId))}
        {" "}#{order.orderId}
      </p>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-xl w-full text-left mb-10">
        <p className="mb-2">
          <strong>{t("orderSuccess", "totalLabel")}</strong>{" "}
          <span className="text-blue-400">S/ {order.total.toFixed(2)}</span>
        </p>
        <p className="mb-4">
          <strong>{t("orderSuccess", "methodLabel")}</strong> {order.paymentMethod}
        </p>
        <div className="border-t border-white/10 pt-4">
          <p className="font-semibold mb-2">{t("orderSuccess", "products")}</p>
          <ul className="text-sm text-gray-300 space-y-1">
            {order.items.map((item) => (
              <li key={item.id}>• {item.name} x{item.quantity}</li>
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