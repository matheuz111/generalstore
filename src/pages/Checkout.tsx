// src/pages/Checkout.tsx
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { useLang } from "../context/LangContext";
import { useState } from "react";
import PaymentMethods from "../components/checkout/PaymentMethods";
import PaymentInstructions from "../components/checkout/PaymentInstructions";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

const SERVERS   = ["America", "Europe", "Asia", "Taiwan"];
const SYMBOLS: Record<string, string> = { PEN: "S/", USD: "$", EUR: "€" };

const ROBLOX_PREFIXES     = ["rbx-", "gp-"];
const UID_SERVER_PREFIXES = ["wc-", "gi-", "zzz-", "wuwa-", "pk-"];
const DISCORD_PREFIXES    = ["discord-"];
const ALL_KNOWN_PREFIXES  = [...ROBLOX_PREFIXES, ...UID_SERVER_PREFIXES, ...DISCORD_PREFIXES, "hsr-", "hok-", "lat-"];

const anyItem = (items: { id: string }[], prefixes: string[]) =>
  items.some((item) => prefixes.some((p) => item.id.startsWith(p)));

const isFortniteItem = (id: string) =>
  !ALL_KNOWN_PREFIXES.some((p) => id.startsWith(p));

/* ── Input reutilizable ── */
const Field = ({
  value, onChange, placeholder, type = "text",
}: { value: string; onChange: (v: string) => void; placeholder: string; type?: string }) => (
  <input
    type={type} value={value} onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full bg-black/40 px-4 py-3 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none transition text-white placeholder-gray-500"
  />
);

