import { motion } from "framer-motion";
import CategoryShell from "../components/layout/CategoryShell";
import { useCart } from "../context/CartContext";
import { usePriceConverter } from "../hooks/usePriceConverter";
import { useLang } from "../context/LangContext";

const products = [
  { id: "gi-60",   name: "60 Cristales Génesis",   basePen: 3.9   },
  { id: "gi-300",  name: "300 Cristales Génesis",  basePen: 14.9  },
  { id: "gi-980",  name: "980 Cristales Génesis",  basePen: 44.9  },
  { id: "gi-1980", name: "1980 Cristales Génesis", basePen: 87.9  },
  { id: "gi-3280", name: "3280 Cristales Génesis", basePen: 142.9 },
  { id: "gi-6480", name: "6480 Cristales Génesis", basePen: 284.9 },
];

const Genshin = () => {
  const { addToCart } = useCart();
  const { format, cartPrice, symbol } = usePriceConverter();
  const { t } = useLang();

  return (
    <CategoryShell title="Genshin Impact" subtitle={t("genshin", "subtitle")}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04 }} transition={{ duration: 0.25 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="h-36 rounded-xl bg-black/40 flex items-center justify-center text-gray-400 mb-4">
              {t("product", "imageHere")}
            </div>
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-blue-400 text-xl font-bold mb-4">{format(product.basePen)}</p>
            <button
              onClick={() => addToCart({ id: product.id, name: product.name, price: cartPrice(product.basePen), image: "" })}
              className="w-full bg-blue-600 hover:bg-blue-500 transition rounded-xl py-2 font-semibold cursor-pointer"
            >
              {t("product", "addToCart")}
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-4 text-xs text-gray-500 text-right">
        {t("product", "pricesIn")} {symbol} · {t("product", "currencyNote")}
      </div>

      <div className="mt-10 text-sm text-gray-400 max-w-3xl space-y-2">
        <p className="font-semibold text-white">{t("genshin", "infoTitle")}</p>
        <ul className="list-disc list-inside space-y-1">
          <li>{t("genshin", "i1")}</li>
          <li>{t("genshin", "i2")}</li>
          <li>{t("genshin", "i3")}</li>
          <li>{t("genshin", "i4")}</li>
          <li>{t("genshin", "i5")}</li>
        </ul>
        <p className="pt-2">{t("genshin", "bonus")}</p>
      </div>
    </CategoryShell>
  );
};

export default Genshin;