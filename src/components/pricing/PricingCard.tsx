import React from 'react';
import './pricing.css';

export interface PricingCardProps {
  title: string;
  priceLabel: string;
  features: string[];
  recommended?: boolean;
  onSelect?: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({ title, priceLabel, features, recommended, onSelect }) => {
  return (
    <article className={`pricing-card ${recommended ? 'recommended' : ''}`}>
      {recommended && <div className="badge">Most popular</div>}
      <h3 className="card-title">{title}</h3>
      <div className="card-price">{priceLabel}</div>
      <ul className="card-features">
        {features.map((f, i) => <li key={i}>{f}</li>)}
      </ul>
      <button className="btn btn-primary" onClick={onSelect}>{recommended ? 'Get started' : 'Choose plan'}</button>
    </article>
  );
};

export default PricingCard;
