import React, { useState, useEffect } from 'react';
import HomeButton from '../HomeButton';
import StarsAnimation from '../StarsAnimation';

const SortLettersGame = ({ setScreen }) => {
  const [draggedLetter, setDraggedLetter] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [targetSlots, setTargetSlots] = useState(['', '', '', '', '']);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [stars, setStars] = useState(5);
  const [message, setMessage] = useState('');
  const [speaker, setSpeaker] = useState('dog');
  const [gameComplete, setGameComplete] = useState(false);
  const [shakeSlots, setShakeSlots] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  
  const correctOrder = ['א', 'ב', 'ג', 'ד', 'ה'];

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile('ontouchstart' in window || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    resetToInitial();
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const resetToInitial = () => {
    const shuffled = [...correctOrder].sort(() => Math.random() - 0.5);
    setAvailableLetters(shuffled);
    setTargetSlots(['', '', '', '', '']);
    setShakeSlots([]);
    setSelectedLetter(null);
    setSelectedSource(null);
    setMistakes(0);
    setStars(5);
    setGameComplete(false);
    setMessage(isMobile ? 'לחצו על אות ואז על משבצת!' : 'סדרו את האותיות לפי הא"ב!');
    setSpeaker('dog');
  };

  const handleLetterClick = (letter, source) => {
    if (selectedLetter === letter && JSON.stringify(selectedSource) === JSON.stringify(source)) {
      setSelectedLetter(null);
      setSelectedSource(null);
    } else {
      setSelectedLetter(letter);
      setSelectedSource(source);
    }
  };

  const handleSlotClick = (slotIndex) => {
    if (!selectedLetter || !selectedSource) return;

    const newSlots = [...targetSlots];
    
    if (selectedSource.type === 'storage') {
      if (newSlots[slotIndex]) {
        setAvailableLetters([...availableLetters, newSlots[slotIndex]]);
      }
      newSlots[slotIndex] = selectedLetter;
      setAvailableLetters(availableLetters.filter(l => l !== selectedLetter));
      
    } else if (selectedSource.type === 'slot') {
      const sourceSlotIndex = selectedSource.index;
      
      if (newSlots[slotIndex]) {
        const targetLetter = newSlots[slotIndex];
        newSlots[slotIndex] = selectedLetter;
        newSlots[sourceSlotIndex] = targetLetter;
      } else {
        newSlots[slotIndex] = selectedLetter;
        newSlots[sourceSlotIndex] = '';
      }
    }
    
    setTargetSlots(newSlots);
    setSelectedLetter(null);
    setSelectedSource(null);
  };

  const handleStorageClick = () => {
    if (!selectedLetter || !selectedSource) return;
    
    if (selectedSource.type === 'slot') {
      const newSlots = [...targetSlots];
      newSlots[selectedSource.index] = '';
      setTargetSlots(newSlots);
      setAvailableLetters([...availableLetters, selectedLetter]);
    }
    
    setSelectedLetter(null);
    setSelectedSource(null);
  };

  const handleDragStart = (e, letter, source) => {
    if (isMobile) {
      e.preventDefault();
      return;
    }
    setDraggedLetter(letter);
    setDragSource(source);
  };

  const handleDragOver = (e) => {
    if (isMobile) return;
    e.preventDefault();
  };

  const handleDrop = (slotIndex) => {
    if (isMobile || !draggedLetter) return;

    const newSlots = [...targetSlots];
    
    if (dragSource.type === 'storage') {
      if (newSlots[slotIndex]) {
        setAvailableLetters([...availableLetters, newSlots[slotIndex]]);
      }
      newSlots[slotIndex] = draggedLetter;
      setAvailableLetters(availableLetters.filter(l => l !== draggedLetter));
      
    } else if (dragSource.type === 'slot') {
      const sourceSlotIndex = dragSource.index;
      
      if (newSlots[slotIndex]) {
        const targetLetter = newSlots[slotIndex];
        newSlots[slotIndex] = draggedLetter;
        newSlots[sourceSlotIndex] = targetLetter;
      } else {
        newSlots[slotIndex] = draggedLetter;
        newSlots[sourceSlotIndex] = '';
      }
    }
    
    setTargetSlots(newSlots);
    setDraggedLetter(null);
    setDragSource(null);
  };

  const handleDropToStorage = () => {
    if (isMobile || !draggedLetter || !dragSource) return;
    
    if (dragSource.type === 'slot') {
      const newSlots = [...targetSlots];
      newSlots[dragSource.index] = '';
      setTargetSlots(newSlots);
      setAvailableLetters([...availableLetters, draggedLetter]);
    }
    
    setDraggedLetter(null);
    setDragSource(null);
  };

  const checkOrder = () => {
    if (targetSlots.some(slot => slot === '')) {
      setMessage('עוד לא סיימתם! צריך למלא את כל המשבצות');
      setSpeaker('cat');
      return;
    }

    const isCorrect = targetSlots.every((letter, index) => letter === correctOrder[index]);

    if (isCorrect) {
      setGameComplete(true);
      setMessage('סיימתם את המשחק!');
      setSpeaker('both');
    } else {
      const wrongIndices = targetSlots
        .map((letter, index) => letter !== correctOrder[index] ? index : null)
        .filter(index => index !== null);
      
      setShakeSlots(wrongIndices);
      setTimeout(() => setShakeSlots([]), 500);
      
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      const newStars = Math.max(2, 5 - newMistakes);
      setStars(newStars);
      
      const wrongCount = wrongIndices.length;
      let errorMessage = '';
      if (wrongCount === 5) {
        errorMessage = 'אופס, כל האותיות לא במקום. נסו שוב! זכרו: א-ב-ג-ד-ה';
      } else if (wrongCount === 1) {
        errorMessage = 'כמעט! רק אות אחת לא במקום. המשיכו!';
      } else {
        errorMessage = `לא בדיוק... יש ${wrongCount} אותיות שלא במקום. נסו שוב!`;
      }
      
      setMessage(errorMessage);
      setSpeaker('dog');
    }
  };

  const resetGame = () => {
    resetToInitial();
  };

  const isLetterSelected = (letter, source) => {
    return selectedLetter === letter && JSON.stringify(selectedSource) === JSON.stringify(source);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-300 flex flex-col items-center justify-between p-4 overflow-hidden relative touch-none" dir="rtl">
      <HomeButton setScreen={setScreen} />
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 left-10 w-40 h-40 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-2xl z-10 pt-16">
        <h1 className="text-2xl md:text-4xl font-bold text-amber-800 mb-4 text-center">סדר את האותיות</h1>
      </div>

      <div className="flex-1 flex items-center justify-center w-full max-w-3xl z-10">
        {!gameComplete ? (
          <div className="w-full space-y-8">
            <div className="bg-white bg-opacity-80 rounded-2xl p-4 shadow-lg">
              <p className="text-lg font-bold text-amber-800 mb-3 text-center">
                {isMobile ? 'לחצו על האותיות:' : 'גררו או לחצו על האותיות:'}
              </p>
              <div 
                className="flex justify-center gap-3 flex-wrap min-h-20 p-2 border-4 border-dashed border-green-500 rounded-xl bg-green-50"
                onDragOver={handleDragOver}
                onDrop={handleDropToStorage}
                onClick={handleStorageClick}
              >
                {availableLetters.map((letter, index) => (
                  <div
                    key={`${letter}-${index}`}
                    draggable={!isMobile}
                    onDragStart={(e) => handleDragStart(e, letter, { type: 'storage' })}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLetterClick(letter, { type: 'storage' });
                    }}
                    className={`w-16 h-16 md:w-20 md:h-20 bg-orange-400 hover:bg-orange-500 rounded-xl shadow-lg cursor-pointer flex items-center justify-center text-4xl md:text-5xl font-bold text-amber-900 active:scale-95 transition-transform select-none
                      ${isLetterSelected(letter, { type: 'storage' }) ? 'ring-4 ring-blue-500 scale-105' : ''}
                    `}
                  >
                    {letter}
                  </div>
                ))}
                {availableLetters.length === 0 && (
                  <div className="text-gray-400 text-center py-4 w-full">
                    {isMobile ? 'לחצו כאן עם אות נבחרת' : 'גררו/לחצו כאן להחזיר אות'}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white bg-opacity-80 rounded-2xl p-4 shadow-lg">
              <p className="text-lg font-bold text-amber-800 mb-3 text-center">שימו כאן לפי הסדר:</p>
              <div className="flex justify-center gap-2 md:gap-3 mb-4">
                {targetSlots.map((letter, index) => (
                  <div
                    key={index}
                    draggable={!isMobile && !!letter}
                    onDragStart={(e) => letter && handleDragStart(e, letter, { type: 'slot', index })}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    onClick={() => letter ? handleLetterClick(letter, { type: 'slot', index }) : handleSlotClick(index)}
                    className={`w-16 h-16 md:w-20 md:h-20 border-4 border-dashed border-amber-600 rounded-xl flex items-center justify-center text-4xl md:text-5xl font-bold text-amber-900 transition-all select-none
                      ${letter ? 'bg-orange-300 cursor-pointer hover:bg-orange-200' : 'bg-white bg-opacity-50 cursor-pointer'}
                      ${shakeSlots.includes(index) ? 'animate-shake bg-red-300' : ''}
                      ${letter && isLetterSelected(letter, { type: 'slot', index }) ? 'ring-4 ring-blue-500 scale-105' : ''}
                    `}
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={checkOrder}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
                >
                  בדוק את הסדר!
                </button>
                <button
                  onClick={resetToInitial}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
                >
                  התחל מחדש
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="text-6xl animate-bounce">🎉</div>
            <div className="text-3xl md:text-4xl font-bold text-amber-800">
              זכיתם ב-
            </div>
            <StarsAnimation stars={stars} />
            <div className="text-2xl md:text-3xl font-bold text-green-700">
              {stars} כוכבים!
            </div>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={resetGame}
                className="bg-orange-400 hover:bg-orange-500 px-8 py-4 rounded-full text-xl font-bold text-amber-900 shadow-lg hover:shadow-xl transition-all"
              >
                שחקו שוב!
              </button>
              <button
                onClick={() => setScreen('home')}
                className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-full text-xl font-bold text-white shadow-lg hover:shadow-xl transition-all"
              >
                חזרה לבית
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="w-full max-w-3xl z-10 mb-4">
        <div className="bg-white bg-opacity-90 rounded-2xl p-4 md:p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex-1">
              <div className="bg-green-100 rounded-xl p-3 md:p-4 relative">
                <div className="absolute -right-2 top-4 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-green-100"></div>
                <p className="text-lg md:text-2xl font-bold text-amber-900">
                  {message}
                </p>
              </div>
            </div>
            <div className="flex gap-4 text-5xl md:text-6xl">
              <span className={speaker === 'dog' || speaker === 'both' ? 'animate-bounce' : ''}>🐕</span>
              <span className={speaker === 'cat' || speaker === 'both' ? 'animate-bounce' : ''}>🐱</span>
            </div>
          </div>
          
          <div className="flex justify-center items-center text-sm md:text-base text-gray-600">
            <div className="text-amber-700">
              {isMobile ? '💡 לחצו על אות ואז על משבצת' : '💡 לחצו/גררו אותיות להחלפה'}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
        .touch-none {
          touch-action: none;
          -webkit-user-drag: none;
          -webkit-touch-callout: none;
        }
        .select-none {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default SortLettersGame;