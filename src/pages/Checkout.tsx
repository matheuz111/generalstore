import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { useState } from "react";

import PaymentMethods from "../components/checkout/PaymentMethods";
import PaymentInstructions from "../components/checkout/PaymentInstructions";

const SERVERS = ["America", "Europe", "Asia", "Taiwan"];
const SYMBOLS: Record<string, string> = { PEN: "S/", USD: "$", EUR: "€" };

/* ─────────────────────────────────────────────────────────────
   Prefijos de ID por categoría
   (deben coincidir exactamente con los ids definidos en cada
   página de productos)
   ───────────────────────────────────────────────────────────── */
const ROBLOX_PREFIXES    = ["rbx-", "gp-"];
const UID_SERVER_PREFIXES = [
  "wc-",    // Wild Rift
  "gi-",    // Genshin Impact
  "zzz-",   // Zenless Zone Zero
  "wuwa-",  // Wuthering Waves
  "pk-",    // Pokémon GO
];
const DISCORD_PREFIXES = ["discord-"];

// Todos los prefijos no-Fortnite. Los ítems de Fortnite vienen
// de la API externa y no tienen un prefijo fijo propio, por lo
// que se detectan por exclusión.
const ALL_KNOWN_PREFIXES = [
  ...ROBLOX_PREFIXES,
  ...UID_SERVER_PREFIXES,
  ...DISCORD_PREFIXES,
  "hsr-",  // Honkai Star Rail
  "hok-",  // Honor of Kings
  "lat-",  // Marvel Rivals
];

const anyItem = (items: { id: string }[], prefixes: string[]) =>
  items.some((item) => prefixes.some((p) => item.id.startsWith(p)));

const isFortniteItem = (id: string) =>
  !ALL_KNOWN_PREFIXES.some((p) => id.startsWith(p));

/* ─────────────────────────────────────────────────────────────
   Componente reutilizable de input
   ───────────────────────────────────────────────────────────── */
const Field = ({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
}) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full bg-black/40 px-4 py-3 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none transition text-white placeholder-gray-500"
  />
);

/* ─────────────────────────────────────────────────────────────
   Separador de sección con etiqueta de juego
   ───────────────────────────────────────────────────────────── */
const SectionLabel = ({
  color,
  label,
}: {
  color: string;
  label: string;
}) => (
  <p className={`text-xs font-bold uppercase tracking-widest ${color} pt-2`}>
    {label}
  </p>
);

/* ═════════════════════════════════════════════════════════════
   CHECKOUT
   ═════════════════════════════════════════════════════════════ */
