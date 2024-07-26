import './App.css';
import React, { useState } from 'react';
import PlatformList from './components/PlatformList';
import Form from './components/Form';
import Statistics from './components/Statistics';
function App() {

  const [platforms, setPlatforms] = useState([]);

  const handleAddPlatform = (newPlatform) => {
    setPlatforms([...platforms, newPlatform]);
  };

  
  return (
    <div className="App">
      <h1>S-tracks</h1>
      <Form onAdd={handleAddPlatform} />
      <PlatformList platforms={platforms} setPlatforms={setPlatforms} />
      <Statistics platforms={platforms} />
    </div>
  );
}

export default App;
