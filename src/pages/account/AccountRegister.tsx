// src/pages/account/AccountRegister.tsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useLang } from "../../context/LangContext";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

type Step = "form" | "verify" | "success";

/* ─────────────────────────────────────────────
   PAÍSES
───────────────────────────────────────────── */
const COUNTRIES = [
  { code: "PE", flag: "🇵🇪", dial: "+51",  label: "Perú",          len: 9  },
  { code: "AR", flag: "🇦🇷", dial: "+54",  label: "Argentina",     len: 10 },
  { code: "BO", flag: "🇧🇴", dial: "+591", label: "Bolivia",       len: 8  },
  { code: "BR", flag: "🇧🇷", dial: "+55",  label: "Brasil",        len: 11 },
  { code: "CL", flag: "🇨🇱", dial: "+56",  label: "Chile",         len: 9  },
  { code: "CO", flag: "🇨🇴", dial: "+57",  label: "Colombia",      len: 10 },
  { code: "CR", flag: "🇨🇷", dial: "+506", label: "Costa Rica",    len: 8  },
  { code: "CU", flag: "🇨🇺", dial: "+53",  label: "Cuba",          len: 8  },
  { code: "DO", flag: "🇩🇴", dial: "+1",   label: "Dom. Republic", len: 10 },
  { code: "EC", flag: "🇪🇨", dial: "+593", label: "Ecuador",       len: 9  },
  { code: "GT", flag: "🇬🇹", dial: "+502", label: "Guatemala",     len: 8  },
  { code: "HN", flag: "🇭🇳", dial: "+504", label: "Honduras",      len: 8  },
  { code: "MX", flag: "🇲🇽", dial: "+52",  label: "México",        len: 10 },
  { code: "NI", flag: "🇳🇮", dial: "+505", label: "Nicaragua",     len: 8  },
  { code: "PA", flag: "🇵🇦", dial: "+507", label: "Panamá",        len: 8  },
  { code: "PY", flag: "🇵🇾", dial: "+595", label: "Paraguay",      len: 9  },
  { code: "SV", flag: "🇸🇻", dial: "+503", label: "El Salvador",   len: 8  },
  { code: "UY", flag: "🇺🇾", dial: "+598", label: "Uruguay",       len: 9  },
  { code: "VE", flag: "🇻🇪", dial: "+58",  label: "Venezuela",     len: 10 },
  { code: "US", flag: "🇺🇸", dial: "+1",   label: "USA",           len: 10 },
  { code: "ES", flag: "🇪🇸", dial: "+34",  label: "España",        len: 9  },
];

/* ─── Validación de contraseña ─── */
interface PasswordRules {
  minLength:   boolean;
  hasUpper:    boolean;
  hasLower:    boolean;
  hasNumber:   boolean;
  hasSymbol:   boolean;
}

const checkPassword = (pw: string): PasswordRules => ({
  minLength: pw.length >= 6,
  hasUpper:  /[A-Z]/.test(pw),
  hasLower:  /[a-z]/.test(pw),
  hasNumber: /[0-9]/.test(pw),
  hasSymbol: /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\\/;'`~]/.test(pw),
});

const isPasswordStrong = (rules: PasswordRules) =>
  Object.values(rules).every(Boolean);

/* ─── Country Select ─── */
interface CountrySelectProps {
  selected: typeof COUNTRIES[0];
  onChange: (c: typeof COUNTRIES[0]) => void;
}

const CountrySelect = ({ selected, onChange }: CountrySelectProps) => {
  const [open, setOpen]     = useState(false);
  const [search, setSearch] = useState("");
  const ref                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = COUNTRIES.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.dial.includes(search)
  );

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-full px-3 bg-black/40 border border-white/10 rounded-l-lg hover:border-blue-500/60 focus:border-blue-500 transition min-w-[95px] cursor-pointer"
        style={{ borderRight: "none" }}
      >
        <span className="text-xl leading-none">{selected.flag}</span>
        <span className="text-sm font-bold text-white/80">{selected.dial}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[10px] text-gray-500 ml-auto"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-1 w-64 bg-[#0b1120] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-2 border-b border-white/10">
              <input
                autoFocus
                type="text"
                placeholder="Buscar país o código..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-black/40 px-3 py-2 rounded-lg text-sm outline-none border border-white/10 focus:border-blue-500 transition placeholder-gray-600 text-white"
              />
            </div>
            <div className="max-h-52 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-4">Sin resultados</p>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => { onChange(c); setOpen(false); setSearch(""); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition hover:bg-white/8 cursor-pointer ${
                      selected.code === c.code ? "bg-blue-600/20 text-blue-300" : "text-gray-300"
                    }`}
                  >
                    <span className="text-lg leading-none">{c.flag}</span>
                    <span className="flex-1">{c.label}</span>
                    <span className="text-gray-500 text-xs">{c.dial}</span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ─── Password Rule Item ─── */
const RuleItem = ({ ok, label }: { ok: boolean; label: string }) => (
  <li className={`flex items-center gap-2 text-xs transition-colors duration-200 ${ok ? "text-green-400" : "text-gray-500"}`}>
    <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-black shrink-0 transition-all duration-200 ${
      ok ? "bg-green-500/20 border border-green-500 text-green-400" : "bg-white/5 border border-white/10 text-gray-600"
    }`}>
      {ok ? "✓" : "•"}
    </span>
    {label}
  </li>
);

