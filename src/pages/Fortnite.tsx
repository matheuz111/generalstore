import { useEffect, useState } from "react";
import { fetchShopDual } from "../lib/fortniteApi";
import CategoryShell from "../components/layout/CategoryShell";
import { useCart } from "../context/CartContext";
import { useCurrency } from "../context/CurrencyContext";
import { useLang } from "../context/LangContext";

const Fortnite = () => {
  const [sections, setSections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice, convertVbucks } = useCurrency();
  const { addToCart } = useCart();
  const { t, lang } = useLang();

  useEffect(() => {
    const loadShop = async () => {
      try {
        // Usa idioma EN si el usuario seleccionó inglés
        const data = await fetchShopDual(lang === "EN" ? "EN" : "ES");
        setSections(data);
      } catch (error) {
        console.error("Error al cargar la tienda de Fortnite:", error);
      } finally {
        setLoading(false);
      }
    };
    loadShop();
  }, [lang]); // recarga si cambia el idioma

  if (loading) return (
    <div className="text-white text-center py-20 font-bold text-lg">
      {t("fortnite", "loading")}
    </div>
  );

  return (
    <CategoryShell
      title="Fortnite"
      subtitle={t("fortnite", "subtitle")}
      banner="/images/fortnite.jpg"
    >
      <div className="space-y-12">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h2
              className="text-2xl font-black uppercase mb-6 text-blue-400"
              style={{ fontFamily: "BurbankBig" }}
            >
              {section.titleEs}
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {section.items.map((item: any) => {
                const priceValue    = convertVbucks(item.vbucks);
                const priceFormatted = formatPrice(item.vbucks);

                return (
                  <div
                    key={item.id}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-blue-500/50 transition group flex flex-col h-full"
                    style={{ background: item.bgGradient }}
                  >
                    <div className="relative overflow-hidden rounded-xl mb-4">
                      <img
                        src={item.image} alt={item.nameEs}
                        className="w-full aspect-square object-contain transform group-hover:scale-110 transition duration-500"
                      />
                    </div>

                    <h3 className="font-bold text-sm md:text-base leading-tight min-h-[40px] mb-2">
                      {item.nameEs}
                    </h3>

                    <div className="mt-auto flex items-center justify-between">
                      <p className="text-blue-300 font-black text-xl tracking-tight">
                        {priceFormatted}
                      </p>
                      <span className="text-[10px] uppercase font-bold opacity-50 bg-black/20 px-2 py-0.5 rounded">
                        {item.rarity}
                      </span>
                    </div>

                    <button
                      onClick={() => addToCart({
                        id: item.id,
                        name: item.nameEs,
                        price: priceValue,
                        image: item.image,
                        quantity: 1,
                      })}
                      className="w-full mt-4 bg-white/10 hover:bg-white/20 py-2 rounded-xl text-xs font-bold uppercase transition active:scale-95"
                    >
                      {t("product", "addToCart")}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </CategoryShell>
  );
};

export default Fortnite;