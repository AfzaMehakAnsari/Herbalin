import "./TipsCard.css";

const TipsCard = ({ tip, index, visible }) => {
  return (
    <div
      className="tip-card"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${index * 0.07}s, transform 0.5s ease ${index * 0.07}s`,
      }}
    >
      <img src={tip.imageUrl} alt={tip.tipTitle} className="tip-img" />

      <div className="tip-content">
        <span className="tip-title">{tip.tipTitle}</span>
        <p className="tip-desc">{tip.description}</p>
        
        <a
          href={tip.source}
          className="tip-link"
          target="_blank"
          rel="noreferrer"
        >
          click <span>here</span> to read more
        </a>
      </div>
    </div>
  );
};

export default TipsCard;