import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderData {
  orderId: number;
  user: {
    username: string;
    email: string;
  } | null;
  items: OrderItem[];
  paymentMethod: string;
  extraData: {
    uid?: string;
    server?: string;
    gamePassLink?: string;
    discordType?: string;
  };
  total: number;
  createdAt: string;
}

const OrderSuccess = () => {
  const navigate = useNavigate();

  const order: OrderData | null = JSON.parse(
    localStorage.getItem("kidstore_last_order") || "null"
  );

  useEffect(() => {
    if (!order) {
      navigate("/");
    }
  }, [order, navigate]);

  if (!order) return null;

  /* ================= WHATSAPP MESSAGE ================= */
  const whatsappMessage = encodeURIComponent(`
🧾 *NUEVO PEDIDO - KIDSTORE*

📌 Pedido N°: ${order.orderId}
👤 Cliente: ${order.user?.username || "Invitado"}
📧 Email: ${order.user?.email || "No registrado"}

🛒 Productos:
${order.items
  .map(
    (item) =>
      `• ${item.name} x${item.quantity} - S/ ${(item.price * item.quantity).toFixed(2)}`
  )
  .join("\n")}

💳 Método de pago: ${order.paymentMethod}
💰 Total: S/ ${order.total.toFixed(2)}

📎 Datos adicionales:
${order.extraData.uid ? `UID: ${order.extraData.uid}\n` : ""}
${order.extraData.server ? `Servidor: ${order.extraData.server}\n` : ""}
${order.extraData.gamePassLink ? `Game Pass: ${order.extraData.gamePassLink}\n` : ""}
${order.extraData.discordType ? `Discord: ${order.extraData.discordType}\n` : ""}

⏰ Fecha: ${new Date(order.createdAt).toLocaleString()}
`);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-white px-6 text-center">

      <h1
        className="text-5xl font-black mb-6 uppercase"
        style={{ fontFamily: "BurbankBig" }}
      >
        ¡Pedido Confirmado!
      </h1>

      <p className="text-gray-300 max-w-xl mb-10">
        Tu pedido <strong>#{order.orderId}</strong> fue registrado correctamente.
        Para continuar, envíanos el comprobante por WhatsApp.
      </p>

      {/* ================= RESUMEN ================= */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 max-w-xl w-full text-left mb-10">
        <p className="mb-2">
          <strong>Total:</strong>{" "}
          <span className="text-blue-400">
            S/ {order.total.toFixed(2)}
          </span>
        </p>

        <p className="mb-4">
          <strong>Método de pago:</strong> {order.paymentMethod}
        </p>

        <div className="border-t border-white/10 pt-4">
          <p className="font-semibold mb-2">Productos:</p>
          <ul className="text-sm text-gray-300 space-y-1">
            {order.items.map((item) => (
              <li key={item.id}>
                • {item.name} x{item.quantity}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ================= ACTIONS ================= */}
      <div className="flex flex-col sm:flex-row gap-6">
        <a
          href={`https://wa.me/51983454837?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-500 px-8 py-4 rounded-xl font-bold transition cursor-pointer"
        >
          Enviar comprobante por WhatsApp
        </a>

        <Link
          to="/"
          className="bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-xl font-bold transition cursor-pointer"
        >
          Volver al catálogo
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;
