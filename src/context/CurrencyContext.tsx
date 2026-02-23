import React, { createContext, useContext, useState, ReactNode } from "react";

type Currency = "PEN" | "USD" | "EUR";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPrice: (vbucks: number) => string;
  convertVbucks: (vbucks: number) => number;
}

const RATES = { PEN: 0.015, USD: 0.0045, EUR: 0.004 }; // Basado en pricing.js
const SYMBOLS = { PEN: "S/", USD: "$", EUR: "€" };

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>("PEN");

  const convertVbucks = (vbucks: number) => vbucks * RATES[currency];

  const formatPrice = (vbucks: number) => {
    const total = convertVbucks(vbucks);
    return `${SYMBOLS[currency]} ${total.toFixed(2)}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, convertVbucks }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error("useCurrency debe usarse dentro de CurrencyProvider");
  return context;
};