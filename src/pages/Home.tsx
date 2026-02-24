// src/pages/Home.tsx
import CatalogGrid from "../components/catalog/CatalogGrid";
import { useLang } from "../context/LangContext";

const Home = () => {
  const { t } = useLang();

  return (
    <div className="relative min-h-screen text-[#1F1BE8] overflow-hidden bg-gradient-to-t from-[#1E55FF] via-[#1E55FF] via-30% to-white to-80%">
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-blue-600/20 blur-[180px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[160px] rounded-full" />

      <div className="relative z-10">
        <section className="text-center pt-24 pb-20 px-6">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            {t("home", "heroTitle")}{" "}
            <span className="text-blue-500">{t("home", "heroSpan")}</span>
          </h2>
          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            {t("home", "heroSubtitle")}
          </p>
          <div className="mt-8 w-24 h-1 bg-blue-500 mx-auto rounded-full" />
        </section>

        <div className="max-w-7xl mx-auto px-6 pb-16">
          <CatalogGrid />
        </div>
      </div>
    </div>
  );
};

export default Home;