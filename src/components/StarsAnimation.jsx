import React, { useState, useEffect } from 'react';

const StarsAnimation = ({ stars }) => {
  const [visibleStars, setVisibleStars] = useState(0);

  useEffect(() => {
    let count = 0;
    const interval = setInterval(() => {
      if (count < stars) {
        count++;
        setVisibleStars(count);
      } else {
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [stars]);

  return (
    <div className="flex justify-center gap-2 my-4">
      {[...Array(5)].map((_, i) => (
        <span 
          key={i} 
          className={`text-5xl md:text-6xl transition-all duration-500 ${
            i < visibleStars ? 'animate-bounce scale-100 opacity-100' : 'scale-0 opacity-0'
          }`}
        >
          {i < stars ? '⭐' : ''}
        </span>
      ))}
    </div>
  );
};

export default StarsAnimation;