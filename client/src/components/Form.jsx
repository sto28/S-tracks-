import React, { useState } from 'react';
import axios from 'axios';

const Form = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [amountSpent, setAmountSpent] = useState('');
  const [subscriptionStart, setSubscriptionStart] = useState('');
  const [subscriptionFee, setSubscriptionFee] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState('weekly');


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPlatform = { name, amountSpent: parseFloat(amountSpent), subscriptionStart, subscriptionFee: parseFloat(subscriptionFee), paymentFrequency };
    try {
        const response = await axios.post('http://localhost:4000/platforms', newPlatform); 
        onAdd(response.data);
        setName('');
        setAmountSpent('');
        setSubscriptionStart('');
        setSubscriptionFee('');
        setPaymentFrequency('weekly');
      } catch (error) {
        console.error('Error adding platform:', error);
      }
    };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Platform Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Subscription Start/Last payement Date:</label>
        <input type="date" value={subscriptionStart} onChange={(e) => setSubscriptionStart(e.target.value)} required />
      </div>
      <div>
        <label>Subscription Fee:</label>
        <input type="number" value={subscriptionFee} onChange={(e) => setSubscriptionFee(e.target.value)} required />
      </div>
      <div>
        <label>Payment Frequency:</label>
        <select value={paymentFrequency} onChange={(e) => setPaymentFrequency(e.target.value)} required>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="annually">Annually</option>
        </select>
      </div>
      <div>
        <label>Additional purchases (£):</label>
        <input type="number" value={amountSpent} onChange={(e) => setAmountSpent(e.target.value)}/>
      </div>

      <button type="submit">Add Tracker</button>
    </form>
  );
};

export default Form;