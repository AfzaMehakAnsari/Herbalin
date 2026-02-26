import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // ✅ IMPORTANT
import "@fontsource/righteous";
import "@fontsource/poppins";
import acneImg from "./assets/acnepic.png";
import eczemaImg from "./assets/eczemapic.png";

export default function HeroSection() {
  const navigate = useNavigate(); // ✅ DEFINE navigate

  const infoSlides = [
    {
      heading: "Acne & Pimples",
      description:
        "A skin condition that occurs when hair follicles become clogged with fat and dead skin cells.",
      risk: "⚠ Medium risk",
      image: acneImg,
    },
    {
      heading: "Eczema",
      description:
        "Inflammatory skin disease of various origins, worsens quality of life and affects general well-being.",
      risk: "⚠ High risk",
      image: eczemaImg,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? infoSlides.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === infoSlides.length - 1 ? 0 : prev + 1
    );
  };

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === infoSlides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [infoSlides.length]);

  const currentSlide = infoSlides[currentIndex];

  return (
    <section className="w-full flex justify-center mt-10">
      <div className="relative w-[90%] flex justify-between items-start">
        {/* WHITE CURVED OVERLAY */}
        <div className="absolute left-0 top-0 h-full w-[55%] bg-white rounded-tr-[350px] z-10"></div>

        {/* LEFT TEXT */}
        <div className="relative z-20 flex flex-col ml-5 mt-20">
          <h3 className="tracking-[0.4em] font-righteous text-black text-3xl ml-3">
            SKIN CHECK
          </h3>

          <h1
            className="text-7xl font-extrabold text-black leading-tight"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            AI SCANNER
          </h1>

          <p className="max-w-xl text-gray-700 text-lg leading-relaxed">
            Upload your skin image and let our AI analyze acne, pigmentation,
            and skin issues within seconds — with accurate severity and layer
            detection.
          </p>

          {/* ✅ BUTTON NAVIGATION */}
          <button
            onClick={() => navigate("/scan")}
            className="bg-[#1B5E44] hover:bg-[#154635] text-white px-6 py-3 rounded font-semibold transition-colors w-fit font-poppins text-base mt-4"
          >
            Scan disease
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative z-0 w-[650px] h-auto">
          <img
            key={currentSlide.image}
            src={currentSlide.image}
            alt={currentSlide.heading}
            className="w-full h-auto object-cover transition-opacity duration-1000 ease-in-out opacity-100"
          />

          {/* INFO BOX */}
          <div className="absolute bottom-4 left-24 w-[300px] bg-white/60 rounded-2xl p-4 shadow-lg">
            <h3 className="text-[#154635] font-bold text-xl tracking-wide">
              {currentSlide.heading}
            </h3>

            <span className="inline-flex items-center gap-1 bg-yellow-400/80 text-white text-base px-4 pr-28 py-2 rounded-full mt-1">
              {currentSlide.risk}
            </span>

            <p className="text-black text-sm mt-2 leading-relaxed">
              {currentSlide.description}
            </p>

            {/* NAV BUTTONS */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-4">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-[#154635] text-white flex items-center justify-center text-3xl shadow hover:bg-[#1B5E44] transition"
              >
                ‹
              </button>

              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-[#154635] text-white flex items-center justify-center text-3xl shadow hover:bg-[#1B5E44] transition"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}