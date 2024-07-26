import React, { useState } from 'react';
import axios from 'axios';

const Form = ({ onAdd }) => {
  const [name, setName] = useState('');
  const [amountSpent, setAmountSpent] = useState('');
  const [subscriptionStart, setSubscriptionStart] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPlatform = { name, amountSpent: parseFloat(amountSpent), subscriptionStart };
    axios.post('/platforms', newPlatform)
      .then(response => {
        onAdd(response.data);
        setName('');
        setAmountSpent('');
        setSubscriptionStart('');
      })
      .catch(error => console.error(error));
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Platform Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label>Amount Spent:</label>
        <input type="number" value={amountSpent} onChange={(e) => setAmountSpent(e.target.value)} required />
      </div>
      <div>
        <label>Subscription Start:</label>
        <input type="date" value={subscriptionStart} onChange={(e) => setSubscriptionStart(e.target.value)} />
      </div>
      <button type="submit">Add Tracker</button>
    </form>
  );
};

export default Form;