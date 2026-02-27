// src/pages/fortnite/FortnitePaseBatalla.tsx
//
// 🖼️  IMÁGENES: pon tus archivos en public/images/fortnite/pases/
//   Ejemplo:  image: "/images/fortnite/pases/club-6m.png"

import { useLang } from "../../context/LangContext";
import FortniteProductLayout from "./FortniteProductLayout";
import type { FnProduct } from "./FortniteProductLayout";

const FortnitePaseBatalla = () => {
  const { t } = useLang();

  const PRODUCTS: FnProduct[] = [
    { id: "club-6m",   name: "Club de Fortnite – 6 Meses",   desc: t("fortnite", "bpClubDesc"),   pricePEN: 99.00, image: "" },
    { id: "club-5m",   name: "Club de Fortnite – 5 Meses",   desc: t("fortnite", "bpClubDesc"),   pricePEN: 89.00, image: "" },
    { id: "club-4m",   name: "Club de Fortnite – 4 Meses",   desc: t("fortnite", "bpClubDesc"),   pricePEN: 79.00, image: "" },
    { id: "club-3m",   name: "Club de Fortnite – 3 Meses",   desc: t("fortnite", "bpClubDesc"),   pricePEN: 69.00, image: "" },
    { id: "club-2m",   name: "Club de Fortnite – 2 Meses",   desc: t("fortnite", "bpClubDesc"),   pricePEN: 59.00, image: "" },
    { id: "club-1m",   name: "Club de Fortnite – 1 Mes",     desc: t("fortnite", "bpClubDesc"),   pricePEN: 39.00, image: "" },
    { id: "bp-battle", name: "Battle Pass – Pase de Batalla", desc: t("fortnite", "bpBattleDesc"), pricePEN: 19.99, image: "" },
    { id: "bp-og",     name: "OG Pass – Pase de Orígenes",   desc: t("fortnite", "bpOGDesc"),     pricePEN: 19.99, image: "" },
    { id: "bp-music",  name: "Music Pass – Pase Musical",    desc: t("fortnite", "bpMusicDesc"),  pricePEN: 24.99, image: "" },
    { id: "bp-lego",   name: "LEGO Pass – Pase de LEGO",     desc: t("fortnite", "bpLegoDesc"),   pricePEN: 24.99, image: "" },
  ];

  return (
    <FortniteProductLayout
      title={t("fortnite", "bpTitle")}
      info={t("fortnite", "bpInfo")}
      products={PRODUCTS}
    />
  );
};

export default FortnitePaseBatalla;