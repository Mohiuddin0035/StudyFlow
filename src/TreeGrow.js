import React from 'react';

const TreeGrow = ({ completedMinutes = 0, dailyGoal = 240 }) => {
  const pct = Math.min(100, Math.max(0, (completedMinutes / dailyGoal) * 100));

  // Determine stage based on percentage
  let stage = 1;
  let label = "Planting a seed...";
  if (pct >= 90) {
    stage = 5;
    label = "Fully blossomed! 🌲✨";
  } else if (pct >= 65) {
    stage = 4;
    label = "Mature and strong! 🌳";
  } else if (pct >= 35) {
    stage = 3;
    label = "Sapling branching out! 🪴";
  } else if (pct >= 15) {
    stage = 2;
    label = "Sprout stretching up! 🌿";
  } else {
    stage = 1;
    label = "Sprouted underground 🌱";
  }

  // Draw appropriate SVG based on stage
  const renderSVG = () => {
    switch (stage) {
      case 1:
        return (
          <svg className="w-full h-full animate-bounce-slow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Ground / Soil */}
            <path d="M15 85 C 35 80, 65 80, 85 85" stroke="#8B5A2B" strokeWidth="6" strokeLinecap="round" />
            <path d="M35 83 C 45 78, 55 78, 65 83" fill="#5C3A21" />
            {/* Tiny Sprout */}
            <path d="M50 82 Q50 72 47 68" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
            <path d="M47 68 Q41 62 48 62 Q50 62 49 68 Z" fill="#34D399" />
            <path d="M48 70 Q55 65 57 69 Q57 73 49 71 Z" fill="#34D399" />
          </svg>
        );
      case 2:
        return (
          <svg className="w-full h-full animate-sway" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 85 C 35 80, 65 80, 85 85" stroke="#8B5A2B" strokeWidth="6" strokeLinecap="round" />
            {/* Stem */}
            <path d="M50 82 Q 49 60 45 45" stroke="#10B981" strokeWidth="5" strokeLinecap="round" />
            {/* Leaves */}
            <path d="M45 45 Q36 38 45 35 Q48 40 45 45 Z" fill="#34D399" />
            <path d="M47 55 Q56 50 58 55 Q53 60 47 55 Z" fill="#059669" />
            <path d="M48 65 Q38 60 38 66 Q44 70 48 65 Z" fill="#059669" />
          </svg>
        );
      case 3:
        return (
          <svg className="w-full h-full animate-sway" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 85 C 35 80, 65 80, 85 85" stroke="#8B5A2B" strokeWidth="6" strokeLinecap="round" />
            {/* Branching Trunk */}
            <path d="M50 82 Q 50 65 48 50 Q 42 42 35 40" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
            <path d="M48 55 Q 52 48 62 42" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M48 50 L 48 30" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
            {/* Leaf Nodes */}
            <circle cx="35" cy="40" r="10" fill="#10B981" fillOpacity="0.85" />
            <circle cx="62" cy="42" r="9" fill="#059669" fillOpacity="0.85" />
            <circle cx="48" cy="28" r="11" fill="#34D399" fillOpacity="0.85" />
          </svg>
        );
      case 4:
        return (
          <svg className="w-full h-full animate-sway" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 85 C 35 80, 65 80, 85 85" stroke="#8B5A2B" strokeWidth="6" strokeLinecap="round" />
            {/* Thick Trunk */}
            <path d="M50 82 Q 50 60 48 45" stroke="#78350F" strokeWidth="10" strokeLinecap="round" />
            <path d="M48 52 Q 38 48 30 40" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
            <path d="M48 50 Q 58 45 68 38" stroke="#78350F" strokeWidth="6" strokeLinecap="round" />
            {/* Dense Foliage */}
            <circle cx="48" cy="30" r="20" fill="#047857" />
            <circle cx="32" cy="38" r="15" fill="#059669" />
            <circle cx="65" cy="35" r="16" fill="#10B981" />
            <circle cx="50" cy="22" r="14" fill="#34D399" />
          </svg>
        );
      case 5:
        return (
          <svg className="w-full h-full animate-pulse-slow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 85 C 35 80, 65 80, 85 85" stroke="#8B5A2B" strokeWidth="6" strokeLinecap="round" />
            {/* Grand Trunk */}
            <path d="M50 82 Q 50 55 48 40" stroke="#451A03" strokeWidth="12" strokeLinecap="round" />
            <path d="M48 48 Q 36 40 25 35" stroke="#451A03" strokeWidth="7" strokeLinecap="round" />
            <path d="M48 46 Q 60 38 72 32" stroke="#451A03" strokeWidth="7" strokeLinecap="round" />
            {/* Super Dense Foliage with Sparks */}
            <circle cx="48" cy="26" r="22" fill="#065F46" />
            <circle cx="28" cy="32" r="18" fill="#047857" />
            <circle cx="68" cy="28" r="18" fill="#059669" />
            <circle cx="48" cy="15" r="16" fill="#10B981" />
            <circle cx="38" cy="20" r="14" fill="#34D399" />
            <circle cx="58" cy="18" r="14" fill="#6EE7B7" />
            {/* Golden Star Sparks */}
            <path d="M22 20 L24 23 L27 24 L24 25 L22 28 L20 25 L17 24 L20 23 Z" fill="#F59E0B" />
            <path d="M80 18 L81.5 20 L83.5 20.5 L81.5 21 L80 23 L78.5 21 L76.5 20.5 L78.5 20 Z" fill="#F59E0B" />
            <path d="M50 8 L51 10 L53 10.5 L51 11 L50 13 L49 11 L47 10.5 L49 10 Z" fill="#F59E0B" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-3.5 bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-white/5 rounded-2xl shadow-inner w-full max-w-[160px] mx-auto select-none">
      <div className="w-24 h-24 relative">
        {renderSVG()}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-emerald-500/10 blur-sm rounded-full" />
      </div>
      <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 mt-1.5 text-center uppercase tracking-wider truncate w-full">{label}</p>
      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1 rounded-full overflow-hidden mt-1.5 max-w-[100px]">
        <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[8px] font-bold text-slate-400 dark:text-slate-500 mt-1">{completedMinutes}m / {dailyGoal}m complete</p>
    </div>
  );
};

export default TreeGrow;
