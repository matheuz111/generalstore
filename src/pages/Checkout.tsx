// src/pages/Checkout.tsx
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { useLang } from "../context/LangContext";
import { useState } from "react";
import PaymentMethods from "../components/checkout/PaymentMethods";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
const SYMBOLS: Record<string, string> = { PEN: "S/", USD: "$", EUR: "€" };
const USD_RATES: Record<string, number> = { PEN: 0.27, USD: 1, EUR: 1.08 };

/* ════════════════════════════════════════════
   DEFINICIÓN DE JUEGOS
════════════════════════════════════════════ */
interface GameConfig {
  key:      string;
  prefixes: string[];
  label:    string;
  emoji:    string;
  color:    string;
  uidLabel: string | null;
  servers:  string[] | null;
}

const GAME_CONFIGS: GameConfig[] = [
  {
    key:      "genshin",
    prefixes: ["gi-"],
    label:    "Genshin Impact",
    emoji:    "🌸",
    color:    "text-sky-400",
    uidLabel: "UID de Genshin Impact",
    servers:  ["América", "Europa", "Asia", "HK/MO/TW"],
  },
  {
    key:      "hsr",
    prefixes: ["hsr-"],
    label:    "Honkai: Star Rail",
    emoji:    "🚂",
    color:    "text-purple-400",
    uidLabel: "UID de Star Rail",
    servers:  ["América", "Europa", "Asia", "HK/MO/TW"],
  },
  {
    key:      "zzz",
    prefixes: ["zzz-"],
    label:    "Zenless Zone Zero",
    emoji:    "⚡",
    color:    "text-yellow-400",
    uidLabel: "UID de Zenless Zone Zero",
    servers:  ["América", "Europa", "Asia", "HK/MO/TW"],
  },
  {
    key:      "wuwa",
    prefixes: ["wuwa-"],
    label:    "Wuthering Waves",
    emoji:    "🌊",
    color:    "text-teal-400",
    uidLabel: "UID de Wuthering Waves",
    servers:  ["América", "Europa", "Asia", "HK/MO/TW"],
  },
  {
    key:      "hok",
    prefixes: ["hok-"],
    label:    "Honor of Kings",
    emoji:    "👑",
    color:    "text-orange-400",
    uidLabel: "UID de Honor of Kings",
    servers:  null,
  },
  {
    key:      "marvel",
    prefixes: ["marvel-", "mr-", "lat-"],
    label:    "Marvel Rivals",
    emoji:    "🦸",
    color:    "text-red-400",
    uidLabel: "UID de Marvel Rivals",
    servers:  null,
  },
  {
    key:      "wildrift",
    prefixes: ["wc-"],
    label:    "Wild Rift / LoL",
    emoji:    "⚔️",
    color:    "text-cyan-400",
    uidLabel: "UID de Wild Rift",
    servers:  null,
  },
  {
    key:      "pokemon",
    prefixes: ["pk-"],
    label:    "Pokémon",
    emoji:    "🔴",
    color:    "text-yellow-300",
    uidLabel: "UID del jugador",
    servers:  null,
  },
];

/* ── Prefijos de otros productos ── */
const PAVOS_PREFIXES             = ["fn-pavos-", "pavos-", "fn-recharge-"];
const PACKS_PREFIXES             = ["fn-pack-",  "pack-",  "fn-bundle-"];
const BP_PREFIXES                = ["club-", "battle-pass", "og-pass", "music-pass", "lego-pass"];
const WHATSAPP_FORTNITE_PREFIXES = [...PAVOS_PREFIXES, ...PACKS_PREFIXES];
const ROBLOX_PREFIXES            = ["rbx-"];
const GAMEPASS_PREFIXES          = ["gp-"];
const DISCORD_PREFIXES           = ["discord-"];

