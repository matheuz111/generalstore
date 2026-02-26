// src/pages/fortnite/FortnitePaseBatalla.tsx
import FortniteProductLayout from "./FortniteProductLayout";
import type { FnProduct } from "./FortniteProductLayout";

const PRODUCTS: FnProduct[] = [
  { id: "club-6m",    name: "Club de Fortnite - 6 Meses",  desc: "La suscripción mensual se activa por Xbox", price: 99.00,  image: "https://fortnite-api.com/images/cosmetics/br/character_peely/smallicon.png" },
  { id: "club-5m",    name: "Club de Fortnite - 5 Meses",  desc: "La suscripción mensual se activa por Xbox", price: 89.00,  image: "https://fortnite-api.com/images/cosmetics/br/character_peely/smallicon.png" },
  { id: "club-4m",    name: "Club de Fortnite - 4 Meses",  desc: "La suscripción mensual se activa por Xbox", price: 79.00,  image: "https://fortnite-api.com/images/cosmetics/br/character_peely/smallicon.png" },
  { id: "club-3m",    name: "Club de Fortnite - 3 Meses",  desc: "La suscripción mensual se activa por Xbox", price: 69.00,  image: "https://fortnite-api.com/images/cosmetics/br/character_peely/smallicon.png" },
  { id: "club-2m",    name: "Club de Fortnite - 2 Meses",  desc: "La suscripción mensual se activa por Xbox", price: 59.00,  image: "https://fortnite-api.com/images/cosmetics/br/character_peely/smallicon.png" },
  { id: "club-1m",    name: "Club de Fortnite - 1 Mes",    desc: "La suscripción mensual se activa por Xbox", price: 39.00,  image: "https://fortnite-api.com/images/cosmetics/br/character_peely/smallicon.png" },
  { id: "bp-battle",  name: "Battle Pass - Pase de Batalla",desc: "¡Compra ahora el Pase de Batalla!",        price: 19.99,  image: "https://fortnite-api.com/images/cosmetics/br/spid_battlepass/icon.png" },
  { id: "bp-og",      name: "OG Pass - Pase de Orígenes",  desc: "¡Compra ahora el Pase de Orígenes!",       price: 19.99,  image: "https://fortnite-api.com/images/cosmetics/br/spid_battlepass/icon.png" },
  { id: "bp-music",   name: "Music Pass - Pase Musical",   desc: "¡Compra ahora el Pase Musical!",           price: 24.99,  image: "https://fortnite-api.com/images/cosmetics/br/spid_battlepass/icon.png" },
  { id: "bp-lego",    name: "LEGO Pass - Pase de LEGO",    desc: "¡Compra ahora el Pase de LEGO!",           price: 24.99,  image: "https://fortnite-api.com/images/cosmetics/br/spid_battlepass/icon.png" },
];

const FortnitePaseBatalla = () => (
  <FortniteProductLayout
    title="Pase de Batalla"
    subtitle=""
    headerImage="https://fortnite-api.com/images/cosmetics/br/character_peely/featured.png"
    info="Sube de nivel con el Pase de Batalla y desbloquea recompensas épicas."
    products={PRODUCTS}
  />
);

export default FortnitePaseBatalla;