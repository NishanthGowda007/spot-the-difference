import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomeScreen from './components/HomeScreen';
import LevelSelector from './components/LevelSelector';
import GameScreen from './components/GameScreen';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/levels" element={<LevelSelector />} />
        <Route path="/game/:level" element={<GameScreen />} />
      </Routes>
    </Router>
  );
}

export default App;
