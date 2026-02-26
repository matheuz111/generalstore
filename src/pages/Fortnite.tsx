// src/pages/Fortnite.tsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { fetchShopDual } from "../lib/fortniteApi";
import CategoryShell from "../components/layout/CategoryShell";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { useLang } from "../context/LangContext";

/* ------------------------------------------------------------------ */
/* BOTONES DE NAVEGACIÓN FORTNITE                                      */
/* ------------------------------------------------------------------ */
const FNAV_BUTTONS = [
  {
    to: "/fortnite/agregar-bots",
    label: "Agregar Bots",
    bg: "#1a6bb5",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        <circle cx="19" cy="8" r="3" fill="#4ade80"/>
        <text x="17.2" y="9.5" fontSize="4" fill="white" fontWeight="bold">+</text>
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
          <span >{btn.label}</span>
        </button>
      ))}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* COUNTDOWN                                                            */
/* ------------------------------------------------------------------ */
function useCountdown(outDate: string) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function calc() {
      const diff = new Date(outDate).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Expirado"); return; }

      const days    = Math.floor(diff / 86_400_000);
      const hours   = Math.floor((diff % 86_400_000) / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000)  / 60_000);
      const seconds = Math.floor((diff % 60_000)     / 1_000);
      const pad = (n: number) => String(n).padStart(2, "0");

      if (days > 0)
        setTimeLeft(`${days}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`);
      else if (hours > 0)
        setTimeLeft(`${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`);
      else
        setTimeLeft(`${pad(minutes)}m ${pad(seconds)}s`);
    }
    calc();
    const id = setInterval(calc, 1_000);
    return () => clearInterval(id);
  }, [outDate]);

  return timeLeft;
}

