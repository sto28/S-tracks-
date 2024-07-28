import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28CFF', '#FF48A3'];


const PlatformList = () => {
  const [platforms, setPlatforms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlatforms = async () => {
      try {
        const response = await axios.get('http://localhost:4000/platforms'); 
        setLoading(false);
        setPlatforms(response.data);
        notifyUpcomingPayments(response.data);
      } catch (error) {
        console.error('Error fetching platforms:', error);
        setLoading(false);
      }
    };

    fetchPlatforms();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/platforms/${id}`); 
      const updatedPlatforms = platforms.filter(platform => platform._id !== id);
      setPlatforms(updatedPlatforms);
      notifyUpcomingPayments(updatedPlatforms);
    } catch (error) {
      console.error('Error deleting platform:', error);
    }
  };

  const notifyUpcomingPayments = (platforms) => {
    platforms.forEach(platform => {
      const now = new Date();
      const startDate = new Date(platform.subscriptionStart);
      const timeDifference = now - startDate;

      let daysUntilNextPayment;
      switch (platform.paymentFrequency) {
        case 'weekly':
          daysUntilNextPayment = 7 - ((timeDifference / (1000 * 60 * 60 * 24)) % 7);
          break;
        case 'monthly':
          daysUntilNextPayment = 30 - ((timeDifference / (1000 * 60 * 60 * 24)) % 30);
          break;
        case 'annually':
          daysUntilNextPayment = 365 - ((timeDifference / (1000 * 60 * 60 * 24)) % 365);
          break;
        default:
          daysUntilNextPayment = 0;
      }

      if (daysUntilNextPayment < 7) {
        toast.info(`Your next payment for ${platform.name} is in ${Math.ceil(daysUntilNextPayment)} days!`);
      }
    });
  };


  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <div>
      <h2>Your Platforms</h2>
      {platforms.length === 0 ? (
        <p>Nothing yet...</p>
      ) : (
        <ul>
          {platforms.map(platform => (
            <li key={platform._id}>
              <div>
                <strong>{platform.name}</strong> - £{platform.totalAmountSpent.toFixed(2)}
              </div>
              <div>
                <em>Subscription Start:</em> {new Date(platform.subscriptionStart).toLocaleDateString()}
              </div>
              <div>
                <em>Subscription Fee:</em> ${platform.subscriptionFee} 
              </div>
              <div>
                <em>Payment Frequency:</em> {platform.paymentFrequency}
              </div>
              <div>
                <em>Rate of Spending:</em> ${platform.spendingRate.toFixed(2)} per day
              </div>
              <button onClick={() => handleDelete(platform._id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
       <h2>Your Spending Stats</h2>
       <ResponsiveContainer width={400} height={400}>
       <PieChart>
        <Pie
          data={platforms}
          dataKey="totalAmountSpent"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={150}
          label={({ name, totalAmountSpent }) => `${name}: $${totalAmountSpent.toFixed(2)}`}
        >
          {platforms.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
        <Legend />
      </PieChart>
      </ResponsiveContainer>
      <h2>Your Rates</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={platforms}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => `$${value.toFixed(2)} per day`} />
          <Legend />
          <Bar dataKey="spendingRate" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
   

export default PlatformList;