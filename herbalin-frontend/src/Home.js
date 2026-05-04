// ============================================================
//  Home.js  –  All sections combined
//  Sections: HeroSection · FeatureSection · Diseases · TipsList
//            AISkinScanner · CollaborationSection · Reviews · Contact
// ============================================================

import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

// ── icons ────────────────────────────────────────────────────
import {
    FaChevronLeft, FaChevronRight,
    FaCamera, FaEye, FaCalendarAlt,
    FaArrowLeft, FaLayerGroup, FaLeaf,
    FaExclamationCircle, FaSearch,
    FaTint, FaClock, FaCalendarCheck,
} from "react-icons/fa";
import { IoWarning } from "react-icons/io5";
import { Brain, Clock, Smartphone, CircleDollarSign } from "lucide-react";

// ── framer-motion ────────────────────────────────────────────
import { motion } from "motion/react";

// ── fonts ────────────────────────────────────────────────────
import "@fontsource/righteous";
import "@fontsource/poppins";

// ── assets  (adjust paths if your project structure differs) ─
import acneImg from "./assets/acnepic.png";
import eczemaImg from "./assets/eczemapic.png";
import herbalinLogo from "./assets/herbalin_logo.png";
import severeEczema from "./assets/severe_eczema.png";
import mildAcne from "./assets/mild_acne.png";
import mildEczema from "./assets/mild_eczema.png";
import moderateAcne from "./assets/moderate_acne.png";
import moderateEczema from "./assets/moderate_eczema.png";
import severeAcne from "./assets/severe_acne.png";
import icon from "./assets/icon.png";
import herbalinvideo from "./assets/Herbalin-video.mp4";
import herbalinThumbnail from "./assets/Herbalin-thumbnail.png";

// ── TipsCard (inline — no separate file needed) ──────────────
import TipsCard from "./TipsCard";

// ============================================================
// SHARED HELPERS
// ============================================================

/** Simple scroll-reveal hook */
function useScrollReveal(ref) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add("hs-visible");
                    observer.disconnect();
                }
            },
            { threshold: 0.12 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
}

/** Returns inline style for scroll-triggered fade-up */
function useFadeStyles(visible) {
    const fadeUp = (delay) => ({
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    });
    const fadeLeft = (delay) => ({
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-28px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    });
    const fadeRight = (delay) => ({
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(28px)",
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    });
    return { fadeUp, fadeLeft, fadeRight };
}

// ── framer-motion variant helpers ────────────────────────────
const fadeUpV = (delay = 0) => ({
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay } },
});
const fadeLeftV = (delay = 0) => ({
    hidden: { opacity: 0, x: 52 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay } },
});
const scaleUpV = (delay = 0) => ({
    hidden: { opacity: 0, scale: 0.90 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay } },
});

// ============================================================
// 1. HERO SECTION  — FIXED mobile responsive + scroll animations
// ============================================================
function HeroSection({ onLoginOpen }) {
    const navigate = useNavigate();

    const infoSlides = [
        { heading: "Acne & Pimples", description: "A skin condition that occurs when hair follicles become clogged with fat and dead skin cells.", risk: "Medium risk", image: acneImg },
        { heading: "Eczema", description: "Inflammatory skin disease of various origins, worsens quality of life and affects general well-being.", risk: "High risk", image: eczemaImg },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredBtn, setHoveredBtn] = useState(null);
    const [hoveredScan, setHoveredScan] = useState(false);

    const handlePrev = () => setCurrentIndex((p) => (p === 0 ? infoSlides.length - 1 : p - 1));
    const handleNext = () => setCurrentIndex((p) => (p === infoSlides.length - 1 ? 0 : p + 1));

    useEffect(() => {
        const id = setInterval(() => setCurrentIndex((p) => (p === infoSlides.length - 1 ? 0 : p + 1)), 5000);
        return () => clearInterval(id);
    }, []);

    const currentSlide = infoSlides[currentIndex];

    const handleScanClick = () => {
        const user = localStorage.getItem("user");
        if (!user) { onLoginOpen(); } else { navigate("/slider-flow"); }
    };

    const scanBtnStyle = {
        boxShadow: hoveredScan ? "0 6px 24px 0 rgba(27,94,68,0.65)" : "0 4px 18px 0 rgba(27,94,68,0.45)",
        transition: "box-shadow 0.25s ease, background-color 0.25s ease",
    };
    const navBtnStyle = (id) => ({
        border: "3.5px solid #a0dac5",
        boxShadow: hoveredBtn === id ? "0 0 14px 3px rgba(76,175,125,0.55), 0 4px 12px rgba(27,94,68,0.35)" : "none",
        transition: "box-shadow 0.25s ease, background-color 0.25s ease",
    });

    return (
        <section className="w-full flex justify-center mt-0 px-4 md:px-10 lg:px-[70px]">
            <div className="relative w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-stretch gap-6 lg:gap-10 min-h-[calc(100vh-72px)]">

                {/* LEFT TEXT */}
                <motion.div
                    className="relative z-20 flex flex-col justify-center text-center lg:text-left lg:ml-5 px-4 sm:px-6 lg:px-0 lg:flex-1"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <motion.h3
                        variants={fadeUpV(0)}
                        className="tracking-[0.25em] sm:tracking-[0.3em] lg:tracking-[0.4em] font-righteous font-semibold text-black text-lg sm:text-2xl lg:text-3xl ml-0 lg:ml-3"
                    >
                        SKIN CHECK
                    </motion.h3>

                    <motion.h1
                        variants={fadeUpV(0.1)}
                        className="text-3xl sm:text-5xl lg:text-7xl text-black leading-snug lg:leading-tight font-['Righteous']"
                    >
                        AI SCANNER
                    </motion.h1>

                    <motion.p
                        variants={fadeUpV(0.2)}
                        className="max-w-full sm:max-w-xl text-gray-700 text-sm sm:text-base lg:text-lg leading-relaxed mx-auto lg:mx-0 mt-3"
                    >
                        Upload your skin image and let our AI analyze acne, pigmentation, and skin issues within seconds — with accurate severity and layer detection.
                    </motion.p>

                    {/* Desktop button */}
                    <motion.div variants={fadeUpV(0.32)} className="hidden lg:block w-fit mt-6">
                        <button
                            onClick={handleScanClick}
                            onMouseEnter={() => setHoveredScan(true)}
                            onMouseLeave={() => setHoveredScan(false)}
                            className="bg-[#1B5E44] hover:bg-[#154635] text-white px-6 py-3 rounded-full font-semibold"
                            style={scanBtnStyle}
                        >
                            Scan disease
                        </button>
                    </motion.div>

                    {/* Mobile button */}
                    <motion.div variants={fadeUpV(0.32)} className="lg:hidden mt-4">
                        <button
                            onClick={handleScanClick}
                            onMouseEnter={() => setHoveredScan(true)}
                            onMouseLeave={() => setHoveredScan(false)}
                            className="bg-[#1B5E44] hover:bg-[#154635] text-white px-6 py-3 rounded font-semibold w-full sm:w-2/3 mx-auto block"
                            style={scanBtnStyle}
                        >
                            Scan disease
                        </button>
                    </motion.div>
                </motion.div>

                {/* RIGHT — image slider */}
                <div className="relative w-full max-w-[480px] lg:max-w-[580px] lg:flex-shrink-0 self-stretch flex flex-col lg:block">

                    {/* Image + Info Box wrapper — relative parent */}
                    <div className="relative w-full h-[300px] sm:h-[400px] lg:h-full lg:min-h-[500px]">
                        <motion.img
                            key={currentSlide.image}
                            src={currentSlide.image}
                            alt={currentSlide.heading}
                            initial={{ opacity: 0, scale: 1.04 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                            className="w-full h-full object-cover object-top rounded-xl"
                        />

                        {/* Info box — ab image ke andar absolute */}
                        <motion.div
                            variants={scaleUpV(0.42)}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.1 }}
                            className="
        absolute bottom-1 left-2 -translate-x-1/2
        lg:left-8 lg:translate-x-0
        w-[90%] sm:w-[320px] lg:w-[300px]
        bg-white/80 lg:bg-white/60
        backdrop-blur-md rounded-2xl
        pt-4 px-4 pb-10 shadow-lg
        z-10
      "
                        >
                            <motion.h3
                                key={currentSlide.heading}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35 }}
                                className="text-[#154635] font-bold text-lg"
                            >
                                {currentSlide.heading}
                            </motion.h3>

                            <span
                                className="inline-flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full text-sm font-semibold"
                                style={{ background: "linear-gradient(90deg, #ffd000 0%, #f9e68d 100%)", color: "#ffffff" }}
                            >
                                <IoWarning size={15} color="#ffffff" />
                                {currentSlide.risk}
                            </span>

                            <motion.p
                                key={currentSlide.description}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.4, delay: 0.1 }}
                                className="text-black text-xs sm:text-sm mt-3 leading-relaxed"
                            >
                                {currentSlide.description}
                            </motion.p>

                            {/* Nav buttons */}
                            <div className="absolute bottom-[-18px] left-4 flex items-center gap-2">
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.92 }}
                                    onClick={handlePrev}
                                    onMouseEnter={() => setHoveredBtn("prev")}
                                    onMouseLeave={() => setHoveredBtn(null)}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1B5E44] hover:bg-[#154635] text-white shadow-md"
                                    style={navBtnStyle("prev")}
                                >
                                    <FaChevronLeft size={13} />
                                </motion.button>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.92 }}
                                    onClick={handleNext}
                                    onMouseEnter={() => setHoveredBtn("next")}
                                    onMouseLeave={() => setHoveredBtn(null)}
                                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1B5E44] hover:bg-[#154635] text-white shadow-md"
                                    style={navBtnStyle("next")}
                                >
                                    <FaChevronRight size={13} />
                                </motion.button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Spacer for nav buttons */}
                    <div className="h-8 lg:hidden" />
                </div>

            </div>
        </section>
    );
}

