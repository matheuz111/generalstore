import { motion } from "framer-motion";
import CategoryShell from "../components/layout/CategoryShell";
import { useCart } from "../context/CartContext";

const products = [
  { id: "zzz-60", name: "60 Fotogramas", price: 4.9 },
  { id: "zzz-300", name: "300 Fotogramas", price: 19.9 },
  { id: "zzz-980", name: "980 Fotogramas", price: 54.9 },
  { id: "zzz-1980", name: "1980 Fotogramas", price: 109.9 },
  { id: "zzz-3280", name: "3280 Fotogramas", price: 179.9 },
  { id: "zzz-6480", name: "6480 Fotogramas", price: 359.9 },
  {
    id: "zzz-membership",
    name: "Inter-Knot Membership",
    price: 19.9,
  },
];

const Zzz = () => {
  const { addToCart } = useCart();

  return (
    <CategoryShell
      title="Zenless Zone Zero"
      subtitle="Recargas oficiales – Entrega segura y rápida"
    >
      {/* PRODUCTOS */}
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
            {/* Placeholder imagen */}
            <div className="h-36 rounded-xl bg-black/40 flex items-center justify-center text-gray-400 mb-4">
              Imagen aquí
            </div>

            <h3 className="font-semibold text-lg mb-2">
              {product.name}
            </h3>

            <p className="text-blue-400 text-xl font-bold mb-4">
              S/ {product.price.toFixed(2)}
            </p>

            <button
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
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

      {/* INFORMACIÓN IMPORTANTE */}
      <div className="mt-12 text-sm text-gray-400 max-w-3xl space-y-3">
        <p className="font-semibold text-white">
          🔐 Datos necesarios para la recarga:
        </p>

        <ul className="list-disc list-inside space-y-1">
          <li>🆔 UID del jugador</li>
          <li>🌐 Servidor</li>
        </ul>

        <p className="pt-4">
          💫 Las recargas se realizan de forma segura directamente en la cuenta del jugador.
        </p>
      </div>
    </CategoryShell>
  );
};

export default Zzz;
