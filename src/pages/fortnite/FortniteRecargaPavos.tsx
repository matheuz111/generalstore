// src/pages/fortnite/FortniteRecargaPavos.tsx
import { useLang } from "../../context/LangContext";
import FortniteProductLayout from "./FortniteProductLayout";
import type { FnProduct } from "./FortniteProductLayout";

const FortniteRecargaPavos = () => {
  const { t } = useLang();

  const PAVOS: FnProduct[] = [
    { id: "pavos-1000",  name: t("fortnite", "pavos1000"),  desc: "", pricePEN: 20.90,  image: "/images/fortnite/pavos/vbucks-1000.png"  },
    { id: "pavos-2800",  name: t("fortnite", "pavos2800"),  desc: "", pricePEN: 52.90,  image: "/images/fortnite/pavos/vbucks-2800.png"  },
    { id: "pavos-5000",  name: t("fortnite", "pavos5000"),  desc: "", pricePEN: 76.90,  image: "/images/fortnite/pavos/vbucks-5000.png"  },
    { id: "pavos-13500", name: t("fortnite", "pavos13500"), desc: "", pricePEN: 179.90, image: "/images/fortnite/pavos/vbucks-13500.png" },
  ];

  const infoBox = (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
      <h3 className="text-white font-black text-lg" style={{ fontFamily: "BurbankBig" }}>
        {t("fortnite", "pavosInfoBoxTitle")}
      </h3>
      <p className="text-white/60 text-sm leading-relaxed">
        {t("fortnite", "pavosInfoBoxDesc")}
      </p>
      <div className="border-t border-white/10 pt-4 space-y-2">
        <p className="text-white/80 font-bold text-sm">{t("fortnite", "pavosInfoReqs")}</p>
        <ul className="space-y-1 text-white/60 text-sm">
          <li>{t("fortnite", "pavosInfoReq1")}</li>
          <li>{t("fortnite", "pavosInfoReq2")}</li>
        </ul>
      </div>
      <div className="space-y-1 text-sm text-white/60 border-t border-white/10 pt-4">
        <p>{t("fortnite", "pavosInfoDelivery")}</p>
        <p>{t("fortnite", "pavosInfoFriends")}</p>
        <p>{t("fortnite", "pavosInfoSafe")}</p>
      </div>
    </div>
  );

  return (
    <FortniteProductLayout
      title={t("fortnite", "pavosTitle")}
      info=""
      products={PAVOS}
      infoBox={infoBox}
      variant="pavos"
    />
  );
};

export default FortniteRecargaPavos;