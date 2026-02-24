import { Link } from "react-router-dom";
import {
  FaWhatsapp,
  FaFacebook,
  FaFacebookMessenger,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaDiscord,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#18181C] text-gray-400 py-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto text-center text-white">

        {/* LOGO + NAME */}
        <div className="flex flex-col items-center gap-4 mb-6 select-none">
          <img
            src="/images/logo.png"
            alt="KIDSTORE"
            className="w-16 h-16 object-contain"
            draggable={false}
          />

          <h3
            className="text-4xl font-black tracking-[0.15em] uppercase leading-none"
            style={{ fontFamily: "BurbankBig" }}
          >
            KIDSTORE
          </h3>
        </div>

        {/* FRASE */}
        <p
          className="text-gray-400 max-w-xl mx-auto mb-10 text-sm"
          style={{ fontFamily: "BurbankSmall" }}
        >
          Tu tienda digital gamer de confianza. Seguridad, rapidez y atención personalizada en cada compra.
        </p>

        {/* HORARIO */}
        <div className="mb-10">
          <h4
            className="text-lg mb-2 text-blue-400 uppercase tracking-wider"
            style={{ fontFamily: "BurbankSmall" }}
          >
            Horario de Atención
          </h4>

          <p className="text-gray-300 text-sm">
            Lunes a Viernes: 9:00 AM – 12:00 AM
          </p>
          <p className="text-gray-300 text-sm">
            Sábados y Domingos: 2:00 PM – 12:00 AM
          </p>
        </div>

        {/* REDES */}
        <div className="flex justify-center flex-wrap gap-6 text-2xl mb-10">
          <a
            href="https://wa.me/51983454837"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:text-green-400 transition"
          >
            <FaWhatsapp />
          </a>

          <a
            href="https://www.facebook.com/kidstore.gg/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:text-blue-500 transition"
          >
            <FaFacebook />
          </a>

          <a
            className="cursor-pointer hover:text-blue-400 transition"
          >
            <FaFacebookMessenger />
          </a>

          <a
            href="https://www.instagram.com/kidstore.peru/"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:text-pink-500 transition"
          >
            <FaInstagram />
          </a>

          <a
            href="https://www.tiktok.com/@kidstoreperu"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:text-white transition"
          >
            <FaTiktok />
          </a>

          <a
            href="https://www.youtube.com/@TutorialesTfm"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:text-red-500 transition"
          >
            <FaYoutube />
          </a>

          <a
            href="https://discord.gg/kistore"
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:text-indigo-400 transition"
          >
            <FaDiscord />
          </a>
        </div>

        {/* TERMINOS */}
        <div className="mb-4">
          <Link
            to="/terminos-y-condiciones"
            className="text-sm text-gray-400 hover:text-blue-400 transition cursor-pointer"
          >
            Términos y Condiciones
          </Link>
        </div>

        {/* COPYRIGHT */}
        <div className="text-xs text-gray-500 select-none">
          © {new Date().getFullYear()} KIDSTORE. Todos los derechos reservados.
        </div>

      </div>
    </footer>
  );
};

export default Footer;
