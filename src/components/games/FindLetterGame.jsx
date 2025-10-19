import React, { useState, useEffect } from 'react';
import HomeButton from '../HomeButton';
import StarsAnimation from '../StarsAnimation';

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [triggerWave, setTriggerWave] = useState(0);
  const [shuffledLetters, setShuffledLetters] = useState([]);
  
  const letters = ['א', 'ב', 'ג', 'ד', 'ה'];
  const totalQuestions = 5;

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
    setCurrentLetter(shuffled[0]);
    setMessage(`מצאו את האות ${shuffled[0]}!`);
    setSpeaker('dog');
  };

  const startNewQuestion = (currentCount) => {
    if (shuffledLetters.length > 0 && currentCount < totalQuestions) {
      const nextLetter = shuffledLetters[currentCount];
      setCurrentLetter(nextLetter);
      setMessage(`מצאו את האות ${nextLetter}!`);
      setSpeaker('dog');
      setIsProcessing(false);
    }
  };

  const handleLetterClick = (letter) => {
    if (gameComplete || isProcessing) return;
    
    if (letter === currentLetter) {
      setIsProcessing(true);
      setCelebrateButton(letter);
      setTimeout(() => setCelebrateButton(null), 600);
      
      setMessage('כל הכבוד! אתם מדהימים!');
      setSpeaker('cat');
      
      const newQuestionsAnswered = questionsAnswered + 1;
      setQuestionsAnswered(newQuestionsAnswered);
      setTriggerWave(prev => prev + 1);
      
      if (newQuestionsAnswered >= totalQuestions) {
        setTimeout(() => {
          setGameComplete(true);
          setMessage('סיימתם את המשחק!');
          setSpeaker('both');
          setIsProcessing(false);
        }, 1500);
      } else {
        setTimeout(() => {
          startNewQuestion(newQuestionsAnswered);
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
      
      setTimeout(() => {
        setMessage(`נסו שוב למצוא את האות ${currentLetter}!`);
        setSpeaker('dog');
      }, 2500);
    }
  };

  const resetGame = () => {
    const shuffled = [...letters].sort(() => Math.random() - 0.5);
    setShuffledLetters(shuffled);
    setCurrentLetter(shuffled[0]);
    setMessage(`מצאו את האות ${shuffled[0]}!`);
    setSpeaker('dog');
    setQuestionsAnswered(0);
    setMistakes(0);
    setStars(5);
    setGameComplete(false);
    setIsProcessing(false);
    setTriggerWave(0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-200 to-green-300 flex flex-col items-center justify-between p-4 overflow-hidden relative" dir="rtl">
      <HomeButton setScreen={setScreen} />
      
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-green-600 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-20 left-10 w-40 h-40 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="w-full max-w-2xl z-10 pt-16">
        <h1 className="text-2xl md:text-4xl font-bold text-amber-800 mb-4 text-center">מצא את האות</h1>
        
        <div className="bg-white bg-opacity-80 rounded-lg p-3 text-center shadow-lg">
          {!gameComplete ? (
            <div className="flex justify-center gap-1">
              {[...Array(totalQuestions)].map((_, i) => (
                <div
                  key={`${i}-${triggerWave}`}
                  className={`w-10 h-10 md:w-12 md:h-12 border-4 border-amber-600 rounded-lg transition-all duration-300 ${
                    i < questionsAnswered 
                      ? 'bg-green-300' 
                      : 'bg-white'
                  } ${triggerWave > 0 ? 'animate-wave' : ''}`}
                  style={{
                    animationDelay: `${i * 100}ms`
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center gap-1">
              {[...Array(totalQuestions)].map((_, i) => (
                <div
                  key={i}
                  className="w-10 h-10 md:w-12 md:h-12 border-4 border-amber-600 rounded-lg bg-green-300"
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center w-full max-w-3xl z-10">
        {!gameComplete ? (
          <div className="grid grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 w-full px-4">
            {letters.map((letter) => (
              <button
                key={letter}
                onClick={() => handleLetterClick(letter)}
                disabled={isProcessing}
                className={`
                  aspect-square bg-orange-400 hover:bg-orange-500 rounded-2xl 
                  shadow-lg hover:shadow-xl transition-all duration-200
                  text-5xl md:text-7xl font-bold text-amber-900
                  active:scale-95 transform
                  ${celebrateButton === letter ? 'animate-bounce bg-green-500 scale-110' : ''}
                  ${shakeButton === letter ? 'animate-shake bg-red-400' : ''}
                  ${isProcessing ? 'opacity-50' : ''}
                `}
              >
                {letter}
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
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-wave {
          animation: wave 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default FindLetterGame;