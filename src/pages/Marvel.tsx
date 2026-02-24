import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import CategoryShell from "../components/layout/CategoryShell";
import { usePriceConverter } from "../hooks/usePriceConverter";

const products = [
  { id: "lat-1000",  name: "1000 LATICES",  basePen: 35.9  },
  { id: "lat-2180",  name: "2180 LATICES",  basePen: 69.9  },
  { id: "lat-5680",  name: "5680 LATICES",  basePen: 168.9 },
  { id: "lat-11680", name: "11680 LATICES", basePen: 333.9 },
];

const Marvel = () => {
  const { addToCart } = useCart();
  const { format, cartPrice, symbol } = usePriceConverter();

  return (
    <CategoryShell
      title="Marvel Rivals"
      subtitle="Recarga LATICES de Marvel Rivals de forma rápida y segura. Entrega inmediata mediante ID de jugador."
    >
      <div className="mb-14 max-w-3xl mx-auto text-center text-gray-400 text-sm space-y-2">
        <p>🎮 Perfecto para mejorar tu experiencia en el juego.</p>
        <p>💳 Entrega rápida vía <b>ID de jugador</b> (solo necesitas tu ID).</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25 }}
            className="bg-[#0f172a]/80 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-lg"
          >
            <div className="h-36 bg-black/40 rounded-xl mb-5 flex items-center justify-center text-gray-400 text-sm">
              Imagen aquí
            </div>

            <h3 className="font-bold mb-2 text-lg">{product.name}</h3>

            <p className="text-blue-400 text-2xl font-black mb-6">
              {format(product.basePen)}
            </p>

            <button
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: cartPrice(product.basePen),
                  image: "",
                })
              }
              className="w-full bg-blue-600 hover:bg-blue-500 transition py-3 rounded-xl font-bold cursor-pointer"
            >
              Agregar al carrito
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-xs text-gray-500 text-right">
        Precios en {symbol} · Moneda configurable desde el encabezado
      </div>
    </CategoryShell>
  );
};

export default Marvel;