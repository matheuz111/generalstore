import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import CategoryShell from "../components/layout/CategoryShell";
import { usePriceConverter } from "../hooks/usePriceConverter";
import { useLang } from "../context/LangContext";

const products = [
  { id: "lat-1000",  name: "1000 LATTICE",  basePen: 35.9  },
  { id: "lat-2180",  name: "2180 LATTICE",  basePen: 69.9  },
  { id: "lat-5680",  name: "5680 LATTICE",  basePen: 168.9 },
  { id: "lat-11680", name: "11680 LATTICE", basePen: 333.9 },
];

const Marvel = () => {
  const { addToCart } = useCart();
  const { format, cartPrice, symbol } = usePriceConverter();
  const { t } = useLang();

  return (
    <CategoryShell title="Marvel Rivals" subtitle={t("marvel", "subtitle")}>
      <div className="mb-10 max-w-3xl mx-auto text-center text-gray-400 text-sm space-y-1">
        <p>{t("marvel", "tip1")}</p>
        <p>{t("marvel", "tip2")}</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }} transition={{ duration: 0.25 }}
            className="bg-[#0f172a]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg"
          >
            <div className="h-36 bg-black/40 rounded-xl mb-5 flex items-center justify-center text-gray-400 text-sm">
              {t("product", "imageHere")}
            </div>
            <h3 className="font-bold mb-2 text-lg">{product.name}</h3>
            <p className="text-blue-400 text-2xl font-black mb-6">{format(product.basePen)}</p>
            <button
              onClick={() => addToCart({ id: product.id, name: product.name, price: cartPrice(product.basePen), image: "" })}
              className="w-full bg-blue-600 hover:bg-blue-500 transition py-3 rounded-xl font-bold cursor-pointer"
            >
              {t("product", "addToCart")}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500 text-right">
        {t("product", "pricesIn")} {symbol} · {t("product", "currencyNote")}
      </div>
    </CategoryShell>
  );
};

export default Marvel;