const SectionCountdown = ({ outDate }: { outDate: string }) => {
  const countdown = useCountdown(outDate);
  const colorClass =
    countdown.includes("m") && !countdown.includes("h") && !countdown.includes("d")
      ? "bg-red-500/20 text-red-400 border-red-500/40"
      : countdown.includes("h") && !countdown.includes("d")
      ? "bg-orange-500/20 text-orange-400 border-orange-500/40"
      : "bg-white/10 text-white/60 border-white/20";

  return (
    <div className={`flex items-center gap-1.5 border rounded-full px-3 py-1 text-xs font-bold ${colorClass}`}>
      <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
      </svg>
      {countdown}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* SHOP CARD                                                            */
/* ------------------------------------------------------------------ */
const ShopCard = ({ item, formatPrice, convertVbucks, addToCart, t }: any) => {
  const priceValue = convertVbucks(item.vbucks);
  const hasVbucks  = item.vbucks > 0;

  return (
    <div
      className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-blue-500/50 transition group flex flex-col h-full relative"
      style={{ background: item.bgGradient }}
    >
      {item.banner && (
        <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-black text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow">
          {item.banner}
        </div>
      )}
      {item.isBundle && (
        <div className="absolute top-2 right-2 z-10 bg-purple-600 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow">
          Bundle
        </div>
      )}
      <div className="relative overflow-hidden rounded-xl mb-4">
        <img
          src={item.image} alt={item.name}
          className="w-full aspect-square object-contain transform group-hover:scale-110 transition duration-500"
        />
      </div>
      <h3 className="font-bold text-sm md:text-base leading-tight min-h-[40px] mb-2">
        {item.name}
      </h3>
      <div className="mt-auto space-y-1">
        {hasVbucks && (
          <div className="flex items-center gap-1.5">
            {item.vbuckIcon
              ? <img src={item.vbuckIcon} alt="V-Bucks" className="w-4 h-4 object-contain" />
              : <span className="text-yellow-400 text-xs font-black">⬡</span>
            }
            <span className="text-yellow-300 font-black text-sm tracking-tight">
              {item.vbucks.toLocaleString()}
            </span>
            {item.originalVbucks && (
              <span className="text-white/40 text-xs line-through ml-1">
                {item.originalVbucks.toLocaleString()}
              </span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <p className="text-blue-300 font-black text-xl tracking-tight">
              {hasVbucks ? formatPrice(item.vbucks) : "—"}
            </p>
            {item.originalSoles && (
              <span className="text-white/40 text-xs line-through">
                {formatPrice(item.originalVbucks)}
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase font-bold opacity-50 bg-black/20 px-2 py-0.5 rounded">
            {item.rarityDisplay || item.rarity}
          </span>
        </div>
      </div>
      <button
        onClick={() => addToCart({ id: item.offerId, name: item.name, price: priceValue, image: item.image, quantity: 1 })}
        disabled={!hasVbucks}
        className="w-full mt-4 bg-white/10 hover:bg-white/20 disabled:opacity-40 disabled:cursor-not-allowed py-2 rounded-xl text-xs font-bold uppercase transition active:scale-95"
      >
        {t("product", "addToCart")}
      </button>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* FILTER DRAWER — flota sobre el contenido, no lo empuja              */
/* ------------------------------------------------------------------ */
const FilterDrawer = ({
  sections,
  activeId,
  onSelect,
}: {
  sections: any[];
  activeId: string;
  onSelect: (id: string) => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Botón disparador — fijo en el lado izquierdo */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`
          fixed left-0 top-1/2 -translate-y-1/2 z-40
          flex flex-col items-center gap-1.5
          bg-[#0d1225] border border-white/20 hover:border-blue-400/60
          text-white/70 hover:text-white
          px-2 py-4 rounded-r-2xl shadow-xl
          transition-all duration-200
        `}
        title="Filtros"
      >
        {/* Ícono filtro */}
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h6M13 16h4" />
        </svg>
        {/* Texto vertical */}
        <span
          className="text-[10px] font-black uppercase tracking-widest"
          style={{
            writingMode: "vertical-rl",
            fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif",
          }}
        >
          Filtros
        </span>
        {/* Indicador de apertura */}
        <svg
          className={`w-3 h-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Overlay al abrir */}
      <div
        className={`fixed inset-0 z-40 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ background: "rgba(0,0,0,0.5)" }}
        onClick={() => setOpen(false)}
      />

      {/* Panel drawer — desliza desde la izquierda, flota sobre todo */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50
          bg-[#0a0f1e] border-r border-white/10
          flex flex-col pt-6 pb-8
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 mb-4">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h6M13 16h4" />
            </svg>
            <span
              className="text-white font-black uppercase text-sm tracking-widest"
              style={{ fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif" }}
            >
              Navegación
            </span>
          </div>
          <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white transition">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lista */}
        <nav className="overflow-y-auto flex-1 px-2 space-y-1">
          {sections.map((section) => {
            const isActive = section.id === activeId;
            return (
              <button
                key={section.id}
                onClick={() => { onSelect(section.id); setOpen(false); }}
                className={`
                  w-full text-left px-4 py-3 rounded-xl font-black uppercase text-sm tracking-wide
                  transition-all duration-200 flex items-center justify-between gap-2
                  ${isActive
                    ? "bg-white/15 text-white border border-white/30"
                    : "text-white/60 hover:text-white hover:bg-white/8"
                  }
                `}
                style={{ fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif" }}
              >
                <span className="leading-tight">{section.titleEs}</span>
                {isActive && <span className="w-2 h-2 rounded-full bg-blue-400 shrink-0 animate-pulse" />}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

/* ------------------------------------------------------------------ */
/* MAIN PAGE                                                            */
/* ------------------------------------------------------------------ */
const Fortnite = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>("");

  const { formatPrice, convertVbucks } = useCurrency();
  const { addToCart } = useCart();
  const { t, lang }   = useLang();

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchShopDual(lang === "EN" ? "EN" : "ES")
      .then((data) => { setSections(data); setActiveId(data[0]?.id || ""); })
      .catch(err => {
        console.error("Error cargando tienda Fortnite:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [lang]);

  // Scroll spy
  useEffect(() => {
    if (!sections.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 }
    );
    for (const id of Object.keys(sectionRefs.current)) {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sections]);

  const handleSelect = (id: string) => {
    setActiveId(id);
    const el = sectionRefs.current[id];
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) return (
    <div className="text-white text-center py-20 font-bold text-lg animate-pulse">
      {t("fortnite", "loading")}
    </div>
  );

  if (error) return (
    <CategoryShell title="Fortnite" subtitle="">
      <div className="flex flex-col items-center justify-center py-24 gap-6 text-center">
        <div className="text-6xl">⚠️</div>
        <h2
          className="text-2xl font-black uppercase italic text-white"
          style={{ fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif" }}
        >
          Tienda no disponible
        </h2>
        <p className="text-white/50 text-sm max-w-sm">
          {error === "503"
            ? "Los servidores de Fortnite están temporalmente caídos. Intenta de nuevo en unos minutos."
            : `Error al conectar con la API (${error}). Revisa tu conexión e intenta de nuevo.`
          }
        </p>
        <button
          onClick={() => { setLoading(true); setError(null); fetchShopDual(lang === "EN" ? "EN" : "ES").then((data) => { setSections(data); setActiveId(data[0]?.id || ""); }).catch(err => setError(err.message)).finally(() => setLoading(false)); }}
          className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase px-6 py-3 rounded-xl transition active:scale-95"
          style={{ fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif" }}
        >
          🔄 Reintentar
        </button>
      </div>
    </CategoryShell>
  );

  return (
    <CategoryShell title="Fortnite" subtitle={t("fortnite", "subtitle")}>

      {/* Botones de navegación */}
      <FortniteNavButtons />

      {/* Panel flotante — NO está en el flujo del documento */}
      <FilterDrawer
        sections={sections}
        activeId={activeId}
        onSelect={handleSelect}
      />

      {/* Contenido ocupa el 100% del ancho, sin cambios */}
      <div className="space-y-12">
        {sections.map((section) => {
          const sectionOutDate = section.items[0]?.outDate;
          return (
            <div
              key={section.id}
              id={section.id}
              ref={(el) => { sectionRefs.current[section.id] = el; }}
            >
              <div className="flex items-center gap-4 mb-6">
                <h2
                  className="text-3xl md:text-4xl font-black uppercase italic text-white tracking-wide drop-shadow-lg"
                  style={{
                    fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif",
                    WebkitTextStroke: "1px rgba(0,180,255,0.6)",
                    textShadow: "0 0 20px rgba(0,150,255,0.4), 2px 2px 0px rgba(0,0,0,0.8)",
                  }}
                >
                  {section.titleEs}
                </h2>
                {sectionOutDate && <SectionCountdown outDate={sectionOutDate} />}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {section.items.map((item: any) => (
                  <ShopCard
                    key={item.offerId}
                    item={item}
                    formatPrice={formatPrice}
                    convertVbucks={convertVbucks}
                    addToCart={addToCart}
                    t={t}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </CategoryShell>
  );
};

export default Fortnite;