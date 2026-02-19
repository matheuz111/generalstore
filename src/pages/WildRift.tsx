import { motion } from "framer-motion";
import { useCart } from "../context/CartContext";
import CategoryShell from "../components/layout/CategoryShell";

const CATEGORY = "wild-rift";

const products = [
  {
    id: "wc-425",
    name: "425 Wild Cores",
    price: 15.9,
    image: "/images/wildrift/425wc.jpg",
  },
  {
    id: "wc-1000",
    name: "1000 Wild Cores",
    price: 28.9,
    image: "/images/wildrift/1000wc.jpg",
  },
  {
    id: "wc-1850",
    name: "1850 Wild Cores",
    price: 51.9,
    image: "/images/wildrift/1850wc.jpg",
  },
  {
    id: "wc-3275",
    name: "3275 Wild Cores",
    price: 88.9,
    image: "/images/wildrift/3275wc.jpg",
  },
  {
    id: "wc-4800",
    name: "4800 Wild Cores",
    price: 127.9,
    image: "/images/wildrift/4800wc.jpg",
  },
  {
    id: "wc-10000",
    name: "10000 Wild Cores",
    price: 235.9,
    image: "/images/wildrift/10000wc.jpg",
  },
];

const WildRift = () => {
  const { addToCart } = useCart();

  return (
    <CategoryShell
      title="Wild Rift"
      subtitle="Compra Wild Cores para cuentas de League of Legends: Wild Rift en regiones LAN y LAS de forma rápida y segura."
    >
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
            {/* ================= IMAGEN OPTIMIZADA ================= */}
            <div className="h-48 rounded-xl mb-5 overflow-hidden bg-gradient-to-b from-black/40 to-black/70 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain scale-110 transition-transform duration-300 group-hover:scale-125"
                style={{ objectPosition: "center bottom" }}
                draggable={false}
              />
            </div>

            {/* ================= NOMBRE ================= */}
            <h2
              className="text-lg font-bold mb-2"
              style={{ fontFamily: "BurbankSmall" }}
            >
              {product.name}
            </h2>

            {/* ================= PRECIO ================= */}
            <p className="text-blue-400 text-2xl font-black mb-6">
              S/ {product.price.toFixed(2)}
            </p>

            {/* ================= BOTÓN ================= */}
            <button
              onClick={() =>
                addToCart({
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  category: CATEGORY,
                })
              }
              className="w-full bg-blue-600 hover:bg-blue-500 transition py-3 rounded-xl font-bold cursor-pointer"
            >
              Agregar al carrito
            </button>
          </motion.div>
        ))}
      </div>
    </CategoryShell>
  );
};

export default WildRift;
