import { useParams } from "react-router-dom";
import WildRift from "./WildRift";

const CategoryLayout = () => {
  const { category } = useParams();

  switch (category) {
    case "wildrift":
      return <WildRift />;

    // futuras categorías
    // case "discord":
    //   return <Discord />;

    // case "genshin-impact":
    //   return <GenshinImpact />;

    default:
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-white">
          <h1 className="text-4xl font-bold mb-4">
            Categoría no encontrada
          </h1>
          <p className="text-gray-400">
            Esta categoría aún no está disponible.
          </p>
        </div>
      );
  }
};

export default CategoryLayout;