// ============================================================
// 1.5  VIDEO SECTION  — Hero ke baad
// ============================================================
function VideoSection() {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef(null);

    const handleToggle = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
        } else {
            videoRef.current.play();
        }
    };

    return (
        <>
            <style>{`
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.9); opacity: 0; }
        }
        @keyframes pulseRing2 {
          0%   { transform: scale(1);   opacity: 0.4; }
          100% { transform: scale(1.6); opacity: 0; }
        }
        .play-ring-1 {
          animation: pulseRing 2s ease-out infinite;
        }
        .play-ring-2 {
          animation: pulseRing2 2s ease-out infinite 0.4s;
        }

        @keyframes videoReveal {
          from { clip-path: inset(0 100% 0 0); }
          to   { clip-path: inset(0 0% 0 0); }
        }
        .video-reveal {
          animation: videoReveal 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes headingWord {
          from { opacity: 0; transform: translateY(20px); filter: blur(4px); }
          to   { opacity: 1; transform: translateY(0);    filter: blur(0px); }
        }
        .word-anim {
          display: inline-block;
          opacity: 0;
          animation: headingWord 0.55s cubic-bezier(0.22,1,0.36,1) forwards;
        }
      `}</style>

            <section className="w-full mt-8 px-4 md:px-10 lg:px-[70px] flex flex-col items-center gap-8">

                {/* ── Heading ── */}
                <motion.div
                    className="text-center max-w-4xl"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    viewport={{ once: true, amount: 0.2 }}
                >
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-['Righteous'] text-black leading-tight">
                        {["Your", "Online"].map((w, i) => (
                            <span key={i} className="word-anim" style={{ animationDelay: `${i * 0.1}s` }}>
                                {w}{" "}
                            </span>
                        ))}
                        <span className="word-anim text-[#1B5E44]" style={{ animationDelay: "0.2s" }}>
                            AI Scanner {" "}
                        </span>
                        <span className="word-anim" style={{ animationDelay: "0.3s" }}>
                            24/7
                        </span>
                    </h2>

                    <motion.p
                        className="mt-4 text-gray-500 text-base sm:text-lg md:text-xl leading-relaxed"
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
                        viewport={{ once: true, amount: 0.2 }}
                    >
                        Smart Skin Analysis for Improved SkinCare
                    </motion.p>
                </motion.div>

                {/* ── Video ── */}
                <motion.div
                    className="relative w-full max-w-5xl rounded-2xl overflow-hidden cursor-pointer"
                    style={{ aspectRatio: "16/9" }}
                    initial={{ opacity: 0, scale: 0.96, y: 40 }}
                    whileInView={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                    viewport={{ once: true, amount: 0.2 }}
                    onClick={handleToggle}
                    whileHover={{ boxShadow: "0 32px 80px rgba(27,94,68,0.22)" }}
                >
                    {/* Video */}
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover"
                        src={herbalinvideo}
                        poster={herbalinThumbnail}
                        loop
                        playsInline
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onError={(e) => console.warn("Video load error:", e)}
                    />

                    {/* Dark overlay */}
                    <motion.div
                        className="absolute inset-0"
                        animate={{ opacity: isPlaying ? 0 : 1 }}
                        transition={{ duration: 0.4 }}
                        style={{ background: "rgba(0,0,0,0.32)", pointerEvents: "none" }}
                    />

                    {/* ── Play Button with pulse rings ── */}
                    <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        animate={{ opacity: isPlaying ? 0 : 1, scale: isPlaying ? 0.8 : 1 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        style={{ pointerEvents: isPlaying ? "none" : "auto" }}
                    >
                        {/* Pulse rings */}
                        <div className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1B5E44] play-ring-1" />
                        <div className="absolute w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#1B5E44] play-ring-2" />

                        {/* Main button */}
                        <motion.div
                            className="relative w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
                            style={{ background: "#1B5E44", boxShadow: "0 8px 32px rgba(27,94,68,0.55)" }}
                            whileHover={{ scale: 1.12 }}
                            whileTap={{ scale: 0.93 }}
                            transition={{ type: "spring", stiffness: 300, damping: 18 }}
                        >
                            <div
                                style={{
                                    width: 0,
                                    height: 0,
                                    borderTop: "14px solid transparent",
                                    borderBottom: "14px solid transparent",
                                    borderLeft: "22px solid white",
                                    marginLeft: "5px",
                                }}
                            />
                        </motion.div>
                    </motion.div>

                    {/* ── Pause icon on hover while playing ── */}
                    {isPlaying && (
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300"
                        >
                            <div
                                className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center gap-2"
                                style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}
                            >
                                <div style={{ width: "5px", height: "22px", background: "white", borderRadius: "2px" }} />
                                <div style={{ width: "5px", height: "22px", background: "white", borderRadius: "2px" }} />
                            </div>
                        </motion.div>
                    )}
                </motion.div>

            </section>
        </>
    );
}

