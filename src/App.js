import React, { useState, useEffect } from 'react';

const HebrewGamesHub = () => {
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

// מסך בית
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

// כפתור בית (משותף לכל המשחקים)
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

// משחק 1: מצא את האות
const FindLetterGame = ({ setScreen }) => {
  const [currentLetter, setCurrentLetter] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [stars, setStars] = useState(5);
  const [message, setMessage] = useState('');
  const [speaker, setSpeaker] = useState('');
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [celebrateButton, setCelebrateButton] = useState(null);
  const [shakeButton, setShakeButton] = useState(null);
  
  const letters = ['א', 'ב', 'ג', 'ד', 'ה'];
  const totalQuestions = 5;

  useEffect(() => {
    startNewQuestion();
  }, []);

  const startNewQuestion = () => {
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];
    setCurrentLetter(randomLetter);
    setMessage(`מצאו את האות ${randomLetter}!`);
    setSpeaker('dog');
  };

  const handleLetterClick = (letter) => {
    if (gameComplete) return;
    
    if (letter === currentLetter) {
      setCelebrateButton(letter);
      setTimeout(() => setCelebrateButton(null), 600);
      
      setMessage('כל הכבוד! אתם מדהימים!');
      setSpeaker('cat');
      
      const newQuestionsAnswered = questionsAnswered + 1;
      setQuestionsAnswered(newQuestionsAnswered);
      
      if (newQuestionsAnswered >= totalQuestions) {
        setTimeout(() => {
          setGameComplete(true);
          setMessage('סיימתם! אתם אלופים!');
          setSpeaker('both');
        }, 1500);
      } else {
        setTimeout(() => {
          startNewQuestion();
        }, 1500);
      }
    } else {
      setShakeButton(letter);
      setTimeout(() => setShakeButton(null), 500);
      
      const newMistakes = mistakes + 1;
      setMistakes(newMistakes);
      
      const newStars = Math.max(2, 5 - newMistakes);
      setStars(newStars);
      
      setMessage('אופס, זה לא זה. בואו ננסה שוב!');
      setSpeaker('dog');
    }
  };

  const resetGame = () => {
    setQuestionsAnswered(0);
    setMistakes(0);
    setStars(5);
    setGameComplete(false);
    startNewQuestion();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-300 flex flex-col items-center justify-between p-4 overflow-hidden relative" dir="rtl">
      <HomeButton setScreen={setScreen} />
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 left-10 w-40 h-40 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-2xl z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-4xl font-bold text-amber-800">מצא את האות</h1>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-2xl md:text-3xl">
                {i < stars ? '⭐' : '☆'}
              </span>
            ))}
          </div>
        </div>
        
        <div className="bg-white bg-opacity-80 rounded-lg p-3 text-center shadow-lg">
          <p className="text-lg md:text-xl text-gray-700">
            {!gameComplete ? `שאלה ${questionsAnswered + 1} מתוך ${totalQuestions}` : 'המשחק הסתיים!'}
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center w-full max-w-3xl z-10">
        {!gameComplete ? (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 w-full px-4">
            {letters.map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                className={`
                  aspect-square bg-orange-400 hover:bg-orange-500 rounded-2xl 
                  shadow-lg hover:shadow-xl transition-all duration-200
                  text-5xl md:text-7xl font-bold text-amber-900
                  active:scale-95 transform
                  ${celebrateButton === letter ? 'animate-bounce bg-green-500 scale-110' : ''}
                  ${shakeButton === letter ? 'animate-shake bg-red-400' : ''}
                `}
              >
                {letter}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="text-6xl animate-bounce">🎉</div>
            <div className="text-3xl font-bold text-amber-800">
              קיבלתם {stars} כוכבים!
            </div>
            <div className="flex gap-4 justify-center">
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
          
          <div className="flex justify-between items-center text-sm md:text-base text-gray-600">
            <div className="font-bold text-green-700">ניקוד: {questionsAnswered}/{totalQuestions}</div>
            <div>טעויות: {mistakes}</div>
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
      `}</style>
    </div>
  );
};

// משחק 2: סדר את האותיות
const SortLettersGame = ({ setScreen }) => {
  const [draggedLetter, setDraggedLetter] = useState(null);
  const [dragSource, setDragSource] = useState(null);
  const [targetSlots, setTargetSlots] = useState(['', '', '', '', '']);
  const [availableLetters, setAvailableLetters] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [stars, setStars] = useState(5);
  const [message, setMessage] = useState('');
  const [speaker, setSpeaker] = useState('dog');
  const [gameComplete, setGameComplete] = useState(false);
  const [shakeSlots, setShakeSlots] = useState([]);
  
  const correctOrder = ['א', 'ב', 'ג', 'ד', 'ה'];

  useEffect(() => {
    resetToInitial();
  }, []);

  const resetToInitial = () => {
    const shuffled = [...correctOrder].sort(() => Math.random() - 0.5);
    setAvailableLetters(shuffled);
    setTargetSlots(['', '', '', '', '']);
    setShakeSlots([]);
    setMistakes(0);
    setStars(5);
    setGameComplete(false);
    setMessage('סדרו את האותיות לפי הא"ב!');
    setSpeaker('dog');
  };

  const handleDragStart = (letter, source) => {
    setDraggedLetter(letter);
    setDragSource(source);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (slotIndex) => {
    if (!draggedLetter) return;

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
    if (!draggedLetter || !dragSource) return;
    
    if (dragSource.type === 'slot') {
      const newSlots = [...targetSlots];
      newSlots[dragSource.index] = '';
      setTargetSlots(newSlots);
      setAvailableLetters([...availableLetters, draggedLetter]);
    }
    
    setDraggedLetter(null);
    setDragSource(null);
  };

  const handleRemoveLetter = (slotIndex) => {
    const letter = targetSlots[slotIndex];
    if (!letter) return;

    const newSlots = [...targetSlots];
    newSlots[slotIndex] = '';
    setTargetSlots(newSlots);
    setAvailableLetters([...availableLetters, letter]);
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
      setMessage('מדהים! סידרתם נכון! אתם אלופים!');
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-300 flex flex-col items-center justify-between p-4 overflow-hidden relative" dir="rtl">
      <HomeButton setScreen={setScreen} />
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 left-10 w-40 h-40 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-2xl z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-4xl font-bold text-amber-800">סדר את האותיות</h1>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-2xl md:text-3xl">
                {i < stars ? '⭐' : '☆'}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center w-full max-w-3xl z-10">
        {!gameComplete ? (
          <div className="w-full space-y-8">
            <div className="bg-white bg-opacity-80 rounded-2xl p-4 shadow-lg">
              <p className="text-lg font-bold text-amber-800 mb-3 text-center">גררו את האותיות:</p>
              <div 
                className="flex justify-center gap-3 flex-wrap min-h-20 p-2 border-4 border-dashed border-green-500 rounded-xl bg-green-50"
                onDragOver={handleDragOver}
                onDrop={handleDropToStorage}
              >
                {availableLetters.map((letter, index) => (
                  <div
                    key={`${letter}-${index}`}
                    draggable
                    onDragStart={() => handleDragStart(letter, { type: 'storage' })}
                    className="w-16 h-16 md:w-20 md:h-20 bg-orange-400 hover:bg-orange-500 rounded-xl shadow-lg cursor-move flex items-center justify-center text-4xl md:text-5xl font-bold text-amber-900 active:scale-95 transition-transform"
                  >
                    {letter}
                  </div>
                ))}
                {availableLetters.length === 0 && (
                  <div className="text-gray-400 text-center py-4 w-full">
                    גררו אותיות לכאן כדי להחזיר
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
                    draggable={!!letter}
                    onDragStart={() => letter && handleDragStart(letter, { type: 'slot', index })}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(index)}
                    onClick={() => handleRemoveLetter(index)}
                    className={`w-16 h-16 md:w-20 md:h-20 border-4 border-dashed border-amber-600 rounded-xl flex items-center justify-center text-4xl md:text-5xl font-bold text-amber-900 transition-all
                      ${letter ? 'bg-orange-300 cursor-move hover:bg-orange-200' : 'bg-white bg-opacity-50'}
                      ${shakeSlots.includes(index) ? 'animate-shake bg-red-300' : ''}
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
            <div className="text-3xl font-bold text-amber-800">
              קיבלתם {stars} כוכבים!
            </div>
            <div className="flex gap-4 justify-center">
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
          
          <div className="flex justify-between items-center text-sm md:text-base text-gray-600">
            <div className="text-amber-700">💡 טיפ: גררו בין משבצות להחלפה, או חזרה למחסן</div>
            <div>טעויות: {mistakes}</div>
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
      `}</style>
    </div>
  );
};

// משחק 3: זיכרון האותיות
const MemoryLettersGame = ({ setScreen }) => {
  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [mistakes, setMistakes] = useState(0);
  const [stars, setStars] = useState(5);
  const [message, setMessage] = useState('');
  const [speaker, setSpeaker] = useState('dog');
  const [gameComplete, setGameComplete] = useState(false);
  const [canFlip, setCanFlip] = useState(true);

  const letters = ['א', 'ב', 'ג', 'ד', 'ה'];

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const pairs = letters.flatMap((letter, index) => [
      { id: index * 2, letter, pairId: index },
      { id: index * 2 + 1, letter, pairId: index }
    ]);
    
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setMessage('מצאו את הזוגות הזהים!');
    setSpeaker('dog');
  };

  const handleCardClick = (index) => {
    if (!canFlip) return;
    if (flippedIndices.includes(index)) return;
    if (matchedPairs.includes(cards[index].pairId)) return;
    if (flippedIndices.length >= 2) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setCanFlip(false);
      const [firstIndex, secondIndex] = newFlipped;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.letter === secondCard.letter) {
        setTimeout(() => {
          setMatchedPairs([...matchedPairs, firstCard.pairId]);
          setFlippedIndices([]);
          setCanFlip(true);
          setMessage('מצוין! מצאתם זוג!');
          setSpeaker('cat');

          if (matchedPairs.length + 1 === letters.length) {
            setTimeout(() => {
              setGameComplete(true);
              setMessage('וואו! מצאתם את כל הזוגות! אלופים!');
              setSpeaker('both');
            }, 500);
          }
        }, 800);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
          setCanFlip(true);
          const newMistakes = mistakes + 1;
          setMistakes(newMistakes);
          const newStars = Math.max(2, 5 - newMistakes);
          setStars(newStars);
          setMessage('אופס, לא זוג. המשיכו לנסות!');
          setSpeaker('dog');
        }, 1200);
      }
    }
  };

  const isCardFlipped = (index) => {
    return flippedIndices.includes(index) || matchedPairs.includes(cards[index].pairId);
  };

  const isCardMatched = (index) => {
    return matchedPairs.includes(cards[index].pairId);
  };

  const resetGame = () => {
    initializeGame();
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMistakes(0);
    setStars(5);
    setGameComplete(false);
    setCanFlip(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-300 flex flex-col items-center justify-between p-4 overflow-hidden relative" dir="rtl">
      <HomeButton setScreen={setScreen} />
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 left-10 w-40 h-40 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-2xl z-10">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-4xl font-bold text-amber-800">זיכרון האותיות</h1>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-2xl md:text-3xl">
                {i < stars ? '⭐' : '☆'}
              </span>
            ))}
          </div>
        </div>
        
        <div className="bg-white bg-opacity-80 rounded-lg p-3 text-center shadow-lg">
          <p className="text-lg md:text-xl text-gray-700">
            זוגות שנמצאו: {matchedPairs.length} מתוך {letters.length}
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center w-full max-w-3xl z-10">
        {!gameComplete ? (
          <div className="grid grid-cols-5 md:grid-cols-5 gap-3 md:gap-4 w-full px-4">
            {cards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => handleCardClick(index)}
                disabled={!canFlip && !isCardFlipped(index)}
                className={`
                  aspect-square rounded-xl shadow-lg transition-all duration-300 transform
                  text-4xl md:text-6xl font-bold
                  ${isCardFlipped(index)
                    ? isCardMatched(index)
                      ? 'bg-green-400 text-amber-900 scale-95'
                      : 'bg-orange-400 text-amber-900'
                    : 'bg-amber-600 hover:bg-amber-700 active:scale-95 cursor-pointer'
                  }
                  ${!canFlip && !isCardFlipped(index) ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                {isCardFlipped(index) ? card.letter : '?'}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center space-y-6">
            <div className="text-6xl animate-bounce">🎉</div>
            <div className="text-3xl font-bold text-amber-800">
              קיבלתם {stars} כוכבים!
            </div>
            <div className="text-xl text-gray-700">
              סיימתם ב-{mistakes + letters.length} מהלכים
            </div>
            <div className="flex gap-4 justify-center">
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
          
          <div className="flex justify-between items-center text-sm md:text-base text-gray-600">
            <div className="font-bold text-green-700">מהלכים: {mistakes + matchedPairs.length}</div>
            <div>טעויות: {mistakes}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HebrewGamesHub;