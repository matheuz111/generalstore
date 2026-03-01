// src/pages/fortnite/FortnitePaquetes.tsx
import { useLang } from "../../context/LangContext";
import FortniteProductLayout from "./FortniteProductLayout";
import type { FnProduct } from "./FortniteProductLayout";

const FortnitePaquetes = () => {
  const { t } = useLang();

  const PAQUETES: FnProduct[] = [
    { id: "pack-flowering", name: t("fortnite", "packFlowering"), desc: "", pricePEN: 20.90, image: "/images/fortnite/paquetes/bassassin-quest.png"  },
    { id: "pack-koi",       name: t("fortnite", "packKoi"),       desc: "", pricePEN: 40.90, image: "/images/fortnite/paquetes/koi-kingdom.png"          },
    { id: "pack-deriva",    name: t("fortnite", "packDeriva"),    desc: "", pricePEN: 40.90, image: "/images/fortnite/paquetes/infinite-drift.png"    },
    { id: "pack-noche",     name: t("fortnite", "packNoche"),     desc: "", pricePEN: 41.90, image: "/images/fortnite/paquetes/full-clip-pack.png"     },
    { id: "pack-starter",   name: t("fortnite", "packStarter"),   desc: "", pricePEN: 11.90, image: "/images/fortnite/paquetes/operation-brite.png"       },
    { id: "pack-legends",   name: t("fortnite", "packLegends"),   desc: "", pricePEN: 11.50, image: "/images/fortnite/paquetes/shaka-surfin.png"            },
  ];

  const infoBox = (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
      <h3 className="text-white font-black text-lg" style={{ fontFamily: "BurbankBig" }}>
        {t("fortnite", "packagesInfoTitle")}
      </h3>
      <p className="text-white/60 text-sm leading-relaxed">
        {t("fortnite", "packagesInfoDesc")}
      </p>
      <div className="space-y-1 text-sm text-white/60 border-t border-white/10 pt-4">
        <p>{t("fortnite", "packagesInfoNote1")}</p>
        <p>{t("fortnite", "packagesInfoNote2")}</p>
        <p>{t("fortnite", "packagesInfoNote3")}</p>
        <p>{t("fortnite", "packagesInfoSafe")}</p>
      </div>
    </div>
  );

  return (
    <FortniteProductLayout
      title={t("fortnite", "packagesTitle")}
      info=""
      products={PAQUETES}
      infoBox={infoBox}
      variant="packs"
    />
  );
};

export default FortnitePaquetes;