// ============================================================
// 2. FEATURE SECTION  (Phone mockup + Key Features list)
// ============================================================

function FloatCard({ posStyle, green = false, children }) {
    return (
        <div style={{
            borderRadius: "18px", padding: "15px 16px", width: "162px",
            ...(green
                ? { background: "#1B5E44", boxShadow: "0 10px 32px rgba(27,94,68,0.28)" }
                : { background: "white", border: "0.5px solid #eaeaea", boxShadow: "0 10px 32px rgba(0,0,0,0.10)" }),
            ...posStyle,
        }}>
            {children}
        </div>
    );
}

function PhoneMockup() {
    return (
        <div style={{
            width: "265px", background: "#111", borderRadius: "44px", padding: "8px",
            boxShadow: "0 0 0 1.5px #2a2a2a, 0 32px 64px rgba(0,0,0,0.45)", flexShrink: 0, position: "relative", zIndex: 1
        }}>
            <div style={{ display: "flex", justifyContent: "center", height: "10px", alignItems: "center" }}>
                <div style={{ width: "55px", height: "5px", background: "#1a1a1a", borderRadius: "3px" }} />
            </div>
            <div style={{ background: "white", borderRadius: "34px", height: "510px", overflowY: "auto", scrollbarWidth: "none" }}>
                {/* Header */}
                <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 14px 11px",
                    borderBottom: "0.5px solid #f0f0f0", position: "sticky", top: 0, background: "white", zIndex: 10
                }}>
                    <div style={{ width: "24px", height: "24px", background: "#f5f5f5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <FaArrowLeft size={7} color="#666" />
                    </div>
                    <img src={herbalinLogo} alt="Herbalin" style={{ height: "30px", objectFit: "contain" }} />
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", background: "#f0f7f4", borderRadius: "7px", padding: "4px 8px" }}>
                        <FaSearch size={6} color="#1B5E44" />
                        <span style={{ fontSize: "7.5px", color: "#1B5E44", fontWeight: 700 }}>255</span>
                    </div>
                </div>
                {/* Skin Scan Image */}
                <div style={{ width: "100%", height: "130px", position: "relative", overflow: "hidden" }}>
                    <img src={severeEczema} alt="Skin Scan" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.32) 100%)" }} />
                    <div style={{
                        position: "absolute", bottom: "8px", left: "10px", background: "rgba(0,0,0,0.42)", borderRadius: "5px",
                        padding: "2px 8px", fontSize: "7px", color: "white", letterSpacing: "1px", fontWeight: 600
                    }}>SKIN SCAN</div>
                </div>
                {/* Donut + Condition */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "11px 14px 4px" }}>
                    <div style={{ position: "relative", width: "52px", height: "52px", flexShrink: 0 }}>
                        <svg width="52" height="52" viewBox="0 0 52 52">
                            <circle cx="26" cy="26" r="20" fill="none" stroke="#f0f0f0" strokeWidth="4.5" />
                            <circle cx="26" cy="26" r="20" fill="none" stroke="#E53935" strokeWidth="4.5" strokeDasharray="94.2 125.7" strokeDashoffset="31.4" strokeLinecap="round" transform="rotate(-90 26 26)" />
                            <circle cx="26" cy="26" r="20" fill="none" stroke="#4CAF50" strokeWidth="4.5" strokeDasharray="31.4 125.7" strokeDashoffset="-94.2" strokeLinecap="round" transform="rotate(-90 26 26)" />
                        </svg>
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9.5px", fontWeight: 800, color: "#222" }}>75%</div>
                    </div>
                    <div>
                        <div style={{ fontSize: "17px", fontWeight: 800, color: "#000000" }}>Eczema</div>
                        <div style={{ fontSize: "8px", color: "#888", marginTop: "2px" }}>Inflammatory skin condition</div>
                    </div>
                </div>
                {/* Description */}
                <div style={{ padding: "4px 14px 10px" }}>
                    <p style={{ fontSize: "8px", color: "#666", lineHeight: 1.75, margin: 0 }}>
                        Eczema is a chronic inflammatory skin condition causing redness, dryness, and intense itching. Proper skincare and avoiding triggers are key.
                    </p>
                </div>
                {/* Warning */}
                <div style={{
                    margin: "0 12px 12px", background: "#fff5f5", border: "0.5px solid #ffcdd2", borderRadius: "10px",
                    padding: "8px 12px", display: "flex", alignItems: "center", gap: "6px"
                }}>
                    <FaExclamationCircle size={9} color="#c62828" />
                    <div style={{ fontSize: "8px", fontWeight: 700, color: "#c62828" }}>Please consult a dermatologist immediately.</div>
                </div>
                {/* Herbal Treatment */}
                <div style={{ margin: "0 12px 16px", background: "#F1F8E9", border: "0.5px solid #c8e6c9", borderRadius: "14px", padding: "11px 12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px" }}>
                        <div style={{ width: "22px", height: "22px", background: "#1B5E44", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <FaLeaf size={10} color="white" />
                        </div>
                        <div style={{ fontSize: "10px", fontWeight: 800, color: "#1B5E44" }}>Herbal Treatment</div>
                        <div style={{ background: "#1B5E44", color: "white", fontSize: "6.5px", fontWeight: 600, padding: "1px 6px", borderRadius: "20px", marginLeft: "auto" }}>Recommended</div>
                    </div>
                    <p style={{ fontSize: "7.5px", color: "#444", lineHeight: 1.65, margin: "0 0 8px" }}>
                        Apply diluted <strong style={{ color: "#1B5E44" }}>tea tree oil</strong> twice daily. Use <strong style={{ color: "#1B5E44" }}>aloe vera gel</strong> to soothe redness naturally.
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {["Tea Tree Oil", "Aloe Vera", "Chamomile"].map((herb) => (
                            <div key={herb} style={{ display: "flex", alignItems: "center", gap: "4px", background: "white", borderRadius: "6px", padding: "3px 7px", border: "0.5px solid #c8e6c9" }}>
                                <FaLeaf size={7} color="#558B2F" />
                                <span style={{ fontSize: "7px", fontWeight: 600, color: "#558B2F" }}>{herb}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", padding: "7px 0 3px" }}>
                <div style={{ width: "52px", height: "3.5px", background: "#333", borderRadius: "2px" }} />
            </div>
        </div>
    );
}

function FeatureSection() {
    const phoneRef = useRef(null);
    const cardTRRef = useRef(null);
    const cardLRef = useRef(null);
    const cardRRef = useRef(null);
    const apptRef = useRef(null);

    useScrollReveal(phoneRef);
    useScrollReveal(cardTRRef);
    useScrollReveal(cardLRef);
    useScrollReveal(cardRRef);
    useScrollReveal(apptRef);

    const features = [
        { icon: <FaCamera size={22} />, text: "Go to a well-lit room and snap a photo of your skin issue." },
        { icon: <FaEye size={22} />, text: "AI-based realtime camera helps evaluate skin problems accurately." },
        { icon: <FaCalendarAlt size={22} />, text: "Use Herbalin weekly to monitor skin improvement – all the way to clear skin." },
        { icon: <FaLeaf size={22} />, text: "Get personalized herbal treatment recommendations based on your skin condition and severity." },
    ];

    return (
        <>
            <style>{`
        .herbalin-scene-wrapper {
          position: relative; width: 480px; height: 700px; flex-shrink: 0; transform-origin: top center;
        }
        @media (max-width: 400px)  { .herbalin-scene-wrapper { transform: scale(0.62); margin-bottom: -266px; } }
        @media (min-width: 401px) and (max-width: 520px)  { .herbalin-scene-wrapper { transform: scale(0.70); margin-bottom: -210px; } }
        @media (min-width: 521px) and (max-width: 640px)  { .herbalin-scene-wrapper { transform: scale(0.78); margin-bottom: -154px; } }
        @media (min-width: 641px) and (max-width: 767px)  { .herbalin-scene-wrapper { transform: scale(0.88); margin-bottom: -84px; } }
        @media (min-width: 768px) { .herbalin-scene-wrapper { transform: scale(1); margin-bottom: 0; } }

        .hs-phone  { opacity:0; transform:translateX(-50%) translateY(36px); transition:opacity .75s cubic-bezier(.22,1,.36,1),transform .75s cubic-bezier(.22,1,.36,1); }
        .hs-card-tr{ opacity:0; transform:translateX(24px);  transition:opacity .65s cubic-bezier(.22,1,.36,1) .20s,transform .65s cubic-bezier(.22,1,.36,1) .20s; }
        .hs-card-l { opacity:0; transform:translateX(-24px); transition:opacity .65s cubic-bezier(.22,1,.36,1) .35s,transform .65s cubic-bezier(.22,1,.36,1) .35s; }
        .hs-card-r { opacity:0; transform:translateX(24px);  transition:opacity .65s cubic-bezier(.22,1,.36,1) .35s,transform .65s cubic-bezier(.22,1,.36,1) .35s; }
        .hs-appt   { opacity:0; transform:translateY(20px);  transition:opacity .6s  cubic-bezier(.22,1,.36,1) .50s,transform .6s  cubic-bezier(.22,1,.36,1) .50s; }
        .hs-visible { opacity:1!important; transform:translate(0,0)!important; }
        .hs-phone.hs-visible { transform:translateX(-50%) translateY(0)!important; }
      `}</style>

            <div className="w-full px-4 md:px-[90px] py-10">
                <section className="w-full flex flex-col md:flex-row items-center justify-between gap-10 md:gap-16">

                    {/* LEFT */}
                    <div className="w-full md:w-1/2 flex justify-center items-start overflow-hidden md:overflow-visible">
                        <div className="herbalin-scene-wrapper">
                            <div ref={phoneRef} className="hs-phone" style={{ position: "absolute", top: "85px", left: "50%", zIndex: 1 }}>
                                <PhoneMockup />
                            </div>
                            {/* TOP-RIGHT: Severity */}
                            <div ref={cardTRRef} className="hs-card-tr" style={{ position: "absolute", right: 0, top: "110px", zIndex: 10 }}>
                                <FloatCard posStyle={{}}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "10px" }}>
                                        <FaExclamationCircle size={11} color="#E53935" />
                                        <span style={{ fontSize: "9px", fontWeight: 600, color: "#999" }}>Severity Level</span>
                                    </div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                        <div style={{ position: "relative", width: "50px", height: "50px", flexShrink: 0 }}>
                                            <svg width="50" height="50" viewBox="0 0 50 50">
                                                <circle cx="25" cy="25" r="19" fill="none" stroke="#f5f5f5" strokeWidth="4.5" />
                                                <circle cx="25" cy="25" r="19" fill="none" stroke="#E53935" strokeWidth="4.5"
                                                    strokeDasharray="107.5 119.4" strokeDashoffset="29.8" strokeLinecap="round" transform="rotate(-90 25 25)" />
                                            </svg>
                                            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "9.5px", fontWeight: 800, color: "#222" }}>90%</div>
                                        </div>
                                        <div>
                                            <div style={{ fontSize: "15px", fontWeight: 800, color: "#E53935" }}>Severe</div>
                                            <div style={{ fontSize: "8px", color: "#888", lineHeight: 1.55, marginTop: "3px" }}>Immediate<br />dermatologist<br />attention needed</div>
                                        </div>
                                    </div>
                                </FloatCard>
                            </div>
                            {/* LEFT: Skin Layer */}
                            <div ref={cardLRef} className="hs-card-l" style={{ position: "absolute", left: 0, top: "350px", zIndex: 10 }}>
                                <FloatCard posStyle={{}}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                                        <FaLayerGroup size={12} color="#1B5E44" />
                                        <span style={{ fontSize: "9px", fontWeight: 600, color: "#999" }}>Skin Layer</span>
                                    </div>
                                    <div style={{ fontSize: "20px", fontWeight: 800, color: "#1B5E44" }}>Dermis</div>
                                    <div style={{ fontSize: "10px", fontWeight: 600, color: "#888" }}>(2nd Layer)</div>
                                    <div style={{ fontSize: "8px", color: "#bbb", marginTop: "6px", lineHeight: 1.55 }}>Affects deeper skin<br />structure &amp; tissue.</div>
                                    <div style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                                        {["#E0E0E0", "#BDBDBD", "#1B5E44"].map((c, i) => (
                                            <div key={i} style={{ width: "9px", height: "9px", borderRadius: "50%", background: c }} />
                                        ))}
                                    </div>
                                </FloatCard>
                            </div>
                            {/* RIGHT: Skin Moisture */}
                            <div ref={cardRRef} className="hs-card-r" style={{ position: "absolute", right: 0, top: "360px", zIndex: 10 }}>
                                <FloatCard posStyle={{}}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                                        <FaTint size={12} color="#1B5E44" />
                                        <span style={{ fontSize: "9px", fontWeight: 600, color: "#999" }}>Skin Moisture</span>
                                    </div>
                                    <div style={{ fontSize: "28px", fontWeight: 900, color: "#1B5E44", lineHeight: 1 }}>18%</div>
                                    <div style={{ fontSize: "8px", color: "#aaa", marginTop: "5px", lineHeight: 1.55 }}>Critically low —<br />hydration needed</div>
                                    <div style={{ marginTop: "10px", background: "#e8f5e9", borderRadius: "4px", height: "5px" }}>
                                        <div style={{ width: "18%", background: "#1B5E44", height: "5px", borderRadius: "4px" }} />
                                    </div>
                                </FloatCard>
                            </div>
                            {/* Appointment card */}
                            <div ref={apptRef} className="hs-appt"
                                style={{
                                    position: "absolute", top: "530px", left: "60px", width: "250px", background: "white",
                                    border: "0.5px solid #eaeaea", boxShadow: "0 10px 32px rgba(0,0,0,0.10)", borderRadius: "18px",
                                    padding: "14px 18px", zIndex: 10, display: "flex", alignItems: "center", gap: "14px"
                                }}>
                                <div style={{ width: "44px", height: "44px", flexShrink: 0, background: "#f0f7f4", borderRadius: "13px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <FaCalendarCheck size={20} color="#1B5E44" />
                                </div>
                                <div>
                                    <div style={{ fontSize: "11px", fontWeight: 800, color: "#1B5E44", marginBottom: "5px" }}>Appointment</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                        <FaClock size={8} color="#aaa" />
                                        <span style={{ fontSize: "9px", color: "#666", fontWeight: 600 }}>Today, 3:00 PM</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT — Key Features with whileInView scroll animations */}
                    <div className="w-full md:w-1/2 space-y-8">
                        <motion.h2
                            className="text-4xl sm:text-5xl md:text-6xl font-['Righteous'] text-center md:text-left"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                            viewport={{ once: false, amount: 0.3 }}
                        >
                            Key Features
                        </motion.h2>

                        <motion.p
                            className="text-gray-600 text-base sm:text-lg md:text-xl leading-relaxed text-center md:text-left"
                            initial={{ opacity: 0, y: 22 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                            viewport={{ once: false, amount: 0.3 }}
                        >
                            Discover powerful AI-driven features that help you capture, analyze, and track your skin health easily over time.
                        </motion.p>

                        <div className="flex flex-col gap-8">
                            {features.map(({ icon, text }, i) => (
                                <motion.div
                                    key={i}
                                    className="flex items-start gap-4 md:gap-5"
                                    initial={{ opacity: 0, x: 32 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.12 + i * 0.12 }}
                                    viewport={{ once: false, amount: 0.3 }}
                                >
                                    <motion.div
                                        className="bg-[#1B5E44] text-white p-4 md:p-5 rounded-xl flex-shrink-0"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                    >
                                        {icon}
                                    </motion.div>
                                    <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed">{text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                </section>
            </div>
        </>
    );
}

// ============================================================
// 3. DISEASES SECTION  — with framer-motion whileInView (like About.js)
// ============================================================
function Diseases() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [hoveredBtn, setHoveredBtn] = useState(null);

    const conditionPairs = [
        {
            pair: [
                { title: "Mild Acne", desc: "Frequent small blemishes and blackheads against oily skin.", img: mildAcne },
                { title: "Mild Eczema", desc: "Noticeable red patches with recurring itching and peeling.", img: mildEczema },
            ]
        },
        {
            pair: [
                { title: "Moderate Acne", desc: "Inflamed red bumps and papules requiring evaluation.", img: moderateAcne },
                { title: "Moderate Eczema", desc: "Persistent inflammation with intense itching in skin folds.", img: moderateEczema },
            ]
        },
        {
            pair: [
                { title: "Severe Acne", desc: "Deep painful cysts and widespread inflammation requiring medical care.", img: severeAcne },
                { title: "Severe Eczema", desc: "Severe dryness, cracking, and intense itching affecting large areas.", img: severeEczema },
            ]
        },
    ];

    useEffect(() => {
        const timer = setInterval(() => setCurrentIndex((p) => (p + 1) % conditionPairs.length), 3000);
        return () => clearInterval(timer);
    }, []);

    const navBtnStyle = (btn) => ({
        transition: "background 0.2s ease, transform 0.15s ease",
        transform: hoveredBtn === btn ? "scale(1.08)" : "scale(1)",
    });

    return (
        <section className="w-full flex justify-center mt-10">
            <div className="relative w-[90%] max-w-7xl">
                {/* Heading + Nav */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-10 md:mb-16">
                    <motion.h2
                        className="text-3xl sm:text-4xl md:text-6xl font-['Righteous'] text-black leading-tight tracking-tighter"
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        viewport={{ once: false, amount: 0.3 }}
                    >
                        Which <span className="text-[#1B5E44]">skin conditions</span> <br />
                        require evaluation with <br />Herbalin App?
                    </motion.h2>

                    <motion.div
                        className="flex gap-4 md:mb-4 self-start md:self-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
                        viewport={{ once: false, amount: 0.3 }}
                    >
                        <button
                            onClick={() => setCurrentIndex(currentIndex === 0 ? conditionPairs.length - 1 : currentIndex - 1)}
                            onMouseEnter={() => setHoveredBtn("prev")} onMouseLeave={() => setHoveredBtn(null)}
                            className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1B5E44] hover:bg-[#154635] active:scale-95 text-white shadow-md"
                            style={navBtnStyle("prev")}
                        >
                            <FaChevronLeft size={13} />
                        </button>
                        <button
                            onClick={() => setCurrentIndex((currentIndex + 1) % conditionPairs.length)}
                            onMouseEnter={() => setHoveredBtn("next")} onMouseLeave={() => setHoveredBtn(null)}
                            className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#1B5E44] hover:bg-[#154635] active:scale-95 text-white shadow-md"
                            style={navBtnStyle("next")}
                        >
                            <FaChevronRight size={13} />
                        </button>
                    </motion.div>
                </div>

                {/* Cards */}
                <motion.div
                    className="bg-gray-50 rounded-[60px] p-6 md:p-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 min-h-[400px]"
                    initial={{ opacity: 0, y: 32 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                    viewport={{ once: false, amount: 0.2 }}
                >
                    {conditionPairs[currentIndex].pair.map((cond, i) => (
                        <motion.div
                            key={`${currentIndex}-${i}`}
                            className="flex items-center gap-4 md:gap-8"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, ease: "easeOut", delay: i * 0.1 }}
                        >
                            <div className="w-28 h-28 md:w-56 md:h-56 rounded-full shadow-2xl overflow-hidden flex-shrink-0 border-[6px] md:border-[10px] border-white">
                                <img src={cond.img} alt={cond.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h3 className="text-lg md:text-2xl font-bold text-black mb-2 md:mb-3">{cond.title}</h3>
                                <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium">{cond.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Dots */}
                <motion.div
                    className="flex justify-center gap-3 mt-6 md:mt-10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    viewport={{ once: false, amount: 0.3 }}
                >
                    {conditionPairs.map((_, i) => (
                        <div
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`h-2.5 rounded-full cursor-pointer transition-all duration-300 ${i === currentIndex ? "w-8 bg-[#1B5E44]" : "w-2.5 bg-gray-200"}`}
                        />
                    ))}
                </motion.div>
            </div>
        </section>
    );
}

// ============================================================
// 4. TIPS LIST
// ============================================================
const CARD_WIDTH = 280 + 24;
const VISIBLE_CARDS = 4;

function TipsList() {
    const [tips, setTips] = useState([]);
    const scrollRef = useRef(null);
    const [index, setIndex] = useState(0);
    const [hoveredBtn, setHoveredBtn] = useState(null);
    const [visible, setVisible] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        fetch("/api/Tips")
            .then((res) => res.json())
            .then((data) => setTips(Array.isArray(data) ? data : []));
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold: 0.1 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    const navBtnStyle = (btn) => ({
        transform: hoveredBtn === btn ? "scale(1.08)" : "scale(1)",
        transition: "transform 0.15s ease, background-color 0.15s ease",
    });

    const next = () => {
        if (index < tips.length - VISIBLE_CARDS) {
            const i = index + 1;
            setIndex(i);
            scrollRef.current.scrollTo({ left: i * CARD_WIDTH, behavior: "smooth" });
        }
    };
    const prev = () => {
        if (index > 0) {
            const i = index - 1;
            setIndex(i);
            scrollRef.current.scrollTo({ left: i * CARD_WIDTH, behavior: "smooth" });
        }
    };

    return (
        <>
            <style>{`
        @keyframes tipsFadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        .tips-section{opacity:0;padding:70px 90px;background:#fff}
        @media(max-width:768px){.tips-section{padding:40px 16px}}
        .tips-section.tips-visible{animation:tipsFadeUp .6s ease forwards}
        .tips-heading{opacity:0;font-size:48px;font-weight:800;margin-bottom:40px;text-align:left}
        @media(max-width:768px){.tips-heading{font-size:22px;margin-bottom:20px}}
        .tips-section.tips-visible .tips-heading{animation:tipsFadeUp .6s ease .1s forwards}
        .tips-row{display:flex;align-items:center;gap:12px}
        .tips-row-anim{opacity:0}
        .tips-section.tips-visible .tips-row-anim{animation:tipsFadeUp .6s ease .2s forwards}
        .tips-scroll{display:flex;gap:24px;overflow:hidden;width:calc((280px * 4) + (24px * 3))}
        @media(max-width:768px){.tips-scroll{width:100%;overflow:hidden}}
      `}</style>
            <section ref={sectionRef} className={`tips-section ${visible ? "tips-visible" : ""}`}>
                <h2 className="tips-heading text-3xl sm:text-4xl md:text-5xl font-['Righteous'] text-black leading-tight tracking-tighter">
                    Discover the true meaning of herbal remedies!
                </h2>
                <div className="tips-row tips-row-anim mt-6">
                    <button onClick={prev} onMouseEnter={() => setHoveredBtn("prev")} onMouseLeave={() => setHoveredBtn(null)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1B5E44] hover:bg-[#154635] active:scale-95 text-white shadow-md flex-shrink-0"
                        style={navBtnStyle("prev")}>
                        <FaChevronLeft size={13} />
                    </button>
                    <div className="tips-scroll" ref={scrollRef}>
                        {tips.map((tip, i) => (
                            <TipsCard key={i} tip={tip} index={i} visible={visible} />
                        ))}
                    </div>
                    <button onClick={next} onMouseEnter={() => setHoveredBtn("next")} onMouseLeave={() => setHoveredBtn(null)}
                        className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1B5E44] hover:bg-[#154635] active:scale-95 text-white shadow-md flex-shrink-0"
                        style={navBtnStyle("next")}>
                        <FaChevronRight size={13} />
                    </button>
                </div>
            </section>
        </>
    );
}

// ============================================================
// 5. AI SKIN SCANNER  — with framer-motion whileInView
// ============================================================
function FeatureItem({ icon: Icon, title, text, index }) {
    return (
        <motion.div
            className="relative group flex flex-col items-center text-center px-6 pt-16 pb-8 rounded-2xl bg-gray-50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.1 }}
            viewport={{ once: false, amount: 0.2 }}
            whileHover={{ scale: 1.03 }}
        >
            <div className="absolute -top-14 w-28 h-28 md:w-32 md:h-32 bg-[#044a33] rounded-full flex items-center justify-center shadow-lg border-8 border-gray-50 transition-all duration-300">
                <Icon size={60} strokeWidth={1.2} className="text-white transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2 mt-4">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[240px]">{text}</p>
        </motion.div>
    );
}

function AISkinScanner() {
    const data = [
        { title: "Smart", icon: Brain, text: "AI Skin Scanner uses smart technology built with doctors delivering dermatologist level skin accuracy" },
        { title: "Simple", icon: Clock, text: "Place phone near skin spot and receive results within one minute instantly safely today" },
        { title: "Accessible", icon: Smartphone, text: "AI Skin Scanner works anywhere anytime helping you track skin health easily daily life" },
        { title: "Affordable", icon: CircleDollarSign, text: "AI Skin Scanner offers powerful analytics at affordable pricing saving time money for users" },
    ];

    return (
        <section className="py-20 bg-white w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-[90px]">
                <motion.h2
                    className="text-3xl md:text-5xl font-extrabold font-['Righteous'] text-black mb-20 text-left"
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.3 }}
                >
                    Why is AI Skin Scanner worth using?
                </motion.h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-16">
                    {data.map((item, index) => (
                        <FeatureItem key={index} icon={item.icon} title={item.title} text={item.text} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
}

// ============================================================
// 6. COLLABORATION SECTION  — with framer-motion whileInView
// ============================================================
function CollaborationSection() {
    return (
        <section className="max-w-6xl mx-auto px-6 py-12">
            <div className="relative bg-[#fcfdfd] rounded-[60px] flex flex-col lg:flex-row overflow-hidden border border-gray-100 shadow-2xl shadow-green-900/5 min-h-[500px]">
                <div className="absolute inset-0 z-0"
                    style={{ backgroundImage: "url('/herbalist-bg.jpg')", backgroundSize: "cover", backgroundPosition: "center", opacity: 0.25 }} />

                {/* LEFT */}
                <motion.div
                    className="relative z-10 lg:w-[40%] bg-[#1B5E44]/90 backdrop-blur-sm p-10 md:p-16 flex flex-col justify-center items-center text-center"
                    initial={{ opacity: 0, x: -28 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.3 }}
                >
                    <motion.div
                        className="w-16 h-16 bg-[#ffff] rounded-full flex items-center justify-center mb-6 shadow-md"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        viewport={{ once: false, amount: 0.3 }}
                    >
                        <img src={icon} alt="icon" className="w-15 h-14 object-contain" />
                    </motion.div>
                    <motion.h2
                        className="text-[28px] md:text-[36px] font-normal uppercase tracking-tight leading-tight text-white font-['Righteous']"
                        initial={{ opacity: 0, y: 15 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        viewport={{ once: false, amount: 0.3 }}
                    >
                        In Collaboration <br /> With Herbalist
                    </motion.h2>
                </motion.div>

                {/* RIGHT */}
                <motion.div
                    className="relative z-10 lg:w-[60%] p-8 md:p-12 lg:p-20 flex flex-col justify-center bg-white/60 backdrop-blur-md"
                    initial={{ opacity: 0, x: 28 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
                    viewport={{ once: false, amount: 0.3 }}
                >
                    <motion.h3
                        className="text-xl md:text-2xl font-bold text-[#1B5E44] mb-6 md:mb-8 leading-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: false, amount: 0.3 }}
                    >
                        To provide well-rounded guidance, AI Skin Scanner works in collaboration with our trusted herbal partner.
                    </motion.h3>
                    <div className="space-y-5 text-gray-800 text-base md:text-lg leading-relaxed">
                        {[
                            { delay: 0.3, content: <p>All herbal treatment recommendations provided on our platform are carefully reviewed and approved by{" "}<span className="font-extrabold text-[#1B5E44]">Al-Abbasi Clinic</span>.</p> },
                            { delay: 0.38, content: <p>Our collaboration is led by <span className="font-semibold text-[#1B5E44]">Dr. Hafsa Abbasi</span>, a highly experienced herbal specialist with <span className="font-semibold">10+ years of expertise</span> in skin care and natural treatments.</p> },
                            { delay: 0.46, content: <p>Through this partnership, we ensure users receive{" "}<span className="italic">safe, holistic, and expert-backed herbal guidance</span> for better skin wellness.</p> },
                        ].map(({ delay, content }, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay }}
                                viewport={{ once: false, amount: 0.3 }}
                            >
                                {content}
                            </motion.div>
                        ))}
                    </div>
                    <motion.div
                        className="mt-8 md:mt-10 p-6 md:p-8 bg-[#1B5E44] rounded-[30px] border-l-[10px] md:border-l-[12px] border-[#c2e1d6]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.54 }}
                        viewport={{ once: false, amount: 0.3 }}
                    >
                        <p className="text-xs md:text-[14px] font-bold text-white uppercase tracking-widest italic">
                            Our Focus: Supportive recommendations — not medical replacements.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
}

// ============================================================
// 7. REVIEWS SECTION  — with framer-motion whileInView
// ============================================================
function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);

    const reviewsPerPage = typeof window !== "undefined" && window.innerWidth < 640 ? 1 : 6;

    useEffect(() => {
        fetch("http://localhost:5000/api/reviews")
            .then((res) => res.json())
            .then((data) => setReviews(data))
            .catch((err) => console.log(err));
    }, []);

    const avgRating = reviews.length > 0
        ? (reviews.reduce((acc, item) => acc + (item.rating || 5), 0) / reviews.length).toFixed(1)
        : 0;
    const getCount = (star) => reviews.filter((r) => (r.rating || 5) === star).length;
    const total = reviews.length;

    const indexOfLast = currentPage * reviewsPerPage;
    const indexOfFirst = indexOfLast - reviewsPerPage;
    const currentReviews = reviews.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(reviews.length / reviewsPerPage);

    return (
        <section className="bg-white px-4 py-10 flex justify-center">
            <div className="max-w-6xl w-full">
                {/* Header */}
                <div className="text-3xl sm:text-4xl md:text-6xl flex flex-col md:flex-row md:items-center font-extrabold font-['Righteous'] md:justify-between mb-10 gap-6">
                    <motion.h2
                        className="text-6xl font-bold"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.65, ease: "easeOut" }}
                        viewport={{ once: false, amount: 0.3 }}
                    >
                        Reviews
                    </motion.h2>
                    <motion.div
                        className="flex gap-6 items-center w-full md:w-auto"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
                        viewport={{ once: false, amount: 0.3 }}
                    >
                        <div>
                            <h1 className="text-5xl font-bold">{avgRating}</h1>
                            <div className="text-[#1B5E44] text-lg">{"★".repeat(Math.round(avgRating))}</div>
                            <p className="text-gray-500 text-sm">{total} reviews</p>
                        </div>
                        <div className="flex flex-col gap-2 w-52">
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = getCount(star);
                                const percent = total ? (count / total) * 100 : 0;
                                return (
                                    <div key={star} className="flex items-center gap-2 text-sm">
                                        <span className="w-3">{star}</span>
                                        <div className="flex-1 bg-gray-200 h-2 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-[#1B5E44]"
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${percent}%` }}
                                                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 + star * 0.07 }}
                                                viewport={{ once: false, amount: 0.3 }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentReviews.map((item, index) => (
                        <motion.div
                            key={index}
                            className="border-l-4 border-[#1B5E44]/30 hover:border-[#1B5E44] p-6 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300"
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 + index * 0.07 }}
                            viewport={{ once: false, amount: 0.1 }}
                        >
                            <div className="mb-2 text-lg">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star} className={`transition ${star <= (item.rating || 5) ? "text-[#1B5E44]" : "text-gray-300"} hover:text-[#145c3c]`}>★</span>
                                ))}
                            </div>
                            <p className="italic text-gray-700 mb-4">"{item.message}"</p>
                            <p className="font-bold text-[#1B5E44]">— {item.name}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Pagination */}
                <motion.div
                    className="flex justify-center mt-10 gap-2 flex-wrap"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: false, amount: 0.3 }}
                >
                    <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} className="px-3 py-1 border rounded hover:bg-gray-100">{"<"}</button>
                    <div className="hidden sm:flex gap-2 flex-wrap justify-center">
                        {[...Array(totalPages)].map((_, i) => (
                            <button key={i} onClick={() => setCurrentPage(i + 1)}
                                className={`px-3 py-1 rounded ${currentPage === i + 1 ? "bg-[#1B5E44] text-white" : "border hover:bg-gray-100"}`}>
                                {i + 1}
                            </button>
                        ))}
                    </div>
                    <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} className="px-3 py-1 border rounded hover:bg-gray-100">{">"}</button>
                </motion.div>
            </div>
        </section>
    );
}

// ============================================================
// 8. CONTACT / FEEDBACK SECTION  — with framer-motion whileInView
// ============================================================
function Contact() {
    const form = useRef();
    const [rating, setRating] = useState(0);

    const sendEmail = async (e) => {
        e.preventDefault();
        const formData = new FormData(form.current);
        const data = {
            name: formData.get("user_name"),
            email: formData.get("user_email"),
            company: formData.get("company"),
            phone: formData.get("phone"),
            message: formData.get("message"),
            rating: rating || 1,
        };
        try {
            const res = await fetch("http://localhost:5000/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
            const result = await res.json();
            if (result.success) { alert("Message sent ✅"); form.current.reset(); setRating(0); }
            else { alert(result.message); }
        } catch (err) { console.log(err); alert("Error ❌"); }
    };

    return (
        <section className="min-h-screen flex items-center justify-center px-4 mb-6">
            <div className="w-full max-w-6xl bg-[#1B5E44] rounded-[40px] shadow-2xl flex flex-col md:flex-row overflow-hidden">

                {/* LEFT */}
                <motion.div
                    className="md:w-[45%] text-white p-12 flex flex-col justify-center relative overflow-hidden"
                    style={{ background: "linear-gradient(135deg, #1B5E44 60%, #154635 100%)" }}
                    initial={{ opacity: 0, x: -28 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.65, ease: "easeOut" }}
                    viewport={{ once: false, amount: 0.3 }}
                >
                    <motion.h1
                        className="text-5xl font-black leading-tight mb-6 uppercase tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        viewport={{ once: false, amount: 0.3 }}
                    >
                        WE VALUE <br /> YOUR REVIEWS <br /> &amp; FEEDBACK
                    </motion.h1>
                    <motion.p
                        className="text-lg opacity-90 max-w-xs leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        viewport={{ once: false, amount: 0.3 }}
                    >
                        Share your experience with us. Your feedback helps us improve and serve you better.
                    </motion.p>
                </motion.div>

                {/* RIGHT */}
                <motion.div
                    className="md:w-1/2 p-10 bg-[#f9f9f9]"
                    initial={{ opacity: 0, x: 28 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.65, ease: "easeOut", delay: 0.1 }}
                    viewport={{ once: false, amount: 0.3 }}
                >
                    <form ref={form} onSubmit={sendEmail} className="space-y-4">
                        {[
                            { name: "user_name", placeholder: "Full name *", type: "text", required: true, delay: 0.2 },
                            { name: "user_email", placeholder: "Email *", type: "email", required: true, delay: 0.27 },
                            { name: "company", placeholder: "Profession", type: "text", required: false, delay: 0.34 },
                            { name: "phone", placeholder: "Phone", type: "text", required: false, delay: 0.41 },
                        ].map(({ name, placeholder, type, required, delay }) => (
                            <motion.input
                                key={name}
                                type={type}
                                name={name}
                                placeholder={placeholder}
                                required={required}
                                className="w-full border-b border-gray-300 bg-transparent p-1 outline-none focus:border-[#1B5E44]"
                                initial={{ opacity: 0, y: 18 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.55, delay }}
                                viewport={{ once: false, amount: 0.3 }}
                            />
                        ))}

                        <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.48 }}
                            viewport={{ once: false, amount: 0.3 }}
                        >
                            <p className="text-sm text-gray-600">Rating:</p>
                            <div className="flex text-2xl">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <span key={star} onClick={() => setRating(star)}
                                        className={`cursor-pointer transition ${star <= rating ? "text-[#1B5E44]" : "text-gray-300"}`}>★</span>
                                ))}
                            </div>
                        </motion.div>

                        <motion.textarea
                            name="message"
                            placeholder="Write your review *"
                            required
                            rows="2"
                            className="w-full border-b border-gray-300 bg-transparent p-1 outline-none focus:border-[#1B5E44]"
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.55 }}
                            viewport={{ once: false, amount: 0.3 }}
                        />

                        <motion.div
                            className="flex items-start gap-1 text-sm text-gray-600"
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.62 }}
                            viewport={{ once: false, amount: 0.3 }}
                        >
                            <input type="checkbox" required className="accent-[#1B5E44] mt-1" />
                            <p className="m-0 leading-snug">
                                Please be informed that when you click the Send button Herbalin will process your personal data...
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.55, delay: 0.69 }}
                            viewport={{ once: false, amount: 0.3 }}
                        >
                            <button type="submit" className="bg-[#1B5E44] text-white py-3 px-10 rounded-full hover:bg-[#154635] transition shadow-lg font-bold">
                                Submit
                            </button>
                        </motion.div>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}

// ============================================================
// HOME  –  Default Export
// ============================================================
export default function Home({ onLoginOpen }) {
    return (
        <div className="flex flex-col gap-24">
            <HeroSection onLoginOpen={onLoginOpen} />
            <VideoSection />
            <FeatureSection />
            <Diseases />
            <TipsList />
            <AISkinScanner />
            <CollaborationSection />
            <Reviews />
            <Contact />
        </div>
    );
}