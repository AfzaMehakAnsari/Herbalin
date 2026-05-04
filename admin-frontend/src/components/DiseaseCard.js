import { FaArrowRight, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function DiseaseCard({
  title,
  value,
  percent,
  subtitle,
  type, // "acne" | "eczema"
}) {
  const isAcne = type === "acne";
  const navigate = useNavigate();

  const [count, setCount] = useState(0);

  // COUNT ANIMATION
  useEffect(() => {
    let start = 0;
    const duration = 800;
    const increment = value / (duration / 16);

    const counter = setInterval(() => {
      start += increment;

      if (start >= value) {
        setCount(value);
        clearInterval(counter);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [value]);

  const handleClick = () => {
    if (isAcne) {
      navigate("acne");
    } else {
      navigate("eczema");
    }
  };

  return (
    <div
      className={`relative p-6 rounded-2xl border transition hover:shadow-lg ${
        isAcne
          ? "border-[#1B5E44]/30 bg-gradient-to-br from-[#e6f4ef] to-white"
          : "border-[#1B5E44]/20 bg-gradient-to-br from-[#f0fdf9] to-white"
      }`}
    >
      {/* TOP ROW */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-sm text-[#1B5E44]">
          {title.toUpperCase()}
        </h3>

        <div className="flex items-center gap-1 text-xs px-3 py-1 rounded-full font-medium bg-[#1B5E44]/10 text-[#1B5E44]">
          {isAcne ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
          {percent}
        </div>
      </div>

      {/* VALUE (ANIMATED) */}
      <h1 className="text-5xl font-bold text-[#1B5E44]">
        {count}
      </h1>

      {/* SUBTEXT */}
      <p className="text-gray-500 text-sm mt-2">
        {subtitle || "Cases detected in users"}
      </p>

      {/* PROGRESS BAR */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 h-2 rounded-full">
          <div
            className="bg-[#1B5E44] h-2 rounded-full"
            style={{ width: percent }}
          />
        </div>
      </div>

      {/* ARROW BUTTON */}
      <div className="absolute right-6 bottom-12">
        <button
          onClick={handleClick}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-md cursor-pointer hover:scale-110 transition"
        >
          <FaArrowRight className="text-[#1B5E44]" />
        </button>
      </div>
    </div>
  );
}