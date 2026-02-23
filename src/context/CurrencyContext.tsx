import { createContext, useContext, useState, type ReactNode } from "react";
import { useCart } from "./CartContext"; 

type Currency = "PEN" | "USD" | "EUR";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (vbucks: number) => string;
  convertVbucks: (vbucks: number) => number;
}

const RATES = { PEN: 0.015, USD: 0.0045, EUR: 0.004 }; 
const SYMBOLS = { PEN: "S/", USD: "$", EUR: "€" };

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>("PEN")
  const { clearCart } = useCart() // Ahora funcionará correctamente

  const handleCurrencyChange = (newCurrency: Currency) => {
    if (newCurrency === currency) return

    const confirmed = window.confirm(
      `¿Cambiar a ${newCurrency}? Se vaciará el carrito para actualizar los precios.`
    )

    if (confirmed) {
      setCurrency(newCurrency)
      clearCart() // Evita que un precio de 100 PEN se convierta en 100 USD
    }
  }

  const convertVbucks = (vbucks: number) => vbucks * RATES[currency]

  const formatPrice = (vbucks: number) => {
    const total = convertVbucks(vbucks)
    return `${SYMBOLS[currency]} ${total.toFixed(2)}`
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleCurrencyChange, formatPrice, convertVbucks }}>
      {children}
    </CurrencyContext.Provider>
  )
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency debe usarse dentro de CurrencyProvider");
  return context;
};