// src/pages/fortnite/FortniteProductLayout.tsx
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import CategoryShell from "../../components/layout/CategoryShell";
import { useCart } from "../../context/CartContext";
import { useLang } from "../../context/LangContext";
import { usePriceConverter } from "../../hooks/usePriceConverter";

export type FnProduct = {
  id:       string;
  name:     string;
  desc:     string;
  pricePEN: number;
  image:    string;
};

/* ─── Card de producto ─── */
const ShopCard = ({ product, onAdd }: { product: FnProduct; onAdd: () => void }) => {
  const { format } = usePriceConverter();
  const { t }      = useLang();

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-blue-500/50 transition group flex flex-col h-full">
      <div className="relative overflow-hidden rounded-xl mb-4 aspect-square bg-black/30 flex items-center justify-center">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain transform group-hover:scale-110 transition duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              const next = (e.target as HTMLImageElement).nextElementSibling;
              if (next) next.classList.remove("hidden");
            }}
          />
        ) : null}
        <div className={`absolute inset-0 flex flex-col items-center justify-center gap-2 text-white/20 ${product.image ? "hidden" : "flex"}`}>
          <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span className="text-[9px] uppercase font-bold tracking-widest">{t("product", "imageHere")}</span>
        </div>
      </div>

      <h3 className="font-bold text-sm md:text-base leading-tight min-h-[40px] mb-2 text-white">
        {product.name}
      </h3>

      <div className="mt-auto flex items-center justify-between mb-3">
        <p className="text-blue-300 font-black text-xl tracking-tight">
          {format(product.pricePEN)}
        </p>
        <span className="text-[10px] uppercase font-bold opacity-50 bg-black/20 px-2 py-0.5 rounded text-white">
          Fortnite
        </span>
      </div>

      <button
        onClick={onAdd}
        className="w-full bg-white/10 hover:bg-white/20 py-2 rounded-xl text-xs font-bold uppercase transition active:scale-95 text-white cursor-pointer"
      >
        {t("fortnite", "addCartBtn")}
      </button>
    </div>
  );
};

/* ─── Aviso Lira Turca (TRY) ─── */
const TryNotice = () => (
  <div className="bg-amber-500/10 border border-amber-500/40 rounded-xl p-4 flex gap-3 text-left">
    <span className="text-2xl shrink-0">🇹🇷</span>
    <div className="text-sm leading-relaxed">
      <p
        className="font-black text-amber-300 uppercase tracking-wide mb-1"
        style={{ fontFamily: "'BurbankBig','Arial Black',sans-serif" }}
      >
        Precios en Lira Turca (TRY)
      </p>
      <p className="text-amber-200/80">
        Exclusivos para cuentas con región en <strong>Turquía (TRY)</strong>.
      </p>
      <p className="text-amber-200/60 mt-1.5 flex items-start gap-1.5">
        <span className="mt-0.5 shrink-0">💬</span>
        Te contactaremos por{" "}
        <strong className="text-amber-300 ml-1">WhatsApp, Instagram, Facebook o Discord</strong>
        {" "}para coordinar la entrega.
      </p>
    </div>
  </div>
);

/* ─── Layout principal ─── */
interface Props {
  title:    string;
  info:     string;
  products: FnProduct[];
  infoBox?: ReactNode;
  variant?: "pavos" | "packs";
}

const FortniteProductLayout = ({ title, products, infoBox, variant }: Props) => {
  const navigate      = useNavigate();
  const { addToCart } = useCart();
  const { t }         = useLang();
  const { cartPrice } = usePriceConverter();

  return (
    <CategoryShell
      title={title}
      subtitle=""
      notice={<TryNotice />}
    >
      {/* Breadcrumb */}
      <button
        onClick={() => navigate("/fortnite")}
        className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-bold mb-8 transition cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
        {t("fortnite", "backHome")} / <span className="text-white">{title}</span>
      </button>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ShopCard
            key={product.id}
            product={product}
            onAdd={() =>
              addToCart({
                id:       product.id,
                name:     product.name,
                price:    cartPrice(product.pricePEN),
                image:    product.image,
                quantity: 1,
              })
            }
          />
        ))}
      </div>

      {infoBox && <div className="mt-10">{infoBox}</div>}
    </CategoryShell>
  );
};

export default FortniteProductLayout;