const ALL_KNOWN_PREFIXES = [
  ...GAME_CONFIGS.flatMap((g) => g.prefixes),
  ...WHATSAPP_FORTNITE_PREFIXES,
  ...BP_PREFIXES,
  ...ROBLOX_PREFIXES,
  ...GAMEPASS_PREFIXES,
  ...DISCORD_PREFIXES,
];

const anyItem = (items: { id: string }[], prefixes: string[]) =>
  items.some((item) => prefixes.some((p) => item.id.startsWith(p)));

const isFortniteShopItem = (id: string) =>
  !ALL_KNOWN_PREFIXES.some((p) => id.startsWith(p));

const getActiveGames = (items: { id: string }[]): GameConfig[] =>
  GAME_CONFIGS.filter((game) =>
    items.some((item) => game.prefixes.some((p) => item.id.startsWith(p)))
  );

/* ── UI Helpers ── */

const Field = ({
  value, onChange, placeholder, type = "text", hasError = false,
}: {
  value: string; onChange: (v: string) => void; placeholder: string;
  type?: string; hasError?: boolean;
}) => (
  <input
    type={type} value={value} onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full bg-black/40 px-4 py-3 rounded-lg border focus:outline-none transition text-white placeholder-gray-500 ${
      hasError ? "border-red-500/70 focus:border-red-500" : "border-white/10 focus:border-blue-500"
    }`}
  />
);

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs text-gray-400 uppercase tracking-wider pl-1 flex items-center gap-1">
    {children}
    <span className="text-red-400 text-base leading-none">*</span>
  </label>
);

const FieldError = ({ msg }: { msg?: string }) =>
  msg ? <p className="text-xs text-red-400 pl-1 mt-0.5">{msg}</p> : null;

const ServerSelect = ({
  value, onChange, servers, hasError,
}: {
  value: string; onChange: (v: string) => void; servers: string[]; hasError: boolean;
}) => (
  <select
    value={value} onChange={(e) => onChange(e.target.value)}
    className={`w-full bg-black/40 px-4 py-3 rounded-lg border focus:outline-none transition text-white appearance-none cursor-pointer ${
      hasError ? "border-red-500/70 focus:border-red-500" : "border-white/10 focus:border-blue-500"
    }`}
  >
    <option value="" disabled>Selecciona tu servidor</option>
    {servers.map((s) => (
      <option key={s} value={s} className="bg-[#0b1120]">{s}</option>
    ))}
  </select>
);

/* ════════════════════════════════════════════
   BLOQUE: INFORMACIÓN DE ENTREGA FORTNITE
════════════════════════════════════════════ */
const FortniteDeliveryInfo = ({
  hasFnShop,
  hasWhatsappFn,
  hasBP,
}: {
  hasFnShop: boolean;
  hasWhatsappFn: boolean;
  hasBP: boolean;
}) => {
  const [showGiftImg, setShowGiftImg] = useState(false);
  const showGifts    = hasFnShop;
  const showRecharge = hasWhatsappFn || hasBP;

  if (!showGifts && !showRecharge) return null;

  return (
    <div className="border border-blue-500/20 bg-blue-500/5 rounded-xl p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <span className="text-lg">🎮</span>
        <p className="text-xs font-black uppercase tracking-widest text-blue-400"
          style={{ fontFamily: "'BurbankBig','Arial Black',sans-serif" }}>
          Información de entrega — Fortnite
        </p>
      </div>

      {/* Regalos de tienda */}
      {showGifts && (
        <div className="bg-black/20 rounded-xl p-4 space-y-2 relative">
          <p className="text-sm font-bold text-white flex items-center gap-2">
            🎁 Regalos de Fortnite
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            Agrega nuestras cuentas como amigos y espera{" "}
            <span className="text-blue-400 font-bold">48 horas</span>{" "}
            si es tu primera compra.
          </p>

          {/* Aviso de 48h + restricciones */}
          <div className="mt-2 border border-yellow-500/30 bg-yellow-500/5 rounded-xl p-3 relative">
            {/* Botón ver ejemplo */}
            <button
              onClick={() => setShowGiftImg(v => !v)}
              className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/10 hover:bg-white/20 border border-white/15 text-white/60 hover:text-white text-[10px] font-bold uppercase px-2 py-1 rounded-lg transition active:scale-95 cursor-pointer"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              {showGiftImg ? "Ocultar" : "IMG"}
            </button>

            <p className="text-xs text-yellow-200/80 leading-relaxed pr-16">
              ⚠️ Para enviar cualquier Pase es necesario que seamos{" "}
              <strong className="text-yellow-300">amigos durante al menos 48 horas</strong>.
              Además, tu cuenta no debe tener ningún{" "}
              <strong className="text-yellow-300">error o restricción</strong>{" "}
              que impida realizar el envío.
            </p>

            {/* Modal imagen */}
            {showGiftImg && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                onClick={() => setShowGiftImg(false)}
              >
                <div className="relative max-w-2xl w-full mx-4" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setShowGiftImg(false)}
                    className="absolute -top-3 -right-3 z-10 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full w-8 h-8 flex items-center justify-center transition cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                  </button>
                  <div className="rounded-2xl overflow-hidden border border-yellow-500/30 bg-black">
                    <img src="/images/ejemplo.jpg" alt="Ejemplo restricción cuenta" className="w-full object-contain max-h-[80vh]" />
                  </div>
                  <p className="text-center text-yellow-300/60 text-xs mt-2">Ejemplo de error o restricción en cuenta</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Recarga de Club, Pavos y Packs */}
      {showRecharge && (
        <div className="bg-black/20 rounded-xl p-4 space-y-1.5">
          <p className="text-sm font-bold text-white flex items-center gap-2">
            🔑 Recarga de Club, Pavos y Packs
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            Se requieren los{" "}
            <span className="text-white font-semibold">datos de la cuenta</span>
            {" "}(correo y contraseña) para completar la recarga.
          </p>
        </div>
      )}
    </div>
  );
};

/* ════════════════════════════════════════════
   MODAL DE PAGO
════════════════════════════════════════════ */
const CopyRow = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-4 py-3">
      <div>
        <p className="text-white/40 text-[10px] uppercase tracking-widest font-bold">{label}</p>
        <p className="text-white font-black text-sm mt-0.5">{value}</p>
      </div>
      <button
        onClick={handleCopy}
        className={`ml-3 shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wide transition-all cursor-pointer active:scale-95 ${
          copied
            ? "bg-green-500/20 text-green-400 border border-green-500/40"
            : "bg-white/10 hover:bg-white/20 text-white/60 hover:text-white border border-white/10"
        }`}
      >
        {copied ? (
          <><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg> Copiado</>
        ) : (
          <><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copiar</>
        )}
      </button>
    </div>
  );
};

const PAYMENT_DATA: Record<string, {
  title: string; color: string; qr: string;
  rows: { label: string; value: string }[]; note?: string;
}> = {
  yape: {
    title: "Pago con YAPE",
    color: "#6A0FD8",
    qr:    "/images/yape.png",
    rows:  [
      { label: "Número", value: "963 469 586" },
      { label: "Nombre", value: "Freddy Aystin Rodriguez Uricay" },
    ],
    note: "Envía el pago y adjunta el comprobante al finalizar.",
  },
  plin: {
    title: "Pago con PLIN",
    color: "#00C6A0",
    qr:    "/images/plin.png",
    rows:  [
      { label: "Número", value: "963 469 586" },
      { label: "Nombre", value: "Freddy Aystin Rodriguez Uricay" },
    ],
    note: "Escanea el QR con tu app bancaria y adjunta el comprobante.",
  },
  bcp: {
    title: "Transferencia Bancaria",
    color: "#003DA5",
    qr:    "",
    rows:  [
      { label: "BCP",       value: "19206197697098" },
      { label: "Interbank", value: "8983302393569" },
      { label: "BBVA",      value: "001108140213226768" },
      { label: "Titular",   value: "Freddy Aystin Rodriguez Uricay" },
    ],
    note: "Envía el comprobante con el N° de operación por WhatsApp o Instagram.",
  },
  binance: {
    title: "Pago con Binance",
    color: "#F0B90B",
    qr:    "/images/binance.png",
    rows:  [
      { label: "ID Binance",  value: "XXXXXXXXXX" },
      { label: "Red / Token", value: "BSC / USDT" },
    ],
    note: "El total incluye un 1% de cargo por Binance Pay. Adjunta el comprobante.",
  },
  bizum: {
    title: "Pago con Bizum",
    color: "#007AFF",
    qr:    "/images/bizum.png",
    rows:  [
      { label: "Teléfono", value: "641 653 591" },
      { label: "Titular",  value: "Angel Rodriguez" },
    ],
    note: "Envía el pago por Bizum e incluye el comprobante al confirmar.",
  },
};

interface ModalProps {
  method: string; total: number; currency: string;
  onConfirm: () => void; onCancel: () => void; loading: boolean;
}

const PaymentModal = ({ method, total, currency, onConfirm, onCancel, loading }: ModalProps) => {
  const data = PAYMENT_DATA[method];
  if (!data) return null;
  const sym = ({ PEN: "S/", USD: "$", EUR: "€" } as Record<string,string>)[currency] ?? "S/";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.78)", backdropFilter: "blur(8px)" }}
    >
      <div className="w-full max-w-md bg-[#0b1022] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">

        <div className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: `1px solid ${data.color}33`, background: `${data.color}12` }}>
          <h3 className="font-black uppercase text-lg tracking-wide" style={{ color: data.color, fontFamily: "'BurbankBig','Arial Black',sans-serif" }}>
            {data.title}
          </h3>
          <button onClick={onCancel} className="text-white/30 hover:text-white transition cursor-pointer p-1">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {data.qr && (
            <div className="flex justify-center">
              <div className="bg-white p-3 rounded-2xl" style={{ boxShadow: `0 0 30px ${data.color}40` }}>
                <img src={data.qr} alt="QR de pago" className="w-56 h-56 object-contain"
                  onError={(e) => {
                    const el = e.target as HTMLImageElement;
                    el.style.display = "none";
                    const p = el.parentElement;
                    if (p) p.innerHTML = `<div style="width:160px;height:160px;display:flex;align-items:center;justify-content:center;color:${data.color};font-size:11px;font-weight:900;text-align:center;text-transform:uppercase">Coloca tu QR<br/>en /public/images/</div>`;
                  }}
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl px-4 py-3 border"
            style={{ background: `${data.color}10`, borderColor: `${data.color}30` }}>
            <span className="text-white/60 text-sm font-bold">Monto a pagar:</span>
            <span className="font-black text-xl" style={{ color: data.color }}>
              {sym} {total.toFixed(2)} {currency}
            </span>
          </div>

          <div className="space-y-2">
            {data.rows.map((row) => <CopyRow key={row.label} label={row.label} value={row.value} />)}
          </div>

          {data.note && (
            <p className="text-white/40 text-xs text-center leading-relaxed">{data.note}</p>
          )}

          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={onConfirm} disabled={loading}
              className="w-full py-3.5 rounded-2xl font-black uppercase text-sm tracking-wide transition active:scale-[0.98] cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: data.color, color: method === "binance" ? "#000" : "#fff" }}
            >
              {loading
                ? <><span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin"/> Procesando...</>
                : "✓ Confirmar pedido"}
            </button>
            <button onClick={onCancel}
              className="w-full py-3 rounded-2xl font-bold text-sm text-white/40 hover:text-white border border-white/10 hover:border-white/25 transition cursor-pointer">
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════════
   CHECKOUT
════════════════════════════════════════════ */
const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const { user }                 = useAuth();
  const { currency }             = useCurrency();
  const { t }                    = useLang();
  const navigate                 = useNavigate();

  /* Detección de contenido */
  const hasFnShop     = cartItems.some((i) => isFortniteShopItem(i.id));
  const hasWhatsappFn = anyItem(cartItems, WHATSAPP_FORTNITE_PREFIXES);
  const hasBP         = anyItem(cartItems, BP_PREFIXES);
  const hasRoblox     = anyItem(cartItems, ROBLOX_PREFIXES);
  const hasGamePass   = anyItem(cartItems, GAMEPASS_PREFIXES);
  const hasDiscord    = anyItem(cartItems, DISCORD_PREFIXES);
  const activeGames   = getActiveGames(cartItems);

  // Hay algún ítem de Fortnite (cualquier tipo)
  const hasAnyFortnite = hasFnShop || hasWhatsappFn || hasBP;

  /* Estado formulario */
  const [name,          setName]          = useState(user?.username || "");
  const [email,         setEmail]         = useState(user?.email    || "");
  const [phone,         setPhone]         = useState(user?.phone    || "");
  const [epicUser,      setEpicUser]      = useState("");
  const [gamePassLink,  setGamePassLink]  = useState("");
  const [discordType,   setDiscordType]   = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes,         setNotes]         = useState("");
  const [fieldErrors,   setFieldErrors]   = useState<Record<string, boolean>>({});
  const [loading,       setLoading]       = useState(false);
  const [emailStatus,   setEmailStatus]   = useState<"idle"|"sending"|"sent"|"failed">("idle");
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  /* Estado dinámico por juego */
  const [gameUIDs,    setGameUIDs]    = useState<Record<string, string>>({});
  const [gameServers, setGameServers] = useState<Record<string, string>>({});

  const setGameUID    = (key: string, val: string) => setGameUIDs((p)    => ({ ...p, [key]: val }));
  const setGameServer = (key: string, val: string) => setGameServers((p) => ({ ...p, [key]: val }));

  /* Totales */
  const baseTotal       = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const isBinance       = paymentMethod === "binance";
  const isBizum         = paymentMethod === "bizum";
  const displayCurrency = isBinance ? "USD" : currency;
  const symbol          = SYMBOLS[displayCurrency] ?? "S/";
  const toUSD           = (n: number) => currency === "USD" ? n : n * (USD_RATES[currency] ?? 1);
  const displayBase     = isBinance ? toUSD(baseTotal) : baseTotal;
  const binanceFee      = isBinance ? displayBase * 0.01 : 0;
  const displayTotal    = displayBase + binanceFee;
  const fmt             = (n: number) => `${symbol} ${n.toFixed(2)}`;

  /* Validación */
  const validate = () => {
    const errors: Record<string, boolean> = {};

    if (!name.trim())   errors.name  = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) errors.email = true;

    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length !== 9) errors.phone = true;
    if (!paymentMethod) errors.payment = true;

    if (hasFnShop && !epicUser.trim())       errors.epicUser     = true;
    if (hasGamePass && !gamePassLink.trim()) errors.gamePassLink = true;
    if (hasDiscord && !discordType)          errors.discordType  = true;

    for (const game of activeGames) {
      if (game.uidLabel && !gameUIDs[game.key]?.trim())
        errors[`uid_${game.key}`] = true;
      if (game.servers && !gameServers[game.key])
        errors[`server_${game.key}`] = true;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearError = (key: string) =>
    setFieldErrors((prev) => ({ ...prev, [key]: false }));

  const buildFormData = (): Record<string, string> => {
    const gameData: Record<string, string> = {};
    for (const game of activeGames) {
      if (gameUIDs[game.key])    gameData[`uid_${game.key}`]    = gameUIDs[game.key];
      if (gameServers[game.key]) gameData[`server_${game.key}`] = gameServers[game.key];
    }
    return {
      name, email, phone,
      ...(hasFnShop   && epicUser    && { epicUser }),
      ...(hasGamePass && gamePassLink && { gamePassLink }),
      ...(hasDiscord  && discordType  && { discordType }),
      ...gameData,
      ...(notes && { notes }),
    };
  };

  const sendReceiptEmail = async (orderId: number) => {
    setEmailStatus("sending");
    try {
      const res = await fetch(`${BACKEND_URL}/send-receipt`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-api-key": import.meta.env.VITE_INTERNAL_API_KEY || "" },
        body: JSON.stringify({
          email, customerName: name, orderId: String(orderId),
          total: displayTotal, currency: displayCurrency,
          items: cartItems.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image || "" })),
          paymentMethod, formData: buildFormData(),
        }),
      });
      setEmailStatus(res.ok ? "sent" : "failed");
    } catch { setEmailStatus("failed"); }
  };

  const handleConfirm = () => {
    if (!validate()) return;
    setShowPaymentModal(true);
  };

  const handleFinalConfirm = async () => {
    setLoading(true);
    setShowPaymentModal(false);
    const orderId = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("kidstore_last_order", JSON.stringify({
      orderId, user, items: cartItems, paymentMethod,
      currency: displayCurrency, formData: buildFormData(),
      total: displayTotal, createdAt: new Date().toISOString(),
    }));
    sendReceiptEmail(orderId);
    setTimeout(() => { clearCart(); navigate("/orden-confirmada"); }, 1200);
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

  return <>
    <div className="max-w-5xl mx-auto px-6 py-16 text-white grid md:grid-cols-2 gap-10">

      {/* ══════════ RESUMEN ══════════ */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-3xl font-black uppercase" style={{ fontFamily: "BurbankBig" }}>
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
              <span className="font-semibold">
                {fmt(isBinance ? toUSD(item.price) * item.quantity : item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-1.5 pt-2 border-t border-white/10">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Subtotal</span><span>{fmt(displayBase)}</span>
          </div>
          {isBinance && (
            <div className="flex justify-between text-sm text-yellow-400">
              <span>Cargo Binance (1%)</span>
              <span>+ {fmt(binanceFee)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold pt-1">
            <span>{t("checkout", "total")}</span>
            <span className="text-blue-400">{fmt(displayTotal)}</span>
          </div>
          {isBinance && (
            <p className="text-xs text-yellow-400/70 text-right">Convertido a USD para Binance</p>
          )}
        </div>

        {emailStatus === "sending" && (
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <span className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
            Enviando confirmación...
          </div>
        )}
        {emailStatus === "sent"   && <p className="text-sm text-green-400">✅ Recibo enviado a <strong>{email}</strong></p>}
        {emailStatus === "failed" && <p className="text-sm text-yellow-500">⚠️ No se pudo enviar el email, pero tu pedido fue registrado.</p>}
      </div>

      {/* ══════════ FORMULARIO ══════════ */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-3xl font-black uppercase" style={{ fontFamily: "BurbankBig" }}>
          {t("checkout", "title")}
        </h2>

        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span className="text-red-400 text-base leading-none">*</span> Campos obligatorios
        </p>

        {Object.values(fieldErrors).some(Boolean) && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
            <span>⚠️</span> Por favor completa todos los campos obligatorios.
          </div>
        )}

        {/* DATOS PERSONALES */}
        <div className="space-y-1">
          <RequiredLabel>Nombre completo</RequiredLabel>
          <Field value={name} onChange={(v) => { setName(v); clearError("name"); }}
            placeholder={t("checkout", "name")} hasError={!!fieldErrors.name} />
          <FieldError msg={fieldErrors.name ? "El nombre es obligatorio." : undefined} />
        </div>

        <div className="space-y-1">
          <RequiredLabel>Correo electrónico</RequiredLabel>
          <Field value={email} onChange={(v) => { setEmail(v); clearError("email"); }}
            placeholder={t("checkout", "email")} type="email" hasError={!!fieldErrors.email} />
          <FieldError msg={fieldErrors.email ? "Ingresa un correo válido (ejemplo@correo.com)." : undefined} />
        </div>

        <div className="space-y-1">
          <RequiredLabel>Número de teléfono</RequiredLabel>
          <Field
            value={phone}
            onChange={(v) => {
              // Solo permitir dígitos, max 9
              const digits = v.replace(/\D/g, "").slice(0, 9);
              setPhone(digits);
              clearError("phone");
            }}
            placeholder="Ej: 987654321"
            type="tel"
            hasError={!!fieldErrors.phone}
          />
          <FieldError msg={fieldErrors.phone ? "Ingresa un número válido de 9 dígitos." : undefined} />
          {phone.length > 0 && phone.replace(/\D/g, "").length < 9 && (
            <p className="text-xs text-white/30 pl-1">{phone.replace(/\D/g, "").length}/9 dígitos</p>
          )}
        </div>

        {/* ══ INFORMACIÓN DE ENTREGA FORTNITE ══ */}
        {hasAnyFortnite && (
          <FortniteDeliveryInfo
            hasFnShop={hasFnShop}
            hasWhatsappFn={hasWhatsappFn}
            hasBP={hasBP}
          />
        )}

        {/* FORTNITE SHOP — campo usuario Epic */}
        {hasFnShop && (
          <div className="space-y-2 border border-blue-500/20 bg-blue-500/5 rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-400">🎮 Fortnite</p>
            <div className="space-y-1">
              <RequiredLabel>Usuario de Epic Games</RequiredLabel>
              <Field value={epicUser} onChange={(v) => { setEpicUser(v); clearError("epicUser"); }}
                placeholder="Tu usuario de Epic Games" hasError={!!fieldErrors.epicUser} />
              <FieldError msg={fieldErrors.epicUser ? "El usuario de Epic Games es obligatorio." : undefined} />
            </div>
          </div>
        )}

        {/* PAVOS / PACKS — aviso WhatsApp */}
        {hasWhatsappFn && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 text-sm text-blue-300 flex items-start gap-2">
            <span className="text-lg shrink-0">💬</span>
            <span>
              Para esta compra <strong>no necesitas ingresar usuario</strong>.
              Nos pondremos en contacto por WhatsApp o redes sociales para coordinar la entrega.
            </span>
          </div>
        )}

        {/* JUEGOS CON UID */}
        {activeGames.map((game) => (
          <div key={game.key} className="space-y-3 border border-white/8 bg-white/[0.02] rounded-xl p-4">
            <p className={`text-xs font-bold uppercase tracking-widest ${game.color}`}>
              {game.emoji} {game.label}
            </p>

            {game.uidLabel && (
              <div className="space-y-1">
                <RequiredLabel>{game.uidLabel}</RequiredLabel>
                <Field
                  value={gameUIDs[game.key] || ""}
                  onChange={(v) => { setGameUID(game.key, v); clearError(`uid_${game.key}`); }}
                  placeholder="Ej: 123456789"
                  hasError={!!fieldErrors[`uid_${game.key}`]}
                />
                <FieldError msg={fieldErrors[`uid_${game.key}`] ? `El UID de ${game.label} es obligatorio.` : undefined} />
              </div>
            )}

            {game.servers && (
              <div className="space-y-1">
                <RequiredLabel>Servidor</RequiredLabel>
                <ServerSelect
                  value={gameServers[game.key] || ""}
                  onChange={(v) => { setGameServer(game.key, v); clearError(`server_${game.key}`); }}
                  servers={game.servers}
                  hasError={!!fieldErrors[`server_${game.key}`]}
                />
                <FieldError msg={fieldErrors[`server_${game.key}`] ? `Selecciona tu servidor de ${game.label}.` : undefined} />
              </div>
            )}
          </div>
        ))}

        {/* ROBLOX */}
        {(hasRoblox || hasGamePass) && (
          <div className="space-y-2 border border-red-500/20 bg-red-500/5 rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-red-400">🧱 Roblox</p>
            {hasGamePass && (
              <div className="space-y-1">
                <RequiredLabel>{t("checkout", "gamePassLink")}</RequiredLabel>
                <Field value={gamePassLink} onChange={(v) => { setGamePassLink(v); clearError("gamePassLink"); }}
                  placeholder={t("checkout", "gamePassLink")} hasError={!!fieldErrors.gamePassLink} />
                <FieldError msg={fieldErrors.gamePassLink ? "El enlace del Game Pass es obligatorio." : undefined} />
              </div>
            )}
          </div>
        )}

        {/* DISCORD */}
        {hasDiscord && (
          <div className="space-y-2 border border-indigo-500/20 bg-indigo-500/5 rounded-xl p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">💜 Discord</p>
            <div className="space-y-1">
              <RequiredLabel>{t("checkout", "discordType")}</RequiredLabel>
              <select value={discordType}
                onChange={(e) => { setDiscordType(e.target.value); clearError("discordType"); }}
                className={`w-full bg-black/40 px-4 py-3 rounded-lg border focus:outline-none transition text-white appearance-none cursor-pointer ${
                  fieldErrors.discordType ? "border-red-500/70 focus:border-red-500" : "border-white/10 focus:border-blue-500"
                }`}
              >
                <option value="" disabled>{t("checkout", "discordType")}</option>
                <option value="nitro">{t("checkout", "discordNitro")}</option>
                <option value="boost">{t("checkout", "discordBoost")}</option>
                <option value="decoraciones">{t("checkout", "discordDeco")}</option>
              </select>
              <FieldError msg={fieldErrors.discordType ? "Debes seleccionar el tipo de producto Discord." : undefined} />
            </div>
          </div>
        )}

        {/* MÉTODO DE PAGO */}
        <div className="pt-2">
          <h3 className="text-lg font-semibold mb-3">{t("checkout", "paymentMethod")}</h3>
          <PaymentMethods selected={paymentMethod} onSelect={(m) => { setPaymentMethod(m); clearError("payment"); }} currency={currency} />
          {isBinance && (
            <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 text-sm text-yellow-300 flex items-start gap-2">
              <span className="text-lg shrink-0">⚡</span>
              <span>Los pagos con <strong>Binance Pay</strong> incluyen un cargo del <strong>1%</strong>. Total en <strong>USD</strong>.</span>
            </div>
          )}
          {isBizum && (
            <div className="mt-3 bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 text-sm text-blue-300 flex items-start gap-2">
              <span className="text-lg shrink-0">💙</span>
              <span>Pago con <strong>Bizum</strong> al <strong>641 653 591</strong> — <strong>Angel Rodriguez</strong>. Total en <strong>EUR</strong>.</span>
            </div>
          )}
          {fieldErrors.payment && <p className="text-sm text-red-400 mt-2">⚠️ {t("checkout", "selectPayment")}</p>}
        </div>

        {/* NOTAS */}
        <div className="space-y-1">
          <label className="text-xs text-gray-400 uppercase tracking-wider pl-1">{t("checkout", "notes")}</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder={t("checkout", "notes")}
            className="w-full bg-black/40 px-4 py-3 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none transition resize-none text-white placeholder-gray-500"
            rows={3} />
        </div>

        {/* CONFIRMAR */}
        <button onClick={handleConfirm} disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-xl font-semibold cursor-pointer disabled:opacity-50 transition active:scale-[0.98]">
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

    {/* ══════════ MODAL DE PAGO ══════════ */}
    {showPaymentModal && (
      <PaymentModal
        method={paymentMethod}
        total={displayTotal}
        currency={displayCurrency}
        onConfirm={handleFinalConfirm}
        onCancel={() => setShowPaymentModal(false)}
        loading={loading}
      />
    )}
  </>;
};

export default Checkout;