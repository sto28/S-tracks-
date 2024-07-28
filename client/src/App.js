import './App.css';
import React, { useState } from 'react';
import PlatformList from './components/PlatformList';
import Form from './components/Form';
import Statistics from './components/Statistics';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {

  const [platforms, setPlatforms] = useState([]);

  const handleAddPlatform = (newPlatform) => {
    setPlatforms([...platforms, newPlatform]);
  };


  return (
    <div className="App">
      <ToastContainer/>
      <h1>S-tracks</h1>
      <Form onAdd={handleAddPlatform} />
      <PlatformList platforms={platforms} setPlatforms={setPlatforms} />
      <Statistics platforms={platforms} />
    </div>
  );
}

export default App;
