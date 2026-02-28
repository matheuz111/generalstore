// src/components/layout/CategoryShell.tsx
import type { ReactNode } from "react";
import { useState, useEffect } from "react";

interface CategoryShellProps {
  title:       string;
  subtitle?:   ReactNode;
  children:    ReactNode;
  isFortnite?: boolean; // activa el header especial con fecha + countdown
}

/* ── Días en español ── */
const DAYS_ES   = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const MONTHS_ES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

/* ── Próximo reset: 7 PM EST (= UTC-5 en EST, UTC-4 en EDT) ──
   Detectamos el offset real de New_York vía Intl              */
function getNextReset(): Date {
  const now     = new Date();
  // construimos 7 PM hora New York de HOY
  const nyStr   = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
  // nyStr → "MM/DD/YYYY"
  const [m, d, y] = nyStr.split("/");
  // 19:00 = 7 PM
  const resetToday = new Date(`${y}-${m}-${d}T19:00:00`);
  // convertir a UTC usando el offset real de New York
  const nyOffset  = getNewYorkOffsetMs(resetToday);
  const resetUTC  = new Date(resetToday.getTime() - nyOffset);
  // si ya pasó hoy, el próximo es mañana
  if (resetUTC <= now) resetUTC.setUTCDate(resetUTC.getUTCDate() + 1);
  return resetUTC;
}

function getNewYorkOffsetMs(date: Date): number {
  // Intl nos da la hora local NY; restamos para obtener offset
  const nyParts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", second: "2-digit",
    hour12: false,
  }).formatToParts(date);
  const get = (t: string) => parseInt(nyParts.find(p => p.type === t)!.value);
  const nyDate = new Date(Date.UTC(get("year"), get("month")-1, get("day"), get("hour"), get("minute"), get("second")));
  return date.getTime() - nyDate.getTime() + date.getTime() - date.getTime();
}

/* más simple: calculamos el offset comparando con UTC */
function nyOffsetMs(d: Date) {
  const utcStr = d.toLocaleString("en-US", { timeZone: "UTC" });
  const nyStr  = d.toLocaleString("en-US", { timeZone: "America/New_York" });
  return (new Date(utcStr).getTime() - new Date(nyStr).getTime());
}

function getNextResetFixed(): Date {
  const now = new Date();
  const offset = nyOffsetMs(now); // ms que NY está detrás de UTC (p.ej. 18000000 = 5h)
  // hora NY actual en ms desde epoch
  const nowNY  = new Date(now.getTime() - offset);
  // reset de hoy a 19:00 NY
  const resetNY = new Date(nowNY);
  resetNY.setHours(19, 0, 0, 0);
  // si ya pasó, mañana
  if (resetNY <= nowNY) resetNY.setDate(resetNY.getDate() + 1);
  // volver a UTC
  return new Date(resetNY.getTime() + offset);
}

/* ── Fecha actual en hora NY ── */
function getNYDate(): { dayName: string; day: number; month: string; year: number } {
  const now    = new Date();
  const offset = nyOffsetMs(now);
  const nowNY  = new Date(now.getTime() - offset);
  return {
    dayName: DAYS_ES[nowNY.getDay()],
    day:     nowNY.getDate(),
    month:   MONTHS_ES[nowNY.getMonth()],
    year:    nowNY.getFullYear(),
  };
}

/* ── Pad ── */
const pad = (n: number) => String(n).padStart(2, "0");

/* ── Componente header de Fortnite ── */
const FortniteHeader = ({ title }: { title: string }) => {
  const [countdown, setCountdown] = useState("");
  const [dateInfo,  setDateInfo]  = useState(getNYDate());

  useEffect(() => {
    const tick = () => {
      setDateInfo(getNYDate());
      const diff = getNextResetFixed().getTime() - Date.now();
      if (diff <= 0) { setCountdown("¡Tienda actualizada!"); return; }
      const h = Math.floor(diff / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      const s = Math.floor((diff % 60_000) / 1_000);
      setCountdown(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };
    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="text-center mb-14">
      <h1
        className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-3"
        style={{ fontFamily: "BurbankBig" }}
      >
        {title}
      </h1>

      {/* Fecha */}
      <p
        className="text-blue-400 font-black uppercase tracking-widest text-xs md:text-sm mb-3"
        style={{ fontFamily: "BurbankBig" }}
      >
        {dateInfo.dayName} {dateInfo.day} de {dateInfo.month} de {dateInfo.year}
      </p>

      {/* Countdown */}
      <div className="flex items-center justify-center gap-2 text-gray-300">
        <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
        <span className="text-sm" style={{ fontFamily: "BurbankSmall" }}>
          Nuevos artículos en{" "}
          <span className="font-black text-white text-base tabular-nums">{countdown}</span>
        </span>
      </div>

      <div className="mt-5 w-24 h-1 bg-blue-500 mx-auto rounded-full" />
    </div>
  );
};

/* ── Shell principal ── */
const CategoryShell = ({ title, subtitle, children, isFortnite = false }: CategoryShellProps) => {
  return (
    <div className="min-h-screen text-white bg-[#18181C]">
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-16">

        {isFortnite ? (
          <FortniteHeader title={title} />
        ) : (
          <div className="text-center mb-14">
            <h1
              className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-4"
              style={{ fontFamily: "BurbankBig" }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base" style={{ fontFamily: "BurbankSmall" }}>
                {subtitle}
              </p>
            )}
            <div className="mt-6 w-24 h-1 bg-blue-500 mx-auto rounded-full" />
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default CategoryShell;