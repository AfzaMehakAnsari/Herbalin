import React from "react";
import herbalistImg from "./assets/clinic.png"; // uploaded image

const HerbalistSection = () => {
  return (
    <section className="pt-32 pb-20 bg-[#9bb7aa]"> {/* increased top padding */}
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        {/* Left Image */}
        <div className="md:w-1/2 w-full flex justify-start">
          <img
            src={herbalistImg}
            alt="Herbalist"
            className="w-96 md:w-[36rem] lg:w-[40rem] h-auto"
          />
        </div>

        {/* Right Info */}
        <div className="md:w-1/2 w-full text-white text-left space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold">Dr. Hafsa Abbasi</h2>
          <p className="text-lg md:text-xl leading-relaxed">
            Dr. Hafsa Abbasi is a dedicated herbalist with over 10 years of experience in herbal dermatology. She combines her clinical expertise with teaching experience, helping both patients and students understand the power of natural remedies. As the head of Al-Abbasi Clinic, she is known for her compassionate care and trusted guidance in herbal treatment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HerbalistSection;
