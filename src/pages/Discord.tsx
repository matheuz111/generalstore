import { motion } from "framer-motion";
import CategoryShell from "../components/layout/CategoryShell";
import { useCart } from "../context/CartContext";
import { usePriceConverter } from "../hooks/usePriceConverter";

const products = [
  { id: "discord-nitro-mensual",  name: "Discord Nitro Mensual",         description: "Con acceso a cuenta",                                                        basePen: 18  },
  { id: "discord-nitro-anual",    name: "Discord Nitro Anual",           description: "Con acceso a cuenta",                                                        basePen: 150 },
  { id: "discord-nitro-nuevo-3m", name: "Discord Nitro 3 Meses",        description: "Solo para cuentas que nunca tuvieron Nitro",                                  basePen: 20  },
  { id: "discord-boost-2x-3m",   name: "Mejoras de Servidor x2 (3 Meses)", description: "Server Boosts",                                                           basePen: 30  },
];

const Discord = () => {
  const { addToCart } = useCart();
  const { format, cartPrice, symbol } = usePriceConverter();

  return (
    <CategoryShell
      title="Discord"
      subtitle="Nitro, Boosts y Personalización de Perfil"
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

            <h3 className="font-semibold text-lg mb-1">{product.name}</h3>
            <p className="text-sm text-gray-400 mb-3">{product.description}</p>

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

        {/* Tarjeta especial: sin precio */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.25 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl"
        >
          <div className="h-36 rounded-xl bg-black/40 flex items-center justify-center text-gray-400 mb-4">
            Imagen aquí
          </div>
          <h3 className="font-semibold text-lg mb-1">Decoraciones y Efectos</h3>
          <p className="text-sm text-gray-400 mb-3">
            50% de descuento en decoraciones, efectos de perfil, placas y lotes
          </p>
          <p className="text-green-400 font-semibold mt-4">
            Disponible con Nitro activo
          </p>
        </motion.div>
      </div>

      <div className="mt-6 text-xs text-gray-500 text-right">
        Precios en {symbol} · Moneda configurable desde el encabezado
      </div>

      <div className="mt-12 text-sm text-gray-400 max-w-3xl space-y-4">
        <p className="font-semibold text-white">📌 Información importante:</p>
        <ul className="list-disc list-inside space-y-1">
          <li>🔐 Algunos productos requieren acceso temporal a la cuenta.</li>
          <li>🆕 El Nitro para nuevos usuarios solo funciona si la cuenta nunca tuvo Nitro.</li>
          <li>🚀 Entrega rápida y soporte durante todo el proceso.</li>
          <li>🎨 Decoraciones y efectos disponibles solo para cuentas con Nitro activo.</li>
        </ul>
        <p>⚠️ No hay reembolsos una vez aplicado el servicio.</p>
      </div>
    </CategoryShell>
  );
};

export default Discord;