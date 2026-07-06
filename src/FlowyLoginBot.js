import React, { useState, useEffect, useRef } from 'react';
import './FlowyLoginBot.css';

const FlowyLoginBot = ({ authState = 'typing' }) => {
  const [isSleeping, setIsSleeping] = useState(false);
  const [botState, setBotState] = useState('wave');
  const idleTimerRef = useRef(null);

  // Auto transition from 'wave' to 'typing'
  useEffect(() => {
    setBotState(authState);
    if (authState === 'wave') {
      const timer = setTimeout(() => {
        setBotState('typing');
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [authState]);

  // Reset idle timer on user activity
  const resetIdleTimer = () => {
    setIsSleeping(false);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    
    // Transition to sleep state after 15 seconds of inactivity
    idleTimerRef.current = setTimeout(() => {
      setIsSleeping(true);
    }, 15000);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    events.forEach(e => window.addEventListener(e, resetIdleTimer));
    resetIdleTimer();

    return () => {
      events.forEach(e => window.removeEventListener(e, resetIdleTimer));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  // Merge local sleep state with botState
  const currentMode = 
    (botState === 'typing' || botState === 'wave') && isSleeping 
      ? 'sleeping' 
      : botState;

  // Determine head translation/rotations dynamically
  const getHeadStyle = () => {
    if (currentMode === 'focus-password') {
      return {
        transform: 'rotateY(-45deg) rotateZ(-6deg) translateX(-10px) translateY(-2px)',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
      };
    }
    if (currentMode === 'focus-email') {
      return {
        transform: 'rotateY(20deg) rotateZ(3deg) translateX(10px) translateY(2px)',
        transition: 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)'
      };
    }
    if (currentMode === 'sleeping') {
      return {
        transform: 'translateY(4px) rotate(2deg)',
        transition: 'transform 0.8s ease-in-out'
      };
    }
    return {
      transform: 'none',
      transition: 'transform 0.4s ease-out'
    };
  };

  return (
    <div className="flowy-bot-container relative">
      {/* Speech bubble introducing Flowy */}
      {currentMode !== 'sleeping' && (
        <div className="flowy-speech-bubble absolute">
          Hii, I'm Flowy! 😊
        </div>
      )}

      {/* Sleep Zzz Bubbles */}
      {currentMode === 'sleeping' && (
        <div className="flowy-zzz-group">
          <span className="flowy-zzz-1">z</span>
          <span className="flowy-zzz-2">z</span>
          <span className="flowy-zzz-3">z</span>
        </div>
      )}

      <svg width="200" height="180" viewBox="0 0 200 180" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ overflow: 'visible' }}>
        <style>{`
          .perspective-group {
            perspective: 400px;
          }
        `}</style>

        <g className="perspective-group">
          {/* Ground Floor Shadow */}
          <ellipse cx="100" cy="162" rx="42" ry="5.5" className="flowy-shadow" fill="#0f172a" />

          {/* Flowy Main Body Wrapper */}
          <g className="flowy-body">
            
            {/* Graduation Cap 🎓 (Success state toss) */}
            <g className={`flowy-grad-cap ${currentMode === 'success' ? 'is-thrown' : ''}`}>
              {/* Cap Diamond */}
              <path d="M100 68 L124 76 L100 84 L76 76 Z" fill="#1e293b" stroke="#f97316" strokeWidth="2.5" />
              {/* Skull Cap Base */}
              <path d="M86 78.5 V85 C86 91 114 91 114 85 V78.5" fill="#334155" />
              {/* Gold Tassel */}
              <path d="M100 76 L120 83 L121 95" stroke="#fb923c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              <circle cx="121" cy="96" r="2.5" fill="#f97316" />
            </g>

            {/* Torso / Body base */}
            <rect x="78" y="112" width="44" height="34" rx="16" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
            <rect x="86" y="120" width="28" height="16" rx="8" fill="#3b82f6" fillOpacity="0.1" stroke="#dbeafe" strokeWidth="2" />
            {/* Glowing charging heart indicator */}
            <path d="M96 124.5 C96 124.5 97.5 123 99.5 123 C101.5 123 103 124.5 103 126.5 C103 128.5 100 131 99.5 131.5 C99 131 96 128.5 96 126.5 C96 124.5 96.5 123 96 124.5 Z" 
                  fill={currentMode === 'success' ? '#10b981' : currentMode === 'sleeping' ? '#94a3b8' : '#3b82f6'} 
                  className={currentMode === 'typing' ? 'flowy-spark' : ''} />

            {/* Neck connection */}
            <rect x="94" y="104" width="12" height="12" rx="4" fill="#cbd5e1" />

            {/* HEAD GROUP (with 3D rotations based on state) */}
            <g className={`flowy-head ${currentMode === 'confused' ? 'is-confused' : ''}`} style={getHeadStyle()}>
              
              {/* Left earmuff headphone */}
              <rect x="58" y="68" width="7" height="26" rx="3.5" fill="#cbd5e1" />
              <rect x="61" y="70" width="4" height="22" rx="2" fill="#3b82f6" />
              
              {/* Right earmuff headphone */}
              <rect x="135" y="68" width="7" height="26" rx="3.5" fill="#cbd5e1" />
              <rect x="135" y="70" width="4" height="22" rx="2" fill="#3b82f6" />

              {/* Head Shell */}
              <rect x="66" y="56" width="68" height="52" rx="22" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="3" />
              
              {/* Face screen display */}
              <rect x="73" y="64" width="54" height="36" rx="14" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1" />

              {/* Eyes configurations */}
              {currentMode === 'sleeping' && (
                <>
                  {/* Left sleeping eye */}
                  <path d="M 80 82 Q 87 90 94 82" stroke="#3b82f6" strokeWidth="3" fill="none" strokeLinecap="round" />
                  {/* Right sleeping eye */}
                  <path d="M 106 82 Q 113 90 120 82" stroke="#3b82f6" strokeWidth="3" fill="none" strokeLinecap="round" />
                </>
              )}

              {currentMode === 'success' && (
                <>
                  {/* Left happy eye */}
                  <path d="M 80 84 Q 87 74 94 84" stroke="#10b981" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  {/* Right happy eye */}
                  <path d="M 106 84 Q 113 74 120 84" stroke="#10b981" strokeWidth="3.5" fill="none" strokeLinecap="round" />
                  
                  {/* Smiling digital mouth */}
                  <path d="M 92 91 Q 100 98 108 91" stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                </>
              )}

              {currentMode === 'confused' && (
                <>
                  {/* Slanted confused eyes */}
                  <line x1="80" y1="76" x2="94" y2="86" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="106" y1="86" x2="120" y2="76" stroke="#ef4444" strokeWidth="3.5" strokeLinecap="round" />
                  
                  {/* Confused straight mouth */}
                  <line x1="96" y1="92" x2="104" y2="92" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" />
                </>
              )}

              {currentMode === 'focus-password' && (
                <>
                  {/* Eyes looking completely away to the right */}
                  <rect x="90" y="76" width="10" height="2" rx="0.5" fill="#3b82f6" />
                  <rect x="88" y="80" width="12" height="2" rx="0.5" fill="#3b82f6" />
                  <rect x="90" y="84" width="10" height="2" rx="0.5" fill="#3b82f6" />

                  <rect x="116" y="76" width="10" height="2" rx="0.5" fill="#3b82f6" />
                  <rect x="114" y="80" width="12" height="2" rx="0.5" fill="#3b82f6" />
                  <rect x="116" y="84" width="10" height="2" rx="0.5" fill="#3b82f6" />
                  
                  {/* Surprised mouth */}
                  <circle cx="100" cy="91" r="2.2" fill="#3b82f6" />
                </>
              )}

              {currentMode === 'focus-email' && (
                <>
                  {/* Left Scanline Grid Eye - looking down and right */}
                  <rect x="84" y="76" width="14" height="2.5" rx="0.8" fill="#0ea5e9" className="flowy-eye" />
                  <rect x="82" y="80.5" width="18" height="2.5" rx="0.8" fill="#0ea5e9" className="flowy-eye" />
                  <rect x="84" y="85" width="14" height="2.5" rx="0.8" fill="#0ea5e9" className="flowy-eye" />

                  {/* Right Scanline Grid Eye - looking down and right */}
                  <rect x="110" y="76" width="14" height="2.5" rx="0.8" fill="#0ea5e9" className="flowy-eye" />
                  <rect x="108" y="80.5" width="18" height="2.5" rx="0.8" fill="#0ea5e9" className="flowy-eye" />
                  <rect x="110" y="85" width="14" height="2.5" rx="0.8" fill="#0ea5e9" className="flowy-eye" />

                  {/* Smiling digital mouth */}
                  <path d="M 95 91 Q 101 96 107 91" stroke="#0ea5e9" strokeWidth="2" fill="none" strokeLinecap="round" />
                </>
              )}

              {(currentMode === 'typing' || currentMode === 'wave') && (
                <>
                  {/* Left Scanline Grid Eye */}
                  <rect x="80" y="74" width="14" height="2.5" rx="0.8" fill="#0ea5e9" className="flowy-eye" />
                  <rect x="78" y="78.5" width="18" height="2.5" rx="0.8" fill="#0ea5e9" className="flowy-eye" />
                  <rect x="80" y="83" width="14" height="2.5" rx="0.8" fill="#0ea5e9" className="flowy-eye" />

                  {/* Right Scanline Grid Eye */}
                  <rect x="106" y="74" width="14" height="2.5" rx="0.8" fill="#0ea5e9" className="flowy-eye" />
                  <rect x="104" y="78.5" width="18" height="2.5" rx="0.8" fill="#0ea5e9" className="flowy-eye" />
                  <rect x="106" y="83" width="14" height="2.5" rx="0.8" fill="#0ea5e9" className="flowy-eye" />
                  
                  {/* Smiling digital mouth */}
                  <path d="M 94 91 Q 100 96 106 91" stroke="#0ea5e9" strokeWidth="2" fill="none" strokeLinecap="round" />
                </>
              )}

              {/* Realistic Black-Rimmed Glasses */}
              <g className="flowy-glasses">
                {/* Left frame */}
                <rect x="71" y="66" width="26" height="21" rx="6" stroke="#000000" strokeWidth="2.5" fill="none" />
                {/* Right frame */}
                <rect x="103" y="66" width="26" height="21" rx="6" stroke="#000000" strokeWidth="2.5" fill="none" />
                {/* Bridge */}
                <line x1="97" y1="76" x2="103" y2="76" stroke="#000000" strokeWidth="3.2" strokeLinecap="round" />
                {/* Left temple side */}
                <line x1="71" y1="74" x2="63" y2="76" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
                {/* Right temple side */}
                <line x1="129" y1="74" x2="137" y2="76" stroke="#000000" strokeWidth="2" strokeLinecap="round" />
              </g>
            </g>

            {/* Left Hand: Typing */}
            <g className={`flowy-hand-left ${currentMode === 'typing' ? 'is-typing' : ''}`} style={{ transformOrigin: '72px 125px' }}>
              <path d="M74 125 C66 128 58 136 64 141 C70 146 76 138 78 132" stroke="#e2e8f0" strokeWidth="4.5" strokeLinecap="round" fill="none" />
              <circle cx="63" cy="140" r="3.5" fill="#cbd5e1" />
            </g>

            {/* Right Hand: Typing / Waving / Shy */}
            {(() => {
              if (currentMode === 'wave') {
                return (
                  <g className="flowy-hand-right is-waving" style={{ transformOrigin: '124px 125px' }}>
                    <path d="M125 125 C134 116 142 102 136 98 C130 94 124 110 122 118" stroke="#e2e8f0" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                    <circle cx="136" cy="98" r="3.5" fill="#cbd5e1" />
                  </g>
                );
              }
              if (currentMode === 'focus-password') {
                // Covering face shyness
                return (
                  <g className="flowy-hand-right" style={{ transform: 'translate(-38px, -42px) rotate(-85deg)', transformOrigin: '124px 125px', transition: 'transform 0.4s ease-in-out' }}>
                    <path d="M124 125 C132 128 140 136 134 141 C128 146 122 138 120 132" stroke="#e2e8f0" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                    <circle cx="135" cy="140" r="3.5" fill="#cbd5e1" />
                  </g>
                );
              }
              if (currentMode === 'confused') {
                // Scratching head
                return (
                  <g className="flowy-hand-right" style={{ transform: 'translate(-34px, -65px) rotate(-140deg)', transformOrigin: '124px 125px', transition: 'transform 0.4s ease-in-out' }}>
                    <path d="M124 125 C132 128 140 136 134 141 C128 146 122 138 120 132" stroke="#e2e8f0" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                    <circle cx="135" cy="140" r="3.5" fill="#cbd5e1" />
                  </g>
                );
              }
              // Default typing hand
              return (
                <g className={`flowy-hand-right ${currentMode === 'typing' ? 'is-typing' : ''}`} style={{ transformOrigin: '124px 125px' }}>
                  <path d="M124 125 C132 128 140 136 134 141 C128 146 122 138 120 132" stroke="#e2e8f0" strokeWidth="4.5" strokeLinecap="round" fill="none" />
                  <circle cx="135" cy="140" r="3.5" fill="#cbd5e1" />
                </g>
              );
            })()}

          </g>

          {/* Laptop Base & Display */}
          <g style={{ transform: 'translate(0px, 10px)' }}>
            {/* Screen Lid */}
            <rect x="74" y="126" width="52" height="24" rx="3" fill="#475569" stroke="#334155" strokeWidth="1.5" />
            <rect x="78" y="129" width="44" height="18" rx="1.5" fill="#0f172a" />
            
            {/* Laptop Keyboard Base */}
            <path d="M68 150 L132 150 L124 156 L76 156 Z" fill="#64748b" stroke="#475569" strokeWidth="1.5" />
            
            {/* Tiny typing sparks / speed lines */}
            {currentMode === 'typing' && (
              <>
                <line x1="68" y1="126" x2="62" y2="120" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" className="flowy-spark" />
                <line x1="132" y1="126" x2="138" y2="120" stroke="#fb923c" strokeWidth="1.5" strokeLinecap="round" className="flowy-spark-2" />
              </>
            )}
          </g>
        </g>
      </svg>
    </div>
  );
};

export default FlowyLoginBot;
