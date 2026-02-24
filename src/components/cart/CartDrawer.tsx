// src/components/cart/CartDrawer.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";
import { useLang } from "../../context/LangContext";
import { useNavigate } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
}

const SYMBOLS: Record<string, string> = { PEN: "S/", USD: "$", EUR: "€" };

const CartDrawer = ({ open, onClose }: Props) => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, clearCart } = useCart();
  const { currency } = useCurrency();
  const { t } = useLang();

  const symbol = SYMBOLS[currency] ?? "S/";
  const fmt = (n: number) => `${symbol} ${n.toFixed(2)}`;

  const total      = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const totalItems = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handleCheckout = () => { onClose(); navigate("/checkout"); };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* OVERLAY */}
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 cursor-pointer"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* DRAWER */}
          <motion.aside
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#0b1120] border-l border-white/10 z-50 p-6 overflow-y-auto shadow-2xl"
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold tracking-wide">
                🛒 {t("cart", "title")} ({totalItems})
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white text-2xl cursor-pointer transition"
                aria-label={t("cart", "close")}
              >
                ✕
              </button>
            </div>

            {/* CONTENIDO */}
            {cartItems.length === 0 ? (
              <div className="text-center mt-20 text-gray-400">
                <p className="text-lg font-semibold">{t("cart", "empty")}</p>
                <p className="text-sm mt-2">{t("cart", "emptyHint")}</p>
              </div>
            ) : (
              <>
                <div className="space-y-5">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/5"
                    >
                      <img
                        src={item.image || "/images/placeholder.png"}
                        alt={item.name}
                        className="w-20 h-28 object-contain rounded-md bg-black/30 p-1"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm leading-snug">{item.name}</h4>

                        <div className="flex items-center gap-3 mt-3">
                          <button
                            onClick={() => decreaseQuantity(item.id)}
                            className="w-8 h-8 bg-white/10 rounded-md hover:bg-white/20 active:scale-95 transition cursor-pointer"
                            aria-label={t("cart", "decrease")}
                          >−</button>
                          <span className="font-semibold text-white min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQuantity(item.id)}
                            className="w-8 h-8 bg-white/10 rounded-md hover:bg-white/20 active:scale-95 transition cursor-pointer"
                            aria-label={t("cart", "increase")}
                          >+</button>
                        </div>

                        <p className="text-blue-400 font-semibold mt-3">
                          {fmt(item.price * item.quantity)}
                        </p>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-500 text-xl cursor-pointer transition"
                        aria-label={t("cart", "remove")}
                      >✕</button>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-lg font-semibold flex justify-between">
                    <span>{t("cart", "total")}</span>
                    <span className="text-blue-400">{fmt(total)}</span>
                  </p>

                  <button
                    onClick={handleCheckout}
                    className="mt-5 w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition rounded-lg py-3 font-semibold shadow-lg shadow-blue-600/30 cursor-pointer"
                  >
                    {t("cart", "checkout")}
                  </button>

                  <button
                    onClick={clearCart}
                    className="mt-3 w-full text-sm text-gray-400 hover:text-white transition cursor-pointer"
                  >
                    {t("cart", "clear")}
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