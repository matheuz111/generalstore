import { motion } from "framer-motion";
import CategoryShell from "../components/layout/CategoryShell";
import { useCart } from "../context/CartContext";
import { usePriceConverter } from "../hooks/usePriceConverter";
import { useLang } from "../context/LangContext";

const Zcord = () => {
  const { addToCart } = useCart();
  const { format, cartPrice, symbol } = usePriceConverter();
  const { t } = useLang();

  const paidProducts = [
    { id: "discord-nitro-mensual",  nameKey: "nitroMonthly", descKey: "descMonthly", basePen: 18  },
    { id: "discord-nitro-anual",    nameKey: "nitroYearly",  descKey: "descYearly",  basePen: 150 },
    { id: "discord-nitro-nuevo-3m", nameKey: "nitro3m",      descKey: "desc3m",      basePen: 20  },
    { id: "discord-boost-2x-3m",   nameKey: "boost2x",      descKey: "descBoost",   basePen: 30  },
  ];

  return (
    <CategoryShell title="Discord" subtitle={t("discord", "subtitle")}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Productos con precio */}
        {paidProducts.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04 }} transition={{ duration: 0.25 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="h-36 rounded-xl bg-black/40 flex items-center justify-center text-gray-400 mb-4">
              {t("product", "imageHere")}
            </div>
            <h3 className="font-semibold text-lg mb-1">{t("discord", product.nameKey as any)}</h3>
            <p className="text-sm text-gray-400 mb-3">{t("discord", product.descKey as any)}</p>
            <p className="text-blue-400 text-xl font-bold mb-4">{format(product.basePen)}</p>
            <button
              onClick={() => addToCart({ id: product.id, name: t("discord", product.nameKey as any), price: cartPrice(product.basePen), image: "" })}
              className="w-full bg-blue-600 hover:bg-blue-500 transition rounded-xl py-2 font-semibold cursor-pointer"
            >
              {t("product", "addToCart")}
            </button>
          </motion.div>
        ))}

        {/* Tarjeta especial: sin precio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.04 }} transition={{ duration: 0.25 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
        >
          <div className="h-36 rounded-xl bg-black/40 flex items-center justify-center text-gray-400 mb-4">
            {t("product", "imageHere")}
          </div>
          <h3 className="font-semibold text-lg mb-1">{t("discord", "deco")}</h3>
          <p className="text-sm text-gray-400 mb-3">{t("discord", "descDeco")}</p>
          <p className="text-green-400 font-semibold mt-4">{t("discord", "nitroFree")}</p>
        </motion.div>
      </div>

      <div className="mt-4 text-xs text-gray-500 text-right">
        {t("product", "pricesIn")} {symbol} · {t("product", "currencyNote")}
      </div>

      <div className="mt-10 text-sm text-gray-400 max-w-3xl space-y-2">
        <p className="font-semibold text-white">{t("discord", "infoTitle")}</p>
        <ul className="list-disc list-inside space-y-1">
          <li>{t("discord", "i1")}</li>
          <li>{t("discord", "i2")}</li>
          <li>{t("discord", "i3")}</li>
          <li>{t("discord", "i4")}</li>
        </ul>
        <p>{t("discord", "noRefund")}</p>
      </div>
    </CategoryShell>
  );
};

export default Zcord;