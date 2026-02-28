// src/pages/Fortnite.tsx
import { useEffect, useState, useRef } from "react";
import { fetchShopDual } from "../lib/fortniteApi";
import CategoryShell from "../components/layout/CategoryShell";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { useLang } from "../context/LangContext";

/* ── Countdown hasta reset de tienda (medianoche UTC = 7pm EST) ── */
function useShopResetCountdown() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    function calc() {
      const now   = new Date();
      const reset = new Date();
      reset.setUTCHours(0, 0, 0, 0);
      if (reset.getTime() <= now.getTime()) reset.setUTCDate(reset.getUTCDate() + 1);
      const diff    = reset.getTime() - now.getTime();
      const hours   = Math.floor(diff / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000) / 60_000);
      const seconds = Math.floor((diff % 60_000) / 1_000);
      const pad = (n: number) => String(n).padStart(2, "0");
      setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    }
    calc();
    const id = setInterval(calc, 1_000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

/* ── Header estilo Fortnite con fecha y countdown ── */
const FortniteShopHeader = () => {
  const countdown = useShopResetCountdown();
  const { lang }  = useLang();

  const now = new Date();
  const dateStr = now.toLocaleDateString(lang === "EN" ? "en-US" : "es-ES", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
  }).toUpperCase();

  return (
    <div className="text-center py-4 pb-10">
      <h1
        className="text-3xl md:text-5xl font-black uppercase italic text-white drop-shadow-lg"
        style={{
          fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif",
          textShadow: "2px 2px 0px rgba(0,0,0,0.8), 0 0 30px rgba(0,150,255,0.2)",
        }}
      >
        {lang === "EN" ? "FORTNITE ITEM SHOP" : "TIENDA DE ARTÍCULOS DE FORTNITE"}
      </h1>
      <p
        className="text-cyan-400 font-black uppercase text-xs md:text-sm tracking-widest mt-2"
        style={{ fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif" }}
      >
        {dateStr}
      </p>
      <p className="text-white font-bold text-lg md:text-2xl mt-3 tracking-wide">
        {lang === "EN" ? "New items in" : "Nuevos artículos en"}{" "}
        <span className="font-black tabular-nums">{countdown}</span>
      </p>
    </div>
  );
};

/* ── Countdown por item (cuándo expira) ── */
function useCountdown(outDate: string) {
  const [timeLeft, setTimeLeft] = useState("");
  const { t } = useLang();

  useEffect(() => {
    function calc() {
      const diff = new Date(outDate).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft(t("fortnite", "expired")); return; }

      const days    = Math.floor(diff / 86_400_000);
      const hours   = Math.floor((diff % 86_400_000) / 3_600_000);
      const minutes = Math.floor((diff % 3_600_000)  / 60_000);
      const seconds = Math.floor((diff % 60_000)     / 1_000);
      const pad     = (n: number) => String(n).padStart(2, "0");

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
  const countdown  = useCountdown(outDate);
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

/* ── Shop Card ── */
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
          {t("fortnite", "bundle")}
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
        {t("fortnite", "addToCart")}
      </button>
    </div>
  );
};

/* ── Filter Drawer — panel lateral sin overlay oscuro ── */
const FilterDrawer = ({
  sections, activeId, onSelect,
}: {
  sections: any[]; activeId: string; onSelect: (id: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const { t }           = useLang();
  const drawerRef       = useRef<HTMLDivElement>(null);

  /* Cierra al hacer click fuera del panel */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div
      ref={drawerRef}
      className="fixed left-0 top-1/2 -translate-y-1/2 z-40 flex items-stretch"
    >
      {/* ── Lengüeta del botón ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex flex-col items-center gap-1.5 bg-[#0d1225] border border-white/20 hover:border-blue-400/60 text-white/70 hover:text-white px-2 py-4 rounded-r-2xl shadow-xl transition-all duration-200 cursor-pointer shrink-0"
        title={t("fortnite", "filterBtn")}
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h6M13 16h4" />
        </svg>
        <span
          className="text-[10px] font-black uppercase tracking-widest"
          style={{ writingMode: "vertical-rl", fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif" }}
        >
          {t("fortnite", "filterBtn")}
        </span>
        <svg
          className={`w-3 h-3 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* ── Panel desplegable — NO hay overlay, solo el panel mismo ── */}
      <div
        className={`
          transition-all duration-300 ease-in-out overflow-hidden
          ${open ? "w-60 opacity-100" : "w-0 opacity-0 pointer-events-none"}
        `}
      >
        <div className="w-60 bg-[#0b1022]/98 border border-white/10 border-l-0 rounded-r-2xl shadow-2xl flex flex-col"
          style={{ maxHeight: "65vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0">
            <span
              className="text-white font-black uppercase text-xs tracking-widest"
              style={{ fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif" }}
            >
              {t("fortnite", "filterNav")}
            </span>
            <button
              onClick={() => setOpen(false)}
              className="text-white/30 hover:text-white transition cursor-pointer ml-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Lista de secciones */}
          <nav className="overflow-y-auto flex-1">
            {sections.map((section) => {
              const isActive = section.id === activeId;
              return (
                <button
                  key={section.id}
                  onClick={() => { onSelect(section.id); setOpen(false); }}
                  className={`
                    w-full text-left px-4 py-3 text-xs font-black uppercase tracking-wide
                    transition-colors duration-150 flex items-center justify-between gap-2 cursor-pointer
                    border-b border-white/5 last:border-0
                    ${isActive
                      ? "bg-white/10 text-white"
                      : "text-white/55 hover:text-white hover:bg-white/6"
                    }
                  `}
                  style={{ fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif" }}
                >
                  <span className="truncate leading-tight">{section.titleEs}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const Fortnite = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string>("");

  const { formatPrice, convertVbucks } = useCurrency();
  const { addToCart }                  = useCart();
  const { t, lang }                    = useLang();

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const loadShop = () => {
    setLoading(true);
    setError(null);
    fetchShopDual(lang === "EN" ? "EN" : "ES")
      .then((data) => { setSections(data); setActiveId(data[0]?.id || ""); })
      .catch(err  => { console.error(err); setError(err.message); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadShop(); }, [lang]);

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
          {t("fortnite", "errorTitle")}
        </h2>
        <p className="text-white/50 text-sm max-w-sm">
          {error === "503" ? t("fortnite", "errorServers") : `${t("fortnite", "errorGeneric")} (${error})`}
        </p>
        <button
          onClick={loadShop}
          className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase px-6 py-3 rounded-xl transition active:scale-95"
          style={{ fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif" }}
        >
          {t("fortnite", "retry")}
        </button>
      </div>
    </CategoryShell>
  );

  return (
    <CategoryShell title="" subtitle="">

      {/* ── Header con fecha y countdown ── */}
      <FortniteShopHeader />

      {/* ── Filter lateral sin overlay ── */}
      <FilterDrawer sections={sections} activeId={activeId} onSelect={handleSelect} />

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