// src/lib/fortniteApi.js

const API_URLS = {
  ES: "https://fortnite-api.com/v2/shop?language=es-419",
  EN: "https://fortnite-api.com/v2/shop?language=en",
};

async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Error al obtener datos: ${res.status}`);
  return res.json();
}

/* ---------- helpers de color/gradiente ---------- */
const RARITY_GRADIENTS = {
  common: ["#3a3f47", "#23272e", "#171a1f"],
  uncommon: ["#3ccf7a", "#1aa95c", "#0e6a3a"],
  rare: ["#2aa7ff", "#0b79d0", "#094b84"],
  epic: ["#a955ff", "#7d38d6", "#4c1f8b"],
  legendary: ["#ff9a2a", "#e66a00", "#993d00"],
  mythic: ["#ffcf33", "#df9a00", "#a46a00"],
  darkseries: ["#6a00ff", "#4700b3", "#2a0066"],
  marvelseries: ["#ff3131", "#b51b1b", "#6f0f0f"],
  starwarsseries: ["#52b6ff", "#286f9e", "#133a54"],
  dcu: ["#00c7ff", "#007aa6", "#003f57"],
  gaminglegends: ["#53f3db", "#199f8d", "#0d5d54"],
};

function hexify(v) {
  if (!v) return null;
  const s = v.startsWith("#") ? v : `#${v}`;
  return /^#[0-9a-fA-F]{6}([0-9a-fA-F]{2})?$/.test(s) ? s : null;
}

function materialHintToGradient(tileMaterial = "") {
  const m = String(tileMaterial || "").toLowerCase();
  if (m.includes("fnmares")) return ["#ff6b1c", "#87167f", "#d53554"];
  if (m.includes("idol")) return ["#ff7a7a", "#e43d3d", "#941f1f"];
  return null;
}

function gradientFrom(entry, rarityTag) {
  const c1 = hexify(entry?.colors?.color1);
  const c2 = hexify(entry?.colors?.color2);
  const c3 = hexify(entry?.colors?.color3);
  if (c1 && c2 && c3) return [c1, c2, c3];
  const mat = entry?.tileBackgroundMaterial || entry?.newDisplayAsset?.tileBackgroundMaterial;
  const hinted = materialHintToGradient(mat);
  if (hinted) return hinted;
  const key = String(rarityTag || "common").toLowerCase();
  return RARITY_GRADIENTS[key] || RARITY_GRADIENTS.common;
}

function gradientCss(parts) {
  if (!parts || parts.length < 2) return undefined;
  const [a, b, c] = parts;
  return c
    ? `linear-gradient(180deg, ${a} 0%, ${b} 55%, ${c} 100%)`
    : `linear-gradient(180deg, ${a} 0%, ${b} 100%)`;
}

function pickImage({ it, entry, bundleImage, fallback }) {
  return (
    bundleImage ||
    it?.images?.featured ||
    it?.images?.icon ||
    it?.images?.smallIcon ||
    it?.albumArt ||
    it?.image ||
    entry?.newDisplayAsset?.materialInstances?.[0]?.images?.Background ||
    entry?.newDisplayAsset?.renderImages?.[0]?.image ||
    fallback ||
    "/placeholder.png"
  );
}

function titleForSection(entry) {
  return entry?.section?.name || entry?.layout?.name || entry?.displayName || "Destacados";
}

function extractSectionsFromEntries(payload) {
  const root = payload?.data;
  if (!root) return { sections: [], vbuckIcon: null };

  const vbuckIcon = root?.vbuckIcon || null;
  const entries = (root.entries || []).filter(e => true);

  const sectionsMap = new Map();
  const order = [];
  const seenCosmeticIds = new Set(); 

  for (const entry of entries) {
    const sectionTitle = titleForSection(entry);
    if (!sectionsMap.has(sectionTitle)) {
      sectionsMap.set(sectionTitle, []);
      order.push(sectionTitle);
    }
    
    const finalPrice = entry.finalPrice || 0;

    const processAndPush = (item, type, rarityGuess = 'common') => {
      const cosmeticId = item.id || entry.offerId;
      if (type !== 'bundle' && seenCosmeticIds.has(cosmeticId)) {
        return;
      }
      const rarityTag = (item.rarity?.value || item.series?.backendValue || rarityGuess).toLowerCase();
      
      sectionsMap.get(sectionTitle).push({
        id: `${entry.offerId}-${cosmeticId}`,
        name: item.name || item.title || "Objeto",
        image: pickImage({ it: item, entry, bundleImage: entry.bundle?.image }),
        vbucks: finalPrice,
        rarity: item.rarity?.displayValue || item.series?.value || "Común",
        rarityTag: rarityTag,
        expiresAt: entry.outDate || null,
        bgGradient: gradientCss(gradientFrom(entry, rarityTag)),
        vbuckIcon: vbuckIcon,
        set: item.set,
        type: item.type,
      });
      seenCosmeticIds.add(cosmeticId);
    };

    const brItems = entry.brItems || [];
    const legoItems = entry.legoKits || [];
    const isExplicitBundle = entry.bundle && entry.bundle.name;
    const isUnnamedBundle = !isExplicitBundle && (brItems.length > 1 || legoItems.length > 1);

    if (isExplicitBundle) {
      processAndPush({ ...entry.bundle, id: entry.offerId }, 'bundle', 'legendary');
      (entry.items || []).forEach(i => seenCosmeticIds.add(i.id));
    } else if (isUnnamedBundle) {
      const mainItem = brItems.find(it => it.type?.value === 'outfit') || legoItems[0] || brItems[0];
      processAndPush({ ...mainItem, id: entry.offerId, name: mainItem.name }, 'bundle', mainItem.rarity?.value || 'epic');
      brItems.forEach(i => seenCosmeticIds.add(i.id));
      legoItems.forEach(i => seenCosmeticIds.add(i.id));
    } else {
      (entry.brItems || []).forEach(item => processAndPush(item, 'cosmetic'));
      (entry.tracks || []).forEach(track => processAndPush(track, 'track', 'rare'));
      (entry.legoKits || []).forEach(kit => processAndPush(kit, 'lego', 'uncommon'));
      (entry.cars || []).forEach(carItem => processAndPush(carItem, 'car', carItem.rarity?.value || 'rare'));
      (entry.items || []).forEach(item => processAndPush(item, 'cosmetic'));
    }
  }

  return order.map(title => ({
    title: title,
    items: sectionsMap.get(title) || []
  })).filter(sec => sec.items.length > 0);
}

export async function fetchShopDual(langKey = "ES") {
  const mainKey = langKey === "EN" ? "EN" : "ES";
  const url = API_URLS[mainKey];
  const data = await fetchJSON(url);
  const sections = extractSectionsFromEntries(data);

  return sections.map(sec => ({
    titleEs: sec.title,
    items: sec.items.map(it => ({
      ...it,
      nameEs: it.name,
      vbuckIcon: it.vbuckIcon,
    }))
  }));
}