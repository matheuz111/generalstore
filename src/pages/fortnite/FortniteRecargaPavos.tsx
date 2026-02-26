// src/pages/fortnite/FortniteRecargaPavos.tsx
import FortniteProductLayout from "./FortniteProductLayout";
import type { FnProduct } from "./FortniteProductLayout";

const PRODUCTS: FnProduct[] = [
  { id: "vb-1000",  name: "Fortnite: 1000 paVos",  desc: "Recarga de paVos rápida y segura", price: 22.00,  image: "https://cdn2.epicgames.com/fortnite/purchase/FORTNITE_1000_BUCKS_01-1200x1600-3571e6d1d1f65f00e78aa5c4ee00af63.jpg" },
  { id: "vb-2800",  name: "Fortnite: 2800 paVos",  desc: "Recarga de paVos rápida y segura", price: 55.00,  image: "https://cdn2.epicgames.com/fortnite/purchase/FORTNITE_2800_BUCKS_01-1200x1600-f8b9de55a76c8e0b6a41b36e07d2d5c6.jpg" },
  { id: "vb-5000",  name: "Fortnite: 5000 paVos",  desc: "Recarga de paVos rápida y segura", price: 85.00,  image: "https://cdn2.epicgames.com/fortnite/purchase/FORTNITE_5000_BUCKS_01-1200x1600-f2dca5b64d7de0b5e71dd94b7d5ce6db.jpg" },
  { id: "vb-13500", name: "Fortnite: 13500 paVos", desc: "Recarga de paVos rápida y segura", price: 199.00, image: "https://cdn2.epicgames.com/fortnite/purchase/FORTNITE_13500_BUCKS_01-1200x1600-8b3c90a4b2aa0f98a6e9db0da2a17012.jpg" },
  { id: "vb-2000",  name: "Fortnite: 2000 paVos",  desc: "Recarga de paVos rápida y segura", price: 42.00,  image: "https://fortnite-api.com/images/vbuck.png" },
  { id: "vb-7800",  name: "Fortnite: 7800 paVos",  desc: "Recarga de paVos rápida y segura", price: 135.00, image: "https://fortnite-api.com/images/vbuck.png" },
  { id: "vb-10000", name: "Fortnite: 10000 paVos", desc: "Recarga de paVos rápida y segura", price: 165.00, image: "https://fortnite-api.com/images/vbuck.png" },
  { id: "vb-6000",  name: "Fortnite: 6000 paVos",  desc: "Recarga de paVos rápida y segura", price: 99.00,  image: "https://fortnite-api.com/images/vbuck.png" },
];

const FortniteRecargaPavos = () => (
  <FortniteProductLayout
    title="Recarga de paVos"
    subtitle=""
    headerImage="https://fortnite-api.com/images/cosmetics/br/character_peely/featured.png"
    info="¡Consigue tus paVos para Fortnite hoy!"
    products={PRODUCTS}
  />
);

export default FortniteRecargaPavos;