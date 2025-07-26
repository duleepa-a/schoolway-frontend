
import React from "react";
import "./OfferCard.css";

interface OfferCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const OfferCard: React.FC<OfferCardProps> = ({ icon, title, description }) => {
  return (
    <div className="offer-card">
      <div className="offer-card__icon-wrapper">
        {icon}
      </div>
      <h3 className="offer-card__title">{title}</h3>
      <p className="offer-card__desc">{description}</p>
    </div>
  );
};

export default OfferCard;