const SectionLabel = ({ color, label }: { color: string; label: string }) => (
  <p className={`text-xs font-bold uppercase tracking-widest ${color} pt-2`}>{label}</p>
);

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const { currency } = useCurrency();
  const { t } = useLang();
  const navigate = useNavigate();

  const symbol = SYMBOLS[currency] ?? "S/";
  const fmt = (n: number) => `${symbol} ${n.toFixed(2)}`;
  const [loading, setLoading]       = useState(false);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");

  const total = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const hasFortnite  = cartItems.some((i) => isFortniteItem(i.id));
  const hasRoblox    = anyItem(cartItems, ROBLOX_PREFIXES);
  const hasGamePass  = anyItem(cartItems, ["gp-"]);
  const hasUIDServer = anyItem(cartItems, UID_SERVER_PREFIXES);
  const hasDiscord   = anyItem(cartItems, DISCORD_PREFIXES);

  const [name,          setName]          = useState(user?.username || "");
  const [email,         setEmail]         = useState(user?.email    || "");
  const [epicUser,      setEpicUser]      = useState("");
  const [uid,           setUid]           = useState("");
  const [server,        setServer]        = useState("");
  const [gamePassLink,  setGamePassLink]  = useState("");
  const [discordType,   setDiscordType]   = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes,         setNotes]         = useState("");

  /* ── Enviar email de recibo ── */
  const sendReceiptEmail = async (orderId: number) => {
    console.log("KEY:", import.meta.env.VITE_INTERNAL_API_KEY);
    setEmailStatus("sending");

    const formData: Record<string, string> = {
      name,
      ...(hasFortnite  && epicUser    && { epicUser }),
      ...(hasUIDServer && uid         && { uid }),
      ...(hasUIDServer && server      && { server }),
      ...(hasGamePass  && gamePassLink && { gamePassLink }),
      ...(hasDiscord   && discordType  && { discordType }),
      ...(notes && { notes }),
    };

    try {
      const res = await fetch(`${BACKEND_URL}/send-receipt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_INTERNAL_API_KEY || "",
        },
        body: JSON.stringify({
          email,
          customerName: name,
          orderId: String(orderId),
          total,
          currency,
          items: cartItems.map((i) => ({
            id:       i.id,
            name:     i.name,
            price:    i.price,
            quantity: i.quantity,
            image:    i.image || "",
          })),
          paymentMethod,
          formData,
        }),
      });

      if (res.ok) {
        setEmailStatus("sent");
      } else {
        console.warn("Email no enviado, pero el pedido fue registrado.");
        setEmailStatus("failed");
      }
    } catch (err) {
      console.warn("No se pudo conectar al backend para enviar el email:", err);
      setEmailStatus("failed");
    }
  };

  const handleConfirm = async () => {
    if (!paymentMethod) return;
    setLoading(true);

    const orderId = Math.floor(100000 + Math.random() * 900000);

    const formData: Record<string, string> = {
      name,
      email,
      ...(hasFortnite  && { epicUser }),
      ...(hasUIDServer && { uid, server }),
      ...(hasGamePass  && { gamePassLink }),
      ...(hasDiscord   && { discordType }),
      notes,
    };

    // Guardar en localStorage (igual que antes)
    localStorage.setItem("kidstore_last_order", JSON.stringify({
      orderId, user, items: cartItems, paymentMethod, currency,
      formData,
      total, createdAt: new Date().toISOString(),
    }));

    // Enviar email (en paralelo, no bloquea la navegación si falla)
    sendReceiptEmail(orderId);

    // Navegar a confirmación después de 1.2s
    setTimeout(() => {
      clearCart();
      navigate("/orden-confirmada");
    }, 1200);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-white">
        <h2 className="text-4xl font-black mb-4 uppercase" style={{ fontFamily: "BurbankBig" }}>
          {t("checkout", "emptyCart")}
        </h2>
        <Link to="/" className="mt-4 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-semibold cursor-pointer">
          {t("checkout", "backCatalog")}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 text-white grid md:grid-cols-2 gap-10">

      {/* RESUMEN */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <h2 className="text-3xl font-black mb-6 uppercase" style={{ fontFamily: "BurbankBig" }}>
          {t("checkout", "summary")}
        </h2>
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-4">
                <img src={item.image || "/images/placeholder.png"} alt={item.name}
                  className="w-16 h-16 object-contain bg-black/40 rounded-lg" />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-400">{t("checkout", "quantity")} {item.quantity}</p>
                </div>
              </div>
              <span className="font-semibold">{fmt(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex justify-between text-xl font-bold">
          <span>{t("checkout", "total")}</span>
          <span className="text-blue-400">{fmt(total)}</span>
        </div>

        {/* Estado del email (feedback visual) */}
        {emailStatus === "sending" && (
          <div className="mt-4 flex items-center gap-2 text-sm text-blue-400">
            <span className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
            Enviando confirmación a tu email...
          </div>
        )}
        {emailStatus === "sent" && (
          <div className="mt-4 text-sm text-green-400">
            ✅ Recibo enviado a <span className="font-semibold">{email}</span>
          </div>
        )}
        {emailStatus === "failed" && (
          <div className="mt-4 text-sm text-yellow-500">
            ⚠️ No se pudo enviar el email, pero tu pedido fue registrado.
          </div>
        )}
      </div>

      {/* FORMULARIO */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-3xl font-black uppercase" style={{ fontFamily: "BurbankBig" }}>
          {t("checkout", "title")}
        </h2>

        {/* Campos base */}
        <Field value={name}  onChange={setName}  placeholder={t("checkout", "name")} />
        <Field value={email} onChange={setEmail} placeholder={t("checkout", "email")} type="email" />

        {/* Fortnite */}
        {hasFortnite && (
          <>
            <SectionLabel color="text-blue-400" label={t("checkout", "sectionFortnite")} />
            <Field value={epicUser} onChange={setEpicUser} placeholder={t("checkout", "epicUser")} />
          </>
        )}

        {/* Roblox */}
        {hasRoblox && (
          <>
            <SectionLabel color="text-red-400" label={t("checkout", "sectionRoblox")} />
            {hasGamePass && (
              <Field value={gamePassLink} onChange={setGamePassLink} placeholder={t("checkout", "gamePassLink")} />
            )}
          </>
        )}

        {/* UID + Servidor */}
        {hasUIDServer && (
          <>
            <SectionLabel color="text-yellow-400" label={t("checkout", "sectionGame")} />
            <Field value={uid} onChange={setUid} placeholder={t("checkout", "uid")} />
            <select
              value={server} onChange={(e) => setServer(e.target.value)}
              className="w-full bg-black/40 px-4 py-3 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none transition text-white appearance-none cursor-pointer"
            >
              <option value="" disabled>{t("checkout", "selectServer")}</option>
              {SERVERS.map((s) => (
                <option key={s} value={s} className="bg-[#0b1120]">{s}</option>
              ))}
            </select>
          </>
        )}

        {/* Discord */}
        {hasDiscord && (
          <>
            <SectionLabel color="text-indigo-400" label={t("checkout", "sectionDiscord")} />
            <select
              value={discordType} onChange={(e) => setDiscordType(e.target.value)}
              className="w-full bg-black/40 px-4 py-3 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none transition text-white appearance-none cursor-pointer"
            >
              <option value="" disabled>{t("checkout", "discordType")}</option>
              <option value="nitro">{t("checkout", "discordNitro")}</option>
              <option value="boost">{t("checkout", "discordBoost")}</option>
              <option value="decoraciones">{t("checkout", "discordDeco")}</option>
            </select>
          </>
        )}

        {/* Método de pago */}
        <div className="pt-2">
          <h3 className="text-lg font-semibold mb-3">{t("checkout", "paymentMethod")}</h3>
          <PaymentMethods selected={paymentMethod} onSelect={setPaymentMethod} />
          <PaymentInstructions method={paymentMethod} />
          {!paymentMethod && (
            <p className="text-sm text-red-400 mt-2">{t("checkout", "selectPayment")}</p>
          )}
        </div>

        {/* Notas */}
        <textarea
          value={notes} onChange={(e) => setNotes(e.target.value)}
          placeholder={t("checkout", "notes")}
          className="w-full bg-black/40 px-4 py-3 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none transition resize-none text-white placeholder-gray-500"
          rows={3}
        />

        {/* Confirmar */}
        <button
          onClick={handleConfirm} disabled={loading || !paymentMethod}
          className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold cursor-pointer disabled:opacity-50 transition active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              {t("checkout", "processing")}
            </span>
          ) : t("checkout", "confirm")}
        </button>

        <p className="text-xs text-gray-400 text-center">{t("checkout", "terms")}</p>
      </div>
    </div>
  );
};

export default Checkout;