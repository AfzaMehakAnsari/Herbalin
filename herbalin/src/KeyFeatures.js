import React from "react";
import featureImg from "./assets/key_feature.jpg";
import kfImg from "./assets/kf.png";

export default function FeatureSection() {
  return (
    <div className="w-full px-4 md:px-10 mt-10">
      {/* Feature Section */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between mt-10 gap-4">
        {/* Left Image */}
        <div className="md:w-1/2 w-full flex justify-center">
          <img
            src={featureImg}
            alt="Feature"
            className="w-10/12 md:w-10/12 h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Right Image */}
        <div className="md:w-1/2 w-full flex justify-center">
          <img
            src={kfImg}
            alt="KF"
            className="w-1/2 md:w-10/12 h-auto rounded-lg shadow-md"
          />
        </div>
      </section>
    </div>
  );
}
