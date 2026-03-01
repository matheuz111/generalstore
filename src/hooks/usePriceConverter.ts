import { useCurrency } from "../context/CurrencyContext";

// Tipos de cambio respecto al PEN
const PEN_TO: Record<string, number> = {
  PEN: 1,
  USD: 0.27,   // 1 sol ≈ 0.27 USD  (ajusta según tu criterio)
  EUR: 0.25,   // 1 sol ≈ 0.25 EUR
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

  /** Convierte un precio base-PEN a la moneda activa */
  const convert = (basePen: number) => basePen * rate;

  /** Devuelve el precio ya convertido, listo para guardar en el carrito */
  const cartPrice = (basePen: number) => parseFloat(convert(basePen).toFixed(2));

  /** Devuelve una cadena formateada: "S/ 15.90", "$ 4.29", "€ 3.97" */
  const format = (basePen: number) =>
    `${symbol} ${convert(basePen).toFixed(2)}`;

  /** Formatea un precio que YA está en la moneda activa (para el carrito) */
  const formatStored = (price: number) =>
    `${symbol} ${price.toFixed(2)}`;

  return { currency, symbol, convert, cartPrice, format, formatStored };
};