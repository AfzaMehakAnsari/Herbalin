import { useEffect, useRef, useState } from "react";
import TipsCard from "./TipsCard";
import "./TipsList.css";

const CARD_WIDTH = 280 + 24; // card width + gap
const VISIBLE = 4;

const TipsList = () => {
  const [tips, setTips] = useState([]);
  const scrollRef = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetch("/api/Tips")
      .then((res) => res.json())
      .then((data) => setTips(Array.isArray(data) ? data : []));
  }, []);

  const next = () => {
    if (index < tips.length - VISIBLE) {
      const i = index + 1;
      setIndex(i);
      scrollRef.current.scrollTo({
        left: i * CARD_WIDTH,
        behavior: "smooth",
      });
    }
  };

  const prev = () => {
    if (index > 0) {
      const i = index - 1;
      setIndex(i);
      scrollRef.current.scrollTo({
        left: i * CARD_WIDTH,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="tips-section">
      <h2 className="tips-heading">
        Discover the true meaning of herbal remedies
      </h2>

      <div className="tips-row">
        {/* Left arrow */}
        <button className="arrow-btn" onClick={prev}>
          ❮
        </button>

        {/* Scrollable cards */}
        <div className="tips-scroll" ref={scrollRef}>
          {tips.map((tip, i) => (
            <TipsCard key={i} tip={tip} />
          ))}
        </div>

        {/* Right arrow */}
        <button className="arrow-btn" onClick={next}>
          ❯
        </button>
      </div>
    </section>
  );
};

export default TipsList;
