import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function StatCard({ title, value, icon, route }) {
  const [count, setCount] = useState(0);
  const navigate = useNavigate();

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

  return (
    <div
      onClick={() => route && navigate(route)}   // 🔥 NAVIGATION HERE
      className="bg-white p-6 rounded-2xl shadow-md flex justify-between items-center 
      transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer"
    >
      <div>
        <p className="text-gray-500 text-sm">{title}</p>

        <h1 className="text-3xl font-bold text-gray-900">
          {count}
        </h1>
      </div>

      <div className="bg-[#1B5E44] text-white p-4 rounded-xl text-xl 
      transition-all duration-300 hover:scale-110">
        {icon}
      </div>
    </div>
  );
}