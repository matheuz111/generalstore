import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AccountDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/mi-cuenta/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-24 text-white">
      <h1
        className="text-5xl font-black uppercase tracking-widest mb-10"
        style={{ fontFamily: "BurbankBig" }}
      >
        Mi Cuenta
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {/* PERFIL */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h2 className="text-xl font-bold mb-4 text-blue-400">
            Información de Perfil
          </h2>

          <div className="space-y-3 text-sm">
            <p>
              <span className="text-gray-400">Usuario:</span>{" "}
              <b>{user.username}</b>
            </p>
            <p>
              <span className="text-gray-400">Correo:</span>{" "}
              <b>{user.email}</b>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-6 bg-red-600 hover:bg-red-500 transition px-5 py-2 rounded-xl font-semibold cursor-pointer"
          >
            Cerrar sesión
          </button>
        </div>

        {/* ACCIONES FUTURAS */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
          <h2 className="text-xl font-bold mb-4 text-blue-400">
            Opciones
          </h2>

          <ul className="space-y-3 text-sm">
            <li className="text-gray-400">
              📦 Historial de órdenes (próximamente)
            </li>
            <li className="text-gray-400">
              🔐 Seguridad de la cuenta (próximamente)
            </li>
            <li className="text-gray-400">
              ⚙️ Preferencias (próximamente)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