/* ─────────────────────────────────────────────
   COMPONENTE PRINCIPAL
───────────────────────────────────────────── */
const AccountRegister = () => {
  const { register } = useAuth();
  const { t }        = useLang();
  const navigate     = useNavigate();

  const [step, setStep] = useState<Step>("form");

  // Fields
  const [username,   setUsername]   = useState("");
  const [email,      setEmail]      = useState("");
  const [password,   setPassword]   = useState("");
  const [confirm,    setConfirm]    = useState("");
  const [showPass,   setShowPass]   = useState(false);
  const [showConf,   setShowConf]   = useState(false);

  // Phone
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [phone,   setPhone]   = useState("");

  // OTP
  const [otp,     setOtp]     = useState(["", "", "", "", "", ""]);
  const otpRefs               = useRef<(HTMLInputElement | null)[]>([]);

  // UI
  const [error,          setError]          = useState("");
  const [loading,        setLoading]        = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [passFocused,    setPassFocused]    = useState(false);

  // Anti-double-submit
  const isRegistering = useRef(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const id = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(id);
  }, [resendCooldown]);

  const rules    = checkPassword(password);
  const allRules = isPasswordStrong(rules);
  const passMatch = password === confirm && confirm.length > 0;

  const phoneValid = () => {
    const digits = phone.replace(/\D/g, "");
    return digits.length >= 7 && digits.length <= 12;
  };

  /* ── Paso 1: enviar código ── */
  const handleSendCode = async () => {
    setError("");

    if (!username || !email || !password || !confirm) {
      setError(t("account", "fillAll")); return;
    }
    if (!allRules) {
      setError("La contraseña no cumple con los requisitos de seguridad."); return;
    }
    if (!passMatch) {
      setError("Las contraseñas no coinciden."); return;
    }
    if (!phone.trim()) {
      setError("Ingresa tu número de contacto."); return;
    }
    if (!phoneValid()) {
      setError("Ingresa un número de teléfono válido."); return;
    }

    setLoading(true);
    try {
      const res  = await fetch(`${BACKEND_URL}/send-verification`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, username }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al enviar el código."); return;
      }

      setStep("verify");
      setResendCooldown(60);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  /* ── Paso 2: verificar OTP y registrar ── */
  const handleVerify = async () => {
    if (isRegistering.current) return;

    const code = otp.join("");
    if (code.length < 6) { setError("Ingresa los 6 dígitos del código."); return; }

    setError("");
    setLoading(true);
    isRegistering.current = true;

    try {
      const res  = await fetch(`${BACKEND_URL}/verify-code`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, code }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Código incorrecto.");
        setOtp(["", "", "", "", "", ""]);
        otpRefs.current[0]?.focus();
        isRegistering.current = false;
        return;
      }

      const fullPhone = `${country.dial}${phone.replace(/\D/g, "")}`;
      const created   = await register(username, email, password, fullPhone);

      if (!created.success) {
        setError(created.error || t("account", "userExists"));
        isRegistering.current = false;
        return;
      }

      setStep("success");
      setTimeout(() => navigate("/mi-cuenta", { replace: true }), 2000);
    } catch {
      setError("Error al verificar. Intenta de nuevo.");
      isRegistering.current = false;
    } finally {
      setLoading(false);
    }
  };

  /* ── Reenviar código ── */
  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      const res  = await fetch(`${BACKEND_URL}/send-verification`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, username }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Error al reenviar."); return; }
      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      otpRefs.current[0]?.focus();
    } catch {
      setError("Error al reenviar el código.");
    } finally {
      setLoading(false);
    }
  };

  /* ── OTP handlers ── */
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0)
      otpRefs.current[index - 1]?.focus();
    if (e.key === "Enter") handleVerify();
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    otpRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handlePhoneChange = (v: string) => {
    setPhone(v.replace(/[^\d\s\-()]/g, "").slice(0, 15));
  };

  /* ─── RENDER ─── */
  return (
    <div className="max-w-md mx-auto px-6 py-20 text-white">

      {/* Indicador de pasos */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {(["form", "verify", "success"] as Step[]).map((s, i) => {
          const stepIndex = ["form", "verify", "success"].indexOf(step);
          const thisIndex = i;
          const done      = stepIndex > thisIndex;
          const active    = step === s;
          return (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all duration-300 ${
                active ? "bg-blue-600 text-white scale-110 shadow-lg shadow-blue-600/40"
                       : done ? "bg-blue-900 text-blue-400"
                               : "bg-white/10 text-gray-500"
              }`}>
                {done ? "✓" : i + 1}
              </div>
              {i < 2 && (
                <div className={`w-8 h-px transition-all duration-300 ${done ? "bg-blue-600" : "bg-white/10"}`} />
              )}
            </div>
          );
        })}
      </div>

      <AnimatePresence mode="wait">

        {/* ══════ PASO 1: FORMULARIO ══════ */}
        {step === "form" && (
          <motion.div
            key="form"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.25 }}
          >
            <h2
              className="text-4xl font-black mb-2 uppercase text-center tracking-widest"
              style={{ fontFamily: "BurbankBig" }}
            >
              {t("account", "register")}
            </h2>
            <p className="text-gray-500 text-sm text-center mb-8">
              Crea tu cuenta para comprar más rápido
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-4 backdrop-blur-xl">

              {/* Error global */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    key={error}
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 flex items-start gap-2"
                  >
                    <span className="mt-0.5 shrink-0">⚠️</span>
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Usuario */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase tracking-wider pl-1">
                  {t("account", "username")}
                </label>
                <input
                  placeholder="gamer123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/40 px-4 py-3 rounded-lg outline-none border border-white/10 focus:border-blue-500 transition placeholder-gray-600 text-white"
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase tracking-wider pl-1">
                  {t("account", "email")}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-black/40 px-4 py-3 pr-10 rounded-lg outline-none border border-white/10 focus:border-blue-500 transition placeholder-gray-600 text-white"
                  />
                  {email.includes("@") && email.includes(".") && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 text-sm">✓</span>
                  )}
                </div>
                {email.includes("@") && email.includes(".") && (
                  <p className="text-xs text-green-400 pl-1 flex items-center gap-1">
                    <span>✓</span> Email verificado correctamente
                  </p>
                )}
              </div>

              {/* Teléfono */}
              <div className="space-y-1">
                <label className="text-xs text-gray-400 uppercase tracking-wider pl-1">
                  Número de celular
                </label>
                <div className="flex">
                  <CountrySelect selected={country} onChange={setCountry} />
                  <input
                    type="tel"
                    inputMode="numeric"
                    placeholder={`Ej: ${"9".repeat(country.len - 1)}0`}
                    value={phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                    className="flex-1 bg-black/40 px-4 py-3 rounded-r-lg outline-none border border-white/10 border-l-0 focus:border-blue-500 transition placeholder-gray-600 text-white"
                  />
                </div>
                {phone.trim() && (
                  <p className="text-xs text-gray-500 pl-1 pt-0.5">
                    Número completo:{" "}
                    <span className="text-blue-400 font-semibold">{country.dial} {phone}</span>
                  </p>
                )}
              </div>

              {/* Contraseña + Confirmar en grid */}
              <div className="grid grid-cols-2 gap-3">
                {/* Contraseña */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase tracking-wider pl-1">
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPass ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPassFocused(true)}
                      onBlur={() => setPassFocused(false)}
                      className="w-full bg-black/40 px-4 py-3 pr-10 rounded-lg outline-none border border-white/10 focus:border-blue-500 transition placeholder-gray-600 text-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition cursor-pointer"
                    >
                      {showPass ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirmar contraseña */}
                <div className="space-y-1">
                  <label className="text-xs text-gray-400 uppercase tracking-wider pl-1">
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showConf ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                      className={`w-full bg-black/40 px-4 py-3 pr-10 rounded-lg outline-none border transition placeholder-gray-600 text-white ${
                        confirm.length > 0
                          ? passMatch
                            ? "border-green-500/60 focus:border-green-500"
                            : "border-red-500/60 focus:border-red-500"
                          : "border-white/10 focus:border-blue-500"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConf(!showConf)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition cursor-pointer"
                    >
                      {showConf ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Requisitos de contraseña */}
              <AnimatePresence>
                {(passFocused || password.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="bg-black/30 border border-white/8 rounded-xl px-4 py-3">
                      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                        <RuleItem ok={rules.minLength} label="Al menos 6 caracteres" />
                        <RuleItem ok={rules.hasUpper}  label="Una mayúscula (A-Z)" />
                        <RuleItem ok={rules.hasLower}  label="Una minúscula (a-z)" />
                        <RuleItem ok={rules.hasNumber} label="Un número (0-9)" />
                        <RuleItem ok={rules.hasSymbol} label="Un símbolo (!@#$%...)" />
                        {confirm.length > 0 && (
                          <RuleItem ok={passMatch} label="Las contraseñas coinciden" />
                        )}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Match indicator debajo del confirm */}
              {confirm.length > 0 && !passFocused && (
                <p className={`text-xs pl-1 flex items-center gap-1 -mt-1 ${passMatch ? "text-green-400" : "text-red-400"}`}>
                  {passMatch ? "✓ Las contraseñas coinciden" : "✗ Las contraseñas no coinciden"}
                </p>
              )}

              {/* Botón continuar */}
              <button
                onClick={handleSendCode}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-3.5 rounded-xl font-semibold transition cursor-pointer active:scale-[0.98] mt-2 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando código...
                  </>
                ) : "Continuar →"}
              </button>

              <p className="text-sm text-center text-gray-400 pt-1">
                {t("account", "haveAccount")}{" "}
                <Link
                  to="/mi-cuenta/login"
                  className="text-blue-400 hover:text-blue-300 transition cursor-pointer font-medium"
                >
                  {t("account", "signIn")}
                </Link>
              </p>
            </div>
          </motion.div>
        )}

        {/* ══════ PASO 2: OTP ══════ */}
        {step === "verify" && (
          <motion.div
            key="verify"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <h2
              className="text-4xl font-black mb-2 uppercase text-center tracking-widest"
              style={{ fontFamily: "BurbankBig" }}
            >
              Verifica tu cuenta
            </h2>
            <p className="text-gray-400 text-sm text-center mb-8 leading-relaxed">
              Enviamos un código de 6 dígitos a<br />
              <span className="text-blue-400 font-semibold">{email}</span>
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl space-y-6">

              <AnimatePresence>
                {error && (
                  <motion.div
                    key={error}
                    initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-3 flex items-start gap-2"
                  >
                    <span>⚠️</span>
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-3 justify-center" onPaste={handleOtpPaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`w-12 h-14 text-center text-2xl font-black rounded-xl border-2 outline-none transition-all duration-200 bg-black/50 ${
                      digit
                        ? "border-blue-500 text-white shadow-lg shadow-blue-500/20"
                        : "border-white/10 text-white focus:border-blue-500/70"
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-center text-gray-500">
                Puedes pegar el código directamente
              </p>

              <button
                onClick={handleVerify}
                disabled={loading || otp.join("").length < 6}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 py-3.5 rounded-xl font-semibold transition cursor-pointer active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Verificando...
                  </>
                ) : "Verificar y crear cuenta"}
              </button>

              <div className="flex items-center justify-between text-sm pt-1">
                <button
                  onClick={() => { setStep("form"); setError(""); setOtp(["","","","","",""]); isRegistering.current = false; }}
                  className="text-gray-500 hover:text-gray-300 transition cursor-pointer"
                >
                  ← Cambiar datos
                </button>
                <button
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || loading}
                  className="text-blue-400 hover:text-blue-300 disabled:text-gray-600 disabled:cursor-not-allowed transition cursor-pointer"
                >
                  {resendCooldown > 0 ? `Reenviar en ${resendCooldown}s` : "Reenviar código"}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ══════ PASO 3: ÉXITO ══════ */}
        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, type: "spring" }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
              className="w-24 h-24 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl text-green-400 font-black"
            >
              ✓
            </motion.div>
            <h2
              className="text-4xl font-black mb-3 uppercase tracking-widest"
              style={{ fontFamily: "BurbankBig" }}
            >
              ¡Bienvenido!
            </h2>
            <p className="text-gray-400 text-base mb-2">
              Tu cuenta fue creada con éxito,{" "}
              <span className="text-blue-400 font-semibold">{username}</span>
            </p>
            <p className="text-gray-600 text-sm">Redirigiendo a tu cuenta...</p>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
};

export default AccountRegister;