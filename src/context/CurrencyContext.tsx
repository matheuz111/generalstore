// src/context/CurrencyContext.tsx
import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { useCart } from "./CartContext";
import CurrencyConfirmModal from "../components/ui/CurrencyConfirmModal";

type Currency = "PEN" | "USD" | "EUR";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (vbucks: number) => string;
  convertVbucks: (vbucks: number) => number;
}

// Tasas respecto a PEN (base)
const RATES: Record<Currency, number> = { PEN: 0.015, USD: 0.0045, EUR: 0.004 };

// Tasas PEN → moneda para recalcular precios del carrito
const PEN_TO: Record<Currency, number> = { PEN: 1, USD: 0.27, EUR: 0.25 };

const SYMBOLS: Record<Currency, string> = { PEN: "S/", USD: "$", EUR: "€" };

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency,    setCurrencyState] = useState<Currency>("PEN");
  const [modalOpen,   setModalOpen]     = useState(false);
  const [pendingCurr, setPendingCurr]   = useState<Currency | null>(null);

  const { cartItems, addToCart, clearCart } = useCart();

  // Solicita cambio — abre modal
  const setCurrency = useCallback((newCurrency: Currency) => {
    if (newCurrency === currency) return;
    setPendingCurr(newCurrency);
    setModalOpen(true);
  }, [currency]);

  // Confirma cambio: reconvierte precios del carrito sin vaciarlo
  const handleConfirm = useCallback(() => {
    if (!pendingCurr) return;

    const from = currency;
    const to   = pendingCurr;

    if (cartItems.length > 0) {
      // Cada precio está almacenado en `from`. Lo reconvertimos a `to`:
      // precio_PEN = precio_from / PEN_TO[from]
      // precio_to  = precio_PEN * PEN_TO[to]
      const rateFrom = PEN_TO[from];
      const rateTo   = PEN_TO[to];

      // Recrear el carrito con precios actualizados
      const snapshot = cartItems.map(item => ({ ...item }));
      clearCart();

      // Pequeño timeout para que el clear se procese antes de re-agregar
      setTimeout(() => {
        snapshot.forEach(item => {
          const pricePEN = item.price / rateFrom;
          const newPrice = parseFloat((pricePEN * rateTo).toFixed(2));
          // addToCart suma 1, así que lo agregamos quantity veces
          for (let i = 0; i < item.quantity; i++) {
            addToCart({ ...item, price: newPrice });
          }
        });
      }, 0);
    }

    setCurrencyState(to);
    setModalOpen(false);
    setPendingCurr(null);
  }, [currency, pendingCurr, cartItems, clearCart, addToCart]);

  const handleCancel = useCallback(() => {
    setModalOpen(false);
    setPendingCurr(null);
  }, []);

  const convertVbucks = (vbucks: number) => vbucks * RATES[currency];

  const formatPrice = (vbucks: number) => {
    const total = convertVbucks(vbucks);
    return `${SYMBOLS[currency]} ${total.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertVbucks }}>
      {children}

      <CurrencyConfirmModal
        open={modalOpen}
        fromCurrency={currency}
        toCurrency={pendingCurr ?? currency}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency debe usarse dentro de CurrencyProvider");
  return context;
};