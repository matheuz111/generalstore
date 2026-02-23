import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/layout/Header";
import CartDrawer from "./components/cart/CartDrawer";
import Footer from "./components/layout/Footer";

import Home from "./pages/Home";
import Terms from "./pages/Terms";
import CategoryLayout from "./pages/CategoryLayout";

/* ================= CATEGORÍAS ================= */
import Fortnite from "./pages/Fortnite";
import WildRift from "./pages/WildRift";
import Roblox from "./pages/Roblox";
import Marvel from "./pages/Marvel";
import Pokemon from "./pages/Pokemon";
import Genshin from "./pages/Genshin";
import Zzz from "./pages/Zzz";
import Honkai from "./pages/Honkai";
import Wuwa from "./pages/Wuwa";
import Honor from "./pages/Honor";
import Discord from "./pages/Discord";

/* ================= CUENTA ================= */
import AccountDashboard from "./pages/AccountDashboard";
import AccountLogin from "./pages/account/AccountLogin";
import AccountRegister from "./pages/account/AccountRegister";

/* ================= CARRITO ================= */
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";



const App = () => {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      {/* ================= HEADER ================= */}
      <Header onCartClick={() => setCartOpen(true)} />

      {/* ================= CONTENIDO ================= */}
      <main className="pt-24 min-h-screen bg-gradient-to-b from-[#050816] via-[#070c1f] to-[#03050f]">
        <Routes>
          {/* HOME */}
          <Route path="/" element={<Home />} />

          {/* LEGALES */}
          <Route
            path="/terminos-y-condiciones"
            element={<Terms />}
          />

          {/* ================= CUENTA (ANTES DE /:category) ================= */}
          <Route
            path="/mi-cuenta"
            element={<AccountDashboard />}
          />
          <Route
            path="/mi-cuenta/login"
            element={<AccountLogin />}
          />
          <Route
            path="/mi-cuenta/register"
            element={<AccountRegister />}
          />

          {/* ================= CATEGORÍAS ================= */}
          <Route path="/fortnite" element={<Fortnite />} />
          <Route path="/wild-rift" element={<WildRift />} />
          <Route path="/roblox" element={<Roblox />} />
          <Route path="/marvel-rivals" element={<Marvel />} />
          <Route path="/pokemon-go" element={<Pokemon />} />
          <Route path="/genshin-impact" element={<Genshin />} />
          <Route path="/zenless-zone-zero" element={<Zzz />} />
          <Route path="/wuthering-waves" element={<Wuwa />} />
          <Route path="/honkai-star-rail" element={<Honkai />} />
          <Route path="/honor-of-kings" element={<Honor />} />
          <Route path="/discord" element={<Discord />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orden-confirmada" element={<OrderSuccess />}
/>
          {/* ================= FALLBACK CATEGORÍAS ================= */}
          <Route
            path="/:category"
            element={<CategoryLayout />}
          />

          {/* ================= 404 ================= */}
          <Route
            path="*"
            element={
              <div className="min-h-[70vh] flex flex-col items-center justify-center text-white">
                <h1
                  className="text-6xl font-black mb-4"
                  style={{ fontFamily: "BurbankBig" }}
                >
                  404
                </h1>
                <p className="text-gray-400 text-lg">
                  Página no encontrada
                </p>
              </div>
            }
          />
        </Routes>
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />

      {/* ================= CARRITO ================= */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
      />
    </>
  );
};

export default App;
