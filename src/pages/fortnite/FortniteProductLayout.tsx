// src/pages/fortnite/FortniteProductLayout.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryShell from "../../components/layout/CategoryShell";
import { useCart } from "../../context/CartContext";
import { useLang } from "../../context/LangContext";
import FortniteNavButtons from "./FortniteNavButtons";

export type FnProduct = {
  id:       string;
  name:     string;
  desc:     string;
  pricePEN: number;
  image:    string;   // "/images/fortnite/..." — vacío = placeholder
};

/* ─── Tasas de conversión ─── */
const RATES: Record<string, number> = { PEN: 1, USD: 0.27, EUR: 0.25 };
const SYMBOL: Record<string, string> = { PEN: "S/", USD: "$", EUR: "€" };
const FLAG:   Record<string, string> = { PEN: "🇵🇪", USD: "🇺🇸", EUR: "🇪🇺" };
const CURRENCIES = ["PEN", "USD", "EUR"] as const;

function fmtPrice(pricePEN: number, currency: string) {
  return (pricePEN * (RATES[currency] ?? 1)).toFixed(2);
}

/* ─── Selector de moneda (igual que en la tienda) ─── */
const CurrencyPill = ({
  currency, active, onClick,
}: { currency: string; active: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black
      uppercase tracking-wide transition-all border
      ${active
        ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30"
        : "bg-white/5 border-white/15 text-white/50 hover:bg-white/10 hover:text-white"
      }
    `}
    style={{ fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif" }}
  >
    {FLAG[currency]} {currency}
  </button>
);

/* ─── Card de producto (igual estética a la tienda) ─── */
const ShopCard = ({
  product, currency, onAdd,
}: { product: FnProduct; currency: string; onAdd: () => void }) => {
  const sym   = SYMBOL[currency] ?? "S/";
  const price = fmtPrice(product.pricePEN, currency);

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-blue-500/50 transition group flex flex-col h-full relative">

      {/* Imagen cuadrada */}
      <div className="relative overflow-hidden rounded-xl mb-4 aspect-square bg-black/30 flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transform group-hover:scale-110 transition duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        {/* Placeholder */}
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/20 ${product.image ? "hidden" : "flex"}`}>
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span className="text-[9px] uppercase font-bold tracking-widest text-center leading-tight">
            Imagen
          </span>
        </div>
      </div>

      {/* Nombre */}
      <h3 className="font-bold text-sm md:text-base leading-tight min-h-[40px] mb-2 text-white">
        {product.name}
      </h3>

      {/* Precio */}
      <div className="mt-auto flex items-center justify-between mb-3">
        <p className="text-blue-300 font-black text-xl tracking-tight">
          {sym} {price}
        </p>
        <span className="text-[10px] uppercase font-bold opacity-50 bg-black/20 px-2 py-0.5 rounded text-white">
          Fortnite
        </span>
      </div>

      {/* Botón */}
      <button
        onClick={onAdd}
        className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-xs font-bold uppercase transition active:scale-95 text-white"
      >
        + Agregar al carrito
      </button>
    </div>
  );
};

/* ─── Layout principal ─── */
interface Props {
  title:    string;
  info:     string;
  products: FnProduct[];
}

const FortniteProductLayout = ({ title, info, products }: Props) => {
  const navigate      = useNavigate();
  const { addToCart } = useCart();
  const { t }         = useLang();
  const [localCurrency, setLocalCurrency] = useState<string>("PEN");

  return (
    <CategoryShell title={title} subtitle="">
      <FortniteNavButtons />

      {/* Breadcrumb */}
      <button
        onClick={() => navigate("/fortnite")}
        className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-bold mb-6 transition"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
        {t("fortnite", "backHome")} / <span className="text-white">{title}</span>
      </button>

      {/* Info compacta */}
      <div className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
            ⚡ {t("fortnite", "instantDelivery")}
          </span>
          <span className="flex items-center gap-1.5 bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap">
            🛡 {t("fortnite", "safe")}
          </span>
        </div>
        <p className="text-white/45 text-sm sm:border-l sm:border-white/10 sm:pl-4">
          <span className="text-white/65 font-semibold">ℹ {t("fortnite", "infoLabel")} </span>
          {info}
        </p>
      </div>

      {/* Selector de moneda */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <span className="text-white/35 text-[11px] font-black uppercase tracking-widest">
          {t("product", "pricesIn")}:
        </span>
        {CURRENCIES.map((cur) => (
          <CurrencyPill
            key={cur}
            currency={cur}
            active={localCurrency === cur}
            onClick={() => setLocalCurrency(cur)}
          />
        ))}
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ShopCard
            key={product.id}
            product={product}
            currency={localCurrency}
            onAdd={() => addToCart({
              id:       product.id,
              name:     product.name,
              price:    Number(fmtPrice(product.pricePEN, localCurrency)),
              image:    product.image,
              quantity: 1,
            })}
          />
        ))}
      </div>
    </CategoryShell>
  );
};

export default FortniteProductLayout;