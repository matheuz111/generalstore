import { motion } from "framer-motion";
import CategoryShell from "../components/layout/CategoryShell";
import { useCart } from "../context/CartContext";

const products = [
  { id: "wuwa-60", name: "60 Lunita", price: 4.9 },
  { id: "wuwa-300", name: "300 Lunita", price: 17.9 },
  { id: "wuwa-980", name: "980 Lunita", price: 57.9 },
  { id: "wuwa-1980", name: "1980 Lunita", price: 98.9 },
  { id: "wuwa-3280", name: "3280 Lunita", price: 163.9 },
  { id: "wuwa-6480", name: "6480 Lunita", price: 327.9 },
];

const Wuwa = () => {
  const { addToCart } = useCart();

  return (
    <CategoryShell
      title="Wuthering Waves"
      subtitle="Recargas de Lunita – Entrega segura y confiable"
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
            {/* Imagen placeholder */}
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
      <div className="mt-12 text-sm text-gray-400 max-w-3xl space-y-4">
        <p className="font-semibold text-white">
          📋 Datos requeridos para la recarga:
        </p>

        <ul className="list-disc list-inside space-y-1">
          <li>🧾 Cuenta</li>
          <li>🔒 Contraseña</li>
          <li>
            🔑 Método de inicio de sesión (Gmail / Facebook / Email / X / Kuro)
          </li>
          <li>🆔 UID / Nombre del jugador</li>
          <li>🌍 Servidor</li>
        </ul>

        <p>
          ✨ <span className="text-white font-medium">BONUS x2 Lunita</span> disponible
          para cuentas que nunca hayan recargado.
        </p>

        <p>
          🔁 Si ya recargaste anteriormente, solo se aplicará el bono indicado.
        </p>

        <p>
          🛡️ Recarga realizada de forma segura por nuestro equipo.
        </p>
      </div>
    </CategoryShell>
  );
};

export default Wuwa;
