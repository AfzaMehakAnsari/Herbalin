import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCamera,
  FiTarget,
  FiSun,
  FiChevronLeft,
  FiChevronRight,
  FiArrowRight,
} from "react-icons/fi";

const GREEN = "#0f5132";
const GREEN_LIGHT_BG = "linear-gradient(135deg, #f0faf4 0%, #d6f0e2 100%)";

const slides = [
  {
    title: "Before you start",
    subtitle: "Get close enough",
    description:
      "Hold your camera 2–4 inches (5–10 cm) from the skin mark for a sharp, well-framed shot.",
    icon: FiCamera,
  },
  {
    title: "Before you start",
    subtitle: "Center the mark",
    description:
      "Keep the skin mark in focus and centered. Avoid capturing surrounding skin or hair.",
    icon: FiTarget,
  },
  {
    title: "Before you start",
    subtitle: "Light it right",
    description:
      "Use natural or bright indoor light. Avoid shadows, flash glare, or dim conditions.",
    icon: FiSun,
  },
];

export default function SliderScreen() {
  const [current, setCurrent] = React.useState(0);
  const [hasReachedLast, setHasReachedLast] = React.useState(false);
  const navigate = useNavigate();

  const isLast = current === slides.length - 1;
  const isUnlocked = hasReachedLast;

  const goTo = (index, allowUnlock = false) => {
    setCurrent(index);
    if (allowUnlock && index === slides.length - 1) setHasReachedLast(true);
  };

  const nextSlide = () => {
    if (current < slides.length - 1) goTo(current + 1, true);
  };
  const prevSlide = () => {
    if (current > 0) goTo(current - 1, false);
  };

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Sora', sans-serif; }
        button { border: none; outline: none; background: none; }

        .slider-wrapper {
          min-height: 100dvh;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          background: #ffffff;
          padding: 40px 16px 32px;
        }

        .slider-card {
          width: 100%;
          max-width: 420px;
          border-radius: 28px;
          padding: 28px 24px 22px;
          display: flex;
          flex-direction: column;
          align-items: center;
          background: ${GREEN_LIGHT_BG};
          box-shadow: 0 24px 64px #0f513218, 0 4px 16px #0001;
        }

        .step-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 14px;
        }

        .step-btn {
          height: 8px;
          border-radius: 99px;
          border: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(.4,0,.2,1);
          padding: 0;
        }

        .small-title {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 16px;
          color: ${GREEN};
        }

        .icon-wrap {
          width: 96px;
          height: 96px;
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 18px;
          background: #0f513218;
          border: 2.5px solid #0f513230;
          box-shadow: 0 8px 32px #0f513218;
          flex-shrink: 0;
        }

        .subtitle {
          font-size: 20px;
          font-weight: 700;
          color: #0a2e1e;
          text-align: center;
          margin-bottom: 10px;
          line-height: 1.25;
        }

        .description {
          font-size: 14px;
          color: #3a5a48;
          text-align: center;
          line-height: 1.6;
          max-width: 300px;
          margin-bottom: 22px;
        }

        .nav-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          gap: 12px;
          margin-bottom: 10px;
        }

        .nav-btn {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: opacity 0.2s;
          box-shadow: 0 2px 8px #0f513214;
          cursor: pointer;
        }

        .got-it-btn {
          flex: 1;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          transition: all 0.35s cubic-bezier(.4,0,.2,1);
          letter-spacing: 0.02em;
        }
.got-it-btn:not(:disabled):hover {
  background: #154635 !important;
}
        .hint {
          font-size: 11.5px;
          color: #5a8a6e;
          text-align: center;
          letter-spacing: 0.01em;
          margin-top: 4px;
        }

        /* Tablet */
        @media (min-width: 600px) {
          .slider-wrapper {
            padding-top: 48px;
            align-items: flex-start;
          }
          .slider-card {
            padding: 32px 36px 26px;
          }
          .icon-wrap {
            width: 110px;
            height: 110px;
          }
          .subtitle {
            font-size: 22px;
          }
          .description {
            font-size: 14.5px;
            max-width: 320px;
          }
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .slider-wrapper {
            align-items: center;
            padding-top: 0;
          }
        }

        /* Small phones */
        @media (max-width: 360px) {
          .slider-wrapper {
            padding-top: 32px;
          }
          .slider-card {
            padding: 22px 16px 18px;
            border-radius: 20px;
          }
          .icon-wrap {
            width: 80px;
            height: 80px;
            border-radius: 18px;
            margin-bottom: 14px;
          }
          .subtitle {
            font-size: 18px;
          }
          .description {
            font-size: 13px;
            margin-bottom: 18px;
          }
          .got-it-btn {
            height: 42px;
            font-size: 14px;
          }
          .nav-btn {
            width: 38px;
            height: 38px;
          }
        }
      `}</style>

      <div className="slider-wrapper">
        <div className="slider-card">
          {/* Dot indicators */}
          <div className="step-row">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className="step-btn"
                style={{
                  background: i === current ? GREEN : "#b6d9c8",
                  width: i === current ? 28 : 8,
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Small label */}
          <p className="small-title">
            {slide.title} — {current + 1} of {slides.length}
          </p>

          {/* Icon */}
          <div className="icon-wrap">
            <Icon size={44} color={GREEN} strokeWidth={1.5} />
          </div>

          {/* Subtitle */}
          <h2 className="subtitle">{slide.subtitle}</h2>

          {/* Description */}
          <p className="description">{slide.description}</p>

          {/* Navigation row */}
          <div className="nav-row">
            <button
              onClick={prevSlide}
              disabled={current === 0}
              className="nav-btn"
              style={{
                opacity: current === 0 ? 0.35 : 1,
                cursor: current === 0 ? "not-allowed" : "pointer",
              }}
              aria-label="Previous"
            >
              <FiChevronLeft size={20} color={GREEN} />
            </button>

            <button
              onClick={() => isUnlocked && navigate("/scan")}
              disabled={!isUnlocked}
              className="got-it-btn"
              style={{
                background: isUnlocked ? "#1B5E44" : "#b6d9c8",
                cursor: isUnlocked ? "pointer" : "not-allowed",
                boxShadow: isUnlocked ? `0 8px 24px ${GREEN}44` : "none",
                transform: isUnlocked ? "scale(1)" : "scale(0.97)",
              }}
              aria-label="Got it, proceed to scan"
            >
              <span>Got it</span>
              <FiArrowRight size={16} style={{ marginLeft: 6 }} />
            </button>

            <button
              onClick={nextSlide}
              disabled={isLast}
              className="nav-btn"
              style={{
                opacity: isLast ? 0.35 : 1,
                cursor: isLast ? "not-allowed" : "pointer",
              }}
              aria-label="Next"
            >
              <FiChevronRight size={20} color={GREEN} />
            </button>
          </div>

          {/* Hint */}
          {!isUnlocked && (
            <p className="hint">
              {isLast
                ? "You're all set — tap Got it to continue!"
                : `${slides.length - current - 1} more tip${slides.length - current - 1 !== 1 ? "s" : ""} to go`}
            </p>
          )}
        </div>
      </div>
    </>
  );
}