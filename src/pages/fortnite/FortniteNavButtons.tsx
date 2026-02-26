// src/pages/fortnite/FortniteNavButtons.tsx
import { useNavigate } from "react-router-dom";

const FNAV_BUTTONS = [
  {
    to: "/fortnite/agregar-bots",
    label: "Agregar Bots",
    bg: "#1a6bb5",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
  },
  {
    to: "/fortnite/recarga-pavos",
    label: "Recarga de Pavos",
    bg: "#7c3aed",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7">
        <circle cx="12" cy="12" r="10" fill="#a78bfa" opacity="0.3"/>
        <text x="6" y="16" fontSize="11" fill="white" fontWeight="black">V</text>
        <circle cx="15" cy="9" r="4" fill="#fbbf24"/>
        <text x="13" y="11.5" fontSize="6" fill="white" fontWeight="bold">+</text>
      </svg>
    ),
  },
  {
    to: "/fortnite/paquetes",
    label: "Paquetes de Fortnite",
    bg: "#0ea5e9",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M20 6h-2.18c.07-.44.18-.86.18-1 0-2.21-1.79-4-4-4s-4 1.79-4 4c0 .14.11.56.18 1H8c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6-3c1.1 0 2 .9 2 2 0 .14-.11.56-.18 1h-3.64c-.07-.44-.18-.86-.18-1 0-1.1.9-2 2-2zm0 10l-4-4 1.41-1.41L14 10.17l6.59-6.59L22 5l-8 8z"/>
      </svg>
    ),
  },
  {
    to: "/fortnite/pase-de-batalla",
    label: "Pase de Batalla",
    bg: "#d97706",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/>
      </svg>
    ),
  },
  {
    to: "/fortnite",
    label: "Tienda de Fortnite",
    bg: "#0d47a1",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.9 18 9 18h12v-2H9.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.45 5H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
    ),
  },
];

const FortniteNavButtons = () => {
  const navigate = useNavigate();
  return (
    <div className="flex justify-center gap-3 flex-wrap mb-10">
      {FNAV_BUTTONS.map((btn) => (
        <button
          key={btn.to}
          onClick={() => navigate(btn.to)}
          className="flex flex-col items-center justify-center gap-2 w-24 h-24 rounded-2xl border-2 border-black/30 shadow-lg hover:scale-105 hover:brightness-110 active:scale-95 transition-all duration-200 text-white font-black text-[11px] uppercase text-center leading-tight"
          style={{
            background: btn.bg,
            fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif",
            boxShadow: `0 4px 20px ${btn.bg}55`,
          }}
        >
          {btn.icon}
          <span>{btn.label}</span>
        </button>
      ))}
    </div>
  );
};

export default FortniteNavButtons;