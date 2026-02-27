// src/pages/fortnite/FortnitePaquetes.tsx
//
// 🖼️  IMÁGENES: pon tus archivos en public/images/fortnite/paquetes/
//   y pon la ruta en el campo `image` de cada producto.
//   Ejemplo:  image: "/images/fortnite/paquetes/flowering-chaos.png"
//   Si dejas image: "" se muestra un placeholder automático.

import { useLang } from "../../context/LangContext";
import FortniteProductLayout from "./FortniteProductLayout";
import type { FnProduct } from "./FortniteProductLayout";

const FortnitePaquetes = () => {
  const { t } = useLang();

  const PRODUCTS: FnProduct[] = [
    { id: "pack-flowering", name: "Flowering Chaos Bundle",          desc: t("fortnite", "packDesc"), pricePEN: 79.00, image: "" },
    { id: "pack-koi",       name: "Paquete Reino Koi",               desc: t("fortnite", "packDesc"), pricePEN: 42.00, image: "" },
    { id: "pack-deriva",    name: "Paquete Deriva Infinita",         desc: t("fortnite", "packDesc"), pricePEN: 42.00, image: "" },
    { id: "pack-surfeo",    name: "Paquete de Inicio Surfeo Shaka",  desc: t("fortnite", "packDesc"), pricePEN: 14.99, image: "" },
    { id: "pack-siluro",    name: "Paquete de Misiones de Siluro",   desc: t("fortnite", "packDesc"), pricePEN: 22.00, image: "" },
    { id: "pack-operacion", name: "Paquete de Inicio Operación",     desc: t("fortnite", "packDesc"), pricePEN: 14.99, image: "" },
    { id: "pack-clip",      name: "Paquete Clip al Completo",        desc: t("fortnite", "packDesc"), pricePEN: 39.99, image: "" },
  ];

  return (
    <FortniteProductLayout
      title={t("fortnite", "packagesTitle")}
      info={t("fortnite", "packagesInfo")}
      products={PRODUCTS}
    />
  );
};

export default FortnitePaquetes;