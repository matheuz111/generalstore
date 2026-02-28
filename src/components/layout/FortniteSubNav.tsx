// src/components/layout/FortniteSubNav.tsx
import { useNavigate, useLocation } from "react-router-dom";
import { useLang } from "../../context/LangContext";

const FNAV = [
  {
    to: "/fortnite",
    exact: true,
    labelKey: "navShop",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
        <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96C5 16.1 6.9 18 9 18h12v-2H9.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.45 5H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
    ),
  },
  {
    to: "/fortnite/agregar-bots",
    exact: false,
    labelKey: "navBots",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
  },
  {
    to: "/fortnite/recarga-pavos",
    exact: false,
    labelKey: "navPavos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 shrink-0">
        <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.25"/>
        <text x="6" y="16" fontSize="11" fill="currentColor" fontWeight="900">V</text>
      </svg>
    ),
  },
  {
    to: "/fortnite/paquetes",
    exact: false,
    labelKey: "navPacks",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
        <path d="M20 6h-2.18c.07-.44.18-.86.18-1 0-2.21-1.79-4-4-4s-4 1.79-4 4c0 .14.11.56.18 1H8c-1.11 0-2 .89-2 2v12c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6-3c1.1 0 2 .9 2 2 0 .14-.11.56-.18 1h-3.64c-.07-.44-.18-.86-.18-1 0-1.1.9-2 2-2z"/>
      </svg>
    ),
  },
  {
    to: "/fortnite/pase-de-batalla",
    exact: false,
    labelKey: "navBP",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm4.24 16L12 15.45 7.77 18l1.12-4.81-3.73-3.23 4.92-.42L12 5l1.92 4.53 4.92.42-3.73 3.23L16.23 18z"/>
      </svg>
    ),
  },
];

const FortniteSubNav = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { t }     = useLang();

  const isActive = (to: string, exact: boolean) =>
    exact ? location.pathname === to : location.pathname.startsWith(to);

  return (
    <div className="w-full bg-[#080d1a]/90 backdrop-blur-xl border-b border-white/8">
      <div className="max-w-7xl mx-auto px-6 flex items-center gap-0 overflow-x-auto scrollbar-hide">
        {FNAV.map((btn) => {
          const active = isActive(btn.to, btn.exact);
          return (
            <button
              key={btn.to}
              onClick={() => navigate(btn.to)}
              className={`
                relative flex items-center gap-2 px-5 py-3.5 text-xs font-black uppercase tracking-wider
                whitespace-nowrap transition-all duration-200 cursor-pointer shrink-0 group
                ${active ? "text-white" : "text-white/40 hover:text-white/75"}
              `}
              style={{ fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif" }}
            >
              <span className={`transition-colors duration-200 ${active ? "text-blue-400" : "group-hover:text-white/60"}`}>
                {btn.icon}
              </span>
              <span>{t("fortnite", btn.labelKey)}</span>

              {/* línea activa */}
              {active && (
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-blue-400"
                  style={{ boxShadow: "0 0 8px rgba(96,165,250,0.7)" }}
                />
              )}

              {/* línea hover */}
              {!active && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-white/0 group-hover:bg-white/20 transition-colors duration-200" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FortniteSubNav;