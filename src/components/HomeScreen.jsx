import React from 'react';

const HomeScreen = ({ setScreen }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-300 flex flex-col items-center justify-center p-4 overflow-hidden relative" dir="rtl">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 left-10 w-40 h-40 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="z-10 text-center space-y-8 max-w-2xl w-full">
        <h1 className="text-4xl md:text-6xl font-bold text-amber-800 mb-4">
          עולם האותיות העבריות
        </h1>
        
        <div className="flex justify-center gap-6 text-7xl md:text-8xl mb-8">
          <span className="animate-bounce">🐕</span>
          <span className="animate-bounce delay-100">🐱</span>
        </div>

        <div className="bg-white bg-opacity-90 rounded-2xl p-6 shadow-xl mb-8">
          <p className="text-xl md:text-2xl font-bold text-amber-900">
            שלום! בואו ללמוד אותיות ביחד! 🎉
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setScreen('find')}
            className="w-full bg-orange-400 hover:bg-orange-500 text-amber-900 font-bold py-6 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all text-xl md:text-2xl flex items-center justify-between"
          >
            <span>🎯</span>
            <span>משחק 1: מצא את האות</span>
            <span className="text-sm bg-green-500 text-white px-3 py-1 rounded-full">קל</span>
          </button>

          <button
            onClick={() => setScreen('sort')}
            className="w-full bg-orange-400 hover:bg-orange-500 text-amber-900 font-bold py-6 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all text-xl md:text-2xl flex items-center justify-between"
          >
            <span>🔤</span>
            <span>משחק 2: סדר את האותיות</span>
            <span className="text-sm bg-yellow-500 text-white px-3 py-1 rounded-full">בינוני</span>
          </button>

          <button
            onClick={() => setScreen('memory')}
            className="w-full bg-orange-400 hover:bg-orange-500 text-amber-900 font-bold py-6 px-8 rounded-2xl shadow-lg hover:shadow-xl transition-all text-xl md:text-2xl flex items-center justify-between"
          >
            <span>🧠</span>
            <span>משחק 3: זיכרון האותיות</span>
            <span className="text-sm bg-red-500 text-white px-3 py-1 rounded-full">מאתגר</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;