import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useCurrency } from "../../context/CurrencyContext"; // Asegúrate de tener este import

interface HeaderProps {
  onCartClick: () => void;
}

// 1. Definimos el CurrencySelector sin el 'export default'
const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex bg-black/40 p-1 rounded-lg border border-white/10">
      {(["PEN", "USD", "EUR"] as const).map((curr) => (
        <button
          key={curr}
          onClick={() => setCurrency(curr)}
          className={`px-3 py-1 rounded-md text-xs font-bold transition ${
            currency === curr ? "bg-blue-600 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          {curr}
        </button>
      ))}
    </div>
  );
};

// 2. Componente Header principal
const Header = ({ onCartClick }: HeaderProps) => {
  const { cartItems } = useCart();

  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.quantity,
    0
  );

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/70 backdrop-blur-xl border-b border-white/10">
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
            style={{ fontFamily: "'Rubik Spray Paint', system-ui" }} // Cambio de BurbankBig a Rubik Spray Paint
          >
            KIDSTORE
          </span>
        </Link>

        {/* ACTIONS */}
        <div className="flex items-center gap-8 text-sm font-medium">

          {/* INTEGRACIÓN: Insertamos el selector aquí */}
          <CurrencySelector />

          {/* MI CUENTA */}
          <Link
            to="/mi-cuenta"
            className="cursor-pointer select-none hover:text-blue-400 transition"
            style={{ fontFamily: "BurbankSmall" }}
          >
            Mi Cuenta
          </Link>

          {/* CARRITO */}
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

// 3. Solo un export default al final
export default Header;