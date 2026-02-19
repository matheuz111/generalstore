import CatalogGrid from "../components/catalog/CatalogGrid";

const Home = () => {
  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-gradient-to-b from-[#050816] via-[#070c1f] to-[#03050f]">

      {/* GLOW BACKGROUND */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-blue-600/20 blur-[180px] rounded-full" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[160px] rounded-full" />

      <div className="relative z-10">

        {/* HERO */}
        <section className="text-center pt-24 pb-20 px-6">
          <h2 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            CATÁLOGO <span className="text-blue-500">DIGITAL GAMER</span>
          </h2>

          <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto">
            Elige tu juego favorito y compra de forma rápida, segura y sin complicaciones.
          </p>

          <div className="mt-8 w-24 h-1 bg-blue-500 mx-auto rounded-full" />
        </section>

        {/* GRID */}
        <div className="max-w-7xl mx-auto px-6 pb-16">
          <CatalogGrid />
        </div>

      </div>
    </div>
  );
};

export default Home;
