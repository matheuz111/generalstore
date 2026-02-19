import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AccountLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Página a la que volver luego del login
  const redirectTo =
    (location.state as { from?: string })?.from || "/mi-cuenta";

  const handleLogin = async () => {
    setError("");

    if (!identifier || !password) {
      setError("Completa todos los campos");
      return;
    }

    setLoading(true);

    const success = await login(identifier, password);

    setLoading(false);

    if (!success) {
      setError("Usuario o contraseña incorrectos");
      return;
    }

    navigate(redirectTo, { replace: true });
  };

  return (
    <div className="max-w-md mx-auto px-6 py-24 text-white">
      <h2
        className="text-4xl font-black mb-8 uppercase text-center tracking-widest"
        style={{ fontFamily: "BurbankBig" }}
      >
        Iniciar Sesión
      </h2>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-5 backdrop-blur-xl">

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Usuario o correo"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          className="w-full bg-black/40 px-4 py-3 rounded-lg outline-none border border-white/10 focus:border-blue-500 transition"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-black/40 px-4 py-3 rounded-lg outline-none border border-white/10 focus:border-blue-500 transition"
        />

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition cursor-pointer"
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>

        <p className="text-sm text-center text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link
            to="/mi-cuenta/register"
            className="text-blue-400 hover:text-blue-300 transition cursor-pointer"
          >
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AccountLogin;
