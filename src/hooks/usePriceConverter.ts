import { useCurrency } from "../context/CurrencyContext";

// Tipos de cambio respecto al PEN
const PEN_TO: Record<string, number> = {
  PEN: 1,
  USD: 0.30,  
  EUR: 0.25,  
};

const SYMBOLS: Record<string, string> = {
  PEN: "S/",
  USD: "$",
  EUR: "€",
};

export const usePriceConverter = () => {
  const { currency } = useCurrency();

  const symbol = SYMBOLS[currency] ?? "S/";
  const rate   = PEN_TO[currency]  ?? 1;

  const convert = (basePen: number) => basePen * rate;

  const cartPrice = (basePen: number) => parseFloat(convert(basePen).toFixed(2));

  const format = (basePen: number) =>
    `${symbol} ${convert(basePen).toFixed(2)}`;

  /** Formatea un precio que YA está en la moneda activa (para el carrito) */
  const formatStored = (price: number) =>
    `${symbol} ${price.toFixed(2)}`;

  return { currency, symbol, convert, cartPrice, format, formatStored };
};