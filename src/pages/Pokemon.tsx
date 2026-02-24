import { motion } from "framer-motion";
import CategoryShell from "../components/layout/CategoryShell";
import { useCart } from "../context/CartContext";
import { usePriceConverter } from "../hooks/usePriceConverter";

const products = [
  { id: "pk-100",   name: "100 Pokémonedas",                        basePen: 2.9   },
  { id: "pk-550",   name: "550 Pokémonedas",                        basePen: 9.9   },
  { id: "pk-1200",  name: "1200 Pokémonedas",                       basePen: 17.9  },
  { id: "pk-2500",  name: "2500 Pokémonedas",                       basePen: 33.9  },
  { id: "pk-5200",  name: "5200 Pokémonedas",                       basePen: 68.9  },
  { id: "pk-14500", name: "14500 Pokémonedas",                      basePen: 171.9 },
  { id: "pk-pack",  name: "Paquete de Inicio 📦",                   basePen: 5.9   },
  { id: "pk-pass",  name: "Pase de GO Deluxe: Febrero 🎫",          basePen: 15.5  },
  { id: "pk-kalos", name: "Entrada Pokémon GO Tour: Kalos 🎟️ (Global)", basePen: 17.9 },
];

const Pokemon = () => {
  const { addToCart } = useCart();
  const { format, cartPrice, symbol } = usePriceConverter();

  return (
    <CategoryShell
      title="Pokémon GO"
      subtitle="Pokémonedas y entradas oficiales – Entrega rápida y segura"
    >
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04 }}
            transition={{ duration: 0.25 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
          >
            <div className="h-36 rounded-xl bg-black/40 flex items-center justify-center text-gray-400 mb-4">
              Imagen aquí
            </div>

            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>

            <p className="text-blue-400 text-xl font-bold mb-4">
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
              className="w-full bg-blue-600 hover:bg-blue-500 transition rounded-xl py-2 font-semibold cursor-pointer"
            >
              Agregar al carrito
            </button>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-xs text-gray-500 text-right">
        Precios en {symbol} · Moneda configurable desde el encabezado
      </div>

      <div className="mt-12 text-sm text-gray-400 max-w-3xl">
        <p className="mb-2">⚡ Entrega rápida según disponibilidad.</p>
        <p>🛡️ No nos responsabilizamos por el estado o seguridad de la cuenta del jugador.</p>
      </div>
    </CategoryShell>
  );
};

export default Pokemon;