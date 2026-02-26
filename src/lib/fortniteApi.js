// src/lib/fortniteApi.js
//NO TOCAR ya funciona xd

const API_URL = "https://fortnite-api.com/v2/shop";

function vbucksToSoles(vbucks) {
  return parseFloat(((vbucks / 1000) * 27).toFixed(2));
}

function getEntryImage(entry) {
  if (entry.bundle?.image) return entry.bundle.image;

  if (entry.newDisplayAsset?.renderImages?.length > 0) {
    const brImage = entry.newDisplayAsset.renderImages.find(
      (r) => r.productTag === "Product.BR"
    );
    if (brImage?.image) return brImage.image;
    if (entry.newDisplayAsset.renderImages[0]?.image)
      return entry.newDisplayAsset.renderImages[0].image;
  }

  const firstItem = entry.brItems?.[0];
  if (firstItem?.images?.featured) return firstItem.images.featured;
  if (firstItem?.images?.icon) return firstItem.images.icon;

  if (entry.tracks?.[0]?.albumArt) return entry.tracks[0].albumArt;

  return null;
}

function buildEntryCard(entry, vbuckIcon) {
  const isBundle = !!entry.bundle;
  const brCount  = entry.brItems?.length || 0;
  const isTrack  = entry.tracks?.length > 0 && brCount === 0;

  let name, description, typeDisplay, rarity, series;

  if (isBundle) {
    name        = entry.bundle.name;
    description = entry.bundle.info || `${brCount} items`;
    typeDisplay = "Bundle";
    rarity      = entry.brItems?.[0]?.rarity || null;
    series      = entry.brItems?.[0]?.series || null;
  } else if (isTrack) {
    const track = entry.tracks[0];
    name        = track.title;
    description = `${track.artist}${track.album ? ` • ${track.album}` : ""}`;
    typeDisplay = "Jam Track";
    rarity      = null;
    series      = null;
  } else if (brCount >= 1) {
    const item  = entry.brItems[0];
    name        = item.name;
    description = brCount > 1 ? `Pack de ${brCount} items` : (item.description || "");
    typeDisplay = brCount > 1 ? "Pack" : (item.type?.displayValue || "");
    rarity      = item.rarity || null;
    series      = item.series || null;
  } else {
    name        = entry.devName || "Item";
    description = "";
    typeDisplay = "";
    rarity      = null;
    series      = null;
  }

  const vbucks         = entry.finalPrice;
  const originalVbucks = entry.regularPrice && entry.regularPrice !== entry.finalPrice
    ? entry.regularPrice : null;

  return {
    id:      entry.offerId,
    offerId: entry.offerId,

    name,
    nameEs: name,

    description,
    image:       getEntryImage(entry),
    typeDisplay,

    rarity:       rarity?.value || "common",
    rarityDisplay: rarity?.displayValue || "",
    series:       series?.value || null,

    vbucks,
    originalVbucks,
    soles:         vbucksToSoles(vbucks),
    originalSoles: originalVbucks ? vbucksToSoles(originalVbucks) : null,
    vbuckIcon,

    isBundle,
    isTrack,
    banner:   entry.banner?.value || null,
    giftable: !!entry.giftable,

    layoutName: entry.layout?.name || "Otros",
    layoutId:   entry.layout?.id   || "otros",
    tileSize:   entry.tileSize     || "Size_1_x_1",

    bgGradient: entry.colors
      ? `linear-gradient(135deg, #${entry.colors.color1?.slice(0,6)}22, #${entry.colors.color2?.slice(0,6)}44)`
      : undefined,

    inDate:  entry.inDate,
    outDate: entry.outDate,

    bundleItems: isBundle
      ? entry.brItems?.map((item) => ({
          id:    item.id,
          name:  item.name,
          type:  item.type?.displayValue || "",
          image: item.images?.icon || item.images?.smallIcon || null,
        }))
      : null,
  };
}

export async function fetchShopDual(_lang = "ES") {
  const langCode = _lang === "EN" ? "en" : "es";
  const res = await fetch(`${API_URL}?language=${langCode}`);
  if (!res.ok) throw new Error(`Error ${res.status} al cargar la tienda de Fortnite`);
  const data = await res.json();

  const vbuckIcon = data.data?.vbuckIcon || "https://fortnite-api.com/images/vbuck.png";
  const entries   = data.data?.entries   || [];

  const cards = entries
    .filter(
      (entry) =>
        entry.finalPrice > 0 ||
        entry.bundle          ||
        entry.brItems?.length > 0 ||
        entry.tracks?.length  > 0
    )
    .map((entry) => buildEntryCard(entry, vbuckIcon));

  const sectionsMap = {};
  for (const card of cards) {
    const key = card.layoutId;
    if (!sectionsMap[key]) {
      sectionsMap[key] = {
        id:      key,
        titleEs: card.layoutName, 
        items:   [],
      };
    }
    sectionsMap[key].items.push(card);
  }

  return Object.values(sectionsMap);
}