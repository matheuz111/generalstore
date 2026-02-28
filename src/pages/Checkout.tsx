// src/pages/Checkout.tsx
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useCurrency } from "../context/CurrencyContext";
import { useLang } from "../context/LangContext";
import { useState, useEffect } from "react";
import PaymentMethods from "../components/checkout/PaymentMethods";
import PaymentInstructions from "../components/checkout/PaymentInstructions";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

const SERVERS  = ["America", "Europe", "Asia", "Taiwan"];
const SYMBOLS: Record<string, string> = { PEN: "S/", USD: "$", EUR: "€" };

/* ── Prefijos por tipo de juego ── */
const ROBLOX_PREFIXES     = ["rbx-", "gp-"];
const UID_SERVER_PREFIXES = ["wc-", "gi-", "zzz-", "wuwa-", "pk-", "lat-", "hok-"];
const DISCORD_PREFIXES    = ["discord-"];
const ALL_KNOWN_PREFIXES  = [...ROBLOX_PREFIXES, ...UID_SERVER_PREFIXES, ...DISCORD_PREFIXES, "hsr-"];

/* Prefijos que son "recarga de pavos" o "packs" — checkout termina en WhatsApp */
const PAVOS_PREFIXES  = ["fn-pavos-", "pavos-", "fn-recharge-"];
const PACKS_PREFIXES  = ["fn-pack-",  "pack-",  "fn-bundle-"];
const WHATSAPP_FORTNITE_PREFIXES = [...PAVOS_PREFIXES, ...PACKS_PREFIXES];

const anyItem = (items: { id: string }[], prefixes: string[]) =>
  items.some((item) => prefixes.some((p) => item.id.startsWith(p)));

/* Fortnite genérico (no pavos/packs) → pide epicUser */
const isFortniteShopItem = (id: string) =>
  !ALL_KNOWN_PREFIXES.some((p) => id.startsWith(p)) &&
  !WHATSAPP_FORTNITE_PREFIXES.some((p) => id.startsWith(p));

const NO_SERVER_PREFIXES = ["lat-", "hok-"];
const needsServer = (items: { id: string }[]) =>
  items.some((item) =>
    UID_SERVER_PREFIXES.some((p) => item.id.startsWith(p)) &&
    !NO_SERVER_PREFIXES.some((p) => item.id.startsWith(p))
  );

/* ── Tasa USD hard-coded (fallback si no hay contexto) ── */
const USD_RATES: Record<string, number> = { PEN: 0.27, USD: 1, EUR: 1.08 };

/* ── Aviso TRY ── */
const TryNotice = () => (
  <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-4 flex gap-3">
    <span className="text-2xl shrink-0">🇹🇷</span>
    <div className="text-sm leading-relaxed">
      <p className="font-black text-amber-300 uppercase tracking-wide mb-1" style={{ fontFamily: "'BurbankBig','Arial Black',sans-serif" }}>
        Precios en Lira Turca (TRY)
      </p>
      <p className="text-amber-200/80">
        Estos precios son exclusivos para cuentas con región configurada en <strong>Turquía (TRY)</strong>.
        Si tu cuenta no muestra los precios en TRY, no podrás acceder a estos valores.
      </p>
      <p className="text-amber-200/60 mt-1.5 flex items-start gap-1.5">
        <span className="mt-0.5 shrink-0">💬</span>
        La entrega se coordina de forma manual. Tras tu compra nos contactaremos por
        <strong className="text-amber-300 ml-1">WhatsApp, Instagram, Facebook o Discord</strong> para
        solicitar los datos necesarios y completar la recarga.
      </p>
    </div>
  </div>
);

