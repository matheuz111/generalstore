// src/components/checkout/PaymentMethods.tsx
import { useState } from "react";

interface Method {
  id:       string;
  label:    string;
  subtitle: string;
  icon:     React.ReactNode;
  badge?:   string;
}

/* ══════════════════════════════════════════
   🖼️  LOGOS — pon tus imágenes en /public/images/
   y ajusta las rutas aquí abajo
══════════════════════════════════════════ */
const LOGOS: Record<string, string> = {
  yape:    "/images/logo-yape.png",
  plin:    "/images/logo-plin.png",
  bcp:     "/images/logo-bcp.png",
  binance: "/images/logo-binance.png",
};

/* Fallback si la imagen no carga */
const MethodIcon = ({ id, label }: { id: string; label: string }) => (
  <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white/10 flex items-center justify-center">
    <img
      src={LOGOS[id]}
      alt={label}
      className="w-full h-full object-contain"
      onError={(e) => {
        const img = e.target as HTMLImageElement;
        img.style.display = "none";
        const parent = img.parentElement;
        if (parent) {
          parent.style.background = "rgba(255,255,255,0.08)";
          parent.innerHTML = `<span style="font-size:9px;font-weight:900;color:rgba(255,255,255,0.4);text-transform:uppercase;text-align:center;padding:4px">${label}</span>`;
        }
      }}
    />
  </div>
);

const METHODS: Method[] = [
  {
    id:       "yape",
    label:    "YAPE",
    subtitle: "Yape QR",
    badge:    "PEN",
    icon:     <MethodIcon id="yape" label="YAPE" />,
  },
  {
    id:       "plin",
    label:    "PLIN",
    subtitle: "Plin – izipay QR",
    badge:    "PEN",
    icon:     <MethodIcon id="plin" label="PLIN" />,
  },
  {
    id:       "bcp",
    label:    "BCP",
    subtitle: "Transferencia Bancaria",
    icon:     <MethodIcon id="bcp" label="BCP" />,
  },
  {
    id:       "binance",
    label:    "Binance Pay",
    subtitle: "Criptomonedas (USDT)",
    badge:    "USD",
    icon:     <MethodIcon id="binance" label="Binance" />,
  },
];

interface Props {
  selected: string;
  onSelect: (id: string) => void;
}

const PaymentMethods = ({ selected, onSelect }: Props) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {METHODS.map((method) => {
        const isActive = selected === method.id;
        return (
          <button
            key={method.id}
            onClick={() => onSelect(method.id)}
            className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer active:scale-95 ${
              isActive
                ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20"
                : "border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/8"
            }`}
          >
            {/* Badge PEN / USD */}
            {method.badge && (
              <span className={`absolute top-2 right-2 text-[9px] font-black px-1.5 py-0.5 rounded-md uppercase tracking-wider ${
                method.badge === "USD" ? "bg-yellow-400/20 text-yellow-400" : "bg-green-400/20 text-green-400"
              }`}>
                {method.badge}
              </span>
            )}

            {/* Check de selección */}
            {isActive && (
              <span className="absolute top-2 left-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            )}

            {method.icon}

            <div className="text-center">
              <p className={`font-black text-xs uppercase tracking-wide leading-tight ${isActive ? "text-white" : "text-white/70"}`}>
                {method.label}
              </p>
              <p className="text-white/40 text-[10px] leading-tight mt-0.5">{method.subtitle}</p>
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default PaymentMethods;