import React, { useState } from 'react';
import './pricing.css';

interface Props {
  defaultPlan?: string;
}

export const SubscriptionForm: React.FC<Props> = ({ defaultPlan = 'pro' }) => {
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState(defaultPlan);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, call payment/subscription API
    alert(`Subscribe ${email} to ${plan} (placeholder)`);
  };

  return (
    <form className="subscription-form" onSubmit={submit}>
      <label>
        Email
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required />
      </label>

      <label>
        Plan
        <select value={plan} onChange={e => setPlan(e.target.value)}>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="team">Team</option>
        </select>
      </label>

      <div className="form-actions">
        <button className="btn btn-primary" type="submit">Subscribe</button>
      </div>
    </form>
  );
};

export default SubscriptionForm;
