import React from 'react';

const HomeButton = ({ setScreen }) => {
  return (
    <button
      onClick={() => setScreen('home')}
      className="fixed top-4 left-4 z-50 bg-white hover:bg-gray-100 text-amber-800 font-bold py-2 px-4 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
      title="חזרה לדף הבית"
    >
      <span className="text-2xl">🏠</span>
      <span className="hidden md:inline">בית</span>
    </button>
  );
};

export default HomeButton;