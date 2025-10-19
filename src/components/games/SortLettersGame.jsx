import React, { useState, useEffect } from 'react';
import HomeButton from '../HomeButton';
import StarsAnimation from '../StarsAnimation';

const SortLettersGame = ({ setScreen }) => {
  const correctOrder = ['א', 'ב', 'ג', 'ד', 'ה'];
  
  // State
  const [storage, setStorage] = useState([]);
  const [slots, setSlots] = useState([null, null, null, null, null]);
  const [attempts, setAttempts] = useState(0);
  const [stars, setStars] = useState(5);
  const [message, setMessage] = useState('');
  const [speaker, setSpeaker] = useState('dog');
  const [gameComplete, setGameComplete] = useState(false);
  const [shakeSlots, setShakeSlots] = useState([]);
  
  // Drag state
  const [draggedLetter, setDraggedLetter] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [dragOverSlot, setDragOverSlot] = useState(null);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    const shuffled = [...correctOrder].sort(() => Math.random() - 0.5);
    setStorage(shuffled);
    setSlots([null, null, null, null, null]);
    setAttempts(0);
    setStars(5);
    setGameComplete(false);
    setShakeSlots([]);
    setMessage('גררו את האותיות למשבצות בסדר הנכון!');
    setSpeaker('dog');
    setDraggedLetter(null);
    setDraggedFrom(null);
    setDragOverSlot(null);
  };

  // ========== DESKTOP DRAG & DROP ==========
  
  const handleDragStart = (e, letter, source) => {
    e.stopPropagation();
    setDraggedLetter(letter);
    setDraggedFrom(source);
    
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', letter);
  };

  const handleDragEnd = (e) => {
    setDraggedLetter(null);
    setDraggedFrom(null);
    setDragOverSlot(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnterSlot = (e, index) => {
    e.preventDefault();
    setDragOverSlot(index);
  };

  const handleDragLeaveSlot = (e) => {
    setDragOverSlot(null);
  };

  const handleDropOnSlot = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedLetter || draggedFrom === null) return;

    performMove(draggedFrom, { type: 'slot', index: targetIndex });
    
    setDraggedLetter(null);
    setDraggedFrom(null);
    setDragOverSlot(null);
  };

  const handleDragEnterStorage = (e) => {
    e.preventDefault();
  };

  const handleDropOnStorage = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!draggedLetter || draggedFrom === null) return;
    
    if (draggedFrom.type === 'slot') {
      const newSlots = [...slots];
      newSlots[draggedFrom.index] = null;
      setSlots(newSlots);
      setStorage([...storage, draggedLetter]);
    }
    
    setDraggedLetter(null);
    setDraggedFrom(null);
    setDragOverSlot(null);
  };

  // ========== DOUBLE CLICK ==========
  
  const handleDoubleClick = (letter, source) => {
    if (source.type === 'slot') {
      const newSlots = [...slots];
      newSlots[source.index] = null;
      setSlots(newSlots);
      setStorage([...storage, letter]);
      setMessage('האות חזרה למחסן!');
      setSpeaker('cat');
    }
  };

  // ========== MOVE LOGIC ==========
  
  const performMove = (from, to) => {
    const newSlots = [...slots];
    const newStorage = [...storage];
    
    // From storage to slot
    if (from.type === 'storage' && to.type === 'slot') {
      const letterToMove = draggedLetter;
      const targetLetter = newSlots[to.index];
      
      // Remove from storage
      const storageIndex = newStorage.indexOf(letterToMove);
      newStorage.splice(storageIndex, 1);
      
      // Place in slot
      newSlots[to.index] = letterToMove;
      
      // If slot was occupied, return old letter to storage
      if (targetLetter) {
        newStorage.push(targetLetter);
        setMessage(`החלפה: ${letterToMove} נכנסה, ${targetLetter} חזרה למחסן`);
      } else {
        setMessage(`כל הכבוד! ${letterToMove} במקום`);
      }
      setSpeaker('cat');
    }
    // From slot to slot (swap)
    else if (from.type === 'slot' && to.type === 'slot') {
      const fromLetter = newSlots[from.index];
      const toLetter = newSlots[to.index];
      
      // Swap
      newSlots[from.index] = toLetter;
      newSlots[to.index] = fromLetter;
      
      if (toLetter) {
        setMessage(`החלפה: ${fromLetter} ↔ ${toLetter}`);
      } else {
        setMessage(`${fromLetter} עברה למשבצת ${to.index + 1}`);
      }
      setSpeaker('dog');
    }
    
    setSlots(newSlots);
    setStorage(newStorage);
  };

  // ========== CHECK SOLUTION ==========
  
  const checkOrder = () => {
    if (slots.some(slot => slot === null)) {
      setMessage('עוד לא סיימת! צריך למלא את כל המשבצות');
      setSpeaker('cat');
      return;
    }

    const isCorrect = slots.every((letter, index) => letter === correctOrder[index]);

    if (isCorrect) {
      setGameComplete(true);
      setMessage('מעולה! סיימת את המשחק!');
      setSpeaker('both');
    } else {
      const wrongIndices = slots
        .map((letter, index) => letter !== correctOrder[index] ? index : null)
        .filter(index => index !== null);
      
      setShakeSlots(wrongIndices);
      setTimeout(() => setShakeSlots([]), 500);
      
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      const newStars = Math.max(2, 5 - newAttempts);
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-300 flex flex-col items-center justify-between p-4 overflow-hidden relative" dir="rtl">
      <HomeButton setScreen={setScreen} />
      
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 left-10 w-40 h-40 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
      </div>

      {/* Title */}
      <div className="w-full max-w-2xl z-10 pt-16">
        <h1 className="text-2xl md:text-4xl font-bold text-amber-800 mb-4 text-center">סדר את האותיות</h1>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex items-center justify-center w-full max-w-3xl z-10">
        {!gameComplete ? (
          <div className="w-full space-y-8">
            {/* Storage Area */}
            <div className="bg-white bg-opacity-80 rounded-2xl p-4 shadow-lg">
              <p className="text-lg font-bold text-amber-800 mb-3 text-center">
                מחסן אותיות - גררו מכאן:
              </p>
              <div 
                className="flex justify-center gap-3 flex-wrap min-h-24 p-4 border-4 border-dashed border-green-500 rounded-xl bg-green-50 transition-all"
                onDragOver={handleDragOver}
                onDrop={handleDropOnStorage}
                onDragEnter={handleDragEnterStorage}
              >
                {storage.map((letter, index) => (
                  <div
                    key={`storage-${letter}-${index}`}
                    draggable="true"
                    onDragStart={(e) => handleDragStart(e, letter, { type: 'storage', index })}
                    onDragEnd={handleDragEnd}
                    className={`w-16 h-16 md:w-20 md:h-20 bg-orange-400 hover:bg-orange-500 rounded-xl shadow-lg flex items-center justify-center text-4xl md:text-5xl font-bold text-amber-900 transition-all select-none
                      ${draggedLetter === letter && draggedFrom?.type === 'storage' ? 'opacity-30 scale-95 cursor-grabbing' : 'cursor-grab hover:scale-105'}
                    `}
                  >
                    {letter}
                  </div>
                ))}
                {storage.length === 0 && (
                  <div className="text-gray-400 text-center py-6 w-full">
                    כל האותיות במשבצות!
                  </div>
                )}
              </div>
            </div>

            {/* Target Slots */}
            <div className="bg-white bg-opacity-80 rounded-2xl p-4 shadow-lg">
              <p className="text-lg font-bold text-amber-800 mb-3 text-center">גררו לכאן לפי הסדר (א-ב-ג-ד-ה):</p>
              <div className="flex justify-center gap-2 md:gap-3 mb-4">
                {slots.map((letter, index) => (
                  <div
                    key={`slot-${index}`}
                    draggable={letter !== null}
                    onDragStart={(e) => letter && handleDragStart(e, letter, { type: 'slot', index })}
                    onDragEnd={handleDragEnd}
                    onDragOver={handleDragOver}
                    onDragEnter={(e) => handleDragEnterSlot(e, index)}
                    onDragLeave={handleDragLeaveSlot}
                    onDrop={(e) => handleDropOnSlot(e, index)}
                    onDoubleClick={() => letter && handleDoubleClick(letter, { type: 'slot', index })}
                    className={`w-16 h-16 md:w-20 md:h-20 border-4 border-dashed rounded-xl flex items-center justify-center text-4xl md:text-5xl font-bold text-amber-900 transition-all select-none
                      ${letter ? 'bg-orange-300 cursor-grab hover:bg-orange-400 hover:scale-105' : 'bg-white bg-opacity-50'}
                      ${dragOverSlot === index ? 'border-blue-500 bg-blue-100 scale-110' : 'border-amber-600'}
                      ${shakeSlots.includes(index) ? 'animate-shake bg-red-300' : ''}
                      ${draggedLetter === letter && draggedFrom?.type === 'slot' && draggedFrom?.index === index ? 'opacity-30 scale-95 cursor-grabbing' : ''}
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
                  onClick={resetGame}
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
              זכית ב-
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

      {/* Message Area */}
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
              💡 גרירה בין משבצות = החלפה • לחיצה כפולה = החזרה למחסן
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
        .select-none {
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }
        .cursor-grab {
          cursor: grab;
        }
        .cursor-grabbing {
          cursor: grabbing;
        }
      `}</style>
    </div>
  );
};

export default SortLettersGame;