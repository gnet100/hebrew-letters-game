import React, { useState } from 'react';
import HomeScreen from './components/HomeScreen';
import FindLetterGame from './components/games/FindLetterGame';
import SortLettersGame from './components/games/SortLettersGame';
import MemoryLettersGame from './components/games/MemoryLettersGame';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('home');
  
  return (
    <div>
      {currentScreen === 'home' && <HomeScreen setScreen={setCurrentScreen} />}
      {currentScreen === 'find' && <FindLetterGame setScreen={setCurrentScreen} />}
      {currentScreen === 'sort' && <SortLettersGame setScreen={setCurrentScreen} />}
      {currentScreen === 'memory' && <MemoryLettersGame setScreen={setCurrentScreen} />}
    </div>
  );
};

export default App;