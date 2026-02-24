// src/components/ui/LangToggle.tsx
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "../../context/LangContext";

const LangToggle = () => {
  const { lang, setLang } = useLang();
  const isES = lang === "ES";

  return (
    <button
      onClick={() => setLang(isES ? "EN" : "ES")}
      aria-label="Toggle language"
      className="relative w-12 h-12 cursor-pointer select-none"
      style={{ perspective: "120px" }}
    >
      {/* Cube wrapper — flips on Y axis */}
      <motion.div
        className="relative w-full h-full"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateX: isES ? 0 : 180 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* ── FACE FRONT: ES ── */}
        <div
          className="absolute inset-0 rounded-xl flex flex-col overflow-hidden border border-white/20 shadow-lg"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* top half — active */}
          <div className="flex-1 flex items-center justify-center bg-blue-600">
            <span className="text-[11px] font-black tracking-widest text-white">ES</span>
          </div>
          {/* bottom half — inactive */}
          <div className="flex-1 flex items-center justify-center bg-white/10">
            <span className="text-[11px] font-black tracking-widest text-gray-400">EN</span>
          </div>
        </div>

        {/* ── FACE BACK: EN (rotated 180° on X) ── */}
        <div
          className="absolute inset-0 rounded-xl flex flex-col overflow-hidden border border-white/20 shadow-lg"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateX(180deg)",
          }}
        >
          {/* top half — active (visually bottom when flipped) */}
          <div className="flex-1 flex items-center justify-center bg-white/10">
            <span className="text-[11px] font-black tracking-widest text-gray-400">ES</span>
          </div>
          <div className="flex-1 flex items-center justify-center bg-blue-600">
            <span className="text-[11px] font-black tracking-widest text-white">EN</span>
          </div>
        </div>
      </motion.div>

      {/* Glow ring on hover */}
      <span className="absolute inset-0 rounded-xl ring-0 hover:ring-2 ring-blue-500/60 transition-all duration-200 pointer-events-none" />
    </button>
  );
};

export default LangToggle;