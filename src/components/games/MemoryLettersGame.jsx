import React, { useState, useEffect } from 'react';
import HomeButton from '../HomeButton';
import StarsAnimation from '../StarsAnimation';

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
              setMessage('סיימתם את המשחק!');
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

      <div className="w-full max-w-2xl z-10 pt-16">
        <h1 className="text-2xl md:text-4xl font-bold text-amber-800 mb-4 text-center">זיכרון האותיות</h1>
        
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
            <div className="font-bold text-green-700">מהלכים: {mistakes + matchedPairs.length}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemoryLettersGame;