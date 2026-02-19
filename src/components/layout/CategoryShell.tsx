import type { ReactNode } from "react";

interface CategoryShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

const CategoryShell = ({
  title,
  subtitle,
  children,
}: CategoryShellProps) => {
  return (
    <div className="min-h-screen text-white bg-gradient-to-b from-[#050816] via-[#070c1f] to-[#03050f]">
      {/* CONTENIDO */}
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-16">

        {/* HEADER DE CATEGORÍA */}
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

        {/* CONTENIDO DINÁMICO */}
        {children}
      </div>
    </div>
  );
};

export default CategoryShell;
