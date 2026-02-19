import { Link } from "react-router-dom";

const Account = () => {
  const isLoggedIn = false; // placeholder por ahora

  return (
    <div className="max-w-6xl mx-auto px-6 py-20 text-white">
      <h1
        className="text-4xl font-black mb-6 uppercase"
        style={{ fontFamily: "BurbankBig" }}
      >
        Mi Cuenta
      </h1>

      {!isLoggedIn ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 max-w-md">
          <p className="text-gray-300 mb-6">
            Inicia sesión o crea una cuenta para ver tus pedidos y gestionar tu información.
          </p>

          <Link
            to="/mi-cuenta/login"
            className="block w-full text-center bg-blue-600 hover:bg-blue-500 transition py-3 rounded-xl font-semibold cursor-pointer"
          >
            Iniciar sesión / Registrarse
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/mi-cuenta/pedidos"
            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-400 transition cursor-pointer"
          >
            📦 Mis Pedidos
          </Link>

          <Link
            to="/mi-cuenta/perfil"
            className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-blue-400 transition cursor-pointer"
          >
            👤 Datos de Cuenta
          </Link>

          <button
            className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 hover:bg-red-500/20 transition cursor-pointer text-left"
          >
            🚪 Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default Account;
