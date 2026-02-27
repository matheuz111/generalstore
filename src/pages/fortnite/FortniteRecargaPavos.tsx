// src/pages/fortnite/FortniteRecargaPavos.tsx
//
// 🖼️  IMÁGENES: pon tus archivos en public/images/fortnite/pavos/
//   Ejemplo:  image: "/images/fortnite/pavos/1000.png"

import { useLang } from "../../context/LangContext";
import FortniteProductLayout from "./FortniteProductLayout";
import type { FnProduct } from "./FortniteProductLayout";

const FortniteRecargaPavos = () => {
  const { t }  = useLang();
  const desc   = t("fortnite", "pavosDesc");

  const PRODUCTS: FnProduct[] = [
    { id: "vb-1000",  name: "1 000 paVos",  desc, pricePEN: 22.00,  image: "" },
    { id: "vb-2000",  name: "2 000 paVos",  desc, pricePEN: 42.00,  image: "" },
    { id: "vb-2800",  name: "2 800 paVos",  desc, pricePEN: 55.00,  image: "" },
    { id: "vb-5000",  name: "5 000 paVos",  desc, pricePEN: 85.00,  image: "" },
    { id: "vb-6000",  name: "6 000 paVos",  desc, pricePEN: 99.00,  image: "" },
    { id: "vb-7800",  name: "7 800 paVos",  desc, pricePEN: 135.00, image: "" },
    { id: "vb-10000", name: "10 000 paVos", desc, pricePEN: 165.00, image: "" },
    { id: "vb-13500", name: "13 500 paVos", desc, pricePEN: 199.00, image: "" },
  ];

  return (
    <FortniteProductLayout
      title={t("fortnite", "pavosTitle")}
      info={t("fortnite", "pavosInfo")}
      products={PRODUCTS}
    />
  );
};

export default FortniteRecargaPavos;