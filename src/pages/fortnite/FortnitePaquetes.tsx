// src/pages/fortnite/FortnitePaquetes.tsx
import FortniteProductLayout from "./FortniteProductLayout";
import type { FnProduct } from "./FortniteProductLayout";

const PRODUCTS: FnProduct[] = [
  { id: "pack-flowering", name: "Fortnite: Flowering Chaos Bundle",        desc: "Adquiere tu paquete ahora!", price: 79.00,  image: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/smallicon.png" },
  { id: "pack-koi",       name: "Fortnite: Paquete Reino Koi",             desc: "Adquiere tu paquete ahora!", price: 42.00,  image: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/smallicon.png" },
  { id: "pack-deriva",    name: "Fortnite: Paquete Deriva infinita",       desc: "Adquiere tu paquete ahora!", price: 42.00,  image: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/smallicon.png" },
  { id: "pack-surfeo",    name: "Fortnite: Paquete de Inicio Surfeo Shaka",desc: "Adquiere tu paquete ahora!", price: 14.99,  image: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/smallicon.png" },
  { id: "pack-siluro",    name: "Fortnite: Paquete de misiones de Siluro", desc: "Adquiere tu paquete ahora!", price: 22.00,  image: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/smallicon.png" },
  { id: "pack-operacion", name: "Fortnite: Paquete de Inicio Operación",   desc: "Adquiere tu paquete ahora!", price: 14.99,  image: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/smallicon.png" },
  { id: "pack-clip",      name: "Fortnite: Paquete Clip al Completo",      desc: "Adquiere tu paquete ahora!", price: 39.99,  image: "https://fortnite-api.com/images/cosmetics/br/cid_a_272_athena_commando_f_prime/smallicon.png" },
];

const FortnitePaquetes = () => (
  <FortniteProductLayout
    title="Paquete de Fortnite"
    subtitle=""
    headerImage="https://fortnite-api.com/images/cosmetics/br/character_peely/featured.png"
    info="Encuentra tu paquete favorito de la Tienda de Fortnite."
    products={PRODUCTS}
  />
);

export default FortnitePaquetes;