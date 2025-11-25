import React from 'react';
import './pricing.css';

export const PricingHero: React.FC = () => {
  return (
    <section className="pricing-hero">
      <div className="pricing-hero-inner">
        <h1 className="pricing-title">Flexible pricing built for learners</h1>
        <p className="pricing-subtitle">
          Choose a plan that suits your practice habits — free tier for casual use,
          paid plans for advanced AI features, conversations and streak rewards.
        </p>
        <div className="pricing-hero-cta">
          <a className="btn btn-primary" href="#plans">See plans</a>
          <a className="btn btn-outline" href="#compare">Compare</a>
        </div>
      </div>
    </section>
  );
};

export default PricingHero;
