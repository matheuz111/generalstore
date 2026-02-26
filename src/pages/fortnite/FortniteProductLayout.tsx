// src/pages/fortnite/FortniteProductLayout.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CategoryShell from "../../components/layout/CategoryShell";
import { useCart } from "../../context/CartContext";
import FortniteNavButtons from "./FortniteNavButtons";

export type FnProduct = {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
};

interface Props {
  title: string;
  info: string;
  headerImage: string;
  products: FnProduct[];
}

const FortniteProductLayout = ({ title, info, headerImage, products }: Props) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [selected, setSelected] = useState<FnProduct | null>(null);

  return (
    // title y subtitle vacíos — los ponemos nosotros debajo del shell para controlar posición
    <CategoryShell title={title} subtitle="">
      {/* Botones de nav — aparecen en todas las subpáginas */}
      <FortniteNavButtons />

      {/* Breadcrumb */}
      <button
        onClick={() => navigate("/fortnite")}
        className="flex items-center gap-2 text-white/40 hover:text-white text-sm font-bold mb-6 transition"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7"/>
        </svg>
        Inicio / <span className="text-white">{title}</span>
      </button>

      {/* Hero header */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex gap-6 items-center mb-8">
        <img
          src={headerImage}
          alt={title}
          className="w-32 h-32 rounded-xl object-cover shrink-0 shadow-lg"
          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
        />
        <div>
          <h1
            className="text-3xl font-black text-white mb-3"
            style={{ fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif" }}
          >
            {title}
          </h1>
          <div className="flex gap-3 mb-4 flex-wrap">
            <span className="flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold px-3 py-1 rounded-full">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/>
              </svg>
              Entrega Instantánea
            </span>
            <span className="flex items-center gap-1.5 bg-green-500/20 border border-green-500/40 text-green-400 text-xs font-bold px-3 py-1 rounded-full">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
              100% Seguro
            </span>
          </div>
          <p className="text-white/50 text-sm">
            <span className="text-white/70 font-bold">ℹ Información: </span>
            {info}
          </p>
        </div>
      </div>

      {/* Productos + Resumen */}
      <div className="flex gap-6 items-start">
        {/* Lista */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
          {products.map((product) => {
            const isSelected = selected?.id === product.id;
            return (
              <button
                key={product.id}
                onClick={() => setSelected(isSelected ? null : product)}
                className={`w-full text-left flex items-center gap-4 p-4 rounded-xl border transition-all duration-200
                  ${isSelected
                    ? "border-orange-500 bg-orange-500/10 shadow-lg shadow-orange-500/20"
                    : "border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/8"
                  }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 rounded-lg object-cover shrink-0"
                  onError={(e) => { (e.target as HTMLImageElement).src = "https://fortnite-api.com/images/vbuck.png"; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm text-white leading-tight">{product.name}</p>
                  <p className="text-green-400 text-xs flex items-center gap-1 mt-0.5">
                    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"/>
                    </svg>
                    {product.desc}
                  </p>
                </div>
                <p className="font-black text-white text-base shrink-0">S/ {product.price.toFixed(2)}</p>
              </button>
            );
          })}
        </div>

        {/* Panel resumen */}
        <div className="w-72 shrink-0 bg-white/5 border border-white/10 rounded-2xl p-5 sticky top-6">
          <h3 className="font-black text-lg text-white mb-1"
            style={{ fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif" }}>
            Resumen de compra
          </h3>
          <p className="text-white/40 text-xs mb-5">
            {selected ? "Producto seleccionado" : "Selecciona un producto para ver el total."}
          </p>
          <div className="border-t border-white/10 pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/50">Producto:</span>
              <span className="text-white font-bold text-right max-w-[140px] leading-tight">
                {selected ? selected.name : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white font-black">Total</span>
              <span className="font-black text-xl" style={{ color: selected ? "#f97316" : "#6b7280" }}>
                {selected ? `S/ ${selected.price.toFixed(2)}` : "0.00"}
              </span>
            </div>
          </div>
          <button
            disabled={!selected}
            onClick={() => {
              if (!selected) return;
              addToCart({ id: selected.id, name: selected.name, price: selected.price, image: selected.image, quantity: 1 });
            }}
            className="w-full mt-5 py-3 rounded-xl font-black uppercase text-sm transition active:scale-95 flex items-center justify-center gap-2
              disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed
              enabled:bg-orange-600 enabled:hover:bg-orange-500 enabled:text-white enabled:shadow-lg enabled:shadow-orange-600/30"
            style={{ fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif" }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
            {selected ? "Añadir al carrito" : "Selecciona un producto"}
          </button>
        </div>
      </div>
    </CategoryShell>
  );
};

export default FortniteProductLayout;