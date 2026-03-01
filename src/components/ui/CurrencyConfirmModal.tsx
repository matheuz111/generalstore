// src/components/ui/CurrencyConfirmModal.tsx
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  open: boolean;
  fromCurrency: string;
  toCurrency: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const SYMBOLS: Record<string, string> = { PEN: "S/", USD: "$", EUR: "€" };
const FLAGS: Record<string, string>   = { PEN: "🇵🇪", USD: "🇺🇸", EUR: "🇪🇺" };
const NAMES: Record<string, string>   = { PEN: "Soles peruanos", USD: "Dólar estadounidense", EUR: "Euro" };

const CurrencyConfirmModal = ({ open, fromCurrency, toCurrency, onConfirm, onCancel }: Props) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.85, y: 32, opacity: 0 }}
              animate={{ scale: 1,    y: 0,  opacity: 1 }}
              exit={{   scale: 0.85, y: 32,  opacity: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
              className="relative w-full max-w-sm bg-[#080e1c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
              style={{ boxShadow: "0 0 60px rgba(59,130,246,0.15), 0 24px 80px rgba(0,0,0,0.7)" }}
            >
              {/* Glow top */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full" />

              {/* Header */}
              <div className="px-7 pt-7 pb-0 text-center">
                {/* Icon */}
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                  <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>

                <h2
                  className="text-xl font-black uppercase tracking-wider text-white mb-1"
                  style={{ fontFamily: "'BurbankBig','Arial Black','Impact',sans-serif" }}
                >
                  Cambiar moneda
                </h2>
                <p className="text-sm text-gray-500">¿Confirmas el cambio de divisa?</p>
              </div>

              {/* Currency display */}
              <div className="px-7 py-6 flex items-center justify-center gap-4">
                {/* From */}
                <div className="flex-1 bg-white/4 border border-white/8 rounded-2xl p-4 text-center">
                  <div className="text-3xl mb-1">{FLAGS[fromCurrency]}</div>
                  <div className="text-white font-black text-lg leading-none">{SYMBOLS[fromCurrency]} {fromCurrency}</div>
                  <div className="text-gray-600 text-xs mt-1">{NAMES[fromCurrency]}</div>
                </div>

                {/* Arrow */}
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                  className="text-blue-400 shrink-0"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </motion.div>

                {/* To */}
                <div className="flex-1 bg-blue-500/8 border border-blue-500/25 rounded-2xl p-4 text-center">
                  <div className="text-3xl mb-1">{FLAGS[toCurrency]}</div>
                  <div className="text-blue-300 font-black text-lg leading-none">{SYMBOLS[toCurrency]} {toCurrency}</div>
                  <div className="text-blue-500/60 text-xs mt-1">{NAMES[toCurrency]}</div>
                </div>
              </div>

              {/* Warning note */}
              <div className="mx-7 mb-5 bg-amber-500/8 border border-amber-500/20 rounded-xl px-4 py-3 flex items-start gap-2.5">
                <span className="text-amber-400 text-base shrink-0 mt-0.5">⚠️</span>
                <p className="text-amber-200/70 text-xs leading-relaxed">
                  Los precios del carrito se actualizarán al tipo de cambio de la nueva moneda.
                </p>
              </div>

              {/* Buttons */}
              <div className="px-7 pb-7 flex gap-3">
                <button
                  onClick={onCancel}
                  className="flex-1 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition font-semibold text-sm cursor-pointer active:scale-[0.97]"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm transition cursor-pointer active:scale-[0.97] shadow-lg shadow-blue-600/25"
                  style={{ fontFamily: "'BurbankBig','Arial Black',sans-serif" }}
                >
                  Confirmar
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CurrencyConfirmModal;