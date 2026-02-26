import React from "react";
import whyImg from "./assets/why.png";

const WhyAISkinScanner = () => {
  return (
    <section className="py-20 bg-white mt-20"> {/* mt-20 adds margin-top */}
      <div className="max-w-6xl mx-auto px-6 text-left"> {/* text-left for heading */}
        {/* Heading */}
        <h2 className="tips-heading" style={{ textAlign: "left" }}>
          Why is AI Skin Scanner worth using?
        </h2>

        {/* Center Image */}
        <div className="flex justify-center mt-8"> {/* mt-8 adds space between heading and image */}
          <img
            src={whyImg}
            alt="Why AI Skin Scanner"
            className="w-[1000px] max-w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default WhyAISkinScanner;
