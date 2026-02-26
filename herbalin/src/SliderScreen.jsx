import React from "react";
import { FiCamera, FiTarget, FiSun } from "react-icons/fi"; // icons instead of images
import "./index.css";

export default function SliderScreen({ onNext }) {
  const slides = [
    {
      title: "Before you start - learn",
      subtitle: "How to make a suitable photo",
      description: 'The smallest possible distance (2-4" or 5-10cm) for a clear frame',
      icon: <FiCamera size={80} />,
    },
    {
      title: "Before you start - learn",
      subtitle: "How to make a suitable photo",
      description: "Keep in focus and center only the skin mark.",
      icon: <FiTarget size={80} />,
    },
    {
      title: "Before you start - learn",
      subtitle: "How to make a suitable photo",
      description: "Make sure lighting is clear and avoid shadows.",
      icon: <FiSun size={80} />,
    },
  ];

  const [current, setCurrent] = React.useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="card">
      <div className="arrow left" onClick={prevSlide}>&#10094;</div>
      <div className="arrow right" onClick={nextSlide}>&#10095;</div>

      <p className="small-title">{slides[current].title}</p>
      <h2>{slides[current].subtitle}</h2>

      <div className="illustration">
        {slides[current].icon}
      </div>

      <p className="description">{slides[current].description}</p>

      <div className="dots">
        {slides.map((_, i) => (
          <span
            key={i}
            className={i === current ? "dot active" : "dot"}
            onClick={() => setCurrent(i)}
          ></span>
        ))}
      </div>

      <button className="btn" onClick={onNext}>
        Got it
      </button>
    </div>
  );
}
