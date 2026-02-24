import { motion } from "framer-motion";
import CategoryShell from "../components/layout/CategoryShell";
import { useCart } from "../context/CartContext";
import { usePriceConverter } from "../hooks/usePriceConverter";
import { useLang } from "../context/LangContext";

const products = [
  { id: "hsr-60",   name: "60 Esquirlas Oníricas",           basePen: 4.9   },
  { id: "hsr-300",  name: "300 + 30 Esquirlas Oníricas",    basePen: 17.9  },
  { id: "hsr-980",  name: "980 + 110 Esquirlas Oníricas",   basePen: 53.9  },
  { id: "hsr-1980", name: "1980 + 260 Esquirlas Oníricas",  basePen: 107.9 },
  { id: "hsr-3280", name: "3280 + 600 Esquirlas Oníricas",  basePen: 179.9 },
  { id: "hsr-6480", name: "6480 + 1600 Esquirlas Oníricas", basePen: 349.9 },
];

const Honkai = () => {
  const { addToCart } = useCart();
  const { format, cartPrice, symbol } = usePriceConverter();
  const { t } = useLang();

  return (
    <CategoryShell title="Honkai: Star Rail" subtitle={t("honkai", "subtitle")}>
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
        <p className="font-semibold text-white">{t("honkai", "infoTitle")}</p>
        <ul className="list-disc list-inside space-y-1">
          <li>{t("honkai", "i1")}</li>
          <li>{t("honkai", "i2")}</li>
        </ul>
        <p>{t("honkai", "bonus")}</p>
        <p>{t("honkai", "noBonus")}</p>
        <p>{t("honkai", "safe")}</p>
      </div>
    </CategoryShell>
  );
};

export default Honkai;