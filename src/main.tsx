import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";

import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { CurrencyProvider } from "./context/CurrencyContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CurrencyProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
