import React from 'react';
import './pricing.css';

export const BillingTable: React.FC = () => {
  return (
    <table className="billing-table">
      <thead>
        <tr>
          <th>Feature</th>
          <th>Free</th>
          <th>Pro</th>
          <th>Team</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>AI Conversations / month</td>
          <td>10</td>
          <td>Unlimited</td>
          <td>Unlimited</td>
        </tr>
        <tr>
          <td>Priority Support</td>
          <td>—</td>
          <td>Yes</td>
          <td>Yes</td>
        </tr>
        <tr>
          <td>Team Seats</td>
          <td>1</td>
          <td>1</td>
          <td>5+</td>
        </tr>
        <tr>
          <td>Advanced Accuracy Tools</td>
          <td>Basic</td>
          <td>Advanced</td>
          <td>Advanced + Admin</td>
        </tr>
      </tbody>
    </table>
  );
};

export default BillingTable;
