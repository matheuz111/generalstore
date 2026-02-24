// src/components/layout/Header.tsx

import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext";

interface HeaderProps {
  onCartClick: () => void;
}

const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex gap-2">
      {(["PEN", "USD", "EUR"] as const).map((lib) => (
        <button
          key={lib}
          onClick={() => setCurrency(lib)}
          className={`px-2 py-1 rounded font-bold transition-colors ${
            currency === lib ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-300 hover:bg-white/20'
          }`}
        >
          {lib}
        </button>
      ))}
    </div>
  );
};

const Header = ({ onCartClick }: HeaderProps) => {
  const { cartItems } = useCart();
  
  // SE ELIMINÓ LA LÍNEA: const { currency, setCurrency } = useCurrency(); 
  // Ya que estos valores se usan dentro de <CurrencySelector /> y no aquí directamente.

  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#18181C]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 text-white">

        {/* LOGO + NAME */}
        <Link
          to="/"
          className="flex items-center gap-4 select-none cursor-pointer hover:opacity-90 transition"
        >
          <img
            src="/images/logo.png"
            alt="KIDSTORE"
            className="w-16 h-16 object-contain"
            draggable={false}
          />

          <span
            className="text-[2.75rem] font-black tracking-[0.15em] uppercase leading-none"
            style={{ fontFamily: "'Rubik Spray Paint', system-ui" }}
          >
            KIDSTORE
          </span>
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-8 text-sm font-medium">

          <CurrencySelector />

          <Link
            to="/mi-cuenta"
            className="cursor-pointer select-none hover:text-blue-400 transition"
            style={{ fontFamily: "BurbankSmall" }}
          >
            Mi Cuenta
          </Link>

          <button
            onClick={onCartClick}
            className="relative text-xl cursor-pointer select-none hover:text-blue-400 transition"
            aria-label="Abrir carrito"
          >
            🛒
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-xs px-2 py-0.5 rounded-full font-bold leading-none">
                {totalItems}
              </span>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};

export default Header;