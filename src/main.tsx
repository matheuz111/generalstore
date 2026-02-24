// src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { CartProvider } from './context/CartContext.tsx'
import { CurrencyProvider } from './context/CurrencyContext.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { LangProvider } from './context/LangContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <CurrencyProvider>
            <LangProvider>
              <App />
            </LangProvider>
          </CurrencyProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)