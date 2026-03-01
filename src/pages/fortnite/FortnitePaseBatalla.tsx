// src/pages/fortnite/FortnitePaseBatalla.tsx
import { useLang } from "../../context/LangContext";
import FortniteProductLayout from "./FortniteProductLayout";
import type { FnProduct } from "./FortniteProductLayout";

const PASES: FnProduct[] = [
  // ── Club de Fortnite (4 variantes) ──
  { id: "club-try",    name: "Club de Fortnite 1 Mes\nRegión Turquía",      desc: "", pricePEN: 19.90, image: "/images/fortnite/pases/club-1m.webp" },
  { id: "club-xbox-1", name: "Club de Fortnite 1 Mes\nActivación Vía Xbox", desc: "", pricePEN: 12.50, image: "/images/fortnite/pases/club-1m.webp" },
  { id: "club-xbox-2", name: "Club de Fortnite 2 Mes\nActivación Vía Xbox", desc: "", pricePEN: 27.90, image: "/images/fortnite/pases/club-1m.webp" },
  { id: "club-xbox-3", name: "Club de Fortnite 3 Mes\nActivación Vía Xbox", desc: "", pricePEN: 47.90, image: "/images/fortnite/pases/club-1m.webp" },
  // ── Otros pases ──
  { id: "battle-pass", name: "Battle Pass",  desc: "", pricePEN: 22.90, image: "/images/fortnite/pases/battle-pass.webp" },
  { id: "og-pass",     name: "OG Pass",      desc: "", pricePEN: 22.90, image: "/images/fortnite/pases/og-pass.webp"     },
  { id: "music-pass",  name: "Music Pass",   desc: "", pricePEN: 29.90, image: "/images/fortnite/pases/music-pass.webp"  },
  { id: "lego-pass",   name: "LEGO Pass",    desc: "", pricePEN: 29.90, image: "/images/fortnite/pases/lego-pass.webp"   },
];

const FortnitePaseBatalla = () => {
  const { t } = useLang();

  const infoBox = (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6">
      <h3 className="text-white font-black text-lg" style={{ fontFamily: "BurbankBig" }}>
        {t("fortnite", "bpInfoTitle")}
      </h3>

      {/* Club de Fortnite */}
      <div className="space-y-2">
        <p className="text-white font-bold text-sm">{t("fortnite", "bpClubTitle")}</p>
        <p className="text-white/60 text-sm leading-relaxed">{t("fortnite", "bpClubDesc")}</p>
      </div>

      {/* Battle Pass */}
      <div className="space-y-2 border-t border-white/10 pt-4">
        <p className="text-white font-bold text-sm">{t("fortnite", "bpBattleTitle")}</p>
        <p className="text-white/60 text-sm leading-relaxed">{t("fortnite", "bpBattleDesc")}</p>
      </div>

      {/* Pases Especiales */}
      <div className="space-y-2 border-t border-white/10 pt-4">
        <p className="text-white font-bold text-sm">{t("fortnite", "bpSpecialTitle")}</p>
        <p className="text-white/60 text-sm leading-relaxed">{t("fortnite", "bpSpecialDesc")}</p>
      </div>

      {/* Footer */}
      <div className="space-y-1 text-sm text-white/60 border-t border-white/10 pt-4">
        <p>{t("fortnite", "bpInfoActivation")}</p>
        <p>{t("fortnite", "bpInfoSafe")}</p>
      </div>
    </div>
  );

  return (
    <FortniteProductLayout
      title={t("fortnite", "bpTitle")}
      info=""
      products={PASES}
      infoBox={infoBox}
      variant="pase"
    />
  );
};

export default FortnitePaseBatalla;