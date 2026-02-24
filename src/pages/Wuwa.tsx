import { motion } from "framer-motion";
import CategoryShell from "../components/layout/CategoryShell";
import { useCart } from "../context/CartContext";
import { usePriceConverter } from "../hooks/usePriceConverter";
import { useLang } from "../context/LangContext";

const products = [
  { id: "wuwa-60",   name: "60 Lunita",   basePen: 4.9   },
  { id: "wuwa-300",  name: "300 Lunita",  basePen: 17.9  },
  { id: "wuwa-980",  name: "980 Lunita",  basePen: 57.9  },
  { id: "wuwa-1980", name: "1980 Lunita", basePen: 98.9  },
  { id: "wuwa-3280", name: "3280 Lunita", basePen: 163.9 },
  { id: "wuwa-6480", name: "6480 Lunita", basePen: 327.9 },
];

const Wuwa = () => {
  const { addToCart } = useCart();
  const { format, cartPrice, symbol } = usePriceConverter();
  const { t } = useLang();

  return (
    <CategoryShell title="Wuthering Waves" subtitle={t("wuwa", "subtitle")}>
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
        <p className="font-semibold text-white">{t("wuwa", "infoTitle")}</p>
        <ul className="list-disc list-inside space-y-1">
          <li>{t("wuwa", "i1")}</li>
          <li>{t("wuwa", "i2")}</li>
          <li>{t("wuwa", "i3")}</li>
          <li>{t("wuwa", "i4")}</li>
          <li>{t("wuwa", "i5")}</li>
        </ul>
        <p>{t("wuwa", "bonus")}</p>
        <p>{t("wuwa", "noBonus")}</p>
        <p>{t("wuwa", "safe")}</p>
      </div>
    </CategoryShell>
  );
};

export default Wuwa;