// src/components/layout/CategoryShell.tsx
import type { ReactNode } from "react";

interface CategoryShellProps {
  title:     string;
  subtitle?: ReactNode;   // acepta string O JSX para resaltar partes
  children:  ReactNode;
}

const CategoryShell = ({ title, subtitle, children }: CategoryShellProps) => {
  return (
    <div className="min-h-screen text-white bg-[#18181C]">
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">

        {/* HEADER */}
        <div className="text-center mb-14">
          <h1
            className="text-4xl md:text-5xl font-black uppercase tracking-widest mb-4"
            style={{ fontFamily: "BurbankBig" }}
          >
            {title}
          </h1>

          {subtitle && (
            <p
              className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base"
              style={{ fontFamily: "BurbankSmall" }}
            >
              {subtitle}
            </p>
          )}

          <div className="mt-6 w-24 h-1 bg-blue-500 mx-auto rounded-full" />
        </div>

        {children}
      </div>
    </div>
  );
};

export default CategoryShell;