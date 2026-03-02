import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import CategoryShell from "../components/layout/CategoryShell";
import { usePriceConverter } from "../hooks/usePriceConverter";
import { useLang } from "../context/LangContext";

const CATEGORY = "wild-rift";

const products = [
  { id: "wc-425",   name: "425 Wild Cores",   basePen: 15.9,  image: "/images/wildrift/425wc.jpg"   },
  { id: "wc-1000",  name: "1000 Wild Cores",  basePen: 28.9,  image: "/images/wildrift/1000wc.jpg"  },
  { id: "wc-1850",  name: "1850 Wild Cores",  basePen: 51.9,  image: "/images/wildrift/1850wc.jpg"  },
  { id: "wc-3275",  name: "3275 Wild Cores",  basePen: 88.9,  image: "/images/wildrift/3275wc.jpg"  },
  { id: "wc-4800",  name: "4800 Wild Cores",  basePen: 127.9, image: "/images/wildrift/4800wc.jpg"  },
  { id: "wc-10000", name: "10000 Wild Cores", basePen: 235.9, image: "/images/wildrift/10000wc.jpg" },
];

const WildRift = () => {
  const { addToCart } = useCart();
  const { format, cartPrice, symbol } = usePriceConverter();
  const { t } = useLang();

  return (
    <CategoryShell title="Wild Rift" subtitle={t("wildrift", "subtitle")}>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.3 }}
            className="group bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg"
          >
            <div className="h-48 rounded-xl mb-5 overflow-hidden bg-gradient-to-b from-black/40 to-black/70 flex items-center justify-center">
              <img
                src={product.image} alt={product.name}
                className="max-h-full max-w-full object-contain scale-110 transition-transform duration-300 group-hover:scale-125"
                style={{ objectPosition: "center bottom" }}
                draggable={false}
              />
            </div>

            <h2 className="text-lg font-bold mb-2" style={{ fontFamily: "BurbankSmall" }}>
              {product.name}
            </h2>

            <p className="text-blue-400 text-2xl font-black mb-6">
              {format(product.basePen)}
            </p>

            <button
              onClick={() => addToCart({ id: product.id, name: product.name, price: cartPrice(product.basePen), image: product.image})}
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

export default WildRift;