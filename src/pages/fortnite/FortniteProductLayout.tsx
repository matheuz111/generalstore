// src/pages/fortnite/FortniteProductLayout.tsx
import { useState } from "react";
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

      <h3 className="font-bold text-sm md:text-base leading-tight min-h-[40px] mb-2 text-white whitespace-pre-line">
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

/* ─── Modal de imagen ejemplo ─── */
const ImageModal = ({ onClose }: { onClose: () => void }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
    onClick={onClose}
  >
    <div
      className="relative max-w-2xl w-full mx-4"
      onClick={e => e.stopPropagation()}
    >
      {/* Botón cerrar */}
      <button
        onClick={onClose}
        className="absolute -top-3 -right-3 z-10 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full w-8 h-8 flex items-center justify-center transition cursor-pointer"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
        </svg>
      </button>

      <div className="rounded-2xl overflow-hidden border border-amber-500/30 bg-black">
        <img
          src="/images/ejemplo.jpg"
          alt="Ejemplo región TRY"
          className="w-full object-contain max-h-[80vh]"
        />
      </div>
      <p className="text-center text-amber-300/60 text-xs mt-2">
        Ejemplo de cuenta con región Turquía (TRY)
      </p>
    </div>
  </div>
);

/* ─── Aviso Lira Turca (TRY) ─── */
const TryNotice = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal && <ImageModal onClose={() => setShowModal(false)} />}

      <div className="w-full bg-amber-500/10 border border-amber-500/40 rounded-xl p-5 text-left relative">

        {/* Botón esquina superior derecha */}
        <button
          onClick={() => setShowModal(true)}
          className="absolute top-3 right-3 flex items-center gap-1.5 bg-amber-500/20 hover:bg-amber-500/40 border border-amber-400/40 text-amber-300 text-[11px] font-bold uppercase px-2.5 py-1 rounded-lg transition active:scale-95 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          Ver ejemplo
        </button>

        {/* Texto del aviso */}
        <div className="space-y-3 pr-36">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🇹🇷</span>
            <p
              className="font-black text-amber-300 uppercase tracking-wide text-sm"
              style={{ fontFamily: "'BurbankBig','Arial Black',sans-serif" }}
            >
              Precios en Lira Turca (TRY)
            </p>
          </div>
          <ul className="space-y-2 text-sm text-amber-200/80">
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5 shrink-0">•</span>
              <span>
                Estos precios son exclusivos para cuentas con región configurada en{" "}
                <strong className="text-amber-300">Turquía (TRY – Lira Turca)</strong>.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-400 mt-0.5 shrink-0">•</span>
              <span>
                Si tu cuenta no muestra los precios en TRY, no podrás acceder a estos valores.
              </span>
            </li>
          </ul>
          <p className="text-amber-200/60 text-sm flex items-start gap-2 pt-1 border-t border-amber-500/20">
            <span className="shrink-0">💬</span>
            <span>
              Te contactaremos por{" "}
              <strong className="text-amber-300">WhatsApp, Instagram, Facebook o Discord</strong>
              {" "}para coordinar la entrega.
            </span>
          </p>
        </div>

      </div>
    </>
  );
};

/* ─── Layout principal ─── */
interface Props {
  title:    string;
  info:     string;
  products: FnProduct[];
  infoBox?: ReactNode;
  variant?: "pavos" | "packs" | "pase";
}

const FortniteProductLayout = ({ title, products, infoBox, variant }: Props) => {
  const navigate      = useNavigate();
  const { addToCart } = useCart();
  const { t }         = useLang();
  const { cartPrice } = usePriceConverter();

  const showTRY = variant !== "pase";

  return (
    <CategoryShell
      title={title}
      subtitle=""
      notice={showTRY ? <TryNotice /> : null}
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