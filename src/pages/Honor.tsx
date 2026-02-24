import { motion } from "framer-motion";
import CategoryShell from "../components/layout/CategoryShell";
import { useCart } from "../context/CartContext";
import { usePriceConverter } from "../hooks/usePriceConverter";
import { useLang } from "../context/LangContext";

const products = [
  { id: "hok-80",   name: "80 Tokens",         basePen: 4.9   },
  { id: "hok-240",  name: "240 Tokens",        basePen: 13.9  },
  { id: "hok-400",  name: "400 Tokens",        basePen: 20.9  },
  { id: "hok-560",  name: "560 Tokens",        basePen: 27.9  },
  { id: "hok-800",  name: "800 + 30 Tokens",   basePen: 36.9  },
  { id: "hok-1200", name: "1200 + 45 Tokens",  basePen: 55.9  },
  { id: "hok-2400", name: "2400 + 108 Tokens", basePen: 109.9 },
  { id: "hok-4000", name: "4000 + 180 Tokens", basePen: 169.9 },
  { id: "hok-8000", name: "8000 + 360 Tokens", basePen: 335.9 },
];

const Honor = () => {
  const { addToCart } = useCart();
  const { format, cartPrice, symbol } = usePriceConverter();
  const { t } = useLang();

  return (
    <CategoryShell title="Honor of Kings" subtitle={t("honor", "subtitle")}>
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
        <p className="font-semibold text-white">{t("honor", "infoTitle")}</p>
        <ul className="list-disc list-inside space-y-1">
          <li>{t("honor", "i1")}</li>
          <li>{t("honor", "i2")}</li>
          <li>{t("honor", "i3")}</li>
        </ul>
        <p>{t("honor", "fast")}</p>
        <p>{t("honor", "safe")}</p>
      </div>
    </CategoryShell>
  );
};

export default Honor;