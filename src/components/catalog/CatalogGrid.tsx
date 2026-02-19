import CategoryCard from "./CategoryCard";

const categories = [
  {
    name: "Fortnite",
    image: "/images/fortnite.jpg",
    slug: "fortnite",
  },
  {
    name: "Wild Rift",
    image: "/images/wildrift.jpg",
    slug: "wild-rift",
  },
  {
    name: "Marvel Rivals",
    image: "/images/marvel.jpg",
    slug: "marvel-rivals",
  },
  {
    name: "Pokémon GO",
    image: "/images/pokemon.jpg",
    slug: "pokemon-go",
  },
  {
    name: "Roblox",
    image: "/images/roblox.jpg",
    slug: "roblox",
  },
  {
    name: "Genshin Impact",
    image: "/images/genshin.jpg",
    slug: "genshin-impact",
  },
  {
    name: "Zenless Zone Zero",
    image: "/images/zzz.jpg",
    slug: "zenless-zone-zero",
  },
  {
    name: "Honkai Star Rail",
    image: "/images/honkai.jpg",
    slug: "honkai-star-rail",
  },
  {
    name: "Wuthering Waves",
    image: "/images/wuwa.jpg",
    slug: "wuthering-waves",
  },
  {
    name: "Honor of Kings",
    image: "/images/honor.jpg",
    slug: "honor-of-kings",
  },
  {
    name: "Discord",
    image: "/images/discord.jpg",
    slug: "discord",
  },
];

const CatalogGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
      {categories.map((cat) => (
        <CategoryCard
          key={cat.slug}
          name={cat.name}
          image={cat.image}
          slug={cat.slug}
        />
      ))}
    </div>
  );
};

export default CatalogGrid;
