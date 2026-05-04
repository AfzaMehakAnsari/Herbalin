import React from "react";
import { FaGlobe, FaLightbulb, FaChartLine, FaHeart } from "react-icons/fa";
import { MdScience, MdOutlineHealthAndSafety } from "react-icons/md";
import { AiOutlineRobot } from "react-icons/ai";
import { FiSmartphone } from "react-icons/fi";
import { GiTargetShot } from "react-icons/gi";
import icon from "./assets/icon.png";
import { motion } from "framer-motion";
const About = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
  const visionItems = [
    {
      title: "Accessibility for all",
      desc: "No matter where you live, if you have access to a smartphone, you have access to technology.",
      icon: <FaGlobe />,
    },
    {
      title: "Innovation",
      desc: "We use the most up-to-date AI screening technology to provide you with accurate results.",
      icon: <FaLightbulb />,
    },
    {
      title: "Professionalism",
      desc: "We hold ourselves to the highest possible standards and work towards making our services efficient.",
      icon: <FaChartLine />,
    },
    {
      title: "Empathy",
      desc: "Battling a skin ailment can be a difficult challenge. We will guide you every step of the way.",
      icon: <FaHeart />,
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Upload Image",
      desc: "Upload a clear image of the affected skin area.",
    },
    {
      number: "02",
      title: "AI Analysis",
      desc: "Our AI model analyzes the image using advanced computer vision.",
    },
    {
      number: "03",
      title: "Identification",
      desc: "The system identifies possible skin condition and severity level.",
    },
    {
      number: "04",
      title: "Instant Results",
      desc: "You receive instant results along with helpful guidance.",
    },
  ];

  const trustFeatures = [
    "Secure image processing",
    "No misuse of personal data",
    "Fast and reliable AI-based analysis",
    "Expert-approved herbal recommendations",
    "Built with responsibility and transparency",
  ];

  return (
    <div className="bg-white min-h-screen font-['Poppins'] antialiased overflow-x-hidden">
      <div className="w-full flex justify-center">
        <div className="w-[90%]">
          {/* --- HERO SECTION --- */}
          <section className="max-w-7xl mx-auto px-6 pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            {/* LEFT SIDE */}
            <motion.div
              className="lg:w-1/2 text-left"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <h1 className="text-[40px] sm:text-[55px] md:text-[70px] lg:text-[80px] font-normal mb-6 tracking-tight text-black uppercase leading-[0.9] font-['Righteous']">
                ABOUT <br /> <span className="text-[#1B5E44]">HERBALIN</span>
              </h1>

              <p className="text-[16px] sm:text-[18px] md:text-[20px] lg:text-[22px] text-gray-600 leading-relaxed max-w-lg mb-10 sm:mb-12 font-medium">
                AI Skin Scanner is an intelligent platform designed to help
                individuals understand their skin health through advanced image
                analysis.
              </p>

              <button className="bg-[#1B5E44] text-white px-8 sm:px-10 lg:px-12 py-4 sm:py-5 rounded-full text-[14px] sm:text-[16px] font-bold hover:brightness-110 transition-all shadow-xl uppercase tracking-widest">
                Explore Technology
              </button>
            </motion.div>

            {/* RIGHT SIDE */}
            <motion.div
              className="lg:w-1/2 w-full min-h-[300px] sm:min-h-[250px] md:min-h-[350px] lg:h-[500px] bg-[#1B5E44] rounded-[80px] p-10 sm:p-12 lg:p-16 text-white shadow-2xl flex flex-col justify-center relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>

              <h2 className="text-[28px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-normal mb-6 sm:mb-8 leading-tight font-['Righteous']">
                AI-Powered Technology
              </h2>

              <ul className="space-y-4 sm:space-y-6 text-[16px] sm:text-[18px] lg:text-[20px] font-medium">
                {["Easy to use", "Provides accuracy", "Enhances capacity"].map(
                  (item, i) => (
                    <li
                      key={i}
                      className={`flex items-center gap-4 ${i !== 0 ? "border-t border-white/10 pt-4" : ""}`}
                    >
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                      {item}
                    </li>
                  ),
                )}
              </ul>
            </motion.div>
          </section>

          {/* --- OUR VISION SECTION --- */}
          <section className="max-w-7xl mx-auto px-6 py-20">
            <h2 className="text-4xl font-normal text-black tracking-tight uppercase font-['Righteous'] mb-12 text-center">
              Our Vision
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {visionItems.map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-[#f9fafb] p-6 sm:p-8 rounded-[40px] text-center cursor-pointer
                   hover:shadow-xl hover:-translate-y-2 hover:bg-white transition-all duration-300"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  viewport={{
                    once: false, 
                    amount: 0.3,
                  }}
                  whileHover={{
                    scale: 1.05,
                  }}
                >
                  <div className="text-4xl mb-6 text-[#1B5E44] flex justify-center">
                    {item.icon}
                  </div>

                  <h3 className="text-xl font-normal mb-4 font-['Righteous'] uppercase tracking-tight">
                    {item.title}
                  </h3>

                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* --- THE PROBLEM WE SOLVE --- */}
          <section className="max-w-7xl mx-auto px-6 py-20">
            <div className="flex flex-col lg:flex-row gap-12 items-stretch">
              {/* LEFT */}
              <motion.div
                className="lg:w-1/2 bg-[#1a1a1a] rounded-[60px] p-12 md:p-16 text-white flex flex-col justify-center relative overflow-hidden"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  ease: "easeOut",
                }}
                viewport={{
                  once: false,
                  amount: 0.35,
                }}
              >
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                    <line x1="12" y1="9" x2="12" y2="13" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                </div>

                <h2 className="text-[40px] md:text-[42px] lg:text-[50px] font-normal leading-tight font-['Righteous'] uppercase mb-8">
                  The Problem <br />
                  <span className="text-[#c2e1d6]">We Solve</span>
                </h2>

                <p className="text-gray-300 text-lg leading-relaxed">
                  Many people ignore early signs of skin conditions due to{" "}
                  <span className="text-white font-semibold">
                    lack of awareness
                  </span>{" "}
                  or limited access to professional consultation.
                </p>

                <p className="text-gray-300 text-lg leading-relaxed mt-6">
                  In many cases, delayed attention can lead to{" "}
                  <span className="text-white font-semibold">
                    more serious skin complications
                  </span>
                  .
                </p>
              </motion.div>

              {/* RIGHT */}
              <motion.div
                className="lg:w-1/2 flex flex-col justify-center p-6 md:p-12"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.9,
                  ease: "easeOut",
                  delay: 0.1,
                }}
                viewport={{
                  once: false,
                  amount: 0.35,
                }}
              >
                <div className="inline-block bg-[#f0fdf4] text-[#1B5E44] px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-6">
                  Our Mission
                </div>

                <h3 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-8">
                  Empowering you with{" "}
                  <span className="text-[#1B5E44]">quick insights</span> for
                  better skin health.
                </h3>

                <p className="text-xl text-gray-600 leading-relaxed font-medium">
                  AI Skin Scanner was created to provide users with quick
                  insights about their skin condition, encouraging{" "}
                  <span className="text-black font-extrabold">
                    early awareness
                  </span>{" "}
                  and informed decision-making.
                </p>

                <motion.div
                  className="mt-10 flex items-center gap-4 text-[#1B5E44] font-bold uppercase tracking-tighter"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    ease: "easeOut",
                  }}
                  viewport={{ once: false, amount: 0.3 }}
                >
                  <span className="w-12 h-[2px] bg-[#1B5E44]"></span>
                  <span>Bridge the Gap in Healthcare</span>
                </motion.div>
              </motion.div>
            </div>
          </section>
          {/* --- HOW IT WORKS --- */}
          <section className="max-w-7xl mx-auto px-6 py-24 bg-gray-50 rounded-[60px] my-10">
            <h2 className="text-5xl font-normal text-black tracking-tight uppercase font-['Righteous'] text-center mb-16">
              How It Works
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {steps.map((step, i) => (
                <motion.div
                  key={i}
                  className="text-center p-6 rounded-2xl cursor-pointer
                   hover:bg-white hover:shadow-xl hover:-translate-y-2
                   transition-all duration-300"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.15, 
                    duration: 0.6,
                    ease: "easeOut",
                  }}
                  viewport={{
                    once: false, 
                    amount: 0.3,
                  }}
                  whileHover={{
                    scale: 1.05,
                  }}
                >
                  <span className="text-4xl font-normal text-[#1B5E44]/20 mb-4 block font-['Righteous']">
                    {step.number}
                  </span>

                  <h4 className="text-lg font-bold mb-3 uppercase tracking-tight">
                    {step.title}
                  </h4>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* --- COLLABORATION --- */}
          <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="relative bg-[#fcfdfd] rounded-[60px] flex flex-col lg:flex-row overflow-hidden border border-gray-100 shadow-2xl shadow-green-900/5 min-h-[500px]">
              {/* Background Image */}
              <div
                className="absolute inset-0 z-0"
                style={{
                  backgroundImage: "url('/herbalist-bg.jpg')",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  opacity: 0.25,
                }}
              />

              {/* LEFT SIDE */}
              <div className="relative z-10 lg:w-[40%] bg-[#1B5E44]/90 backdrop-blur-sm p-20 flex flex-col justify-center items-center text-center">
                <div className="w-16 h-16 bg-[#c2e1d6] rounded-full flex items-center justify-center mb-6 shadow-md">
                  <img
                    src={icon}
                    alt="icon"
                    className="w-14 h-15 object-contain"
                  />
                </div>

                <h2 className="text-[36px] font-normal uppercase tracking-tight leading-tight text-white font-['Righteous']">
                  In Collaboration <br /> With Herbalist
                </h2>
              </div>

              {/* RIGHT SIDE */}
              <div className="relative z-10 lg:w-[60%] p-8 sm:p-10 lg:p-20 flex flex-col justify-center bg-white/60 backdrop-blur-md">
                <h3 className="text-2xl font-bold text-[#1B5E44] mb-8 leading-tight">
                  To provide well-rounded guidance, AI Skin Scanner works in
                  collaboration with our trusted herbal partner.
                </h3>

                <div className="space-y-6 text-gray-800 text-lg leading-relaxed">
                  <p>
                    All herbal treatment recommendations provided on our
                    platform are carefully reviewed and approved by{" "}
                    <span className="font-extrabold text-[#1B5E44]">
                      Al-Abbasi Clinic
                    </span>
                    .
                  </p>

                  <p>
                    Our collaboration is led by{" "}
                    <span className="font-semibold text-[#1B5E44]">
                      Dr. Hafsa Abbasi
                    </span>
                    , a highly experienced herbal specialist with{" "}
                    <span className="font-semibold">
                      10+ years of expertise
                    </span>{" "}
                    in skin care and natural treatments.
                  </p>

                  <p>
                    Through this partnership, we ensure users receive{" "}
                    <span className="italic">
                      safe, holistic, and expert-backed herbal guidance
                    </span>{" "}
                    for better skin wellness.
                  </p>
                </div>

                <div className="mt-10 p-6 sm:p-7 lg:p-8 bg-[#1B5E44] rounded-[30px] border-l-[12px] border-[#c2e1d6]">
                  <p className="text-[14px] font-bold text-white uppercase tracking-widest italic">
                    Our Focus: Supportive recommendations — not medical
                    replacements.
                  </p>
                </div>
              </div>
            </div>

            {/* --- MAP SECTION --- */}
            <div className="mt-12 flex justify-center">
              <div className="w-full max-w-4xl h-[250px] sm:h-[300px] md:h-[250px] sm:h-[300px] md:h-[350px] rounded-[30px] overflow-hidden shadow-lg border">
                <iframe
                  title="Matab Al-Abbasi Location"
                  src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d231765.06251828367!2d66.7112607!3d24.8184166!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33dd014ace8d7%3A0x659d146d6c2894d6!2sMatab%20Al-Abbasi!5e0!3m2!1sen!2s!4v1775944501250!5m2!1sen!2s"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </section>

          {/* --- WHY TRUST US --- */}
          <section className="max-w-7xl mx-auto px-6 py-32">
            <div className="flex flex-col lg:flex-row gap-10 sm:gap-14 lg:gap-16 items-center justify-between">
              <div className="lg:w-3/5">
                <h2 className="text-[32px] sm:text-[40px] md:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[50px] lg:text-[64px] font-normal mb-8 text-black tracking-tight uppercase font-['Righteous'] leading-none">
                  Why <br /> <span className="text-[#1B5E44]">Trust Us</span>
                </h2>
                <p className="text-xl text-gray-500 font-medium mb-12 max-w-lg leading-relaxed">
                  Your privacy and safety are our top priorities. We maintain
                  ethical standards while delivering meaningful health insights.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {trustFeatures.map((feature, i) => (
                    <div
                      key={i}
                      className="p-6 bg-gray-50 rounded-[32px] border border-gray-100 flex items-center gap-5 hover:bg-white hover:shadow-xl transition-all group"
                    >
                      <div className="w-10 h-10 min-w-10 min-h-10 bg-white shadow-sm rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-[#1B5E44] transition-colors">
                        <svg
                          className="w-5 h-5 text-[#1B5E44] group-hover:text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                      <span className="text-[15px] font-bold text-gray-800 uppercase tracking-tight">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-[35%] bg-[#1B5E44] rounded-[60px] p-16 text-white relative flex flex-col justify-center shadow-2xl min-h-[500px]">
                <h3 className="text-3xl font-normal mb-8 font-['Righteous'] uppercase tracking-tight">
                  Our Commitment
                </h3>
                <p className="text-xl leading-relaxed opacity-90 italic font-medium mb-12">
                  "We prioritize data encryption and ethical AI practices to
                  ensure that your skin health journey is as safe as it is
                  insightful."
                </p>
                <div className="flex items-center justify-center gap-12 w-full">
                  <span className="whitespace-nowrap flex items-center justify-center px-7 py-3 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-widest border border-white/20 leading-none">
                    Verified AI
                  </span>

                  <span className="whitespace-nowrap flex items-center justify-center px-7 py-3 bg-white/10 backdrop-blur-md rounded-full text-[11px] font-black uppercase tracking-widest border border-white/20 leading-none">
                    Privacy First
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* --- MEET THE CREATORS --- */}
          <section className="max-w-7xl mx-auto px-6 py-24 mb-10">
            <h2 className="text-[40px] md:text-[28px] sm:text-[36px] md:text-[42px] lg:text-[50px] font-normal leading-tight font-['Righteous'] uppercase text-[#1B5E44] mb-12 text-center">
              Meet The <span className="text-black">Team</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  name: "Laiba Shakeel",
                  initials: "LS",
                  line1: "Backend Developer",
                  line2: "MERN Stack Developer",
                },
                {
                  name: "Afza Mehak Ansari",
                  initials: "AMA",
                  line1: "AI Developer",
                  line2: "AI-powered Healthcare Enthusiast",
                },
                {
                  name: "Muhammad Bin Qasim",
                  initials: "MBQ",
                  line1: "Frontend Developer",
                  line2: "UI/UX Design Specialist",
                },
                {
                  name: "Engr. Misbah Perveen",
                  initials: "EMP",
                  line1: "Project Lead & Engineer",
                  line2: "System Architecture Expert",
                },
              ].map((member, index) => (
                <motion.div
                  key={index}
                  className="bg-[#f0fdf4] rounded-[40px] overflow-hidden flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-7 lg:p-8 relative shadow-sm border border-[#e2f5e9] cursor-pointer
                   hover:shadow-2xl hover:-translate-y-2 hover:bg-white transition-all duration-500"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: index * 0.12,
                    duration: 0.7,
                    ease: "easeOut",
                  }}
                  viewport={{
                    once: false,
                    amount: 0.3,
                  }}
                  whileHover={{ scale: 1.03 }}
                >
                  {/* Decorative Circle */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-[#c2e1d6] rounded-bl-full opacity-30" />

                  {/* Initials Circle */}
                  <motion.div
                    className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-white rounded-full flex-shrink-0 border-4 border-[#c2e1d6] flex items-center justify-center shadow-lg z-10"
                    whileHover={{ rotate: 3, scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <span className="text-[#1B5E44] text-3xl font-['Righteous']">
                      {member.initials}
                    </span>
                  </motion.div>

                  {/* Text Content */}
                  <div className="flex flex-col text-center sm:text-left z-10">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      Hi, I'm{" "}
                      <span className="text-[#1B5E44]">{member.name}</span>
                    </h3>

                    <div className="text-md text-gray-600 leading-snug font-medium">
                      <p>{member.line1}</p>
                      <p>{member.line2}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
          {/* --- DISCLAIMER SECTION --- */}
          <section className="max-w-5xl mx-auto px-6 py-20">
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[50px] p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute -top-6 -left-6 text-gray-100 rotate-12">
                <svg
                  width="150"
                  height="150"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2L1 21h22L12 2zm0 3.45L19.53 19H4.47L12 5.45zM11 16h2v2h-2v-2zm0-6h2v4h-2v-4z" />
                </svg>
              </div>
              <h2 className="text-3xl md:text-4xl font-normal font-['Righteous'] uppercase text-gray-900 mb-8 relative z-10">
                Disclaimer
              </h2>
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-medium max-w-3xl mx-auto relative z-10">
                <p>
                  AI Skin Scanner is intended for{" "}
                  <span className="text-black font-bold">
                    educational and informational purposes only.
                  </span>
                </p>
                <p>
                  It{" "}
                  <span className="text-red-600 font-bold">
                    does not replace
                  </span>{" "}
                  professional medical advice. Always consult a qualified
                  healthcare professional.
                </p>
                <p className="bg-[#f0fdf4] p-6 rounded-2xl border-l-4 border-[#1B5E44] text-[#1B5E44]">
                  Herbal recommendations provided are{" "}
                  <span className="font-bold">supportive in nature</span> and
                  should not be considered a substitute for clinical treatment.
                </p>
              </div>
            </div>
          </section>

          {/* --- OUR FUTURE VISION --- */}
          <section className="max-w-7xl mx-auto px-6 py-24">
            <div className="relative bg-[#1B5E44] rounded-[30px] sm:rounded-[50px] lg:rounded-[80px] p-12 md:p-24 overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1B5E44] rounded-full blur-[120px] -mr-64 -mt-64 opacity-50"></div>
              <div className="relative z-10 text-center mb-20">
                <h2 className="text-[45px] md:text-[60px] font-normal leading-tight font-['Righteous'] uppercase text-white mb-6 tracking-tight">
                  Our Future <span className="text-[#c2e1d6]">Vision</span>
                </h2>
                <p className="text-[#c2e1d6] text-xl font-medium tracking-[0.2em] uppercase">
                  The Roadmap to Innovation
                </p>
              </div>
              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    title: "Expand Categories",
                    desc: "Broadening our AI scope to cover more diverse skin conditions.",
                    icon: <MdScience />,
                  },
                  {
                    title: "Enhance Accuracy",
                    desc: "Refining our computer vision models with deeper datasets.",
                    icon: <GiTargetShot />,
                  },
                  {
                    title: "Mobile Experience",
                    desc: "Developing a native app for seamless, on-the-go skin analysis.",
                    icon: <FiSmartphone />,
                  },
                  {
                    title: "Expert Support",
                    desc: "Integrating live links to professional dermatological advice.",
                    icon: <MdOutlineHealthAndSafety />,
                  },
                  {
                    title: "Global Access",
                    desc: "Breaking barriers to make skin health awareness truly universal.",
                    icon: <FaGlobe />,
                  },
                  {
                    title: "Digital Assistant",
                    desc: "Creating an all-in-one smarter, safer skin health companion.",
                    icon: <AiOutlineRobot />,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="group p-8 bg-white/5 border border-white/10 rounded-[40px] hover:bg-white/10 transition-all duration-500 backdrop-blur-sm"
                  >
                    <div className="text-4xl mb-6 text-[#c2e1d6] transform group-hover:scale-110 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h4 className="text-white text-xl font-normal font-['Righteous'] uppercase mb-3 tracking-wide">
                      {item.title}
                    </h4>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
              <div className="relative z-10 mt-20 pt-12 border-t border-white/10 text-center">
                <p className="text-white text-2xl md:text-3xl font-medium italic max-w-4xl mx-auto leading-relaxed">
                  "Our vision is to create a{" "}
                  <span className="text-[#c2e1d6] font-bold not-italic">
                    smarter, safer, and more accessible
                  </span>{" "}
                  digital skin health assistant."
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;