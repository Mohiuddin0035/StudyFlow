import React, { useState, useEffect, useRef } from 'react';

const ThemeTassel = ({ darkMode, setDarkMode }) => {
  const [pullDistance, setPullDistance] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const startYRef = useRef(0);

  const handleStart = (e) => {
    setIsPulling(true);
    startYRef.current = e.clientY || (e.touches && e.touches[0].clientY) || 0;
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (!isPulling) return;
      const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
      const deltaY = clientY - startYRef.current;
      
      // Clamp pull between 0 and 60px
      if (deltaY >= 0) {
        setPullDistance(Math.min(deltaY, 60));
      }
    };

    const handleEnd = () => {
      if (!isPulling) return;
      setIsPulling(false);
      if (pullDistance > 35) {
        setDarkMode(!darkMode);
      }
      setPullDistance(0);
    };

    if (isPulling) {
      window.addEventListener('mousemove', handleMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleMove);
      window.addEventListener('touchend', handleEnd);
      return () => {
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('mouseup', handleEnd);
        window.removeEventListener('touchmove', handleMove);
        window.removeEventListener('touchend', handleEnd);
      };
    }
  }, [isPulling, pullDistance, darkMode, setDarkMode]);

  // Dynamic values
  const stringLen = 75 + pullDistance;

  return (
    <div className="fixed top-0 right-1 sm:right-2 md:right-2 z-[300] flex flex-col items-center pointer-events-none select-none">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes tasselSway {
          0% { transform: rotate(-3.5deg); }
          100% { transform: rotate(3.5deg); }
        }
        .tassel-sway-anim {
          animation: tasselSway 3s ease-in-out infinite alternate;
          transform-origin: top center;
        }
      `}} />

      {/* Swaying wrapper when not pulling */}
      <div 
        className={`flex flex-col items-center pointer-events-auto cursor-grab active:cursor-grabbing ${isPulling ? '' : 'tassel-sway-anim'}`}
        onMouseDown={handleStart}
        onTouchStart={handleStart}
      >
        <svg 
          width="40" 
          height="190" 
          viewBox="0 0 40 190" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="metalGoldGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="30%" stopColor="#fef08a" />
              <stop offset="70%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
          </defs>

          {/* Top Anchor Mount */}
          <circle cx="20" cy="2" r="3" fill="#64748b" />
          
          {/* Braided Tassel Rope String */}
          <path 
            d={`M 20 2 Q 19 ${stringLen/2} 20 ${stringLen}`} 
            stroke="#d97706" 
            strokeWidth="1.8" 
            strokeLinecap="round" 
            strokeDasharray="4 2" 
            style={{
              transition: isPulling ? 'none' : 'd 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.3)'
            }}
          />
          
          {/* Tassel head knot */}
          <circle 
            cx="20" 
            cy={stringLen + 4} 
            r="3.5" 
            fill="#d97706" 
            stroke="#b45309"
            strokeWidth="0.5"
            style={{
              transition: isPulling ? 'none' : 'cy 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.3)'
            }}
          />

          {/* Gold clasp sleeve */}
          <rect 
            x="17" 
            y={stringLen + 7.5} 
            width="6" 
            height="5" 
            rx="0.5" 
            fill="url(#metalGoldGrad)"
            style={{
              transition: isPulling ? 'none' : 'y 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.3)'
            }}
          />

          {/* Tassel threads group */}
          <g 
            style={{
              transform: `translateY(${stringLen}px)`,
              transition: isPulling ? 'none' : 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.3)'
            }}
          >
            {/* Fine thread paths flaring out at bottom */}
            <path d="M 20 12.5 L 14 55" stroke="#fbbf24" strokeWidth="0.8" strokeLinecap="round" opacity="0.9" />
            <path d="M 20 12.5 L 16 56" stroke="#f59e0b" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M 20 12.5 L 18 57" stroke="#fbbf24" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M 20 12.5 L 20 58" stroke="#d97706" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M 20 12.5 L 22 57" stroke="#fbbf24" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M 20 12.5 L 24 56" stroke="#f59e0b" strokeWidth="0.8" strokeLinecap="round" />
            <path d="M 20 12.5 L 26 55" stroke="#fbbf24" strokeWidth="0.8" strokeLinecap="round" opacity="0.9" />
            
            {/* Internal fill threads */}
            <path d="M 20 12.5 L 15 52" stroke="#d97706" strokeWidth="0.6" opacity="0.75" />
            <path d="M 20 12.5 L 17 53" stroke="#fbbf24" strokeWidth="0.6" opacity="0.8" />
            <path d="M 20 12.5 L 19 54" stroke="#f59e0b" strokeWidth="0.6" opacity="0.75" />
            <path d="M 20 12.5 L 21 54" stroke="#fbbf24" strokeWidth="0.6" opacity="0.8" />
            <path d="M 20 12.5 L 23 52" stroke="#d97706" strokeWidth="0.6" opacity="0.75" />
            
            {/* Soft frayed thread ends blur backing for realism */}
            <path d="M 13 54 C 13 54 16 57 20 57 C 24 57 27 54 27 54" stroke="#f59e0b" strokeWidth="2.2" strokeLinecap="round" opacity="0.3" />
          </g>
        </svg>
      </div>
    </div>
  );
};

export default ThemeTassel;
