import { motion } from "framer-motion";
import CategoryShell from "../components/layout/CategoryShell";
import { useCart } from "../context/CartContext";

const products = [
  { id: "gi-60", name: "60 Cristales Génesis", price: 3.9 },
  { id: "gi-300", name: "300 Cristales Génesis", price: 14.9 },
  { id: "gi-980", name: "980 Cristales Génesis", price: 44.9 },
  { id: "gi-1980", name: "1980 Cristales Génesis", price: 87.9 },
  { id: "gi-3280", name: "3280 Cristales Génesis", price: 142.9 },
  { id: "gi-6480", name: "6480 Cristales Génesis", price: 284.9 },
];

const Genshin = () => {
  const { addToCart } = useCart();

  return (
    <CategoryShell
      title="Genshin Impact"
      subtitle="Cristales Génesis oficiales – Entrega segura y confiable"
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

      {/* INFO IMPORTANTE */}
      <div className="mt-12 text-sm text-gray-400 max-w-3xl space-y-3">
        <p className="font-semibold text-white">
          📋 Datos requeridos para realizar el pedido:
        </p>

        <ul className="list-disc list-inside space-y-1">
          <li>🧾 Cuenta</li>
          <li>🔒 Contraseña</li>
          <li>
            🔑 Método de inicio de sesión (Gmail / Facebook / Email / X)
          </li>
          <li>🆔 Nombre del jugador / UID</li>
          <li>🌍 Servidor</li>
        </ul>

        <p className="pt-4">
          ✨ <span className="text-white font-semibold">Bonus x2</span> de
          Cristales Génesis disponible si es tu primera recarga.
        </p>
      </div>
    </CategoryShell>
  );
};

export default Genshin;