const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const { currency } = useCurrency();
  const navigate = useNavigate();

  const symbol = SYMBOLS[currency] ?? "S/";
  const formatPrice = (price: number) => `${symbol} ${price.toFixed(2)}`;

  const [loading, setLoading] = useState(false);

  /* ── Totales ── */
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  /* ── Qué categorías hay en el carrito ── */
  const hasFortnite  = cartItems.some((i) => isFortniteItem(i.id));
  const hasRoblox    = anyItem(cartItems, ROBLOX_PREFIXES);
  const hasGamePass  = anyItem(cartItems, ["gp-"]);
  const hasUIDServer = anyItem(cartItems, UID_SERVER_PREFIXES);
  const hasDiscord   = anyItem(cartItems, DISCORD_PREFIXES);

  /* ── Estado del formulario ── */
  const [name,          setName]          = useState(user?.username || "");
  const [email,         setEmail]         = useState(user?.email    || "");
  const [epicUser,      setEpicUser]      = useState("");
  const [uid,           setUid]           = useState("");
  const [server,        setServer]        = useState("");
  const [gamePassLink,  setGamePassLink]  = useState("");
  const [discordType,   setDiscordType]   = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes,         setNotes]         = useState("");

  /* ── Confirmar orden ── */
  const handleConfirm = () => {
    if (!paymentMethod) return;
    setLoading(true);

    const orderId = Math.floor(100000 + Math.random() * 900000);

    const orderData = {
      orderId,
      user,
      items: cartItems,
      paymentMethod,
      currency,
      formData: {
        name,
        email,
        ...(hasFortnite  && { epicUser }),
        ...(hasUIDServer && { uid, server }),
        ...(hasGamePass  && { gamePassLink }),
        ...(hasDiscord   && { discordType }),
        notes,
      },
      total,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem("kidstore_last_order", JSON.stringify(orderData));

    setTimeout(() => {
      clearCart();
      navigate("/orden-confirmada");
    }, 1200);
  };

  /* ── Carrito vacío ── */
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

      {/* ══════════════ RESUMEN ══════════════ */}
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
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-between text-xl font-bold">
          <span>Total</span>
          <span className="text-blue-400">{formatPrice(total)}</span>
        </div>
      </div>

      {/* ══════════════ FORMULARIO ══════════════ */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h2
          className="text-3xl font-black uppercase"
          style={{ fontFamily: "BurbankBig" }}
        >
          Datos del cliente
        </h2>

        {/* ── Campos base (todos los pedidos) ── */}
        <Field value={name}  onChange={setName}  placeholder="Nombre completo" />
        <Field value={email} onChange={setEmail} placeholder="Correo electrónico" type="email" />

        {/* ══ FORTNITE ══ nombre + email + usuario Epic Games */}
        {hasFortnite && (
          <>
            <SectionLabel color="text-blue-400" label="🎮 Fortnite" />
            <Field
              value={epicUser}
              onChange={setEpicUser}
              placeholder="Usuario de Epic Games"
            />
          </>
        )}

        {/* ══ ROBLOX ══ nombre + email (+ link game pass si aplica) */}
        {hasRoblox && (
          <>
            <SectionLabel color="text-red-400" label="🎮 Roblox" />
            {hasGamePass && (
              <Field
                value={gamePassLink}
                onChange={setGamePassLink}
                placeholder="Enlace de tu Game Pass"
              />
            )}
          </>
        )}

        {/* ══ WILD RIFT / GENSHIN / ZZZ / WUWA / POKÉMON ══
            nombre + email + UID + servidor */}
        {hasUIDServer && (
          <>
            <SectionLabel color="text-yellow-400" label="🎮 Datos del juego" />
            <Field
              value={uid}
              onChange={setUid}
              placeholder="UID del jugador"
            />
            <select
              value={server}
              onChange={(e) => setServer(e.target.value)}
              className="w-full bg-black/40 px-4 py-3 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none transition text-white appearance-none cursor-pointer"
            >
              <option value="" disabled>Selecciona tu servidor</option>
              {SERVERS.map((s) => (
                <option key={s} value={s} className="bg-[#0b1120]">
                  {s}
                </option>
              ))}
            </select>
          </>
        )}

        {/* ══ DISCORD ══ */}
        {hasDiscord && (
          <>
            <SectionLabel color="text-indigo-400" label="💬 Discord" />
            <select
              value={discordType}
              onChange={(e) => setDiscordType(e.target.value)}
              className="w-full bg-black/40 px-4 py-3 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none transition text-white appearance-none cursor-pointer"
            >
              <option value="" disabled>Tipo de producto Discord</option>
              <option value="nitro">Discord Nitro</option>
              <option value="boost">Mejoras de servidor</option>
              <option value="decoraciones">Decoraciones / Placas</option>
            </select>
          </>
        )}

        {/* ══ MÉTODO DE PAGO ══ */}
        <div className="pt-2">
          <h3 className="text-lg font-semibold mb-3">Método de pago</h3>
          <PaymentMethods selected={paymentMethod} onSelect={setPaymentMethod} />
          <PaymentInstructions method={paymentMethod} />
          {!paymentMethod && (
            <p className="text-sm text-red-400 mt-2">
              Selecciona un método de pago
            </p>
          )}
        </div>

        {/* ══ NOTAS OPCIONALES ══ */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Notas o instrucciones adicionales (opcional)"
          className="w-full bg-black/40 px-4 py-3 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none transition resize-none text-white placeholder-gray-500"
          rows={3}
        />

        {/* ══ BOTÓN CONFIRMAR ══ */}
        <button
          onClick={handleConfirm}
          disabled={loading || !paymentMethod}
          className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold cursor-pointer disabled:opacity-50 transition active:scale-[0.98]"
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