import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

interface Props {
  name: string;
  image: string;
  slug: string;
}

const CategoryCard = ({ name, image, slug }: Props) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4 }}
      onClick={handleClick}
      className="group cursor-pointer select-none"
    >
      <div className="relative w-full aspect-[9/12] rounded-2xl overflow-hidden">

        {/* IMAGE */}
        <motion.img
          src={image}
          alt={name}
          className="absolute inset-0 w-full h-full object-contain bg-black"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          draggable={false}
        />

        {/* SOFT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition duration-500" />

        {/* BORDER GLOW */}
        <div className="absolute inset-0 rounded-2xl border border-white/10 group-hover:border-blue-500/70 transition duration-500" />

        {/* TITLE */}
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <h3 className="text-lg font-bold text-white drop-shadow-lg group-hover:text-blue-400 transition">
            {name}
          </h3>
        </div>

      </div>
    </motion.div>
  );
};

export default CategoryCard;
