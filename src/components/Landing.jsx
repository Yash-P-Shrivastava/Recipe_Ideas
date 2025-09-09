import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="relative flex items-center justify-center h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-yellow-500 to-red-500 animate-gradient" />

      {/* Overlay for slight blur/dark effect */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Main Content */}
      <motion.div
        className="relative text-center text-white z-10"
        initial={{ opacity: 0, y: 70 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5 }}
      >
        <h1 className="text-5xl font-bold mb-4">Hey Taylor 👋</h1>
        <p className="text-xl mb-8">
          Discover recipes that match your taste & mood 🍴
        </p>
        <button
          onClick={() => navigate("/recipies")}
          className="px-6 py-3 text-lg bg-white text-black rounded-2xl shadow-lg hover:bg-gray-200 transition"
        >
          Search Recipes
        </button>
      </motion.div>
    </div>
  );
}
