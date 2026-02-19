import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CartDrawer = ({ open, onClose }: Props) => {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
  } = useCart();

  const total: number = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems: number = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* OVERLAY */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* DRAWER */}
          <motion.aside
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0b1120] border-l border-white/10 z-50 p-6 overflow-y-auto shadow-2xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold tracking-wide">
                🛒 Tu Carrito ({totalItems})
              </h2>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl cursor-pointer transition"
                aria-label="Cerrar carrito"
              >
                ✕
              </button>
            </div>

            {/* CONTENIDO */}
            {cartItems.length === 0 ? (
              <div className="text-center mt-20 text-gray-400">
                <p className="text-lg font-semibold">
                  Tu carrito está vacío
                </p>
                <p className="text-sm mt-2">
                  Agrega productos para comenzar tu compra
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-5">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5"
                    >
                      {/* IMAGEN */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-28 object-contain rounded-md bg-black/30 p-1"
                      />

                      {/* INFO */}
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm leading-snug">
                          {item.name}
                        </h4>

                        {/* CONTROLES DE CANTIDAD */}
                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="w-8 h-8 bg-white/10 rounded-md hover:bg-white/20 active:scale-95 transition cursor-pointer"
                            aria-label="Disminuir cantidad"
                          >
                            −
                          </button>

                          <span className="font-semibold text-white min-w-[20px] text-center">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="w-8 h-8 bg-white/10 rounded-md hover:bg-white/20 active:scale-95 transition cursor-pointer"
                            aria-label="Aumentar cantidad"
                          >
                            +
                          </button>
                        </div>

                        {/* PRECIO */}
                        <p className="text-blue-400 font-semibold mt-3">
                          S/ {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>

                      {/* ELIMINAR */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-500 text-xl cursor-pointer transition"
                        aria-label="Eliminar producto"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-lg font-semibold flex justify-between">
                    <span>Total:</span>
                    <span className="text-blue-400">
                      S/ {total.toFixed(2)}
                    </span>
                  </p>

                  <button
                    className="mt-5 w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition rounded-lg py-3 font-semibold shadow-lg shadow-blue-600/30 cursor-pointer"
                  >
                    Proceder al Pago
                  </button>

                  <button
                    onClick={clearCart}
                    className="mt-3 w-full text-sm text-gray-400 hover:text-white transition cursor-pointer"
                  >
                    Vaciar carrito
                  </button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
