// src/components/layout/CategoryShell.tsx
import type { ReactNode } from "react";

interface CategoryShellProps {
  title:     string;
  subtitle?: ReactNode;
  notice?:   ReactNode;
  children:  ReactNode;
}

const CategoryShell = ({ title, subtitle, notice, children }: CategoryShellProps) => {
  return (
    <div className="min-h-screen text-white bg-[#18181C]">
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">

        {/* HEADER */}
        {title && (
          <div className="text-center mb-14">

            {/* Título */}
            <h1
              className="text-4xl md:text-5xl font-black uppercase tracking-widest"
              style={{ fontFamily: "BurbankBig" }}
            >
              {title}
            </h1>

            {/* Subtítulo opcional */}
            {subtitle && (
              <p
                className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base mt-3"
                style={{ fontFamily: "BurbankSmall" }}
              >
                {subtitle}
              </p>
            )}

            {/* ── Aviso entre título y línea azul — centrado y ancho ── */}
            {notice && (
              <div className="mt-6 max-w-4xl mx-auto text-left">
                {notice}
              </div>
            )}

            {/* Línea azul */}
            <div className="mt-6 w-24 h-1 bg-blue-500 mx-auto rounded-full" />
          </div>
        )}

        {children}
      </div>
    </div>
  );
};

export default CategoryShell;