/* ── Input con indicador de error ── */
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
      hasError
        ? "border-red-500/70 focus:border-red-500"
        : "border-white/10 focus:border-blue-500"
    }`}
  />
);

const RequiredLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-xs text-gray-400 uppercase tracking-wider pl-1 flex items-center gap-1">
    {children}
    <span className="text-red-400 text-base leading-none">*</span>
  </label>
);

const SectionLabel = ({ color, label }: { color: string; label: string }) => (
  <p className={`text-xs font-bold uppercase tracking-widest ${color} pt-2`}>{label}</p>
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

  /* ── Tipo de carrito ── */
  const hasFnShop     = cartItems.some((i) => isFortniteShopItem(i.id));
  const hasPavos      = anyItem(cartItems, PAVOS_PREFIXES);
  const hasPacks      = anyItem(cartItems, PACKS_PREFIXES);
  const hasWhatsappFn = hasPavos || hasPacks;       // checkout manual
  const hasFortnite   = hasFnShop || hasWhatsappFn; // cualquier fortnite
  const hasRoblox     = anyItem(cartItems, ROBLOX_PREFIXES);
  const hasGamePass   = anyItem(cartItems, ["gp-"]);
  const hasUIDServer  = anyItem(cartItems, UID_SERVER_PREFIXES);
  const hasDiscord    = anyItem(cartItems, DISCORD_PREFIXES);
  const showServer    = needsServer(cartItems);

  /* ── Estado del formulario ── */
  const [name,          setName]          = useState(user?.username || "");
  const [email,         setEmail]         = useState(user?.email    || "");
  const [phone,         setPhone]         = useState(user?.phone    || "");
  const [epicUser,      setEpicUser]      = useState("");
  const [uid,           setUid]           = useState("");
  const [server,        setServer]        = useState("");
  const [gamePassLink,  setGamePassLink]  = useState("");
  const [discordType,   setDiscordType]   = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [notes,         setNotes]         = useState("");
  const [fieldErrors,   setFieldErrors]   = useState<Record<string, boolean>>({});
  const [loading,       setLoading]       = useState(false);
  const [emailStatus,   setEmailStatus]   = useState<"idle"|"sending"|"sent"|"failed">("idle");

  /* ── Totales con cargo Binance ── */
  const baseTotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);

  const isBinance = paymentMethod === "binance";

  /* Si es Binance → mostrar en USD con +1% */
  const displayCurrency = isBinance ? "USD" : currency;
  const symbol          = SYMBOLS[displayCurrency] ?? "S/";

  /* Convertir a USD si hace falta */
  const toUSD = (amount: number) => {
    if (currency === "USD") return amount;
    return amount * (USD_RATES[currency] ?? 1);
  };

  const displayBase  = isBinance ? toUSD(baseTotal) : baseTotal;
  const binanceFee   = isBinance ? displayBase * 0.01 : 0;
  const displayTotal = displayBase + binanceFee;

  const fmt = (n: number) => `${symbol} ${n.toFixed(2)}`;

  /* ── Validación ── */
  const validate = () => {
    const errors: Record<string, boolean> = {};
    if (!name.trim())          errors.name    = true;
    if (!email.trim())         errors.email   = true;
    if (!phone.trim())         errors.phone   = true;
    if (!paymentMethod)        errors.payment = true;
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const clearError = (key: string) =>
    setFieldErrors((prev) => ({ ...prev, [key]: false }));

  /* ── Enviar email recibo ── */
  const sendReceiptEmail = async (orderId: number) => {
    setEmailStatus("sending");
    const formData: Record<string, string> = {
      name, phone,
      ...(hasFnShop    && epicUser    && { epicUser }),
      ...(hasUIDServer && uid         && { uid }),
      ...(hasUIDServer && showServer && server && { server }),
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
          total: displayTotal,
          currency: displayCurrency,
          items: cartItems.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image || "" })),
          paymentMethod,
          formData,
        }),
      });
      setEmailStatus(res.ok ? "sent" : "failed");
    } catch {
      setEmailStatus("failed");
    }
  };

  /* ── Confirmar pedido ── */
  const handleConfirm = async () => {
    if (!validate()) return;
    setLoading(true);

    const orderId = Math.floor(100000 + Math.random() * 900000);
    const formData: Record<string, string> = {
      name, email, phone,
      ...(hasFnShop    && { epicUser }),
      ...(hasUIDServer && { uid }),
      ...(hasUIDServer && showServer && { server }),
      ...(hasGamePass  && { gamePassLink }),
      ...(hasDiscord   && { discordType }),
      notes,
    };

    localStorage.setItem("kidstore_last_order", JSON.stringify({
      orderId, user, items: cartItems, paymentMethod,
      currency: displayCurrency,
      formData,
      total: displayTotal,
      createdAt: new Date().toISOString(),
    }));

    sendReceiptEmail(orderId);

    setTimeout(() => {
      clearCart();
      navigate("/orden-confirmada");
    }, 1200);
  };

  /* ── Carrito vacío ── */
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

        {/* Aviso TRY si hay pavos o packs */}
        {hasWhatsappFn && <TryNotice />}

        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-4">
                <img
                  src={item.image || "/images/placeholder.png"} alt={item.name}
                  className="w-16 h-16 object-contain bg-black/40 rounded-lg"
                />
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-400">{t("checkout", "quantity")} {item.quantity}</p>
                </div>
              </div>
              <span className="font-semibold">{fmt(isBinance ? toUSD(item.price) * item.quantity : item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        {/* Desglose totales */}
        <div className="space-y-1.5 pt-2 border-t border-white/10">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Subtotal</span>
            <span>{fmt(displayBase)}</span>
          </div>
          {isBinance && (
            <div className="flex justify-between text-sm text-yellow-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
                Cargo Binance (1%)
              </span>
              <span>+ {fmt(binanceFee)}</span>
            </div>
          )}
          <div className="flex justify-between text-xl font-bold pt-1">
            <span>{t("checkout", "total")}</span>
            <span className="text-blue-400">{fmt(displayTotal)}</span>
          </div>
          {isBinance && (
            <p className="text-xs text-yellow-400/70 text-right">
              Precio convertido a USD para pago con Binance
            </p>
          )}
        </div>

        {/* Estado email */}
        {emailStatus === "sending" && (
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <span className="w-3 h-3 border-2 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
            Enviando confirmación a tu email...
          </div>
        )}
        {emailStatus === "sent" && (
          <p className="text-sm text-green-400">✅ Recibo enviado a <strong>{email}</strong></p>
        )}
        {emailStatus === "failed" && (
          <p className="text-sm text-yellow-500">⚠️ No se pudo enviar el email, pero tu pedido fue registrado.</p>
        )}
      </div>

      {/* ══════════ FORMULARIO ══════════ */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-3xl font-black uppercase" style={{ fontFamily: "BurbankBig" }}>
          {t("checkout", "title")}
        </h2>

        {/* Leyenda */}
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <span className="text-red-400 text-base leading-none">*</span>
          Campos obligatorios
        </p>

        {/* Error global */}
        {Object.values(fieldErrors).some(Boolean) && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 flex items-center gap-2">
            <span>⚠️</span>
            <span>Por favor completa todos los campos obligatorios.</span>
          </div>
        )}

        {/* Nombre */}
        <div className="space-y-1">
          <RequiredLabel>Nombre completo</RequiredLabel>
          <Field
            value={name}
            onChange={(v) => { setName(v); clearError("name"); }}
            placeholder={t("checkout", "name")}
            hasError={!!fieldErrors.name}
          />
          {fieldErrors.name && <p className="text-xs text-red-400 pl-1">El nombre es obligatorio.</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <RequiredLabel>Correo electrónico</RequiredLabel>
          <Field
            value={email}
            onChange={(v) => { setEmail(v); clearError("email"); }}
            placeholder={t("checkout", "email")}
            type="email"
            hasError={!!fieldErrors.email}
          />
          {fieldErrors.email && <p className="text-xs text-red-400 pl-1">El correo es obligatorio.</p>}
        </div>

        {/* Teléfono */}
        <div className="space-y-1">
          <RequiredLabel>Número de teléfono</RequiredLabel>
          <Field
            value={phone}
            onChange={(v) => { setPhone(v); clearError("phone"); }}
            placeholder="Ej: 987 654 321"
            type="tel"
            hasError={!!fieldErrors.phone}
          />
          {fieldErrors.phone && <p className="text-xs text-red-400 pl-1">El teléfono es obligatorio.</p>}
        </div>

        {/* ── Fortnite shop (tienda) → pide usuario Epic ── */}
        {hasFnShop && (
          <>
            <SectionLabel color="text-blue-400" label={t("checkout", "sectionFortnite")} />
            <Field value={epicUser} onChange={setEpicUser} placeholder={t("checkout", "epicUser")} />
          </>
        )}

        {/* ── Pavos / Packs → NO pide epicUser, la entrega es por WhatsApp ── */}
        {hasWhatsappFn && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl px-4 py-3 text-sm text-blue-300 flex items-start gap-2">
            <span className="text-lg shrink-0">💬</span>
            <span>
              Para esta compra <strong>no necesitas ingresar usuario</strong>.
              Nos pondremos en contacto contigo por WhatsApp o redes sociales para coordinar la entrega.
            </span>
          </div>
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
            {showServer && (
              <select
                value={server}
                onChange={(e) => setServer(e.target.value)}
                className="w-full bg-black/40 px-4 py-3 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none transition text-white appearance-none cursor-pointer"
              >
                <option value="" disabled>{t("checkout", "selectServer")}</option>
                {SERVERS.map((s) => (
                  <option key={s} value={s} className="bg-[#0b1120]">{s}</option>
                ))}
              </select>
            )}
          </>
        )}

        {/* Discord */}
        {hasDiscord && (
          <>
            <SectionLabel color="text-indigo-400" label={t("checkout", "sectionDiscord")} />
            <select
              value={discordType}
              onChange={(e) => setDiscordType(e.target.value)}
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
          <PaymentMethods
            selected={paymentMethod}
            onSelect={(m) => { setPaymentMethod(m); clearError("payment"); }}
          />
          <PaymentInstructions method={paymentMethod} />

          {/* Aviso cargo Binance */}
          {isBinance && (
            <div className="mt-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl px-4 py-3 text-sm text-yellow-300 flex items-start gap-2">
              <span className="text-lg shrink-0">⚡</span>
              <span>
                Los pagos con <strong>Binance Pay</strong> incluyen un cargo adicional del <strong>1%</strong>.
                El total se muestra en <strong>USD</strong>.
              </span>
            </div>
          )}

          {fieldErrors.payment && (
            <p className="text-sm text-red-400 mt-2">⚠️ {t("checkout", "selectPayment")}</p>
          )}
        </div>

        {/* Notas */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder={t("checkout", "notes")}
          className="w-full bg-black/40 px-4 py-3 rounded-lg border border-white/10 focus:border-blue-500 focus:outline-none transition resize-none text-white placeholder-gray-500"
          rows={3}
        />

        {/* Confirmar */}
        <button
          onClick={handleConfirm}
          disabled={loading}
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