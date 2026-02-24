import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import CategoryShell from "../components/layout/CategoryShell";
import { usePriceConverter } from "../hooks/usePriceConverter";
import { useLang } from "../context/LangContext";

const robuxDirect = [
  { id: "rbx-80",   name: "80 Robux",   basePen: 6.9  },
  { id: "rbx-500",  name: "500 Robux",  basePen: 18.9 },
  { id: "rbx-1000", name: "1000 Robux", basePen: 37.9 },
  { id: "rbx-2000", name: "2000 Robux", basePen: 75.9 },
];

const robuxGamePass = [
  { id: "gp-2000",  name: "2000 Robux (Game Pass)",  basePen: 64.9  },
  { id: "gp-3000",  name: "3000 Robux (Game Pass)",  basePen: 95.9  },
  { id: "gp-4000",  name: "4000 Robux (Game Pass)",  basePen: 114.9 },
  { id: "gp-5000",  name: "5000 Robux (Game Pass)",  basePen: 142.9 },
  { id: "gp-6000",  name: "6000 Robux (Game Pass)",  basePen: 169.9 },
  { id: "gp-7000",  name: "7000 Robux (Game Pass)",  basePen: 198.9 },
  { id: "gp-8000",  name: "8000 Robux (Game Pass)",  basePen: 226.9 },
  { id: "gp-9000",  name: "9000 Robux (Game Pass)",  basePen: 254.9 },
  { id: "gp-10000", name: "10000 Robux (Game Pass)", basePen: 283.9 },
];

const Card = ({ product, onAdd, addLabel, imageLabel }: {
  product: { id: string; name: string; basePen: number };
  onAdd: () => void;
  addLabel: string;
  imageLabel: string;
}) => {
  const { format } = usePriceConverter();
  return (
    <motion.div
      whileHover={{ y: -6 }} transition={{ duration: 0.25 }}
      className="bg-[#0f172a]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl"
    >
      <div className="h-32 bg-black/40 rounded-xl mb-4 flex items-center justify-center text-gray-400 text-sm">
        {imageLabel}
      </div>
      <h3 className="font-bold mb-2">{product.name}</h3>
      <p className="text-blue-400 text-xl font-black mb-4">{format(product.basePen)}</p>
      <button onClick={onAdd} className="w-full bg-blue-600 hover:bg-blue-500 transition py-2 rounded-xl font-bold cursor-pointer">
        {addLabel}
      </button>
    </motion.div>
  );
};

const Roblox = () => {
  const { addToCart } = useCart();
  const { cartPrice, symbol } = usePriceConverter();
  const { t } = useLang();

  const addLabel   = t("product", "addToCart");
  const imageLabel = t("product", "imageHere");

  return (
    <CategoryShell title="Roblox" subtitle={t("roblox", "subtitle")}>

      {/* DIRECTOS */}
      <section className="mb-14">
        <h2 className="text-2xl font-black mb-6 uppercase tracking-wider" style={{ fontFamily: "BurbankBig" }}>
          {t("roblox", "sectionDirect")}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {robuxDirect.map((p) => (
            <Card key={p.id} product={p} addLabel={addLabel} imageLabel={imageLabel}
              onAdd={() => addToCart({ id: p.id, name: p.name, price: cartPrice(p.basePen), image: "" })} />
          ))}
        </div>
        <p className="text-gray-400 text-sm mt-4">{t("roblox", "deliveryTime")}</p>
      </section>

      {/* GAME PASS */}
      <section className="mb-10">
        <h2 className="text-2xl font-black mb-4 uppercase tracking-wider" style={{ fontFamily: "BurbankBig" }}>
          {t("roblox", "sectionGP")}
        </h2>
        <p className="text-gray-400 max-w-3xl mb-8 text-sm">{t("roblox", "gpInfo")}</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {robuxGamePass.map((p) => (
            <Card key={p.id} product={p} addLabel={addLabel} imageLabel={imageLabel}
              onAdd={() => addToCart({ id: p.id, name: p.name, price: cartPrice(p.basePen), image: "" })} />
          ))}
        </div>
        <ul className="text-gray-400 text-sm mt-6 space-y-1">
          <li>{t("roblox", "gpDays")}</li>
          <li>{t("roblox", "gpNoRefund")}</li>
          <li>{t("roblox", "gpDisclaimer")}</li>
        </ul>
      </section>

      <div className="text-xs text-gray-500 text-right">
        {t("product", "pricesIn")} {symbol} · {t("product", "currencyNote")}
      </div>
    </CategoryShell>
  );
};

export default Roblox;