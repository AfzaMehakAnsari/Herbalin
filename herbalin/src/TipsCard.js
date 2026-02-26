import "./TipsCard.css";

const TipsCard = ({ tip }) => {
  return (
    <div className="tip-card">
      <img src={tip.imageUrl} alt={tip.tipTitle} className="tip-img" />

      <div className="tip-content">
        <span className="tip-title">{tip.tipTitle}</span>

        <p className="tip-desc">
          {tip.description}
        </p>

        <a href={tip.source} className="tip-link" target="_blank" rel="noreferrer">
          click <span>here</span> to read more
        </a>
      </div>
    </div>
  );
};

export default TipsCard;
