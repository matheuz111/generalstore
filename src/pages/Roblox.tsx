import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import CategoryShell from "../components/layout/CategoryShell";

const robuxDirect = [
  { id: "rbx-80", name: "80 Robux", price: 6.9 },
  { id: "rbx-500", name: "500 Robux", price: 18.9 },
  { id: "rbx-1000", name: "1000 Robux", price: 37.9 },
  { id: "rbx-2000", name: "2000 Robux", price: 75.9 },
];

const robuxGamePass = [
  { id: "gp-2000", name: "2000 Robux (Game Pass)", price: 64.9 },
  { id: "gp-3000", name: "3000 Robux (Game Pass)", price: 95.9 },
  { id: "gp-4000", name: "4000 Robux (Game Pass)", price: 114.9 },
  { id: "gp-5000", name: "5000 Robux (Game Pass)", price: 142.9 },
  { id: "gp-6000", name: "6000 Robux (Game Pass)", price: 169.9 },
  { id: "gp-7000", name: "7000 Robux (Game Pass)", price: 198.9 },
  { id: "gp-8000", name: "8000 Robux (Game Pass)", price: 226.9 },
  { id: "gp-9000", name: "9000 Robux (Game Pass)", price: 254.9 },
  { id: "gp-10000", name: "10000 Robux (Game Pass)", price: 283.9 },
];

const Roblox = () => {
  const { addToCart } = useCart();

  return (
    <CategoryShell
      title="Roblox"
      subtitle="Compra Robux de forma segura y rápida. Entrega inmediata o mediante Game Pass, nosotros cubrimos el tax para que recibas el monto exacto."
    >
      {/* ROBUX DIRECTOS */}
      <section className="mb-16">
        <h2
          className="text-2xl font-black mb-6 uppercase tracking-wider"
          style={{ fontFamily: "BurbankBig" }}
        >
          Robux Disponibles – Entrega Inmediata ⚡
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {robuxDirect.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="bg-[#0f172a]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl"
            >
              <div className="h-32 bg-black/40 rounded-xl mb-4 flex items-center justify-center text-gray-400 text-sm">
                Imagen aquí
              </div>

              <h3 className="font-bold mb-2">{product.name}</h3>

              <p className="text-blue-400 text-xl font-black mb-4">
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
                className="w-full bg-blue-600 hover:bg-blue-500 transition py-2 rounded-xl font-bold cursor-pointer"
              >
                Agregar al carrito
              </button>
            </motion.div>
          ))}
        </div>

        <p className="text-gray-400 text-sm mt-6">
          ⏱ Tiempo de entrega estimado: entre <b>1h a 7h</b>, según disponibilidad.
        </p>
      </section>

      {/* GAME PASS */}
      <section className="mb-16">
        <h2
          className="text-2xl font-black mb-6 uppercase tracking-wider"
          style={{ fontFamily: "BurbankBig" }}
        >
          Robux por Game Pass 💸
        </h2>

        <p className="text-gray-400 max-w-3xl mb-8 text-sm">
          Nosotros cubrimos el <b>tax de Roblox (30%)</b>. Recibirás la cantidad exacta de Robux.
          Debes enviarnos el enlace de tu Game Pass creado con el precio correcto.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {robuxGamePass.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.25 }}
              className="bg-[#0f172a]/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl"
            >
              <div className="h-32 bg-black/40 rounded-xl mb-4 flex items-center justify-center text-gray-400 text-sm">
                Imagen aquí
              </div>

              <h3 className="font-bold mb-2">{product.name}</h3>

              <p className="text-blue-400 text-xl font-black mb-4">
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
                className="w-full bg-blue-600 hover:bg-blue-500 transition py-2 rounded-xl font-bold cursor-pointer"
              >
                Agregar al carrito
              </button>
            </motion.div>
          ))}
        </div>

        <ul className="text-gray-400 text-sm mt-6 space-y-2">
          <li>✔ El pago se procesa entre <b>5 a 7 días</b> luego de la compra.</li>
          <li>❌ No hay reembolsos luego de comprar un Game Pass.</li>
          <li>🛡 No nos responsabilizamos por el estado o seguridad de la cuenta.</li>
        </ul>
      </section>
    </CategoryShell>
  );
};

export default Roblox;
