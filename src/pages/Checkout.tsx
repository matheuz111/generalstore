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
  uidLabel: string | null;   // null = sin campo UID
  servers:  string[] | null; // null = sin selección de servidor
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
    prefixes: ["marvel-", "mr-"],
    label:    "Marvel Rivals",
    emoji:    "🦸",
    color:    "text-red-400",
    uidLabel: "UID de Marvel Rivals",
    servers:  null,
  },
  {
    key:      "wildrift",
    prefixes: ["wc-", "lat-"],
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
const WHATSAPP_FORTNITE_PREFIXES = [...PAVOS_PREFIXES, ...PACKS_PREFIXES];
const ROBLOX_PREFIXES            = ["rbx-"];
const GAMEPASS_PREFIXES          = ["gp-"];
const DISCORD_PREFIXES           = ["discord-"];

/* Todos los prefijos conocidos — para detectar Fortnite shop por exclusión */
const ALL_KNOWN_PREFIXES = [
  ...GAME_CONFIGS.flatMap((g) => g.prefixes),
  ...WHATSAPP_FORTNITE_PREFIXES,
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
const TryNotice = () => (
  <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-4 flex gap-3">
    <span className="text-2xl shrink-0">🇹🇷</span>
    <div className="text-sm leading-relaxed">
      <p className="font-black text-amber-300 uppercase tracking-wide mb-1" style={{ fontFamily: "'BurbankBig','Arial Black',sans-serif" }}>
        Precios en Lira Turca (TRY)
      </p>
      <p className="text-amber-200/80">
        Exclusivos para cuentas con región en <strong>Turquía (TRY)</strong>.
      </p>
      <p className="text-amber-200/60 mt-1.5 flex items-start gap-1.5">
        <span className="mt-0.5 shrink-0">💬</span>
        Te contactaremos por <strong className="text-amber-300 ml-1">WhatsApp, Instagram, Facebook o Discord</strong> para coordinar la entrega.
      </p>
    </div>
  </div>
);

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
  const hasRoblox     = anyItem(cartItems, ROBLOX_PREFIXES);
  const hasGamePass   = anyItem(cartItems, GAMEPASS_PREFIXES);
  const hasDiscord    = anyItem(cartItems, DISCORD_PREFIXES);
  const activeGames   = getActiveGames(cartItems);

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

  /* Estado dinámico por juego */
  const [gameUIDs,    setGameUIDs]    = useState<Record<string, string>>({});
  const [gameServers, setGameServers] = useState<Record<string, string>>({});

  const setGameUID    = (key: string, val: string) => setGameUIDs((p)    => ({ ...p, [key]: val }));
  const setGameServer = (key: string, val: string) => setGameServers((p) => ({ ...p, [key]: val }));

  /* Totales */
  const baseTotal       = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const isBinance       = paymentMethod === "binance";
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
    if (!email.trim())  errors.email = true;
    if (!phone.trim())  errors.phone = true;
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

  /* Construir formData para email y localStorage */
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

  /* Enviar email recibo */
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

  /* Confirmar pedido */
  const handleConfirm = async () => {
    if (!validate()) return;
    setLoading(true);
    const orderId = Math.floor(100000 + Math.random() * 900000);
    localStorage.setItem("kidstore_last_order", JSON.stringify({
      orderId, user, items: cartItems, paymentMethod,
      currency: displayCurrency, formData: buildFormData(),
      total: displayTotal, createdAt: new Date().toISOString(),
    }));
    sendReceiptEmail(orderId);
    setTimeout(() => { clearCart(); navigate("/orden-confirmada"); }, 1200);
  };

  /* Carrito vacío */
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

      {/* ══════════ RESUMEN ══════════ */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-3xl font-black uppercase" style={{ fontFamily: "BurbankBig" }}>
          {t("checkout", "summary")}
        </h2>

        {hasWhatsappFn && <TryNotice />}

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
          <FieldError msg={fieldErrors.email ? "El correo es obligatorio." : undefined} />
        </div>

        <div className="space-y-1">
          <RequiredLabel>Número de teléfono</RequiredLabel>
          <Field value={phone} onChange={(v) => { setPhone(v); clearError("phone"); }}
            placeholder="Ej: 987 654 321" type="tel" hasError={!!fieldErrors.phone} />
          <FieldError msg={fieldErrors.phone ? "El teléfono es obligatorio." : undefined} />
        </div>

        {/* FORTNITE SHOP */}
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

        {/* PAVOS / PACKS */}
        {hasWhatsappFn && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 text-sm text-blue-300 flex items-start gap-2">
            <span className="text-lg shrink-0">💬</span>
            <span>
              Para esta compra <strong>no necesitas ingresar usuario</strong>.
              Nos pondremos en contacto por WhatsApp o redes sociales para coordinar la entrega.
            </span>
          </div>
        )}

        {/* JUEGOS CON UID — uno por juego detectado en el carrito */}
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
          <PaymentMethods selected={paymentMethod} onSelect={(m) => { setPaymentMethod(m); clearError("payment"); }} />
          <PaymentInstructions method={paymentMethod} />
          {isBinance && (
            <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 text-sm text-yellow-300 flex items-start gap-2">
              <span className="text-lg shrink-0">⚡</span>
              <span>Los pagos con <strong>Binance Pay</strong> incluyen un cargo del <strong>1%</strong>. Total en <strong>USD</strong>.</span>
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
  );
};

export default Checkout;