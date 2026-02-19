import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

import PaymentMethods from "../components/checkout/PaymentMethods";
import PaymentInstructions from "../components/checkout/PaymentInstructions";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  /* ================= TOTAL ================= */
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ================= MÉTODO DE PAGO ================= */
  const [paymentMethod, setPaymentMethod] = useState("");

  /* ================= DETECCIÓN DE CATEGORÍAS ================= */
  const needsUID = cartItems.some(
    (item) =>
      item.id.startsWith("wc") ||
      item.id.startsWith("genshin") ||
      item.id.startsWith("hsr") ||
      item.id.startsWith("zzz") ||
      item.id.startsWith("wuwa")
  );

  const needsGamePass = cartItems.some((item) =>
    item.id.startsWith("robux")
  );

  const needsDiscordInfo = cartItems.some((item) =>
    item.id.startsWith("discord")
  );

  /* ================= FORM STATE ================= */
  const [uid, setUid] = useState("");
  const [server, setServer] = useState("");
  const [gamePassLink, setGamePassLink] = useState("");
  const [discordType, setDiscordType] = useState("");

  /* ================= CONFIRMAR ================= */
  const handleConfirm = () => {
    if (!paymentMethod) return;

    setLoading(true);

    const orderId = Math.floor(100000 + Math.random() * 900000);

    const orderData = {
      orderId,
      user,
      items: cartItems,
      paymentMethod,
      extraData: {
        uid,
        server,
        gamePassLink,
        discordType,
      },
      total,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "kidstore_last_order",
      JSON.stringify(orderData)
    );

    setTimeout(() => {
      clearCart();
      navigate("/orden-confirmada");
    }, 1200);
  };

  /* ================= CARRITO VACÍO ================= */
  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white">
        <h2
          className="text-4xl font-black mb-4 uppercase"
          style={{ fontFamily: "BurbankBig" }}
        >
          Tu carrito está vacío
        </h2>

        <Link
          to="/"
          className="mt-4 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-semibold cursor-pointer"
        >
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 text-white grid md:grid-cols-2 gap-10">

      {/* ================= RESUMEN ================= */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2
          className="text-3xl font-black mb-6 uppercase"
          style={{ fontFamily: "BurbankBig" }}
        >
          Resumen de compra
        </h2>

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border-b border-white/10 pb-3"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image || "/images/placeholder.png"}
                  alt={item.name}
                  className="w-16 h-16 object-contain bg-black/40 rounded-lg"
                />

                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-400">
                    Cantidad: {item.quantity}
                  </p>
                </div>
              </div>

              <span className="font-semibold">
                S/ {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between text-xl font-bold">
          <span>Total</span>
          <span className="text-blue-400">
            S/ {total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* ================= DATOS CLIENTE ================= */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
        <h2
          className="text-3xl font-black uppercase"
          style={{ fontFamily: "BurbankBig" }}
        >
          Datos del cliente
        </h2>

        <input
          defaultValue={user?.username || ""}
          placeholder="Nombre"
          className="w-full bg-black/40 px-4 py-3 rounded-lg"
        />

        <input
          defaultValue={user?.email || ""}
          placeholder="Correo electrónico"
          className="w-full bg-black/40 px-4 py-3 rounded-lg"
        />

        {/* ================= CAMPOS DINÁMICOS ================= */}
        {needsUID && (
          <>
            <input
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              placeholder="UID del jugador"
              className="w-full bg-black/40 px-4 py-3 rounded-lg"
            />

            <input
              value={server}
              onChange={(e) => setServer(e.target.value)}
              placeholder="Servidor"
              className="w-full bg-black/40 px-4 py-3 rounded-lg"
            />
          </>
        )}

        {needsGamePass && (
          <input
            value={gamePassLink}
            onChange={(e) => setGamePassLink(e.target.value)}
            placeholder="Enlace del Game Pass"
            className="w-full bg-black/40 px-4 py-3 rounded-lg"
          />
        )}

        {needsDiscordInfo && (
          <select
            value={discordType}
            onChange={(e) => setDiscordType(e.target.value)}
            className="w-full bg-black/40 px-4 py-3 rounded-lg"
          >
            <option value="">Selecciona tipo de producto Discord</option>
            <option value="nitro">Discord Nitro</option>
            <option value="boost">Mejoras de servidor</option>
            <option value="decoraciones">Decoraciones / Placas</option>
          </select>
        )}

        {/* ================= MÉTODO DE PAGO ================= */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Método de pago
          </h3>

          <PaymentMethods
            selected={paymentMethod}
            onSelect={setPaymentMethod}
          />

          {/* 🔥 PASO 6B */}
          <PaymentInstructions method={paymentMethod} />

          {!paymentMethod && (
            <p className="text-sm text-red-400 mt-2">
              Selecciona un método de pago
            </p>
          )}
        </div>

        <textarea
          placeholder="Notas o instrucciones (opcional)"
          className="w-full bg-black/40 px-4 py-3 rounded-lg resize-none"
          rows={4}
        />

        <button
          onClick={handleConfirm}
          disabled={loading || !paymentMethod}
          className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold cursor-pointer disabled:opacity-50"
        >
          {loading ? "Procesando..." : "Confirmar compra"}
        </button>

        <p className="text-xs text-gray-400 text-center">
          Al confirmar, aceptas nuestros términos y condiciones.
        </p>
      </div>
    </div>
  );
};

export default Checkout;
