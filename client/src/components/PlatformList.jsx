import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlatformList = () => {
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    axios.get('/platforms')
      .then(response => setPlatforms(response.data))
      .catch(error => console.error(error));
  }, []);

  const deletePlatform = (id) => {
    axios.delete(`/platforms/${id}`)
      .then(() => setPlatforms(platforms.filter(platform => platform._id !== id)))
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>Your Platforms</h2>
      <ul>
        {platforms.map(platform => (
          <li key={platform._id}>
            {platform.name} - ${platform.amountSpent}
            <button onClick={() => deletePlatform(platform._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlatformList;