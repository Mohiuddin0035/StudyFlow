import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  CheckCircle2, Circle, Plus, Trash2, Calendar, Link as LinkIcon, 
  BookOpen, School, Wrench, Users, Coffee, LayoutDashboard,
  ExternalLink, Clock, MapPin, Sparkles, Loader2, X,
  UserCircle, MoonStar, Zap, Bell, LogOut, Mail, Lock, Sun, Moon,
  Bot, MessageSquare, Search, BrainCircuit, Cpu,
  ShieldCheck, Vault, Eye, EyeOff, Menu, UserPlus, Quote, ShieldAlert,
  ArrowRight, ArrowLeft,
  ChevronDown, ChevronUp, Maximize2, Star,
  Monitor, CheckSquare, FileText, Send, Inbox, Megaphone, AlertCircle,
  Award, TrendingUp, Play, Pause, RotateCcw, Flame, Copy, CreditCard, Edit2,
  ClipboardList, Layers, MousePointerClick, Github, Linkedin, Facebook, Youtube, HardDrive,
  Upload, Download, Terminal, Database, Check
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import emailjs from '@emailjs/browser';
import { 
  getFirestore, collection, doc, setDoc, addDoc, deleteDoc, 
  onSnapshot, updateDoc, writeBatch
} from 'firebase/firestore';
import { 
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile,
  signOut, setPersistence, browserLocalPersistence,
  GoogleAuthProvider, signInWithPopup
} from 'firebase/auth';
import SplitText from './SplitText';
import RotatingText from './RotatingText';
import { GoogleCalendarWeekly, fromRoutine, downloadICS } from './calendar/index.mjs';
import './calendar/styles.css';
import TreeGrow from './TreeGrow';
import TargetCursor from './TargetCursor';
import StudyFlowAIChatbot from './StudyFlowAIChatbot';
import BorderGlow from './BorderGlow';
import FlowyLoginBot from './FlowyLoginBot';
import ThemeTassel from './ThemeTassel';
import Lanyard from './Lanyard';
import QRCode from 'qrcode';
import SoftAurora from './SoftAurora';

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const appId = (typeof window !== 'undefined' && window.__app_id) ? window.__app_id : 'uiu-studyflow-v26.7'; 

setPersistence(auth, browserLocalPersistence);

// --- CONSTANTS ---
const ADMIN_EMAIL = "msaikat2420035@bscse.uiu.ac.bd";

const CATEGORIES = {
  OFFICIAL: { id: 'official', label: 'Official UIU', icon: School, color: 'text-orange-500', bg: 'bg-orange-50/50 dark:bg-orange-500/10' },
  MATERIALS: { id: 'materials', label: 'Materials', icon: BookOpen, color: 'text-blue-500', bg: 'bg-blue-50/50 dark:bg-blue-500/10' },
  TOOLS: { id: 'tools', label: 'Tools', icon: Wrench, color: 'text-purple-500', bg: 'bg-purple-50/50 dark:bg-purple-500/10' },
  COMMUNITY: { id: 'community', label: 'Community', icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50/50 dark:bg-emerald-500/10' },
  FUN: { id: 'fun', label: 'Fun Break', icon: Coffee, color: 'text-pink-500', bg: 'bg-pink-50/50 dark:bg-pink-500/10' },
  PROFILES: { id: 'profiles', label: 'Profiles', icon: UserCircle, color: 'text-indigo-500', bg: 'bg-indigo-50/50 dark:bg-indigo-500/10' },
};

const CATEGORY_ORDER = ['official', 'materials', 'tools', 'community', 'fun', 'profiles'];

const AI_TOOLS = [
  { name: 'ChatGPT', url: 'https://chatgpt.com', icon: MessageSquare, color: 'text-emerald-500' },
  { name: 'Claude', url: 'https://claude.ai', icon: BrainCircuit, color: 'text-orange-400' },
  { name: 'Gemini', url: 'https://gemini.google.com', icon: Sparkles, color: 'text-blue-500' },
  { name: 'Perplexity', url: 'https://perplexity.ai', icon: Search, color: 'text-cyan-500' },
  { name: 'Grok', url: 'https://x.ai', icon: Cpu, color: 'text-slate-500 dark:text-slate-100' },
  { name: 'Copilot', url: 'https://copilot.microsoft.com', icon: Bot, color: 'text-indigo-500' },
  { name: 'NotebookLM', url: 'https://notebooklm.google.com', icon: BookOpen, color: 'text-blue-400' },
];

const DAYS = ['Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const QUOTE_BANK = [
"Indeed, with hardship comes ease. — Quran 94:6",
"Do not lose hope, nor be sad. — Quran 3:139",
"Verily, in the remembrance of Allah do hearts find rest. — Quran 13:28",
"The best among you are those who have the best character. — Prophet Muhammad (SAW)",
"Actions are judged by intentions. — Prophet Muhammad (SAW)",
"And whoever puts their trust in Allah, He will be sufficient for them. — Quran 65:3",
"Discipline is choosing what you want most over what you want now.",
"The journey of a thousand miles begins with a single step. — Lao Tzu",
"Success is the sum of small efforts repeated day in and day out. — Robert Collier",
"A person who never made a mistake never tried anything new. — Albert Einstein",
"Do something today your future self will thank you for.",
"The future belongs to those who prepare for it today. — Malcolm X",
"If you can't explain it simply, you don't understand it well enough. — Einstein",
"Programs must be written for people to read. — Harold Abelson",
"First, solve the problem. Then, write the code. — John Johnson",
"Any fool can write code that a computer can understand. Good programmers write code humans can understand. — Martin Fowler",
"Debugging is twice as hard as writing the code in the first place. — Brian Kernighan",
"Simplicity is the soul of efficiency. — Austin Freeman",
"The only way to do great work is to love what you do. — Steve Jobs",
"Why do we fall? So that we can learn to pick ourselves up. — Batman Begins",
"It’s not who I am underneath, but what I do that defines me. — Batman Begins",
"Hope is a good thing, maybe the best of things. — Shawshank Redemption",
"Great men are not born great, they grow great. — The Godfather",
"I don't pay for suits. My suits are on the house or the house burns down. — Tommy Shelby",
"When You Plan Something Well, There’s No Need To Rush. — Tommy Shelby",
"The best way to predict the future is to invent it. — Alan Kay",
"Your time is limited, so don't waste it living someone else's life. — Steve Jobs",
"Logic will get you from A to B. Imagination will take you everywhere. — Albert Einstein",
"Quality is not an act, it is a habit. — Aristotle",
"The only thing we have to fear is fear itself. — Franklin D. Roosevelt"
];

const DAY_STYLES = {
  Saturday: { bg: 'bg-orange-50/40 dark:bg-orange-950/20 backdrop-blur-md', border: 'border-orange-100/50 dark:border-orange-800/30', accent: 'text-orange-600', grad: 'from-orange-500/10 to-transparent' },
  Sunday: { bg: 'bg-blue-50/40 dark:bg-blue-950/20 backdrop-blur-md', border: 'border-blue-100/50 dark:border-blue-800/30', accent: 'text-blue-600', grad: 'from-blue-500/10 to-transparent' },
  Monday: { bg: 'bg-emerald-50/40 dark:bg-emerald-950/20 backdrop-blur-md', border: 'border-emerald-100/50 dark:border-emerald-800/30', accent: 'text-emerald-600', grad: 'from-emerald-500/10 to-transparent' },
  Tuesday: { bg: 'bg-purple-50/40 dark:bg-purple-950/20 backdrop-blur-md', border: 'border-purple-100/50 dark:border-purple-800/30', accent: 'text-purple-600', grad: 'from-purple-500/10 to-transparent' },
  Wednesday: { bg: 'bg-pink-50/40 dark:bg-pink-950/20 backdrop-blur-md', border: 'border-pink-100/50 dark:border-pink-800/30', accent: 'text-pink-600', grad: 'from-pink-500/10 to-transparent' },
  Thursday: { bg: 'bg-amber-50/40 dark:bg-amber-950/20 backdrop-blur-md', border: 'border-amber-100/50 dark:border-amber-800/30', accent: 'text-amber-600', grad: 'from-amber-500/10 to-transparent' },
  Friday: { bg: 'bg-slate-50/40 dark:bg-slate-900/30 backdrop-blur-md', border: 'border-slate-100/50 dark:border-slate-800/30', accent: 'text-slate-600', grad: 'from-slate-500/10 to-transparent' },
};

// --- CUSTOM HOOKS & COMPONENTS ---

const GlassSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      <button 
        type="button" 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl text-sm font-semibold border border-white/60 dark:border-white/10 shadow-sm outline-none dark:text-white flex justify-between items-center transition-colors hover:bg-white/60 dark:hover:bg-slate-800/70"
      >
        <span>{options.find(o => o.value === value)?.label || placeholder}</span>
        <ChevronDown size={16} className={`text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-white/80 dark:bg-slate-800/90 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
            {options.map(opt => (
              <button 
                type="button" 
                key={opt.value} 
                onClick={() => { onChange(opt.value); setIsOpen(false); }} 
                className={`w-full text-left px-4 py-3 text-sm font-bold transition-all hover:bg-black/5 dark:hover:bg-white/10 ${value === opt.value ? 'text-orange-500 bg-orange-50/50 dark:bg-orange-500/10' : 'text-slate-700 dark:text-slate-200'}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CreditSection = () => (
  <div className="p-3.5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/80 backdrop-blur-sm transition-all hover:border-orange-500/20">
    <div className="flex items-center justify-between gap-2 mb-2.5 pb-2 border-b border-slate-200/40 dark:border-slate-800/60">
      <div className="flex items-center gap-1.5">
        <Terminal size={13} className="text-orange-500 shrink-0 animate-pulse" />
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 tracking-tight">StudyFlow UIU</span>
      </div>
      <span className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">v26.7</span>
    </div>
    
    <div className="space-y-1 mb-2.5">
      <p className="font-mono text-[10px] font-semibold text-slate-500 dark:text-slate-400">Built, Designed & Developed by</p>
      <div className="flex items-center justify-between gap-1">
        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-orange-500 transition-colors">Moheuddin Sikder Saikat</span>
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded-md shrink-0">CSE 242</span>
      </div>
    </div>

    <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/60">
      <a href="mailto:msaikat2420035@bscse.uiu.ac.bd" className="flex items-center gap-1.5 text-[11px] font-semibold text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 transition-colors outline-none">
        <Mail size={12} className="shrink-0" /> Contact for feedback
      </a>
    </div>
  </div>
);

const LiveClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <span>
      {time.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}
    </span>
  );
};

const RamadanLanternIcon = ({ size = 18, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M12 2v2" />
    <path d="M8 7h8l-1-3h-6z" fill="currentColor" fillOpacity="0.2" />
    <path d="M7 7l-2 5 3 7h8l3-7-2-5" />
    <path d="M12 10v5" strokeWidth="1.5" />
    <path d="M10 12.5h4" strokeWidth="1.5" />
    <path d="M9 19h6v2H9z" fill="currentColor" fillOpacity="0.2" />
  </svg>
);



const generateCardFront = (profileImg, qrImg) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background linear gradient matching modern dark card theme
  const grad = ctx.createLinearGradient(0, 0, 0, 768);
  grad.addColorStop(0, '#0a0d17');
  grad.addColorStop(1, '#111422');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 768);

  // Tech grid lines
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 512; i += 32) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 768); ctx.stroke();
  }
  for (let j = 0; j < 768; j += 32) {
    ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(512, j); ctx.stroke();
  }

  // Header Brand - written in orange as requested
  ctx.fillStyle = '#f97316'; 
  ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '4px';
  ctx.fillText('STUDYFLOW', 256, 110);
  ctx.letterSpacing = 'normal'; // reset

  // Orange card tag on top-right (matching screenshot color contrast)
  ctx.fillStyle = '#f97316';
  ctx.fillRect(418, 160, 40, 50);

  // Profile box coordinates for boxier shape (Enlarged to 240x240 to match mockup)
  const size = 240;
  const bx = 256 - size / 2;
  const by = 190;
  const radius = 32;

  // Helper function to trace rounded rect path
  const traceRoundedRect = (c, x, y, w, h, r) => {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
  };

  // Draw glowing cyan outline around the boxy profile photo
  ctx.strokeStyle = '#00f2fe';
  ctx.lineWidth = 4;
  ctx.shadowColor = '#00f2fe';
  ctx.shadowBlur = 15;
  traceRoundedRect(ctx, bx - 4, by - 4, size + 8, size + 8, radius + 2);
  ctx.stroke();
  ctx.shadowBlur = 0; // reset shadow

  // Draw boxy cropped profile image
  if (profileImg) {
    ctx.save();
    traceRoundedRect(ctx, bx, by, size, size, radius);
    ctx.clip();
    ctx.drawImage(profileImg, bx, by, size, size);
    ctx.restore();
  }

  // Name written in two lines as requested
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Moheuddin Sikder', 256, 470);
  ctx.fillText('Saikat', 256, 505);

  // QR Code Slot (Width: 130px, Height: 130px, Centered at the bottom center)
  const qx = 256 - 65;
  const qy = 540;
  const qw = 130;

  // Outer glowing card border container for QR
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
  ctx.lineWidth = 2;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
  traceRoundedRect(ctx, qx - 8, qy - 8, qw + 16, qw + 16, 16);
  ctx.fill();
  ctx.stroke();

  // Draw QR code image containing user's github link on a high-contrast white card slot
  if (qrImg) {
    ctx.save();
    // High contrast light quiet zone for QR scanners
    ctx.fillStyle = '#ffffff';
    traceRoundedRect(ctx, qx - 6, qy - 6, qw + 12, qw + 12, 12);
    ctx.fill();
    
    // Pixel-perfect crisp rendering
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(qrImg, qx, qy, qw, qw);
    ctx.restore();
  } else {
    // Fallback QR outline text if loading fails
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.font = '10px monospace';
    ctx.fillText('QR CODE', 256, qy + 65);
  }
  ctx.restore();

  // Scan info text
  ctx.fillStyle = '#00f2fe';
  ctx.font = 'bold 11px "Plus Jakarta Sans", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('[ SCAN FOR GITHUB ]', 256, 698);
  ctx.letterSpacing = 'normal';

  // Footer status bar
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.font = 'bold 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('<CSE 242 UIU/>', 256, 730);

  return canvas.toDataURL();
};

const generateCardBack = (faviconImg) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Background linear gradient matching modern dark dashboard style
  const grad = ctx.createLinearGradient(0, 0, 0, 768);
  grad.addColorStop(0, '#090d16'); // slate-950/900 depth
  grad.addColorStop(1, '#181b29');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 768);

  // Tech grid pattern lines
  ctx.strokeStyle = 'rgba(249, 115, 22, 0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i < 512; i += 32) {
    ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 768); ctx.stroke();
  }
  for (let j = 0; j < 768; j += 32) {
    ctx.beginPath(); ctx.moveTo(0, j); ctx.lineTo(512, j); ctx.stroke();
  }

  // Draw top banner background
  ctx.fillStyle = 'rgba(249, 115, 22, 0.08)';
  ctx.fillRect(0, 0, 512, 220);

  // Logo rendering: Draw site favicon logo if loaded, fallback to letter S
  if (faviconImg) {
    const favSize = 76;
    ctx.drawImage(faviconImg, 256 - favSize/2, 100 - favSize/2, favSize, favSize);
  } else {
    // Logo circle
    ctx.fillStyle = '#f97316'; // orange-500
    ctx.beginPath();
    ctx.arc(256, 100, 38, 0, Math.PI * 2);
    ctx.fill();

    // Logo letter "S"
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 32px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('S', 256, 98);
  }

  // Brand Name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('STUDYFLOW', 256, 165);

  ctx.fillStyle = '#f97316';
  ctx.font = '800 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('DEVELOPER SYSTEM CARD', 256, 192);

  // Decorative border
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(60, 220); ctx.lineTo(452, 220); ctx.stroke();

  // Saikat's Info
  ctx.fillStyle = '#ffffff';
  ctx.font = '900 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('M. S. SAIKAT', 256, 290);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Full Stack Web Developer', 256, 322);

  ctx.fillStyle = '#f97316';
  ctx.font = '800 16px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CSE 242 (UIU)', 256, 355);

  // Decorative Barcode box
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(156, 420, 200, 200);

  // Generate QR pattern
  ctx.fillStyle = '#090d16';
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if ((i + j) % 2 === 0 || (i * j) % 3 === 0) {
        ctx.fillRect(156 + i * 25, 420 + j * 25, 25, 25);
      }
    }
  }
  
  // Custom QR Anchor 1
  ctx.fillStyle = '#090d16';
  ctx.fillRect(156, 420, 75, 75);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(181, 445, 25, 25);

  // Custom QR Anchor 2
  ctx.fillStyle = '#090d16';
  ctx.fillRect(281, 420, 75, 75);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(306, 445, 25, 25);

  // Custom QR Anchor 3
  ctx.fillStyle = '#090d16';
  ctx.fillRect(156, 545, 75, 75);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(181, 570, 25, 25);

  // Footer branding
  ctx.fillStyle = '#475569';
  ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('OFFICIAL CREATOR CARD • STUDYFLOW HUB', 256, 680);

  return canvas.toDataURL();
};

export default function App() {
  // --- CORE STATE ---
  const [user, setUser] = useState(null);
  const [sessionActiveUser, setSessionActiveUser] = useState(null);
  const [loginBotState, setLoginBotState] = useState('wave');
  const [showCover, setShowCover] = useState(true); // NEW: Controls the Cover Page visibility
  const [authMode, setAuthMode] = useState('login'); 
  const [authData, setAuthData] = useState({ email: '', password: '', username: '' });
  const [authLoading, setAuthLoading] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [cgpaTab, setCgpaTab] = useState('cgpa'); // 'cgpa' | 'payment'
  const [cgpaPrevCgpa, setCgpaPrevCgpa] = useState('');
  const [cgpaPrevCredit, setCgpaPrevCredit] = useState('');
  const [cgpaCourses, setCgpaCourses] = useState([
    { id: 1, name: '', credit: '', gpa: '' },
    { id: 2, name: '', credit: '', gpa: '' },
    { id: 3, name: '', credit: '', gpa: '' }
  ]);
  const [cgpaResultSummary, setCgpaResultSummary] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentWaiver, setPaymentWaiver] = useState(1.0); // 1.0 | 0.75 | 0.50 | 0.0
  const [darkMode, setDarkMode] = useState(false); // Default Day Mode
  const [ramadanMode, setRamadanMode] = useState(false);
  const [todayDateString, setTodayDateString] = useState('');
  
  // --- TOAST STATE ---
  const [toasts, setToasts] = useState([]);
  
  // --- SPOTLIGHT SEARCH STATE ---
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- POMODORO STATE ---
  const [pomoMode, setPomoMode] = useState('work'); // 'work' | 'break'
  const [pomoTimeLeft, setPomoTimeLeft] = useState(30 * 60);
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoTotalDuration, setPomoTotalDuration] = useState(30 * 60);
  
  const [focusDuration, setFocusDuration] = useState(30); // in minutes
  const [dailyFocusGoal, setDailyFocusGoal] = useState(240); // in minutes
  const [skipBreaks, setSkipBreaks] = useState(false);
  const [completedFocusMinutes, setCompletedFocusMinutes] = useState(0);
  const [focusStreak, setFocusStreak] = useState(0);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  
  // --- CHATBOT STATE ---
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');
  
  // --- SECURE VAULT ACCESS STATE ---
  const [vaultInputPin, setVaultInputPin] = useState('');
  const [vaultConfig, setVaultConfig] = useState(null); // { passcode: '1234' }
  const [vaultLockState, setVaultLockState] = useState('locked'); // 'locked' | 'setting_up' | 'unlocked'
  const [vaultPinError, setVaultPinError] = useState('');
  const [setupPin, setSetupPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  // --- CGPA CALCULATOR STATE ---
  
  // --- DATA STATE ---
  const [activeProfileId, setActiveProfileId] = useState('profile_1');
  const [profiles, setProfiles] = useState([{ id: 'profile_1', name: 'Profile 1' }]);
  const [isAddingProfileInput, setIsAddingProfileInput] = useState(false);
  const [newProfileName, setNewProfileName] = useState('');
  const [editingProfileId, setEditingProfileId] = useState(null);
  const [editingProfileName, setEditingProfileName] = useState('');

  const [studyPlans, setStudyPlans] = useState([]);
  const [routine, setRoutine] = useState([]);
  const [links, setLinks] = useState([]);
  const [vaultLinks, setVaultLinks] = useState([]);
  
  // NEW C & A State
  const [cts, setCts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  
  // NEW Inbox State
  const [announcements, setAnnouncements] = useState([]);
  const [readAnnouncements, setReadAnnouncements] = useState([]);

  // --- QUOTE LOGIC STATE ---
  const [quoteRevealed, setQuoteRevealed] = useState(false);
  const [dailyQuote, setDailyQuote] = useState("");
  const [userQuoteData, setUserQuoteData] = useState({ index: -1, date: "" });

  // --- INPUT STATE ---
  const [newPlan, setNewPlan] = useState({ topic: '', date: '', timeSlot: '', priority: 'medium' });
  const [newRoutine, setNewRoutine] = useState({ day: 'Saturday', course: '', code: '', faculty: '', time: '', room: '', ramadanTime: '' });
  const [newLink, setNewLink] = useState({ title: '', url: '', category: 'official', materialTypes: [] });
  const [newVaultLink, setNewVaultLink] = useState({ title: '', url: '', hint: '' });
  
  const [newCt, setNewCt] = useState({ course: '', topic: '', deadline: '' });
  const [newAssignment, setNewAssignment] = useState({ course: '', topic: '', deadline: '' });
  
  const [newNotice, setNewNotice] = useState({ title: '', message: '' });
  
  // --- INTERACTION STATE ---
  const [isAddingRoutine, setIsAddingRoutine] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState(null);
  const [editingStudyPlan, setEditingStudyPlan] = useState(null);
  const [editingCt, setEditingCt] = useState(null);
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [editingLink, setEditingLink] = useState(null);
  const [editingVaultLink, setEditingVaultLink] = useState(null);
  
  // Materials segment states
  const [isMaterialsModalOpen, setIsMaterialsModalOpen] = useState(false);
  const [materialTypes, setMaterialTypes] = useState([
    'Question Bank',
    'Youtube Playlist',
    'Drive',
    'HandNote',
    'Slides',
    'Paid Course',
    'Project-Show'
  ]);
  const [customMaterialTypeInput, setCustomMaterialTypeInput] = useState('');
  const [isAddingCustomMaterialType, setIsAddingCustomMaterialType] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [activeMaterialTypeTab, setActiveMaterialTypeTab] = useState('all');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtpInput, setUserOtpInput] = useState('');
  const [isOtpServiceFailed, setIsOtpServiceFailed] = useState(false);
  const [importConfirmData, setImportConfirmData] = useState(null);
  const [isCalendarViewOpen, setIsCalendarViewOpen] = useState(false);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isAddingVaultLink, setIsAddingVaultLink] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [showVaultLinks, setShowVaultLinks] = useState({});
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [showLanyard, setShowLanyard] = useState(false);
  const [profileImageObj, setProfileImageObj] = useState(null);
  const [qrImageObj, setQrImageObj] = useState(null);
  const [faviconImageObj, setFaviconImageObj] = useState(null);
  const [frontCardUrl, setFrontCardUrl] = useState('');
  const [backCardUrl, setBackCardUrl] = useState('');

  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [dismissedMobileWarning, setDismissedMobileWarning] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIosSafari, setIsIosSafari] = useState(false);
  const [dismissedInstallBanner, setDismissedInstallBanner] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // --- IMPORT & EXPORT STATES ---
  const fileInputRef = useRef(null);
  const [isExportConfirmOpen, setIsExportConfirmOpen] = useState(false);
  const [isExportOtpOpen, setIsExportOtpOpen] = useState(false);
  const [exportOtpInput, setExportOtpInput] = useState('');
  const [exportOtpGenerated, setExportOtpGenerated] = useState('');
  const [isExportOtpFailed, setIsExportOtpFailed] = useState(false);
  const [isExportSuccessOpen, setIsExportSuccessOpen] = useState(false);

  const [isImportConflictOpen, setIsImportConflictOpen] = useState(false);
  const [importedPendingData, setImportedPendingData] = useState(null);
  const [isImportOtpOpen, setIsImportOtpOpen] = useState(false);
  const [importOtpInput, setImportOtpInput] = useState('');
  const [importOtpGenerated, setImportOtpGenerated] = useState('');
  const [isImportOtpFailed, setIsImportOtpFailed] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobileDevice(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Detect iOS Safari specifically
    const ua = window.navigator.userAgent;
    const isIPad = !!ua.match(/iPad/i);
    const isIPhone = !!ua.match(/iPhone/i);
    const isSafari = !!ua.match(/WebKit/i) && !ua.match(/CriOS/i) && !ua.match(/FxiOS/i);
    setIsIosSafari((isIPad || isIPhone) && isSafari);

    // Capture PWA Install trigger event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    setIsTransitioning(true);
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [sessionActiveUser]);

  useEffect(() => {
    // 1. Programmatically generate a pixel-perfect QR code for the GitHub profile link
    QRCode.toDataURL("https://github.com/Mohiuddin0035", {
      margin: 1,
      width: 256,
      color: {
        dark: '#000000',
        light: '#ffffff'
      }
    }).then(url => {
      const qrImg = new Image();
      qrImg.src = url;
      qrImg.onload = () => {
        setQrImageObj(qrImg);
      };
    }).catch(err => {
      console.error("Programmatic QR generation failed:", err);
    });

    // 2. Preload the profile picture
    const img = new Image();
    img.src = '/profile.png';
    img.onload = () => {
      setProfileImageObj(img);
    };

    // 3. Preload the favicon picture
    const favImg = new Image();
    favImg.src = '/favicon.ico';
    favImg.onload = () => {
      setFaviconImageObj(favImg);
    };
  }, []);

  useEffect(() => {
    if (profileImageObj && qrImageObj) {
      setFrontCardUrl(generateCardFront(profileImageObj, qrImageObj));
    }
  }, [profileImageObj, qrImageObj]);

  useEffect(() => {
    setBackCardUrl(generateCardBack(faviconImageObj));
  }, [faviconImageObj]);

  const renderLanyardModal = () => {
    if (!showLanyard) return null;
    return (
      <div className="fixed inset-0 z-[999] bg-[#070608]/40 dark:bg-[#070608]/60 backdrop-blur-md animate-in fade-in duration-300 pointer-events-auto">
        {/* Minimalist Close button in circular container */}
        <button 
          type="button"
          onClick={() => setShowLanyard(false)}
          className="absolute top-6 right-6 p-3 rounded-full border border-slate-200/20 dark:border-white/10 bg-black/10 hover:bg-black/25 text-slate-800 dark:text-white transition-all hover:scale-110 active:scale-95 cursor-pointer z-[100] outline-none"
        >
          <X size={20} />
        </button>

        {/* Fullscreen Interactive Lanyard Physics Canvas */}
        <div className="absolute inset-0 w-full h-full z-10 select-none cursor-grab active:cursor-grabbing cursor-target">
          <Lanyard 
            frontImage={frontCardUrl} 
            backImage={backCardUrl} 
            lanyardWidth={0.8}
            position={[0, 0, 15]}
          />
        </div>

        {/* Floating social sidebar panel - left bottom dock (Theme Adaptive) */}
        <div className="fixed bottom-8 left-8 z-[100] flex flex-col gap-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/50 dark:border-white/10 p-3 rounded-2xl shadow-2xl animate-in slide-in-from-left-6 duration-500">
          <a href="https://github.com/Mohiuddin0035" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-all hover:scale-110 active:scale-95 text-slate-800 dark:text-white flex items-center justify-center outline-none">
            <Github size={18} />
          </a>
          <a href="https://www.linkedin.com/in/moheuddin-saikat" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-all hover:scale-110 active:scale-95 text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-white flex items-center justify-center outline-none">
            <Linkedin size={18} />
          </a>
          <a href="https://www.facebook.com/mohiuddin.s.saikat2.o" target="_blank" rel="noopener noreferrer" className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-all hover:scale-110 active:scale-95 text-blue-500 hover:text-white dark:hover:text-white flex items-center justify-center outline-none">
            <Facebook size={18} />
          </a>
          <a href="mailto:msaikat2420035@bscse.uiu.ac.bd" className="p-3 bg-slate-100 dark:bg-white/5 rounded-xl hover:bg-orange-500 hover:text-white dark:hover:bg-orange-500 transition-all hover:scale-110 active:scale-95 text-orange-500 hover:text-white dark:hover:text-white flex items-center justify-center outline-none">
            <Mail size={18} />
          </a>
        </div>
      </div>
    );
  };

  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const clickTimeoutRef = useRef(null);

  const calendarEvents = useMemo(() => {
    const formatTime24h = (timeStr) => {
      if (!timeStr) return "08:30";
      const match = timeStr.trim().match(/^(\d+):(\d+)\s*(AM|PM)$/i);
      if (!match) return "08:30";

      let hours = parseInt(match[1]);
      const minutes = parseInt(match[2]);
      const ampm = match[3].toUpperCase();

      if (ampm === 'PM' && hours !== 12) {
        hours += 12;
      } else if (ampm === 'AM' && hours === 12) {
        hours = 0;
      }

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const addMinutesTo24h = (time24h, minutesToAdd) => {
      const [hStr, mStr] = time24h.split(':');
      let h = parseInt(hStr);
      let m = parseInt(mStr);

      m += minutesToAdd;
      h += Math.floor(m / 60);
      m = m % 60;
      h = h % 24;

      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
    };

    const mapped = routine.map(r => {
      const activeTime = ramadanMode && r.ramadanTime ? r.ramadanTime : r.time;
      const start24h = formatTime24h(activeTime);
      const end24h = addMinutesTo24h(start24h, 80);

      return {
        id: r.id,
        title: r.course,
        schedule: {
          [r.day]: { start: start24h, end: end24h }
        },
        location: r.room ? `Room ${r.room}` : '',
        color: r.day === 'Saturday' ? '#f97316' : 
               r.day === 'Sunday' ? '#0ea5e9' : 
               r.day === 'Monday' ? '#8b5cf6' : 
               r.day === 'Tuesday' ? '#ec4899' : 
               r.day === 'Wednesday' ? '#10b981' : 
               r.day === 'Thursday' ? '#eab308' : '#64748b',
        actors: r.faculty ? [{ id: r.faculty, name: r.faculty, role: 'instructor' }] : [],
        meta: { courseCode: r.code || '', roomId: r.room || '' }
      };
    });

    const today = new Date();
    const saturday = new Date(today);
    const day = today.getDay();
    const diff = today.getDate() - (day === 6 ? 0 : day + 1);
    saturday.setDate(diff);
    saturday.setHours(0, 0, 0, 0);

    const yearStr = saturday.getFullYear();
    const monthStr = (saturday.getMonth() + 1).toString().padStart(2, '0');
    const dateStr = saturday.getDate().toString().padStart(2, '0');
    const baseDateString = `${yearStr}-${monthStr}-${dateStr}T00:00:00+06:00`;

    try {
      return fromRoutine(mapped, { timeZone: "Asia/Dhaka", baseDate: baseDateString });
    } catch (e) {
      console.error(e);
      return [];
    }
  }, [routine, ramadanMode]);

  // --- CLICK OUTSIDE HANDLER ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- CLOCK & DATE ENGINE (OPTIMIZED) ---
  useEffect(() => {
    const updateDate = () => {
      const now = new Date();
      const pad = (n) => n < 10 ? '0'+n : n;
      const dateStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}`;
      setTodayDateString(dateStr);
    };
    updateDate();
    const interval = setInterval(updateDate, 30000); // Check once every 30 seconds
    return () => clearInterval(interval);
  }, []);

  // --- TOAST UTILITY ---
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // --- POMODORO TIMER ENGINE ---
  const updateFocusConfig = async (key, val) => {
    if (!user) return;
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'focusStats'), {
      [key]: val
    }, { merge: true });
  };

  useEffect(() => {
    let timer = null;
    if (pomoActive && pomoTimeLeft > 0) {
      timer = setInterval(() => {
        setPomoTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (pomoActive && pomoTimeLeft === 0) {
      if (pomoMode === 'work') {
        const nextMin = completedFocusMinutes + focusDuration;
        setCompletedFocusMinutes(nextMin);
        
        let nextStreak = focusStreak;
        if (completedFocusMinutes < dailyFocusGoal && nextMin >= dailyFocusGoal) {
          nextStreak = focusStreak + 1;
          setFocusStreak(nextStreak);
          showToast("Daily focus goal achieved! Streak incremented! 🏆🌲", "success");
        } else {
          showToast("Focus session finished! Good work 🎯", "success");
        }
        
        const todayStr = new Date().toLocaleDateString('en-CA');
        if (user) {
          setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'focusStats'), {
            completedFocusMinutes: nextMin,
            lastCompletedDate: todayStr,
            streak: nextStreak
          }, { merge: true }).catch(() => {});
        }

        try {
          const audio = new Audio("https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg");
          audio.play();
        } catch(e) {}

        if (skipBreaks) {
          setPomoActive(false);
          setPomoTimeLeft(focusDuration * 60);
          setPomoTotalDuration(focusDuration * 60);
        } else {
          setPomoMode('break');
          const breakDur = focusDuration >= 50 ? 10 : 5;
          setPomoTimeLeft(breakDur * 60);
          setPomoTotalDuration(breakDur * 60);
        }
      } else {
        setPomoMode('work');
        setPomoTimeLeft(focusDuration * 60);
        setPomoTotalDuration(focusDuration * 60);
        setPomoActive(false);
        showToast("Break finished! Let's focus again 🎯", "success");
        try {
          const audio = new Audio("https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg");
          audio.play();
        } catch(e) {}
      }
    }
    return () => clearInterval(timer);
  }, [pomoActive, pomoTimeLeft, pomoMode, focusDuration, dailyFocusGoal, skipBreaks, completedFocusMinutes, focusStreak, user]);

  const togglePomo = () => {
    setPomoActive(prev => !prev);
    showToast(pomoActive ? "Timer paused" : "Focus timer started ⏱️", "info");
  };

  const resetPomo = () => {
    setPomoActive(false);
    const duration = pomoMode === 'work' ? focusDuration * 60 : (focusDuration >= 50 ? 10 : 5) * 60;
    setPomoTimeLeft(duration);
    setPomoTotalDuration(duration);
    showToast("Timer reset", "info");
  };

  const changePomoMode = (mode) => {
    setPomoActive(false);
    setPomoMode(mode);
    const duration = mode === 'work' ? focusDuration * 60 : (focusDuration >= 50 ? 10 : 5) * 60;
    setPomoTimeLeft(duration);
    setPomoTotalDuration(duration);
    showToast(`Switched to ${mode} session`, "info");
  };

  // --- SPOTLIGHT SEARCH ENGINE ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase();
    const routineResults = [];
    const otherResults = [];
    
    routine.forEach(r => {
      if (
        (r.course && r.course.toLowerCase().includes(query)) ||
        (r.code && r.code.toLowerCase().includes(query)) ||
        (r.faculty && r.faculty.toLowerCase().includes(query)) ||
        (r.room && r.room.toLowerCase().includes(query)) ||
        (r.day && r.day.toLowerCase().includes(query)) ||
        (r.time && r.time.toLowerCase().includes(query))
      ) {
        routineResults.push({
          type: 'Routine',
          title: `${r.course} (${r.code})`,
          sub: `Class on ${r.day} at ${r.time} • Room ${r.room}${r.faculty ? ` • ${r.faculty}` : ''}`,
          action: () => { setActiveTab('routine'); setSearchOpen(false); }
        });
      }
    });
    
    studyPlans.forEach(p => {
      if (
        (p.topic && p.topic.toLowerCase().includes(query)) ||
        (p.date && p.date.toLowerCase().includes(query))
      ) {
        otherResults.push({
          type: 'Study Plan',
          title: p.topic,
          sub: `Scheduled for ${p.date} • ${p.priority} priority ${p.completed ? '(Completed)' : '(Pending)'}`,
          action: () => { setActiveTab('planner'); setSearchOpen(false); }
        });
      }
    });
    
    links.forEach(l => {
      if (
        (l.title && l.title.toLowerCase().includes(query)) ||
        (l.url && l.url.toLowerCase().includes(query)) ||
        (l.category && l.category.toLowerCase().includes(query))
      ) {
        otherResults.push({
          type: 'Link Vault',
          title: l.title,
          sub: `${l.category} • ${l.url}`,
          action: () => { window.open(l.url, '_blank'); setSearchOpen(false); }
        });
      }
    });
    
    cts.forEach(c => {
      if (
        (c.course && c.course.toLowerCase().includes(query)) ||
        (c.topic && c.topic.toLowerCase().includes(query))
      ) {
        otherResults.push({
          type: 'Class Test (CT)',
          title: `${c.course} CT`,
          sub: `${c.topic} • Deadline: ${c.deadline}`,
          action: () => { setActiveTab('assessments'); setSearchOpen(false); }
        });
      }
    });
    
    assignments.forEach(a => {
      if (
        (a.course && a.course.toLowerCase().includes(query)) ||
        (a.topic && a.topic.toLowerCase().includes(query))
      ) {
        otherResults.push({
          type: 'Assignment',
          title: `${a.course} Assignment`,
          sub: `${a.topic} • Deadline: ${a.deadline}`,
          action: () => { setActiveTab('assessments'); setSearchOpen(false); }
        });
      }
    });
    
    return [...routineResults, ...otherResults];
  }, [searchQuery, routine, studyPlans, links, cts, assignments]);

  // --- DARK MODE LOGIC ---
  useEffect(() => {
    if (window.tailwind && !window.tailwind.initialized) {
      window.tailwind.config = { darkMode: 'class' };
      window.tailwind.initialized = true;
    }
    const html = document.documentElement;
    if (darkMode) html.classList.add('dark');
    else html.classList.remove('dark');
  }, [darkMode]);
  
  // --- AUTH LISTENER ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setSessionActiveUser(null);
        setAuthLoading(false);
      } else {
        const loginTimeStr = localStorage.getItem('studyflow_login_timestamp');
        const loginTime = loginTimeStr ? parseInt(loginTimeStr) : null;
        
        if (loginTime && (Date.now() - loginTime > 259200000)) {
          localStorage.removeItem('studyflow_login_timestamp');
          signOut(auth);
          setUser(null);
          setSessionActiveUser(null);
          setAuthLoading(false);
          setTimeout(() => {
            showToast("Session expired after 3 days. Please sign in again. 🔐", "warning");
          }, 1000);
        } else {
          if (!loginTime) {
            localStorage.setItem('studyflow_login_timestamp', Date.now().toString());
          }
          
          if (!showCover) {
            setLoginBotState('success');
            setTimeout(() => {
              setSessionActiveUser(u);
              setAuthLoading(false);
            }, 1800);
          } else {
            setSessionActiveUser(u);
            setAuthLoading(false);
          }
        }
      }
    });
    return () => unsubscribe();
  }, [showCover]);

  // --- DERIVED DATA ---
  const currentDayClassesList = useMemo(() => {
    if (!todayDateString) return [];
    const jsDayToName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayIndex = new Date(todayDateString).getDay();
    return routine.filter(r => r.day === jsDayToName[dayIndex]);
  }, [routine, todayDateString]); 

  const todaysStudyPlans = useMemo(() => {
    if (!todayDateString) return [];
    return studyPlans.filter(p => p.date === todayDateString);
  }, [studyPlans, todayDateString]);

  const unreadAnnouncementsCount = useMemo(() => {
    return announcements.filter(a => !readAnnouncements.includes(a.id)).length;
  }, [announcements, readAnnouncements]);

  // C&A Glow Logic
  const getNearestDeadlineGlow = () => {
    const allPending = [...cts, ...assignments].filter(item => !item.completed);
    if (allPending.length === 0) return 'border-white/50 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-black/20';
    
    allPending.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    const nearest = allPending[0];
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const deadline = new Date(nearest.deadline);
    deadline.setHours(0,0,0,0);
    
    const diffDays = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0 || diffDays === 0) {
      return 'border-red-400/80 dark:border-red-500/60 shadow-[0_0_20px_rgba(239,68,68,0.25)]'; 
    }
    if (diffDays <= 3) {
      return 'border-orange-400/80 dark:border-orange-500/60 shadow-[0_0_20px_rgba(249,115,22,0.25)]'; 
    }
    return 'border-emerald-400/80 dark:border-emerald-500/60 shadow-[0_0_20px_rgba(34,197,94,0.25)]'; 
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');
    setResetSent(false);
    setIsSubmitting(true);
    try {
      if (authMode === 'signup') {
        const { username, email, password } = authData;
        if (!username || !email || !password) throw new Error("Please fill in all fields.");
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCred.user, { displayName: username });
      } else {
        await signInWithEmailAndPassword(auth, authData.email, authData.password);
      }
      localStorage.setItem('studyflow_login_timestamp', Date.now().toString());
    } catch (err) {
      setAuthError(err.message.replace('Firebase:', '').replace('auth/', ''));
      setLoginBotState('confused');
      setTimeout(() => {
        setLoginBotState('typing');
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setAuthError('');
    setResetSent(false);
    setIsSubmitting(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      localStorage.setItem('studyflow_login_timestamp', Date.now().toString());
    } catch (err) {
      setAuthError(err.message.replace('Firebase:', '').replace('auth/', ''));
      setLoginBotState('confused');
      setTimeout(() => {
        setLoginBotState('typing');
      }, 2500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e) => {
    if (e) e.preventDefault();
    if (!authData.email) {
      setAuthError("Please enter your email to reset password.");
      return;
    }
    setIsSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, authData.email);
      setResetSent(true);
      setAuthError("");
    } catch (err) {
      setAuthError("Reset failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    signOut(auth);
    localStorage.removeItem('studyflow_login_timestamp');
    setShowCover(false); // Return to auth page instead of cover page
    setAuthData({ email: '', password: '', username: '' }); // Clear user credentials for security
    setAuthMode('login'); // Ensure it resets to login view
    setAuthError(''); // Clear any leftover errors
    setIsProfileModalOpen(false);
    setIsVaultOpen(false);
    setMobileSidebarOpen(false);
    setQuoteRevealed(false);
    setDailyQuote("");
    setLoginBotState('wave');
  };

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the PWA install prompt');
        } else {
          console.log('User dismissed the PWA install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  // --- ACADEMIC PROFILES HANDLERS ---
  const handleSwitchProfile = async (profileId) => {
    if (!user) return;
    setActiveProfileId(profileId);
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'profileData'), {
      activeProfileId: profileId
    }, { merge: true });
    showToast("Switched academic profile", "success");
  };

  const handleDeleteProfile = async (profileId) => {
    if (!user || profiles.length <= 1) return;
    if (profileId === activeProfileId) {
      showToast("Cannot delete the active profile. Switch profiles first!", "warning");
      return;
    }
    const updated = profiles.filter(p => p.id !== profileId);
    setProfiles(updated);
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'profileData'), {
      profiles: updated
    }, { merge: true });
    deleteProfileData(user.uid, profileId);
    showToast("Academic profile deleted", "info");
  };

  const handleCreateProfile = async () => {
    if (!user || !newProfileName.trim()) return;
    const newId = 'profile_' + Date.now();
    const newProfile = { id: newId, name: newProfileName.trim(), createdAt: Date.now() };
    let updatedProfiles = [...profiles, newProfile];
    let oldestToDelete = null;

    if (updatedProfiles.length > 3) {
      const sorted = [...updatedProfiles].sort((a, b) => a.createdAt - b.createdAt);
      oldestToDelete = sorted[0];
      updatedProfiles = updatedProfiles.filter(p => p.id !== oldestToDelete.id);
    }

    setProfiles(updatedProfiles);
    setActiveProfileId(newId);

    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'profileData'), {
      activeProfileId: newId,
      profiles: updatedProfiles
    });

    if (oldestToDelete) {
      deleteProfileData(user.uid, oldestToDelete.id);
      showToast(`Oldest profile "${oldestToDelete.name}" auto-removed to keep max 3 profiles`, "info");
    }

    setNewProfileName('');
    setIsAddingProfileInput(false);
    showToast(`Started new academic profile: "${newProfileName}" 🚀`, "success");
  };

  const handleRenameProfile = async (profileId) => {
    if (!editingProfileName.trim() || !user) {
      setEditingProfileId(null);
      return;
    }
    const updated = profiles.map(p => p.id === profileId ? { ...p, name: editingProfileName.trim() } : p);
    setProfiles(updated);
    setEditingProfileId(null);
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'profileData'), {
      profiles: updated
    }, { merge: true });
    showToast("Academic profile renamed! ✏️", "success");
  };

  const handleProfileClick = (p) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      setEditingProfileId(p.id);
      setEditingProfileName(p.name);
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
        handleSwitchProfile(p.id);
      }, 250);
    }
  };

  const deleteProfileData = async (uid, profileId) => {
    try {
      const { getDocs: firestoreGetDocs } = await import('firebase/firestore');
      const cols = ['studyPlans', 'routine', 'cts', 'assignments'];
      for (const colName of cols) {
        const ref = collection(db, 'artifacts', appId, 'users', uid, 'profiles', profileId, colName);
        const snap = await firestoreGetDocs(ref);
        const batch = writeBatch(db);
        snap.docs.forEach(docSnap => {
          batch.delete(docSnap.ref);
        });
        await batch.commit();
      }
    } catch (e) {
      console.error("Failed to delete profile collections:", e);
    }
  };

  const migrateLegacyData = async (uid) => {
    try {
      const { getDocs: firestoreGetDocs } = await import('firebase/firestore');
      const targetRoutineRef = collection(db, 'artifacts', appId, 'users', uid, 'profiles', 'profile_1', 'routine');
      const targetSnap = await firestoreGetDocs(targetRoutineRef);
      if (!targetSnap.empty) return; // Already migrated
      
      const getLegacyDocs = async (path) => {
        const ref = collection(db, 'artifacts', appId, 'users', uid, path);
        const snapshot = await firestoreGetDocs(ref);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      };
      
      const legacyRoutine = await getLegacyDocs('routine');
      const legacyPlans = await getLegacyDocs('studyPlans');
      const legacyCts = await getLegacyDocs('cts');
      const legacyAssignments = await getLegacyDocs('assignments');
      
      if (legacyRoutine.length === 0 && legacyPlans.length === 0 && legacyCts.length === 0 && legacyAssignments.length === 0) {
        return;
      }
      
      const batch = writeBatch(db);
      legacyRoutine.forEach(item => {
        const { id, ...data } = item;
        batch.set(doc(db, 'artifacts', appId, 'users', uid, 'profiles', 'profile_1', 'routine', id), data);
      });
      legacyPlans.forEach(item => {
        const { id, ...data } = item;
        batch.set(doc(db, 'artifacts', appId, 'users', uid, 'profiles', 'profile_1', 'studyPlans', id), data);
      });
      legacyCts.forEach(item => {
        const { id, ...data } = item;
        batch.set(doc(db, 'artifacts', appId, 'users', uid, 'profiles', 'profile_1', 'cts', id), data);
      });
      legacyAssignments.forEach(item => {
        const { id, ...data } = item;
        batch.set(doc(db, 'artifacts', appId, 'users', uid, 'profiles', 'profile_1', 'assignments', id), data);
      });
      
      await batch.commit();
      console.log("Successfully migrated legacy user data to profile_1!");
    } catch (e) {
      console.error("Migration failed:", e);
    }
  };

  // --- DATA SYNC (FIRESTORE) ---
  useEffect(() => {
    if (!user) return;
    
    // User specific profile-dependent collections
    const plansRef = collection(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'studyPlans');
    const routineRef = collection(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'routine');
    const ctsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'cts');
    const assignmentsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'assignments');

    // Global and user settings (non-profile dependent)
    const linksRef = collection(db, 'artifacts', appId, 'users', user.uid, 'links');
    const vaultRef = collection(db, 'artifacts', appId, 'users', user.uid, 'vaultLinks');
    
    const quoteDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'quoteData');
    const readAnnouncementsDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'readAnnouncements');
    const globalAnnouncementsRef = collection(db, 'artifacts', appId, 'public', 'data', 'global_notifications');
    const vaultConfigDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'vaultConfig');
    const cgpaDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'cgpaData');
    const focusStatsDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'focusStats');
    const profileDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'profileData');

    const unsubPlans = onSnapshot(plansRef, (s) => setStudyPlans(s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => new Date(a.date) - new Date(b.date))));
    const unsubRoutine = onSnapshot(routineRef, (s) => setRoutine(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubLinks = onSnapshot(linksRef, (s) => setLinks(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubVault = onSnapshot(vaultRef, (s) => setVaultLinks(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    
    const unsubCts = onSnapshot(ctsRef, (s) => setCts(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    const unsubAssignments = onSnapshot(assignmentsRef, (s) => setAssignments(s.docs.map(d => ({ id: d.id, ...d.data() }))));
    
    const unsubGlobal = onSnapshot(globalAnnouncementsRef, (s) => {
      setAnnouncements(s.docs.map(d => ({ id: d.id, ...d.data() })).sort((a,b) => b.createdAt - a.createdAt));
    });

    const unsubReadNotices = onSnapshot(readAnnouncementsDoc, (s) => {
      setReadAnnouncements(s.data()?.readIds || []);
    });

    const unsubVaultConfig = onSnapshot(vaultConfigDoc, (s) => {
      setVaultConfig(s.data() || null);
    });

    const unsubCgpa = onSnapshot(cgpaDoc, (s) => {
      if (s.exists()) {
        const data = s.data();
        setCgpaPrevCgpa(data.prevCgpa || '');
        setCgpaPrevCredit(data.prevCredit || '');
      }
    });

    const unsubFocusStats = onSnapshot(focusStatsDoc, (s) => {
      const data = s.data();
      const todayStr = new Date().toLocaleDateString('en-CA');
      if (data) {
        setFocusDuration(data.focusDuration ?? 30);
        setDailyFocusGoal(data.dailyFocusGoal ?? 240);
        setSkipBreaks(data.skipBreaks ?? false);
        setFocusStreak(data.streak ?? 0);
        setCustomApiKey(data.customApiKey ?? '');
        if (data.lastCompletedDate === todayStr) {
          setCompletedFocusMinutes(data.completedFocusMinutes ?? 0);
        } else {
          setCompletedFocusMinutes(0);
        }
      }
    });

    const unsubProfileData = onSnapshot(profileDoc, (s) => {
      if (s.exists()) {
        const data = s.data();
        if (data.activeProfileId) setActiveProfileId(data.activeProfileId);
        if (data.profiles) setProfiles(data.profiles);
      } else {
        const defaultProfiles = [{ id: 'profile_1', name: 'Profile 1', createdAt: Date.now() }];
        setDoc(profileDoc, {
          activeProfileId: 'profile_1',
          profiles: defaultProfiles
        }).catch(() => {});
        setActiveProfileId('profile_1');
        setProfiles(defaultProfiles);
        migrateLegacyData(user.uid);
      }
    });

    const unsubQuote = onSnapshot(quoteDoc, (s) => {
      const data = s.data();
      const todayString = new Date().toDateString();
      if (data) {
        setUserQuoteData({ index: data.index ?? -1, date: data.date || "" });
        if (data.date === todayString) {
          setQuoteRevealed(true);
          setDailyQuote(QUOTE_BANK[data.index % QUOTE_BANK.length]);
        } else {
          setQuoteRevealed(false);
          setDailyQuote("");
        }
      } else {
        setQuoteRevealed(false);
        setDailyQuote("");
      }
    });

    return () => { 
      unsubPlans(); unsubRoutine(); unsubLinks(); unsubVault(); 
      unsubQuote(); unsubCts(); unsubAssignments(); unsubGlobal(); unsubReadNotices();
      unsubVaultConfig(); unsubCgpa(); unsubFocusStats(); unsubProfileData();
    };
  }, [user, activeProfileId]);



  // --- HANDLERS ---
  const handleSaveCustomApiKey = async (key) => {
    if (!user) return;
    setCustomApiKey(key);
    const focusStatsDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'focusStats');
    await setDoc(focusStatsDoc, { customApiKey: key }, { merge: true });
    showToast(key ? "Custom API Key updated 🔑" : "Custom API Key removed", "success");
  };

  const handleRevealQuote = async () => {
    if (!user) return;
    const today = new Date().toDateString();
    let newIndex = userQuoteData.index;
    if (userQuoteData.date !== today) {
      newIndex = userQuoteData.date === "" ? 0 : (userQuoteData.index + 1) % QUOTE_BANK.length;
    }
    setDailyQuote(QUOTE_BANK[newIndex]);
    setQuoteRevealed(true);
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'quoteData'), { index: newIndex, date: today }, { merge: true });
    showToast("Daily inspiration quote revealed ✨", "success");
  };



  const handleCopyQuote = () => {
    if (!dailyQuote) return;
    navigator.clipboard.writeText(dailyQuote);
    showToast("Quote copied to clipboard! 📋", "success");
  };

  const markNoticeAsRead = async (noticeId) => {
    if (!user || readAnnouncements.includes(noticeId)) return;
    const updated = [...readAnnouncements, noticeId];
    setReadAnnouncements(updated); // Optimistic
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'readAnnouncements'), { readIds: updated }, { merge: true });
  };

  const markAllNoticesRead = async () => {
    if (!user) return;
    const allIds = announcements.map(a => a.id);
    setReadAnnouncements(allIds);
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'readAnnouncements'), { readIds: allIds }, { merge: true });
    showToast("All announcements marked as read 📬", "success");
  };

  // Study Planner Handlers
  const addStudyPlan = async (e) => {
    e.preventDefault();
    if (!newPlan.topic || !newPlan.date || !user) return;
    const data = { ...newPlan, completed: false, createdAt: Date.now() };
    setNewPlan({ topic: '', date: '', timeSlot: '', priority: 'medium' });
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'studyPlans'), data);
    showToast("Study plan goal added 📅", "success");
  };
  const toggleStudyPlan = async (plan) => { 
    if (user) {
      await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'studyPlans', plan.id), { completed: !plan.completed }); 
      showToast(plan.completed ? "Goal set to pending ⏳" : "Goal completed! 🎉", "success");
    }
  };
  const deleteStudyPlan = async (id) => { 
    if (user) {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'studyPlans', id)); 
      showToast("Study plan goal deleted", "info");
    }
  };
  
  // CT Handlers
  const addCt = async (e) => {
    e.preventDefault();
    if (!newCt.course || !newCt.deadline || !user) return;
    const data = { ...newCt, completed: false, createdAt: Date.now() };
    setNewCt({ course: '', topic: '', deadline: '' });
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'cts'), data);
    showToast("Class Test recorded 📝", "success");
  };
  const toggleCt = async (ct) => { 
    if(user) {
      await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'cts', ct.id), { completed: !ct.completed }); 
      showToast(ct.completed ? "CT marked as pending" : "CT completed! 🏆", "success");
    }
  };
  const deleteCt = async (id) => { 
    if(user) {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'cts', id)); 
      showToast("Class Test record deleted", "info");
    }
  };

  // Assignment Handlers
  const addAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignment.course || !newAssignment.deadline || !user) return;
    const data = { ...newAssignment, completed: false, createdAt: Date.now() };
    setNewAssignment({ course: '', topic: '', deadline: '' });
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'assignments'), data);
    showToast("Assignment recorded 📚", "success");
  };
  const toggleAssignment = async (ass) => { 
    if(user) {
      await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'assignments', ass.id), { completed: !ass.completed }); 
      showToast(ass.completed ? "Assignment marked as pending" : "Assignment completed! 🎓", "success");
    }
  };
  const deleteAssignment = async (id) => { 
    if(user) {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'assignments', id)); 
      showToast("Assignment deleted", "info");
    }
  };

  // Admin Notification Handler
  const sendGlobalNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.message || user.email !== ADMIN_EMAIL) return;
    const data = { ...newNotice, sender: user.displayName, createdAt: Date.now() };
    setNewNotice({ title: '', message: '' });
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'global_notifications'), data);
    showToast("Broadcast message sent 📢", "success");
  };

  // Shared Handlers
  // Shared Handlers
  const addRoutine = (e) => {
    e.preventDefault();
    if (!newRoutine.course || !user) return;
    const data = { ...newRoutine };
    setNewRoutine({ day: 'Saturday', course: '', code: '', faculty: '', time: '', room: '', ramadanTime: '' });
    setIsAddingRoutine(false);
    addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'routine'), data)
      .catch(err => console.error(err));
    showToast("Timetable class added 🗓️", "success");
  };
  const deleteRoutine = (id) => { 
    if (user) {
      // Optimistic UI update: remove instantly from screen
      setRoutine(prev => prev.filter(r => r.id !== id));
      deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'routine', id))
        .catch(err => console.error("Deletion failed:", err));
      showToast("Timetable class deleted", "info");
    }
  };
  const editRoutineHandler = (e) => {
    e.preventDefault();
    if (!editingRoutine || !editingRoutine.course || !user) return;
    const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'routine', editingRoutine.id);
    const { id, ...data } = editingRoutine;
    updateDoc(docRef, data)
      .catch(err => console.error(err));
    setEditingRoutine(null);
    showToast("Class details updated successfully! 📝", "success");
  };

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr) return 9999;
    const match = timeStr.trim().match(/^(\d+):(\d+)\s*(AM|PM)$/i);
    if (!match) return 9999;

    let hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const ampm = match[3].toUpperCase();

    if (ampm === 'PM' && hours !== 12) {
      hours += 12;
    } else if (ampm === 'AM' && hours === 12) {
      hours = 0;
    }

    return hours * 60 + minutes;
  };

  const getLinkBranding = (url) => {
    if (!url) return { icon: ExternalLink, color: 'text-slate-500', glowColor: 'rgba(249, 115, 22, 0.4)', bg: 'bg-slate-100 dark:bg-slate-800/60', hoverText: 'group-hover:text-orange-500', starBg: 'bg-amber-50/80 dark:bg-amber-500/10', starBorder: 'border-amber-300/60 dark:border-amber-500/40', starText: 'text-amber-700 dark:text-amber-300' };
    const lowUrl = url.toLowerCase();
    if (lowUrl.includes('facebook.com') || lowUrl.includes('fb.com')) {
      return { 
        icon: Facebook, 
        color: 'text-[#1877F2]', 
        glowColor: 'rgba(24, 119, 242, 0.6)', 
        bg: 'bg-[#1877F2]/10 text-[#1877F2]', 
        hoverText: 'group-hover:text-[#1877F2]', 
        border: 'border-[#1877F2]/30', 
        starBg: 'bg-[#1877F2]/10 dark:bg-[#1877F2]/20', 
        starBorder: 'border-[#1877F2]/40', 
        starText: 'text-[#1877F2] dark:text-[#60a5fa]' 
      };
    }
    if (lowUrl.includes('youtube.com') || lowUrl.includes('youtu.be')) {
      return { 
        icon: Youtube, 
        color: 'text-[#FF0000]', 
        glowColor: 'rgba(255, 0, 0, 0.6)', 
        bg: 'bg-[#FF0000]/10 text-[#FF0000]', 
        hoverText: 'group-hover:text-[#FF0000]', 
        border: 'border-[#FF0000]/30',
        starBg: 'bg-[#FF0000]/10 dark:bg-[#FF0000]/20', 
        starBorder: 'border-[#FF0000]/40', 
        starText: 'text-[#FF0000] dark:text-[#f87171]'
      };
    }
    if (lowUrl.includes('drive.google.com') || lowUrl.includes('docs.google.com')) {
      return { 
        icon: HardDrive, 
        color: 'text-[#FBBC05]', 
        glowColor: 'rgba(251, 188, 5, 0.6)', 
        bg: 'bg-[#FBBC05]/10 text-[#FBBC05]', 
        hoverText: 'group-hover:text-[#FBBC05]', 
        border: 'border-[#FBBC05]/30',
        starBg: 'bg-[#FBBC05]/10 dark:bg-[#FBBC05]/20', 
        starBorder: 'border-[#FBBC05]/40', 
        starText: 'text-[#FBBC05] dark:text-[#fbbf24]'
      };
    }
    if (lowUrl.includes('uiu.ac.bd')) {
      return { 
        icon: School, 
        color: 'text-[#FF7A00]', 
        glowColor: 'rgba(255, 122, 0, 0.6)', 
        bg: 'bg-[#FF7A00]/10 text-[#FF7A00]', 
        hoverText: 'group-hover:text-[#FF7A00]', 
        border: 'border-[#FF7A00]/30',
        starBg: 'bg-[#FF7A00]/10 dark:bg-[#FF7A00]/20', 
        starBorder: 'border-[#FF7A00]/40', 
        starText: 'text-[#FF7A00] dark:text-[#fb923c]'
      };
    }
    // Default/General
    return { 
      icon: ExternalLink, 
      color: 'text-amber-500', 
      glowColor: 'rgba(245, 158, 11, 0.6)', 
      bg: 'bg-amber-100/80 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400', 
      hoverText: 'group-hover:text-amber-500', 
      border: 'border-amber-200/50 dark:border-amber-700/50',
      starBg: 'bg-amber-50/80 dark:bg-amber-500/10', 
      starBorder: 'border-amber-300/60 dark:border-amber-500/40', 
      starText: 'text-amber-700 dark:text-amber-300'
    };
  };

  const executeCalendarImport = async (confirmData, replacePrev) => {
    if (!confirmData || !user) return;
    setImportConfirmData(null);

    try {
      const batch = writeBatch(db);
      
      if (replacePrev) {
        setRoutine([]);
        routine.forEach(r => {
          const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'routine', r.id);
          batch.delete(docRef);
        });
      }

      const dayMap = {
        'SA': 'Saturday', 'SU': 'Sunday', 'MO': 'Monday', 'TU': 'Tuesday', 
        'WE': 'Wednesday', 'TH': 'Thursday', 'FR': 'Friday'
      };
      const dayAbbrevToName = {
        0: 'Sunday', 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 
        4: 'Thursday', 5: 'Friday', 6: 'Saturday'
      };

      let addedCount = 0;

      for (const ev of confirmData.events) {
        let courseName = ev.summary || 'Imported Class';
        let courseCode = '';
        let faculty = '';
        let room = ev.location || '';

        const roomMatch = room.match(/(?:Room|Rm)\s*#?\s*([A-Za-z0-9-]+)/i) || room.match(/^([A-Za-z0-9-]+)/);
        if (roomMatch) {
          room = roomMatch[1];
        }

        const codeMatch = courseName.match(/\b([A-Za-z]{2,4}\s*-?\s*\d{3,4})\b/);
        if (codeMatch) {
          courseCode = codeMatch[1];
          courseName = courseName.replace(courseCode, '').trim();
        }

        const facultyMatch = courseName.match(/\[([A-Z]{2,4})\]/) || courseName.match(/\b([A-Z]{2,4})\b\s*$/);
        if (facultyMatch) {
          faculty = facultyMatch[1];
          courseName = courseName.replace(facultyMatch[0], '').trim();
        }

        courseName = courseName.replace(/^[:-\s]+|[:-\s]+$/g, '').trim();
        if (!courseName) {
          courseName = courseCode || 'Class';
        }

        let timeStr = '';
        let baseDay = '';
        if (ev.dtstart) {
          const cleanStr = ev.dtstart.trim();
          const tIndex = cleanStr.indexOf('T');
          if (tIndex > -1) {
            const datePart = cleanStr.substring(0, tIndex);
            const timePart = cleanStr.substring(tIndex + 1);
            
            if (datePart.length === 8 && timePart.length >= 4) {
              const y = parseInt(datePart.substring(0, 4));
              const m = parseInt(datePart.substring(4, 6)) - 1;
              const d = parseInt(datePart.substring(6, 8));
              const hhVal = parseInt(timePart.substring(0, 2));
              const mmVal = parseInt(timePart.substring(2, 4));
              const ssVal = timePart.length >= 6 ? parseInt(timePart.substring(4, 6)) : 0;
              
              if (!isNaN(y) && !isNaN(m) && !isNaN(d) && !isNaN(hhVal) && !isNaN(mmVal)) {
                let dateObj;
                if (cleanStr.endsWith('Z')) {
                  dateObj = new Date(Date.UTC(y, m, d, hhVal, mmVal, ssVal));
                } else {
                  dateObj = new Date(y, m, d, hhVal, mmVal, ssVal);
                }
                
                let hh = dateObj.getHours();
                const mm = dateObj.getMinutes().toString().padStart(2, '0');
                const ampm = hh >= 12 ? 'PM' : 'AM';
                hh = hh % 12;
                hh = hh ? hh : 12;
                timeStr = `${hh}:${mm} ${ampm}`;
                baseDay = dayAbbrevToName[dateObj.getDay()];
              }
            }
          }
        }

        let daysToAdd = [];
        if (ev.rrule) {
          const bydayMatch = ev.rrule.match(/BYDAY=([^;]+)/);
          if (bydayMatch) {
            const days = bydayMatch[1].split(',');
            days.forEach(d => {
              const name = dayMap[d.trim().toUpperCase()];
              if (name) daysToAdd.push(name);
            });
          }
        }

        if (daysToAdd.length === 0 && baseDay) {
          daysToAdd.push(baseDay);
        }

        if (!timeStr) timeStr = '10:00 AM';

        for (const d of daysToAdd) {
          const newDocRef = doc(collection(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'routine'));
          batch.set(newDocRef, {
            day: d,
            course: courseName,
            code: courseCode,
            faculty: faculty,
            time: timeStr,
            room: room,
            ramadanTime: ''
          });
          addedCount++;
        }
      }

      await batch.commit();
      showToast(`Successfully imported ${addedCount} classes! 🗓️`, "success");
    } catch (err) {
      console.error(err);
      showToast("Error importing routine! ⚠️", "error");
    }
  };

  const handleImportCalendar = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target.result;
        const lines = text.split(/\r?\n/);
        const events = [];
        let currentEvent = null;

        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.startsWith('BEGIN:VEVENT')) {
            currentEvent = {};
          } else if (line.startsWith('END:VEVENT')) {
            if (currentEvent) {
              events.push(currentEvent);
              currentEvent = null;
            }
          } else if (currentEvent) {
            const colonIndex = line.indexOf(':');
            if (colonIndex > -1) {
              const key = line.substring(0, colonIndex).split(';')[0];
              const val = line.substring(colonIndex + 1);
              
              if (key === 'SUMMARY') currentEvent.summary = val;
              else if (key === 'LOCATION') currentEvent.location = val;
              else if (key === 'DTSTART') currentEvent.dtstart = val;
              else if (key === 'RRULE') currentEvent.rrule = val;
            }
          }
        }

        if (events.length === 0) {
          showToast("No valid calendar events found in this file! ⚠️", "warning");
          return;
        }

        setImportConfirmData({
          events: events,
          eventsCount: events.length
        });
      } catch (err) {
        console.error(err);
        showToast("Error parsing calendar file! ⚠️", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
  };

  const addLink = async (e) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url || !user) return;
    
    // Validation for materials type selection
    if (newLink.category === 'materials' && (!newLink.materialTypes || newLink.materialTypes.length === 0)) {
      showToast("Please select at least one material type first!", "warning");
      return;
    }
    
    let url = newLink.url.startsWith('http') ? newLink.url : 'https://' + newLink.url;
    const data = { ...newLink, url };
    setNewLink({ title: '', url: '', category: 'official', materialTypes: [] });
    setIsAddingLink(false);
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'links'), data);
    showToast("Resource link saved 🔗", "success");
  };
  const deleteLink = async (id) => { 
    if (user) {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', id)); 
      showToast("Resource link deleted", "info");
    }
  };
  const toggleStarLink = async (link) => {
    if (!user) return;
    const isStarred = !!link.starred;
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', link.id), { starred: !isStarred, starredAt: !isStarred ? Date.now() : null });
    showToast(isStarred ? "Removed from favorites ⭐" : "Added to favorites ⭐", "success");
  };

  const addVaultLink = async (e) => {
    e.preventDefault();
    if (!newVaultLink.title || !newVaultLink.url || !user) return;
    let url = newVaultLink.url.startsWith('http') ? newVaultLink.url : 'https://' + newVaultLink.url;
    const data = { ...newVaultLink, url, createdAt: Date.now() };
    setNewVaultLink({ title: '', url: '', hint: '' });
    setIsAddingVaultLink(false);
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'vaultLinks'), data);
    showToast("Secure link saved 🔐", "success");
  };
  const deleteVaultLink = async (id) => { 
    if (id && user) {
      await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'vaultLinks', id)); 
      showToast("Secure link deleted", "info");
    }
  };

  const editStudyPlanHandler = async (e) => {
    e.preventDefault();
    if (!editingStudyPlan || !editingStudyPlan.topic || !user) return;
    const { id, ...data } = editingStudyPlan;
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'studyPlans', id), data);
    setEditingStudyPlan(null);
    showToast("Study plan goal updated! 📝", "success");
  };

  const editCtHandler = async (e) => {
    e.preventDefault();
    if (!editingCt || !editingCt.course || !editingCt.deadline || !user) return;
    const { id, ...data } = editingCt;
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'cts', id), data);
    setEditingCt(null);
    showToast("Class Test details updated! 📝", "success");
  };

  const editAssignmentHandler = async (e) => {
    e.preventDefault();
    if (!editingAssignment || !editingAssignment.course || !editingAssignment.deadline || !user) return;
    const { id, ...data } = editingAssignment;
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'profiles', activeProfileId, 'assignments', id), data);
    setEditingAssignment(null);
    showToast("Assignment details updated! 📝", "success");
  };

  const editLinkHandler = async (e) => {
    e.preventDefault();
    if (!editingLink || !editingLink.title || !editingLink.url || !user) return;
    
    // Validation for materials type selection
    if (editingLink.category === 'materials' && (!editingLink.materialTypes || editingLink.materialTypes.length === 0)) {
      showToast("Please select at least one material type first!", "warning");
      return;
    }
    
    let url = editingLink.url.startsWith('http') ? editingLink.url : 'https://' + editingLink.url;
    const { id, ...data } = editingLink;
    data.url = url;
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', id), data);
    setEditingLink(null);
    showToast("Resource link updated! 🔗", "success");
  };

  const editVaultLinkHandler = async (e) => {
    e.preventDefault();
    if (!editingVaultLink || !editingVaultLink.title || !editingVaultLink.url || !user) return;
    let url = editingVaultLink.url.startsWith('http') ? editingVaultLink.url : 'https://' + editingVaultLink.url;
    const { id, ...data } = editingVaultLink;
    data.url = url;
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'vaultLinks', id), data);
    setEditingVaultLink(null);
    showToast("Secure link updated! 🔐", "success");
  };

  const sendOtpForMaterialDelete = async () => {
    if (!user) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    setUserOtpInput('');
    setIsOtpServiceFailed(false);
    setIsOtpModalOpen(true);

    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;

    if (serviceId && templateId && publicKey) {
      showToast("Sending verification code to your email... 📧", "info");
      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            to_email: user.email,
            to_name: user.displayName || 'StudyFlow User',
            otp: code,
          },
          publicKey
        );
        showToast(`Verification code sent to ${user.email}! 📧`, "success");
      } catch (err) {
        console.error("EmailJS Error:", err);
        setIsOtpServiceFailed(true);
        showToast("OTP service limit exceeded or failed. Use backup code.", "warning");
      }
    } else {
      console.log(`[StudyFlow OTP] Developer preview code: ${code}`);
      showToast(`Verification code generated! 📧`, "success");
    }
  };

  const executeBatchDeleteMaterials = async () => {
    if (userOtpInput !== generatedOtp) {
      showToast("Incorrect verification code! Please check again.", "error");
      return;
    }
    
    if (!user) return;
    try {
      const materialsList = links.filter(l => l.category === 'materials');
      const batch = writeBatch(db);
      materialsList.forEach(m => {
        const docRef = doc(db, 'artifacts', appId, 'users', user.uid, 'links', m.id);
        batch.delete(docRef);
      });
      await batch.commit();
      setIsOtpModalOpen(false);
      setIsMaterialsModalOpen(false);
      showToast("All materials links deleted successfully! 🧹", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to delete materials links. ⚠️", "error");
    }
  };

  // --- IMPORT & EXPORT HANDLERS ---
  const handleExportDataProceed = async () => {
    setIsExportConfirmOpen(false);
    if (!user) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setExportOtpGenerated(code);
    setExportOtpInput('');
    setIsExportOtpFailed(false);
    setIsExportOtpOpen(true);

    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'studyflow_otp';
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_sg6qkfe';
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'MN-YuJZWzW_02VsVO';

    showToast("Sending security code for backup export... 📧", "info");
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: user.email,
          to_name: user.displayName || 'StudyFlow User',
          otp: code,
        },
        publicKey
      );
      showToast(`Verification code sent to ${user.email}! 📧`, "success");
    } catch (err) {
      console.error("EmailJS Error:", err);
      setIsExportOtpFailed(true);
      showToast("Email service quota exceeded. Emergency backup code provided.", "warning");
    }
  };

  const handleVerifyExportOtp = () => {
    if (exportOtpInput.trim() !== exportOtpGenerated) {
      showToast("Incorrect security code! Please check again.", "error");
      return;
    }
    setIsExportOtpOpen(false);
    
    // Construct full backup payload
    const backupData = {
      studyflow_backup: true,
      version: "26.7",
      exportDate: new Date().toISOString(),
      userEmail: user?.email,
      displayName: user?.displayName,
      routine,
      studyPlans,
      links,
      cts,
      assignments,
      profiles,
      notes: vaultLinks || [],
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StudyFlow_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setIsExportSuccessOpen(true);
    showToast("Data backup file generated! 📦", "success");
  };

  const handleImportFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (!parsed || typeof parsed !== 'object') {
          showToast("Invalid JSON backup format.", "error");
          return;
        }
        setImportedPendingData(parsed);
        const hasData = (routine && routine.length > 0) || (studyPlans && studyPlans.length > 0) || (links && links.length > 0) || (cts && cts.length > 0) || (assignments && assignments.length > 0);
        if (hasData) {
          setIsImportConflictOpen(true);
        } else {
          executeDataImport(parsed, 'merge');
        }
      } catch (err) {
        showToast("Failed to parse backup JSON file.", "error");
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImportOverrideClick = async () => {
    setIsImportConflictOpen(false);
    if (!user) return;
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setImportOtpGenerated(code);
    setImportOtpInput('');
    setIsImportOtpFailed(false);
    setIsImportOtpOpen(true);

    const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID || 'studyflow_otp';
    const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID || 'template_sg6qkfe';
    const publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY || 'MN-YuJZWzW_02VsVO';

    showToast("Sending security code for data override... 📧", "info");
    try {
      await emailjs.send(
        serviceId,
        templateId,
        {
          to_email: user.email,
          to_name: user.displayName || 'StudyFlow User',
          otp: code,
        },
        publicKey
      );
      showToast(`Verification code sent to ${user.email}! 📧`, "success");
    } catch (err) {
      console.error("EmailJS Error:", err);
      setIsImportOtpFailed(true);
      showToast("Email service quota exceeded. Emergency backup code provided.", "warning");
    }
  };

  const handleVerifyImportOtp = () => {
    if (importOtpInput.trim() !== importOtpGenerated) {
      showToast("Incorrect security code! Override cancelled.", "error");
      return;
    }
    setIsImportOtpOpen(false);
    if (importedPendingData) {
      executeDataImport(importedPendingData, 'override');
    }
  };

  const executeDataImport = async (data, mode) => {
    if (!user || !data) return;
    try {
      showToast("Importing data to workspace... ⏳", "info");

      const newRoutine = mode === 'override' ? (data.routine || []) : [...routine, ...(data.routine || [])];
      const newPlans = mode === 'override' ? (data.studyPlans || []) : [...studyPlans, ...(data.studyPlans || [])];
      const newLinks = mode === 'override' ? (data.links || []) : [...links, ...(data.links || [])];
      const newCts = mode === 'override' ? (data.cts || []) : [...cts, ...(data.cts || [])];
      const newAssignments = mode === 'override' ? (data.assignments || []) : [...assignments, ...(data.assignments || [])];

      setRoutine(newRoutine);
      setStudyPlans(newPlans);
      setLinks(newLinks);
      setCts(newCts);
      setAssignments(newAssignments);

      const userDocRef = doc(db, 'artifacts', appId, 'users', user.uid);
      await setDoc(userDocRef, {
        routine: newRoutine,
        studyPlans: newPlans,
        links: newLinks,
        cts: newCts,
        assignments: newAssignments,
        lastImportedAt: new Date().toISOString()
      }, { merge: true });

      showToast(`Workspace data successfully ${mode === 'override' ? 'overwritten' : 'merged'}! 🎉`, "success");
      setImportedPendingData(null);
    } catch (err) {
      console.error("Import execution error:", err);
      showToast("Failed to save imported data.", "error");
    }
  };

  // --- SECURE VAULT ACCESS HANDLERS ---
  const handleSetupPasscode = async (e) => {
    e.preventDefault();
    if (setupPin.length !== 4) {
      setVaultPinError("PIN must be exactly 4 digits");
      return;
    }
    if (setupPin !== confirmPin) {
      setVaultPinError("PINs do not match");
      return;
    }
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'vaultConfig'), { passcode: setupPin }, { merge: true });
    setVaultLockState('unlocked');
    setVaultPinError('');
    setSetupPin('');
    setConfirmPin('');
    showToast("Vault passcode configured! 🔐", "success");
  };

  const handlePinInput = async (digit) => {
    const nextPin = vaultInputPin + digit;
    if (nextPin.length <= 4) {
      setVaultInputPin(nextPin);
      setVaultPinError('');
    }
    if (nextPin.length === 4) {
      if (nextPin === vaultConfig.passcode) {
        setVaultLockState('unlocked');
        setVaultInputPin('');
        showToast("Vault unlocked! 🔓", "success");
      } else {
        setVaultPinError("Incorrect PIN code. Try again.");
        setVaultInputPin('');
      }
    }
  };

  const handleBackspace = () => {
    setVaultInputPin(prev => prev.slice(0, -1));
  };

  const closeVault = () => {
    setIsVaultOpen(false);
    setVaultLockState('locked');
    setVaultInputPin('');
    setVaultPinError('');
  };

  // --- CGPA CALCULATOR HELPERS ---


  const saveCgpaMeta = async (cgpaVal, creditVal) => {
    if (!user) return;
    setCgpaPrevCgpa(cgpaVal);
    setCgpaPrevCredit(creditVal);
    await setDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'cgpaData'), { 
      prevCgpa: cgpaVal, 
      prevCredit: creditVal 
    }, { merge: true });
  };

  const handleCalculateCgpa = () => {
    const prevCgpaVal = parseFloat(cgpaPrevCgpa) || 0;
    const prevCreditVal = parseFloat(cgpaPrevCredit) || 0;

    let currCredit = 0;
    let currPoints = 0;
    let courseDetails = "";
    let validRows = 0;

    cgpaCourses.forEach((c, index) => {
      const name = c.name || `Course ${index + 1}`;
      const credit = parseFloat(c.credit);
      const gpa = parseFloat(c.gpa);

      if (!isNaN(credit) && !isNaN(gpa)) {
        currCredit += credit;
        currPoints += (credit * gpa);
        courseDetails += `• ${name}: ${gpa.toFixed(2)} (Cr: ${credit})\n`;
        validRows++;
      }
    });

    if (validRows === 0 && prevCreditVal === 0) {
      showToast("Please enter course details or previous results! ⚠️", "error");
      return;
    }

    const currGPA = currCredit > 0 ? (currPoints / currCredit) : 0;
    const totalCredit = prevCreditVal + currCredit;
    const totalCGPA = totalCredit > 0 ? (((prevCgpaVal * prevCreditVal) + currPoints) / totalCredit) : 0;

    let msg = "";
    if (totalCGPA >= 3.50) {
      msg = "🎉 Congratulations! Waiver Eligible next trimester!";
    } else if (totalCGPA > prevCgpaVal && prevCgpaVal > 0) {
      msg = "👏 Great job! You improved your CGPA. Keep going!";
    } else {
      msg = "💪 Don't give up! Trust in Allah and try harder next time.";
    }

    const textReport = `=== RESULT SUMMARY ===

CURRENT TRIMESTER:
${courseDetails || 'No current trimester courses.\n'}--------------------------
Current GPA  : ${currGPA.toFixed(2)}
Current Credit: ${currCredit}

OVERALL STATUS:
--------------------------
Previous CGPA: ${prevCgpaVal.toFixed(2)}
Total Credit : ${totalCredit}
Updated CGPA : ${totalCGPA.toFixed(2)}

${msg}`;

    setCgpaResultSummary({
      currGPA,
      currCredit,
      totalCredit,
      totalCGPA,
      msg,
      textReport
    });
    showToast("Result calculated successfully! 📈", "success");
  };



  // --- UI COMPONENTS ---
  const NavItem = ({ id, icon: Icon, label, onClick }) => (
    <button 
      onClick={() => { setActiveTab(id); if (onClick) onClick(); }} 
      title={sidebarCollapsed ? label : undefined}
      className={`flex items-center ${sidebarCollapsed ? 'justify-center p-3' : 'gap-3 px-4 py-3'} rounded-xl transition-all duration-200 relative w-full ${activeTab === id ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/40 font-medium'} outline-none cursor-pointer`}
    >
      <Icon size={18} className="shrink-0" /> 
      {!sidebarCollapsed && <span className="text-sm capitalize truncate">{label}</span>}
    </button>
  );

  const renderBackupModals = () => {
    return (
      <>
        {/* Hidden File Picker Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleImportFileSelect} 
          accept=".json" 
          className="hidden" 
        />

        {/* EXPORT CONFIRMATION MODAL */}
        {isExportConfirmOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setIsExportConfirmOpen(false)}>
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl max-w-md w-full text-center relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsExportConfirmOpen(false)} className="absolute top-5 right-5 p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors outline-none cursor-pointer"><X size={18} /></button>
              
              <div className="mx-auto w-16 h-16 bg-gradient-to-tr from-amber-500 to-orange-500 text-white rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-orange-500/25 animate-[bounce_2s_infinite]">
                <Flame size={32} />
              </div>
              
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">Secure Backup Export</h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Your data is already secured at our Firebase database. Do you still want to download a local backup file to your device?
              </p>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsExportConfirmOpen(false)} 
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-red-500/20 active:scale-95 transition-all outline-none cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleExportDataProceed} 
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all outline-none cursor-pointer"
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EXPORT OTP VERIFICATION MODAL */}
        {isExportOtpOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setIsExportOtpOpen(false)}>
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl max-w-md w-full text-center relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsExportOtpOpen(false)} className="absolute top-5 right-5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors outline-none cursor-pointer"><X size={18} /></button>

              <div className="mx-auto w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <ShieldCheck size={28} />
              </div>

              <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-1">Verify Email OTP</h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                We sent a 6-digit verification security code to <span className="text-orange-500 font-bold">{user?.email}</span> to authorize downloading your data.
              </p>

              {isExportOtpFailed && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl text-left">
                  <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 leading-tight">
                    Notice: Email service quota reached limit. Use emergency code below:
                  </p>
                  <p className="text-center font-mono font-black text-lg text-amber-600 dark:text-amber-300 mt-1 select-all tracking-wider">
                    {exportOtpGenerated}
                  </p>
                </div>
              )}

              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                value={exportOtpInput}
                onChange={e => setExportOtpInput(e.target.value)}
                className="w-full text-center font-mono text-xl tracking-widest px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 text-slate-800 dark:text-white mb-6 font-bold"
              />

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsExportOtpOpen(false)} 
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 py-3 rounded-xl font-bold text-xs transition-all outline-none cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleVerifyExportOtp} 
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all outline-none cursor-pointer"
                >
                  Verify & Download
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EXPORT SUCCESS MODAL */}
        {isExportSuccessOpen && (
          <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setIsExportSuccessOpen(false)}>
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl max-w-md w-full text-center relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <div className="mx-auto w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
                <Check size={32} />
              </div>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-2">Download Completed</h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Your StudyFlow workspace data backup file has been saved to your local drive. Please store it securely.
              </p>
              <button 
                onClick={() => setIsExportSuccessOpen(false)} 
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all outline-none cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        )}

        {/* IMPORT CONFLICT / MODE MODAL */}
        {isImportConflictOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setIsImportConflictOpen(false)}>
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl max-w-md w-full text-center relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsImportConflictOpen(false)} className="absolute top-5 right-5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors outline-none cursor-pointer"><X size={18} /></button>

              <div className="mx-auto w-14 h-14 bg-orange-500/10 border border-orange-500/30 text-orange-500 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <Database size={28} />
              </div>

              <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-2">Import Data Options</h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                Your workspace already contains existing data. How would you like to apply the imported backup file?
              </p>

              <div className="space-y-3">
                <button 
                  onClick={() => { setIsImportConflictOpen(false); executeDataImport(importedPendingData, 'merge'); }} 
                  className="w-full bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 p-3.5 rounded-xl font-bold text-xs transition-all outline-none flex flex-col items-center gap-1 cursor-pointer"
                >
                  <span className="text-sm font-extrabold">Merge Data</span>
                  <span className="text-[10px] font-normal text-slate-500">Combines imported items with your existing data.</span>
                </button>

                <button 
                  onClick={handleImportOverrideClick} 
                  className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/30 p-3.5 rounded-xl font-bold text-xs transition-all outline-none flex flex-col items-center gap-1 cursor-pointer"
                >
                  <span className="text-sm font-extrabold">Override All Data (Requires OTP)</span>
                  <span className="text-[10px] font-normal text-slate-500">Replaces current workspace state with backup file data.</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* IMPORT OVERRIDE OTP MODAL */}
        {isImportOtpOpen && (
          <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setIsImportOtpOpen(false)}>
            <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl max-w-md w-full text-center relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsImportOtpOpen(false)} className="absolute top-5 right-5 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors outline-none cursor-pointer"><X size={18} /></button>

              <div className="mx-auto w-14 h-14 bg-red-500/10 border border-red-500/30 text-red-500 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                <ShieldAlert size={28} />
              </div>

              <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-1">Confirm Data Override</h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Enter the 6-digit security code sent to <span className="text-orange-500 font-bold">{user?.email}</span> to authorize overwriting all workspace data.
              </p>

              {isImportOtpFailed && (
                <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 rounded-xl text-left">
                  <p className="text-[11px] font-bold text-amber-700 dark:text-amber-400 leading-tight">
                    Notice: Email service quota reached limit. Use emergency code below:
                  </p>
                  <p className="text-center font-mono font-black text-lg text-amber-600 dark:text-amber-300 mt-1 select-all tracking-wider">
                    {importOtpGenerated}
                  </p>
                </div>
              )}

              <input
                type="text"
                maxLength={6}
                placeholder="Enter 6-digit Security Code"
                value={importOtpInput}
                onChange={e => setImportOtpInput(e.target.value)}
                className="w-full text-center font-mono text-xl tracking-widest px-4 py-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-red-500 text-slate-800 dark:text-white mb-6 font-bold"
              />

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setIsImportOtpOpen(false)} 
                  className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 py-3 rounded-xl font-bold text-xs transition-all outline-none cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleVerifyImportOtp} 
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-red-500/20 active:scale-95 transition-all outline-none cursor-pointer"
                >
                  Confirm Override
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderTransitionOverlay = () => {
    return (
      <div className={`fixed inset-0 z-[99999] backdrop-blur-2xl bg-white/40 dark:bg-slate-950/40 transition-all duration-400 ease-in-out pointer-events-none flex items-center justify-center ${isTransitioning ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'}`}>
        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-orange-500/25">
          <School size={32} className="animate-pulse" />
        </div>
      </div>
    );
  };

  // --- RENDER LOGIC ---
  if (authLoading) {
    return (
      <div className="h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center font-sans">
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          * { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}} />
        <div className="flex flex-col items-center gap-4 animate-pulse">
           <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-500/30"><School size={32} /></div>
           <p className="text-sm font-semibold text-slate-500">Loading StudyFlow...</p>
        </div>
      </div>
    );
  }

  if (showCover && (!sessionActiveUser || !isMobileDevice)) {
    if (isMobileDevice && !dismissedMobileWarning && !sessionActiveUser) {
        return (
          <div key="mobile-warning-root" className="min-h-screen w-full relative flex items-center justify-center p-4 bg-[#070608] text-white font-sans overflow-hidden transition-colors duration-500">
            {/* Ambient glows behind */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-500/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
            
            <div className="relative z-10 w-full max-w-md bg-white/10 dark:bg-slate-900/50 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/25 text-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-orange-500/5">
                <Monitor size={32} className="animate-pulse" />
              </div>
              <h3 className="text-xl font-black tracking-tight text-white mb-3">Better on Desktop</h3>
              <p className="text-xs font-semibold text-slate-300 leading-relaxed mb-8 max-w-[320px]">
                For the best academic experience, StudyFlow is optimized for laptop or desktop viewports.
              </p>
              <button 
                onClick={() => {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setDismissedMobileWarning(true);
                    setShowCover(false);
                  }, 200);
                  setTimeout(() => {
                    setIsTransitioning(false);
                  }, 500);
                }}
                className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white py-3.5 px-6 rounded-2xl font-bold text-xs md:text-sm shadow-lg shadow-orange-500/10 active:scale-95 transition-all outline-none border border-white/10 cursor-pointer"
              >
                Proceed as it is
              </button>
            </div>
          </div>
        );
      }
      // --- COVER PAGE (Landing) ---
      return (
        <div key="cover-page-root" className="h-screen w-full relative flex flex-col justify-between bg-[#fafafa] dark:bg-[#070608] transition-colors duration-500 font-sans overflow-hidden">
          {!isMobileDevice && <TargetCursor targetSelector="button, a, input, select, .cursor-target" spinDuration={2} hideDefaultCursor={true} parallaxOn={true} />}
          {!isMobileDevice && <ThemeTassel darkMode={darkMode} setDarkMode={setDarkMode} />}
          <style dangerouslySetInnerHTML={{__html: `
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
            * { font-family: 'Plus Jakarta Sans', sans-serif; }
            @keyframes name-glow-pulse {
              0%, 100% {
                text-shadow: 0 0 8px rgba(249, 115, 22, 0.35), 0 0 16px rgba(234, 179, 8, 0.15);
                color: #f97316;
              }
              50% {
                text-shadow: 0 0 20px rgba(249, 115, 22, 0.75), 0 0 32px rgba(234, 179, 8, 0.5);
                color: #eab308;
              }
            }
            .name-glow {
              animation: name-glow-pulse 3s ease-in-out infinite;
              transition: color 0.5s ease;
            }
            @keyframes connect-glow-pulse {
              0%, 100% {
                box-shadow: 0 0 6px rgba(249, 115, 22, 0.25), inset 0 0 4px rgba(249, 115, 22, 0.1);
                border-color: rgba(249, 115, 22, 0.3);
              }
              50% {
                box-shadow: 0 0 20px rgba(249, 115, 22, 0.7), inset 0 0 10px rgba(249, 115, 22, 0.3);
                border-color: rgba(249, 115, 22, 0.75);
              }
            }
            .connect-glow {
              animation: connect-glow-pulse 2.5s ease-in-out infinite;
            }
          `}} />
          
          {/* Animated SoftAurora Background */}
          <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <SoftAurora
              speed={0.6}
              scale={2.5}
              brightness={1.0}
              color1="#FF7A00"
              color2="#34D9FF"
              noiseFrequency={2.5}
              noiseAmplitude={1.0}
              bandHeight={0.5}
              bandSpread={1.0}
              octaveDecay={0.1}
              layerOffset={0}
              colorSpeed={1.0}
              enableMouseInteraction={false}
              mouseInfluence={0.25}
            />
          </div>

          {/* Header */}
          <header className="w-full p-4 lg:px-10 flex justify-between items-center z-10 shrink-0">
            <div className="flex items-center gap-2 group cursor-pointer select-none">
              <div className="p-1.5 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                <School size={22} className="text-orange-500" />
              </div>
              <div className="flex flex-col text-left">
                <span className="font-extrabold text-lg dark:text-white text-slate-800 tracking-tight leading-none">StudyFlow</span>
                <span className="text-[7.5px] font-extrabold text-slate-400 dark:text-zinc-600 tracking-wider uppercase mt-1">Your Academic Workspace</span>
              </div>
            </div>
          </header>

          {/* Main Hero Column Grid */}
          <main className="w-full max-w-6xl mx-auto px-6 md:px-10 flex-grow flex flex-col justify-center py-4 lg:py-6 z-10 overflow-hidden relative">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
              
              {/* Left Hero Column */}
              <div className="lg:col-span-7 text-left flex flex-col items-start justify-center animate-in fade-in slide-in-from-left-6 duration-700">
                {/* Sleek platform badge */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-orange-500/20 bg-orange-500/5 text-orange-500 text-[9px] uppercase tracking-widest font-bold mb-4 select-none shadow-[0_4px_12px_rgba(249,115,22,0.05)]">
                  <Sparkles size={9} className="animate-pulse" /> StudyFlow v26.7
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl mb-5 leading-[1.02] text-slate-900 dark:text-white select-none">
                  <span className="font-black tracking-[-0.07em] block">Everything You Need</span>
                  <span className="font-light tracking-[-0.04em] block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 dark:from-orange-400 dark:via-amber-300 dark:to-rose-400 mt-1.5">to Stay on Track</span>
                </h1>
                
                <p className="text-slate-500 dark:text-zinc-400 text-xs font-medium leading-relaxed mb-6 max-w-[580px]">
                  StudyFlow unifies routines, class test alerts, assignment logs, and your dashboard into a cohesive, interactive workspace. Track daily academic habits, swap profiles dynamically per semester, and let Flowy guide you.
                </p>

                {/* Sleek Feature Pills */}
                <div className="flex flex-wrap gap-2.5 mb-6">
                  {[
                    { icon: Calendar, text: 'Sem Routine', color: 'text-blue-500 bg-blue-500/10' },
                    { icon: Clock, text: 'Study Planner', color: 'text-orange-500 bg-orange-500/10' },
                    { icon: BookOpen, text: 'Class Tests', color: 'text-emerald-500 bg-emerald-500/10' },
                    { icon: ClipboardList, text: 'Assignments', color: 'text-purple-500 bg-purple-500/10' },
                    { icon: Flame, text: 'Focus habit', color: 'text-amber-500 bg-amber-500/10' },
                    { icon: CreditCard, text: 'CGPA & Fees', color: 'text-pink-500 bg-pink-500/10' },
                    { icon: LinkIcon, text: 'Personal Linksphere', color: 'text-indigo-500 bg-indigo-500/10' },
                    { icon: Bot, text: 'Flowy AI Buddy', color: 'text-rose-500 bg-rose-500/10' }
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-slate-200/50 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm transition-all hover:scale-102 hover:border-orange-500/30">
                      <item.icon className={item.color.split(' ')[0]} size={15} />
                      <span className="text-[11px] font-bold text-slate-700 dark:text-zinc-300">{item.text}</span>
                    </div>
                  ))}
                </div>

                {/* Main Action Buttons */}
                <div className="flex flex-wrap gap-4 w-full sm:w-auto">
                  <button 
                    onClick={() => {
                      setIsTransitioning(true);
                      setTimeout(() => {
                        setShowCover(false);
                      }, 200);
                      setTimeout(() => {
                        setIsTransitioning(false);
                      }, 500);
                    }} 
                    className="group relative bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2.5 transition-all shadow-[0_8px_30px_rgb(249,115,22,0.15)] hover:shadow-[0_8px_30px_rgb(249,115,22,0.35)] active:scale-95 outline-none overflow-hidden cursor-pointer"
                  >
                    <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    <span>Enter Workspace</span> 
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>

                <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-4 leading-relaxed max-w-[360px] select-none">
                  Join thousands of students taking control of their academic journey. Fast, secure, and entirely yours.
                </p>
              </div>

              {/* Right Hub Preview Column */}
              <div className="lg:col-span-5 w-full animate-in fade-in slide-in-from-right-6 duration-700 delay-100">
                <div className="relative group bg-white/80 dark:bg-zinc-900/40 backdrop-blur-xl border border-slate-200/60 dark:border-zinc-800/80 rounded-3xl p-6 shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:scale-[1.01] hover:shadow-[0_20px_40px_rgba(249,115,22,0.06)] hover:border-orange-500/30">
                  {/* Colored window dots */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200/30 dark:border-zinc-800/60">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                    </div>
                    <span className="text-[9px] font-extrabold text-slate-400 dark:text-zinc-500 tracking-wider uppercase">STUDYFLOW HUB PREVIEW</span>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Item 1 */}
                    <div className="flex gap-4 items-start p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-500 shrink-0">
                        <Layers size={18} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Organize Semester</h4>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-1 leading-relaxed">Organize your semester without the stress.</p>
                      </div>
                    </div>
                    
                    {/* Item 2 */}
                    <div className="flex gap-4 items-start p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <div className="p-2.5 bg-orange-500/10 rounded-xl text-orange-500 shrink-0">
                        <Calendar size={18} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Routine & Planner</h4>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-1 leading-relaxed">Track classes, test prep, and assignment priorities in one place.</p>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex gap-4 items-start p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-500 shrink-0">
                        <Bot size={18} className="animate-bounce" style={{ animationDuration: '3s' }} />
                      </div>
                      <div className="text-left">
                        <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200">Flowy AI Assistant</h4>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500 mt-1 leading-relaxed">A personal learning companion that greets you and tracks your daily goals.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </main>

          {/* Footer */}
          <footer className="w-full border-t border-slate-200/30 dark:border-zinc-800/30 py-4 px-6 lg:px-10 z-10 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left select-none shrink-0">
            <div className="flex flex-col items-center md:items-start gap-0.5">
              <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                © 2026 StudyFlow. All academic records are securely synced to the cloud.
              </p>
              <span className="text-[9px] font-semibold text-slate-400/80 dark:text-zinc-600/80">
                Use laptop or PC for the best experience.
              </span>
            </div>
            <div className="text-xs text-slate-400 dark:text-zinc-500 font-bold flex flex-wrap items-center justify-center lg:justify-end gap-1 select-none shrink-0">
              <span>Crafted by</span>
              <span className="name-glow font-extrabold mx-0.5 cursor-pointer">Moheuddin Sikder Saikat</span>
              <button 
                onClick={() => setShowLanyard(true)}
                className="connect-glow ml-0.5 flex items-center gap-1 px-2.5 py-1 text-[9px] font-bold rounded-lg border border-orange-500/20 bg-orange-500/10 text-orange-600 dark:text-orange-400 cursor-pointer hover:bg-orange-500/20 transition-all outline-none"
              >
                <MousePointerClick size={10} className="animate-pulse" /> Click to connect
              </button>
            </div>
          </footer>
          {renderLanyardModal()}
          {renderBackupModals()}
          {renderTransitionOverlay()}
        </div>
      );
  }

  if (!sessionActiveUser) {
    // --- AUTH PAGE (Login/Signup) ---
    return (
      <div key="auth-page-root" className="min-h-screen relative flex items-center justify-center p-4 transition-colors duration-500 font-sans overflow-hidden bg-slate-50 dark:bg-slate-950">
        {!isMobileDevice && <TargetCursor targetSelector="button, a, input, select, .cursor-target" spinDuration={2} hideDefaultCursor={true} parallaxOn={true} />}
        {!isMobileDevice && <ThemeTassel darkMode={darkMode} setDarkMode={setDarkMode} />}
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          * { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}} />
        
        {/* Back Button to Cover Page */}
        <button 
          onClick={() => {
            setIsTransitioning(true);
            setTimeout(() => {
              setShowCover(true);
            }, 200);
            setTimeout(() => {
              setIsTransitioning(false);
            }, 500);
          }}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-slate-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400 transition-colors z-50 font-bold text-sm outline-none bg-white/50 dark:bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-slate-200/50 dark:border-white/10 cursor-pointer"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-400/30 dark:bg-orange-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-[100px]" />
        </div>

        {/* Split login card */}
        <div key="auth-split-card" className="w-full max-w-[820px] bg-white/80 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-slate-200/60 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] z-10 animate-in fade-in duration-500 relative">
          
          {/* Left panel: Flowy Bot animation card */}
          <div className="w-full md:w-1/2 bg-slate-100/50 dark:bg-slate-950/40 p-8 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200/60 dark:border-slate-800/50 relative overflow-hidden min-h-[260px] md:min-h-auto select-none">
            {/* Soft decorative glow behind Flowy */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
              <FlowyLoginBot authState={loginBotState} />
              <div className="text-center mt-5">
                <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight flex items-center justify-center gap-1.5">
                  <School size={22} className="text-orange-500" />
                  StudyFlow
                </h1>
                <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase mt-1">Your Personal Academic Workspace</p>
              </div>
            </div>
          </div>

          {/* Right panel: Login portion card */}
          <div className="w-full md:w-1/2 p-8 flex flex-col justify-center bg-white dark:bg-slate-900/30">
            <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white tracking-tight mb-1">{authMode === 'login' ? 'Welcome Back!' : 'Create Account'}</h2>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">{authMode === 'login' ? 'Please enter your login details to proceed.' : 'Get started with your fresh workspace.'}</p>
            
            <form onSubmit={handleAuth} className="space-y-3.5 relative z-10">
              {authMode === 'signup' && (
                <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl focus-within:ring-1 focus-within:ring-orange-500/50 transition-all shadow-sm group">
                  <UserPlus className="text-slate-400 group-focus-within:text-orange-500 transition-colors shrink-0" size={16} />
                  <input required type="text" placeholder="Your Name" className="w-full bg-transparent font-semibold text-xs dark:text-white outline-none" value={authData.username} onChange={e => setAuthData({...authData, username: e.target.value})} onFocus={() => setLoginBotState('focus-email')} onBlur={() => setLoginBotState('typing')} />
                </div>
              )}
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl focus-within:ring-1 focus-within:ring-orange-500/50 transition-all shadow-sm group">
                <Mail className="text-slate-400 group-focus-within:text-orange-500 transition-colors shrink-0" size={16} />
                <input required type="email" placeholder="Email Address" className="w-full bg-transparent font-semibold text-xs dark:text-white outline-none" value={authData.email} onChange={e => setAuthData({...authData, email: e.target.value})} onFocus={() => setLoginBotState('focus-email')} onBlur={() => setLoginBotState('typing')} />
              </div>
              <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 rounded-xl focus-within:ring-1 focus-within:ring-orange-500/50 transition-all shadow-sm group">
                <Lock className="text-slate-400 group-focus-within:text-orange-500 transition-colors shrink-0" size={16} />
                <input required type="password" placeholder="Password" className="w-full bg-transparent font-semibold text-xs dark:text-white outline-none" value={authData.password} onChange={e => setAuthData({...authData, password: e.target.value})} onFocus={() => setLoginBotState('focus-password')} onBlur={() => setLoginBotState('typing')} />
              </div>
              
              {authError && <div className="bg-red-50/80 dark:bg-red-900/20 p-3 rounded-xl border border-red-200/50 dark:border-red-900/30 text-xs font-semibold text-red-600 leading-tight">{authError}</div>}
              {resetSent && <div className="bg-emerald-50/80 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-200/50 dark:border-emerald-900/30 text-xs font-semibold text-emerald-600 text-center">Password reset link sent to your email.</div>}
              
              <button 
                type="submit" disabled={isSubmitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-bold text-xs shadow-md shadow-orange-500/10 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 outline-none cursor-pointer"
              >
                {isSubmitting ? <Loader2 size={15} className="animate-spin" /> : (authMode === 'login' ? 'Sign In' : 'Sign Up')}
              </button>
            </form>

            {authMode === 'login' && (
              <div className="mt-2.5 relative z-10">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full bg-slate-50 dark:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300 py-3 rounded-xl font-bold text-xs border border-slate-200/80 dark:border-slate-800 transition-all active:scale-95 flex items-center justify-center gap-2 outline-none cursor-pointer"
                >
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.68 1.54 14.98 1 12 1 7.35 1 3.37 3.73 1.52 7.71l3.87 3C6.35 7.79 8.94 5.04 12 5.04z" />
                    <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.71 2.88c2.17-2 3.72-4.94 3.72-8.61z" />
                    <path fill="#FBBC05" d="M5.39 14.29c-.25-.76-.39-1.57-.39-2.41s.14-1.65.39-2.41l-3.87-3C.56 8.08 0 9.97 0 12s.56 3.92 1.52 5.53l3.87-3.24z" />
                    <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.71-2.88c-1.04.7-2.38 1.11-4.25 1.11-3.06 0-5.65-2.75-6.61-5.66l-3.87 3C3.37 20.27 7.35 23 12 23z" />
                  </svg>
                  Sign In with Google
                </button>
              </div>
            )}
            
            <div className="mt-5 flex flex-col items-center gap-2.5 relative z-10 text-center">
              <button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(''); }} className="text-xs font-bold text-slate-500 hover:text-orange-500 transition-colors outline-none cursor-pointer">{authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}</button>
              {authMode === 'login' && <button onClick={handleForgotPassword} className="text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors outline-none cursor-pointer">Forgot password?</button>}
            </div>
          </div>
        </div>
        {renderBackupModals()}
        {renderTransitionOverlay()}
      </div>
    );
  }

  return (
    <div key="workspace-page-root" className="h-screen flex font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-hidden relative">
      {!isMobileDevice && <TargetCursor targetSelector="button, a, input, select, .cursor-target" spinDuration={2} hideDefaultCursor={true} parallaxOn={true} />}
      {!isMobileDevice && <ThemeTassel darkMode={darkMode} setDarkMode={setDarkMode} />}


      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-orange-400/20 dark:bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[120px]" />
      </div>
      
      {/* SIDEBAR */}
      {!isMobileDevice && (
        <aside className={`fixed inset-y-0 left-0 z-[100] lg:relative lg:translate-x-0 ${sidebarCollapsed ? 'w-20 px-3 py-6' : 'w-72 lg:w-64 p-6'} bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-r border-white/50 dark:border-white/10 flex flex-col transition-all duration-300 overflow-y-auto custom-scrollbar shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} mb-8 px-2 relative z-10`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-orange-500/90 backdrop-blur-md rounded-lg flex items-center justify-center text-white shadow-lg border border-white/20 shrink-0"><School size={18} /></div>
              {!sidebarCollapsed && <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">StudyFlow</h1>}
            </div>
            {!sidebarCollapsed && <button onClick={() => setMobileSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-orange-500 outline-none"><X size={20} /></button>}
          </div>
          
          <nav className="flex flex-col gap-1.5 flex-grow mb-6 relative z-10">
            <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setMobileSidebarOpen(false)} />
            <NavItem id="planner" icon={CheckSquare} label="Study Planner" onClick={() => setMobileSidebarOpen(false)} />
            <NavItem id="routine" icon={Calendar} label="Routine" onClick={() => setMobileSidebarOpen(false)} />
            <NavItem id="assessments" icon={FileText} label="C & A" onClick={() => setMobileSidebarOpen(false)} />
            <NavItem id="links" icon={LinkIcon} label="Link Vault" onClick={() => setMobileSidebarOpen(false)} />
            <NavItem id="cgpa" icon={Award} label="CGPA & Payment" onClick={() => setMobileSidebarOpen(false)} />
          </nav>

          {!sidebarCollapsed && <div className="relative z-10"><CreditSection /></div>}
          
          <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-slate-700/50 relative z-10 space-y-2">
             {sidebarCollapsed ? (
               <button 
                 onClick={() => setRamadanMode(!ramadanMode)} 
                 title={`Ramadan Mode: ${ramadanMode ? 'On' : 'Off'}`}
                 className={`w-full flex items-center justify-center p-3 rounded-xl transition-all outline-none cursor-pointer ${ramadanMode ? 'bg-indigo-500/10 text-indigo-500 border border-indigo-500/20' : 'text-slate-500 hover:bg-white/40 dark:hover:bg-slate-800/40'}`}
               >
                 <RamadanLanternIcon size={18} className={ramadanMode ? 'text-indigo-400 animate-pulse' : 'text-slate-400'} />
               </button>
             ) : (
               <button onClick={() => setRamadanMode(!ramadanMode)} className="w-full flex items-center justify-between group outline-none p-2 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl transition-colors cursor-pointer">
                  <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300"><RamadanLanternIcon size={18} className="text-indigo-400" /> Ramadan Mode</div>
                  <div className={`w-9 h-5 rounded-full p-0.5 transition-colors shadow-inner ${ramadanMode ? 'bg-indigo-500/90 backdrop-blur-sm' : 'bg-slate-300/50 dark:bg-slate-700/50'}`}><div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${ramadanMode ? 'translate-x-4' : 'translate-x-0'}`} /></div>
               </button>
             )}
             
             {sidebarCollapsed ? (
               <div className="flex flex-col items-center gap-2 w-full pt-1">
                 <button 
                   onClick={() => { setMobileSidebarOpen(false); fileInputRef.current?.click(); }} 
                   title="Import Backup Data"
                   className="w-full flex items-center justify-center p-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/20 transition-all active:scale-95 outline-none cursor-pointer"
                 >
                   <Upload size={16} />
                 </button>
                 <button 
                   onClick={() => { setMobileSidebarOpen(false); setIsExportConfirmOpen(true); }} 
                   title="Export Backup Data"
                   className="w-full flex items-center justify-center p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 transition-all active:scale-95 outline-none cursor-pointer"
                 >
                   <Download size={16} />
                 </button>
               </div>
             ) : (
               <div className="flex items-center gap-2 w-full pt-1">
                 <button 
                   onClick={() => { setMobileSidebarOpen(false); fileInputRef.current?.click(); }} 
                   className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-bold transition-all active:scale-95 outline-none cursor-pointer"
                 >
                   <Upload size={14} /> Import
                 </button>
                 <button 
                   onClick={() => { setMobileSidebarOpen(false); setIsExportConfirmOpen(true); }} 
                   className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all active:scale-95 outline-none cursor-pointer"
                 >
                   <Download size={14} /> Export
                 </button>
               </div>
             )}
             
             <div className={`pt-4 mt-2 flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} px-2`}>
                <div className="flex items-center gap-2 overflow-hidden" title={sidebarCollapsed ? user?.displayName : undefined}>
                  <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md flex items-center justify-center text-slate-500 border border-white/40 dark:border-white/10 shadow-sm shrink-0"><UserCircle size={16} /></div>
                  {!sidebarCollapsed && <div className="overflow-hidden"><p className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[120px]">{user?.displayName}</p></div>}
                </div>
                {!sidebarCollapsed && <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors outline-none cursor-pointer"><LogOut size={16} /></button>}
             </div>
          </div>
        </aside>
      )}

      {!isMobileDevice && mobileSidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[99] lg:hidden" onClick={() => setMobileSidebarOpen(false)} />}

      <main className="flex-grow overflow-y-auto relative bg-transparent custom-scrollbar z-10 transform-gpu" style={{ WebkitOverflowScrolling: 'touch' }}>
        <header className="sticky top-0 z-50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl px-4 lg:px-6 py-4 flex justify-between items-center border-b border-white/50 dark:border-white/10 shadow-sm transform-gpu">
          <div className="flex items-center gap-2 sm:gap-3">
             {!isMobileDevice && (
               <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors outline-none cursor-pointer"><Menu size={22} /></button>
             )}
             {!isMobileDevice && (
               <button 
                 onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                 className="hidden lg:flex items-center justify-center p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-orange-500 hover:bg-slate-100 dark:hover:bg-slate-800/70 transition-all outline-none cursor-pointer border border-slate-200/50 dark:border-slate-800/80 shadow-2xs -ml-1 mr-1.5"
                 title={sidebarCollapsed ? "Expand Sidebar" : "Minimize Sidebar"}
               >
                 <Menu size={18} className={`transition-transform duration-300 ${sidebarCollapsed ? 'rotate-90 text-orange-500' : ''}`} />
               </button>
             )}
             <h2 className="text-lg font-bold text-slate-800 dark:text-white capitalize">
                 {activeTab === 'assessments' ? 'CT & Assignments' : activeTab === 'cgpa' ? 'CGPA & Payment' : activeTab === 'links' ? 'Link Vault' : activeTab}
               </h2>
               {!isMobileDevice && activeTab === 'dashboard' && (
                 <span className="text-[10px] sm:text-xs font-bold text-slate-500 dark:text-slate-300 select-none px-3 py-1 bg-slate-100/85 dark:bg-slate-800/85 rounded-full border border-slate-200/60 dark:border-slate-800/80 shadow-xs tracking-wider uppercase flex items-center gap-1.5 ml-2">
                   <School size={11} className="text-orange-500 animate-pulse" />
                   <span>{profiles.find(p => p.id === activeProfileId)?.name || 'Profile 1'}</span>
                 </span>
               )}
             </div>
          
          <div className="flex items-center gap-3 lg:gap-4">
            <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 px-3 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl border border-white/60 dark:border-white/10 shadow-sm text-xs font-bold text-slate-500 hover:text-orange-500 hover:border-orange-500/30 transition-all outline-none">
              <Search size={14} />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[9px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded-md border border-slate-300 dark:border-slate-600">Ctrl+K</kbd>
            </button>

            <div className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl border border-white/60 dark:border-white/10 shadow-sm text-xs font-bold text-slate-700 hidden sm:flex items-center gap-2 tabular-nums">
              <Clock size={14} className="text-orange-500" /> <span className="dark:text-slate-300"><LiveClock /></span>
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notificationRef}>
              <button onClick={() => setIsNotificationsOpen(!isNotificationsOpen)} className="relative p-2.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full border border-white/60 dark:border-white/10 shadow-sm transition-all text-slate-600 dark:text-slate-400 hover:text-orange-500 outline-none">
                <Bell size={18} />
                {unreadAnnouncementsCount > 0 && (
                  <span className="absolute top-0 right-0 transform translate-x-1/4 -translate-y-1/4 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border-2 border-white dark:border-slate-900">
                    {unreadAnnouncementsCount}
                  </span>
                )}
              </button>
              
              {isNotificationsOpen && (
                  <div className="absolute right-[-60px] sm:right-0 mt-3 w-[300px] sm:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in zoom-in-95 duration-200">
                    <div className="p-3 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2"><Bell size={14} className="text-orange-500"/> Notifications</span>
                      <button onClick={markAllNoticesRead} className="text-xs font-semibold text-slate-500 hover:text-orange-500 transition-colors">Mark all read</button>
                    </div>
                    <div className="max-h-72 overflow-y-auto custom-scrollbar p-1">
                      {announcements.length === 0 ? (
                        <p className="p-4 text-center text-xs font-medium text-slate-500">No notifications right now.</p>
                      ) : (
                        announcements.slice(0, 5).map(notice => {
                          const isUnread = !readAnnouncements.includes(notice.id);
                          return (
                            <div key={notice.id} onClick={() => markNoticeAsRead(notice.id)} className={`p-3 mx-1 my-1 rounded-xl cursor-pointer transition-colors border ${isUnread ? 'bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-500/30' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                              <div className="flex items-start gap-3">
                                <div className="mt-0.5"><Megaphone size={14} className={isUnread ? 'text-orange-500' : 'text-slate-400'} /></div>
                                <div>
                                  <p className={`text-xs ${isUnread ? 'font-bold text-slate-800 dark:text-slate-200' : 'font-semibold text-slate-600 dark:text-slate-400'}`}>{notice.title}</p>
                                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{notice.message}</p>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                    <div className="p-2 border-t border-slate-200 dark:border-slate-800">
                      <button onClick={() => { setActiveTab('inbox'); setIsNotificationsOpen(false); }} className="w-full text-center text-xs font-bold text-orange-500 hover:text-orange-600 p-1.5 flex items-center justify-center gap-2 outline-none cursor-pointer">
                        <Inbox size={14} /> View All in Inbox
                      </button>
                    </div>
                  </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setIsProfileModalOpen(!isProfileModalOpen)} className="p-2.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full border border-white/60 dark:border-white/10 shadow-sm transition-all text-slate-600 dark:text-slate-400 hover:text-orange-500 outline-none"><UserCircle size={18} /></button>
              {isProfileModalOpen && (
                  <div className="absolute right-0 mt-3 w-[280px] sm:w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in zoom-in-95 duration-200">
                    <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.displayName}</p>
                      <p className="text-xs font-medium text-slate-500 truncate">{user?.email}</p>
                    </div>

                    {/* Academic Profiles Section */}
                    <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between mb-2 px-2">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Academic Profiles</span>
                        <button
                          type="button"
                          onClick={() => setIsAddingProfileInput(!isAddingProfileInput)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-orange-500 hover:text-orange-600 transition-colors cursor-pointer outline-none animate-[pulse_2s_infinite]"
                          title="Add New Profile"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Add Profile Inline Input */}
                      {isAddingProfileInput && (
                        <div className="px-2 mb-3 flex gap-1.5 animate-in slide-in-from-top-1 duration-150">
                          <input
                            type="text"
                            placeholder="e.g. Summer 26"
                            value={newProfileName}
                            onChange={(e) => setNewProfileName(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleCreateProfile();
                            }}
                            className="flex-grow px-2.5 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-orange-500/50 outline-none text-slate-800 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={handleCreateProfile}
                            className="px-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold shadow-sm transition-colors outline-none cursor-pointer"
                          >
                            Add
                          </button>
                        </div>
                      )}

                      {/* Profiles List */}
                      <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar px-1">
                        {profiles.map(p => {
                          const isActive = p.id === activeProfileId;
                          const isEditing = p.id === editingProfileId;
                          return (
                            <div
                              key={p.id}
                              className={`group/item flex items-center justify-between px-2.5 py-2 rounded-xl border transition-all text-xs font-bold ${isActive ? 'bg-orange-50/50 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/20 text-orange-600' : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                            >
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={editingProfileName}
                                  onChange={(e) => setEditingProfileName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleRenameProfile(p.id);
                                    if (e.key === 'Escape') setEditingProfileId(null);
                                  }}
                                  onBlur={() => handleRenameProfile(p.id)}
                                  autoFocus
                                  className="w-full px-2 py-1 bg-white dark:bg-slate-800 border border-orange-500/40 rounded-lg text-xs font-bold outline-none text-slate-800 dark:text-white"
                                />
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => handleProfileClick(p)}
                                    className="flex-grow text-left outline-none font-bold cursor-pointer select-none"
                                    title="Double tap to rename profile, single tap to switch"
                                  >
                                    {p.name}
                                  </button>
                                  
                                  {/* Tiny delete button */}
                                  {profiles.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteProfile(p.id)}
                                      className="opacity-0 group-hover/item:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all outline-none cursor-pointer"
                                      title="Delete Profile"
                                    >
                                      <Trash2 size={12} />
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Dark Mode Theme Toggle for mobile users */}
                    {isMobileDevice && (
                      <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center justify-between p-2.5 mb-1 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-all font-semibold text-sm outline-none">
                         <span className="flex items-center gap-3">{darkMode ? <Sun size={16} className="text-amber-500" /> : <Moon size={16} className="text-slate-400" />} {darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                         <div className={`w-9 h-5 rounded-full p-0.5 transition-colors shadow-inner ${darkMode ? 'bg-orange-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                           <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${darkMode ? 'translate-x-4' : 'translate-x-0'}`} />
                         </div>
                      </button>
                    )}

                    {/* Ramadan Mode for mobile users */}
                    {isMobileDevice && (
                      <button onClick={() => setRamadanMode(!ramadanMode)} className="w-full flex items-center justify-between p-2.5 mb-1 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-all font-semibold text-sm outline-none">
                         <span className="flex items-center gap-3"><MoonStar size={16} className="text-indigo-400" /> Ramadan Mode</span>
                         <div className={`w-9 h-5 rounded-full p-0.5 transition-colors shadow-inner ${ramadanMode ? 'bg-indigo-500' : 'bg-slate-300 dark:bg-slate-700'}`}>
                           <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${ramadanMode ? 'translate-x-4' : 'translate-x-0'}`} />
                         </div>
                      </button>
                    )}

                    {/* Import & Export buttons for mobile users */}
                    {isMobileDevice && (
                      <div className="flex items-center gap-2 w-full p-1 mb-1">
                        <button 
                          onClick={() => { setIsProfileModalOpen(false); fileInputRef.current?.click(); }} 
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-500/20 text-xs font-bold transition-all active:scale-95 outline-none cursor-pointer"
                        >
                          <Upload size={14} /> Import
                        </button>
                        <button 
                          onClick={() => { setIsProfileModalOpen(false); setIsExportConfirmOpen(true); }} 
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold transition-all active:scale-95 outline-none cursor-pointer"
                        >
                          <Download size={14} /> Export
                        </button>
                      </div>
                    )}

                    <button onClick={() => { setIsVaultOpen(true); setIsProfileModalOpen(false); }} className="w-full flex items-center gap-3 p-2.5 mb-1 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-all font-semibold text-sm outline-none"><Vault size={16} className="text-indigo-500" /> Hidden Vault</button>
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-semibold text-sm outline-none border-none">
                      <LogOut size={16} /> Sign Out
                    </button>
                  </div>
              )}
            </div>
          </div>
        </header>

        <div className="px-6 lg:px-8 py-8 max-w-7xl mx-auto space-y-8 pb-32">
          <div key={activeTab} className="animate-in fade-in duration-200 ease-out transform-gpu">
            
            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Welcome Banner */}
                <div className="lg:col-span-12 mb-2">
                  <div className="bg-white/60 dark:bg-slate-900/60 p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-white/10 backdrop-blur-2xl flex flex-col sm:flex-row items-start sm:items-center gap-5 shadow-xl shadow-slate-200/20 dark:shadow-black/20 group">
                      <div className="p-4 bg-white/60 dark:bg-orange-500/20 backdrop-blur-md text-orange-600 dark:text-orange-400 rounded-2xl border border-white/60 dark:border-orange-500/30 shadow-sm shrink-0">
                        <School size={32} />
                      </div>
                      <div className="flex-grow w-full">
                        <SplitText
                          text={`Welcome back, ${user?.displayName?.split(' ')[0] || 'Student'}! 👋`}
                          className="text-xl lg:text-2xl font-extrabold text-slate-800 dark:text-white leading-tight mb-1.5 flex items-center gap-2"
                          delay={50}
                          duration={0.8}
                          ease="power3.out"
                          splitType="chars"
                          from={{ opacity: 0, y: 30 }}
                          to={{ opacity: 1, y: 0 }}
                          threshold={0.1}
                          rootMargin="-50px"
                          textAlign="left"
                          tag="h2"
                        />
                        <div className="text-sm lg:text-base font-semibold text-slate-600 dark:text-slate-400 block sm:inline-flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="mr-0.5 normal-case font-medium">StudyFlow is here to help you by-</span>
                          <RotatingText
                            texts={[
                              'organizing your course schedule.',
                              'planning your daily studies.',
                              'tracking CTs & Assignments.',
                              'managing your academic resources.'
                            ]}
                            mainClassName="px-2 bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 overflow-hidden py-0.5 justify-start rounded-lg inline-flex font-bold"
                            staggerFrom="first"
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "-120%", opacity: 0 }}
                            staggerDuration={0.02}
                            splitLevelClassName="overflow-hidden pb-0.5"
                            transition={{ type: "spring", damping: 30, stiffness: 400 }}
                            rotationInterval={2500}
                          />
                        </div>
                      </div>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                  {/* Daily Inspiration */}
                  <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 backdrop-blur-2xl p-8 text-white shadow-xl border border-white/10 transition-all duration-300">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                    
                    <div className="relative z-10 flex flex-col justify-between h-full">
                      {/* Header row */}
                      <div className="flex items-center justify-between mb-4 border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2 text-orange-400">
                          <Quote size={18} className="drop-shadow-md" />
                          <span className="text-xs font-bold uppercase tracking-wider">Daily Inspiration</span>
                        </div>
                        {quoteRevealed && (
                          <div className="flex items-center gap-1.5">
                            <button onClick={handleCopyQuote} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all outline-none" title="Copy Quote"><Copy size={13} /></button>
                          </div>
                        )}
                      </div>

                      {/* Main Quote Container */}
                      <div className="min-h-[100px] flex flex-col justify-center">
                        {!quoteRevealed ? (
                          <div onClick={handleRevealQuote} className="flex flex-col items-center justify-center text-center cursor-pointer select-none group py-3">
                            <div className="relative mb-3.5 flex items-center justify-center">
                              <div className="absolute inset-0 bg-orange-500/25 rounded-full blur-xl group-hover:scale-125 transition-transform duration-500 animate-pulse" />
                              <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 flex items-center justify-center text-white border border-white/20 relative shadow-lg shadow-orange-500/20 group-hover:rotate-12 transition-all duration-300">
                                <Zap size={24} className="animate-float" />
                              </div>
                            </div>
                            <h4 className="text-base font-extrabold text-slate-200 tracking-tight group-hover:text-orange-400 transition-colors">Today's wisdom is sealed</h4>
                            <p className="text-[11px] font-semibold text-slate-400 mt-1 max-w-[240px] leading-relaxed">Tap here to unlock today's learning inspiration quote</p>
                          </div>
                        ) : (() => {
                          const parts = dailyQuote.split(' — ');
                          const quoteText = parts[0];
                          const authorText = parts[1] || 'Inspiration';
                          return (
                            <div className="flex flex-col gap-3">
                              <SplitText
                                key={dailyQuote}
                                text={`"${quoteText}"`}
                                className="text-xl md:text-2xl font-extrabold leading-relaxed text-slate-100 tracking-tight"
                                delay={25}
                                duration={0.5}
                                ease="power2.out"
                                splitType="words"
                                from={{ opacity: 0, y: 15 }}
                                to={{ opacity: 1, y: 0 }}
                              />
                              <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5 animate-in fade-in duration-700">
                                <p className="text-xs font-bold text-orange-400/90 italic">— {authorText}</p>
                                <span className="text-[9px] font-bold text-emerald-400/90 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1"><ShieldCheck size={10} /> Unlocked</span>
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Today's Classes */}
                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-black/20 hover:shadow-2xl transition-shadow">
                      <h3 className="text-sm font-extrabold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Calendar size={16} className="text-blue-500" /> Today's Classes</h3>
                      <div className="space-y-3">
                        {currentDayClassesList.length > 0 ? currentDayClassesList.map(r => (
                          <div key={r.id} className="flex items-center justify-between p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10 shadow-sm">
                            <div className="min-w-0 pr-2">
                              <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate leading-none mb-1.5">{r.course}</p>
                              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400 leading-none">{r.code} • Room {r.room}</p>
                            </div>
                            <div className="text-right shrink-0 text-xs font-bold text-blue-600 dark:text-blue-400">{ramadanMode && r.ramadanTime ? r.ramadanTime : r.time}</div>
                          </div>
                        )) : <div className="py-6 text-center text-sm font-medium text-slate-500">No classes scheduled for today. Enjoy!</div>}
                      </div>
                    </div>

                    {/* Today's Study Plan (Tasks replaced) */}
                    <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-black/20 hover:shadow-2xl transition-shadow">
                      <h3 className="text-sm font-extrabold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><CheckSquare size={16} className="text-emerald-500" /> Today's Study Plan</h3>
                      <div className="space-y-3">
                        {todaysStudyPlans.filter(p => !p.completed).length > 0 ? todaysStudyPlans.filter(p => !p.completed).slice(0, 4).map(p => (
                          <div key={p.id} className="flex items-start gap-3 p-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/10 shadow-sm">
                            <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${p.priority === 'high' ? 'bg-red-500' : p.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                            <div className="flex-grow">
                               <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-tight">{p.topic}</p>
                               {p.timeSlot && <p className="text-[10px] font-bold text-slate-500 mt-1 flex items-center gap-1"><Clock size={10}/> {p.timeSlot}</p>}
                            </div>
                          </div>
                        )) : <div className="py-6 text-center text-sm font-medium text-slate-500">No study plans for today. Relax or plan ahead!</div>}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Productivity Stats Widget */}
                    {(() => {
                      const totalPlans = studyPlans.length;
                      const completedPlans = studyPlans.filter(p => p.completed).length;
                      const totalCts = cts.length;
                      const completedCts = cts.filter(c => c.completed).length;
                      const totalAssignments = assignments.length;
                      const completedAssignments = assignments.filter(a => a.completed).length;
                      
                      const totalItems = totalPlans + totalCts + totalAssignments;
                      const completedItems = completedPlans + completedCts + completedAssignments;
                      const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
                      
                      const radius = 24;
                      const circumference = 2 * Math.PI * radius;
                      const strokeDashoffset = circumference - (pct / 100) * circumference;
                      
                      return (
                        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-black/20 hover:shadow-2xl transition-shadow flex flex-col justify-between">
                          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white mb-4 flex items-center gap-2">
                            <TrendingUp size={16} className="text-orange-500" />
                            Academic Progress
                          </h3>
                          
                          <div className="flex items-center gap-4 my-2">
                            <div className="relative flex items-center justify-center shrink-0">
                              <svg className="w-16 h-16">
                                <circle className="text-slate-200 dark:text-slate-800" strokeWidth="5" stroke="currentColor" fill="transparent" r={radius} cx="32" cy="32" />
                                <circle className="text-orange-500 transition-all duration-500" strokeWidth="5" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="32" cy="32" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
                              </svg>
                              <span className="absolute text-xs font-extrabold text-slate-800 dark:text-white">{pct}%</span>
                            </div>
                            <div>
                              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">Overall Completion</p>
                              <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1">{completedItems} of {totalItems} tasks completed</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-black/5 dark:border-white/5">
                            <div className="text-center">
                              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{completedPlans}/{totalPlans}</p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">Plans</p>
                            </div>
                            <div className="text-center border-x border-black/5 dark:border-white/5">
                              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{completedCts}/{totalCts}</p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">CTs</p>
                            </div>
                            <div className="text-center">
                              <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">{completedAssignments}/{totalAssignments}</p>
                              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wide mt-0.5">Ass.</p>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Focus Sessions Widget */}
                    {(() => {
                      const minutes = Math.floor(pomoTimeLeft / 60);
                      const seconds = pomoTimeLeft % 60;
                      const pct = ((pomoTotalDuration - pomoTimeLeft) / pomoTotalDuration) * 100;
                      
                      const radius = 32;
                      const circumference = 2 * Math.PI * radius;
                      const strokeDashoffset = circumference - (pct / 100) * circumference;
                      
                      return (
                        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-black/20 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between h-full">
                          <div className="flex items-center justify-between mb-3 border-b border-black/5 dark:border-white/5 pb-3">
                            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                              <Flame size={16} className={pomoActive ? "text-orange-500 animate-pulse" : "text-slate-400"} />
                              Focus Session
                            </h3>
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1 bg-black/5 dark:bg-white/5 p-0.5 rounded-lg border border-black/5 dark:border-white/5">
                                <button onClick={() => changePomoMode('work')} className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all ${pomoMode === 'work' ? 'bg-orange-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>Work</button>
                                <button onClick={() => changePomoMode('break')} className={`px-2 py-1 text-[9px] font-bold rounded-md transition-all ${pomoMode === 'break' ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}>Break</button>
                              </div>
                              <button onClick={() => setIsFocusModalOpen(true)} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg transition-colors outline-none" title="Expand View"><Maximize2 size={14} /></button>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center mt-1">
                            {/* Left Column: Timer Controls */}
                            <div className="space-y-4">
                              {pomoActive ? (
                                <div className="flex flex-col items-center">
                                  <div className="relative flex items-center justify-center shrink-0 mb-3">
                                    <svg className="w-[88px] h-[88px]">
                                      <circle className="text-slate-200 dark:text-slate-800" strokeWidth="5" stroke="currentColor" fill="transparent" r={radius} cx="44" cy="44" />
                                      <circle className={`transition-all duration-100 ${pomoMode === 'work' ? 'text-orange-500' : 'text-teal-500'}`} strokeWidth="5" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="44" cy="44" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
                                    </svg>
                                    <span className="absolute text-base font-extrabold text-slate-800 dark:text-white">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
                                  </div>
                                  <div className="flex gap-2 w-full">
                                    <button onClick={togglePomo} className="flex-1 py-2 text-xs font-bold rounded-xl bg-red-500/90 text-white shadow-md border border-white/20 transition-all active:scale-95 outline-none flex items-center justify-center gap-1.5"><Pause size={12} /> Pause</button>
                                    <button onClick={resetPomo} className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition-all border border-black/5 dark:border-white/5 outline-none"><RotateCcw size={14} /></button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col items-center">
                                  <div className="flex items-center gap-2 bg-slate-100/60 dark:bg-slate-800/60 backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner mb-2.5 w-full justify-between">
                                    <button type="button" onClick={() => { 
                                      const next = Math.max(10, focusDuration - 5); 
                                      setFocusDuration(next); 
                                      setPomoTimeLeft(next * 60); 
                                      setPomoTotalDuration(next * 60);
                                      updateFocusConfig('focusDuration', next);
                                    }} className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors outline-none border-none bg-transparent"><ChevronDown size={18} /></button>
                                    
                                    <div className="text-center select-none">
                                      <span className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">{focusDuration}</span>
                                      <span className="text-[10px] font-bold text-slate-400 block -mt-1 uppercase">mins</span>
                                    </div>
                                    
                                    <button type="button" onClick={() => { 
                                      const next = Math.min(180, focusDuration + 5); 
                                      setFocusDuration(next); 
                                      setPomoTimeLeft(next * 60); 
                                      setPomoTotalDuration(next * 60);
                                      updateFocusConfig('focusDuration', next);
                                    }} className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors outline-none border-none bg-transparent"><ChevronUp size={18} /></button>
                                  </div>
                                  <button onClick={togglePomo} className="w-full py-2.5 text-xs font-bold rounded-xl bg-orange-500/90 text-white shadow-md border border-white/20 transition-all hover:bg-orange-600 active:scale-95 outline-none flex items-center justify-center gap-1.5"><Play size={12} /> Start Session</button>
                                </div>
                              )}
                            </div>
                            
                            {/* Right Column: Growth Preview */}
                            <div>
                              <TreeGrow completedMinutes={completedFocusMinutes} dailyGoal={dailyFocusGoal} />
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
                
                {/* NEW C & A Organizer Widget (Replaces Scratchpad) */}
                <div className="lg:col-span-4 h-full">
                  <div className={`bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 rounded-3xl border transition-all duration-500 h-full flex flex-col ${getNearestDeadlineGlow()}`}>
                      <h3 className="text-sm font-extrabold text-slate-800 dark:text-white mb-4 flex items-center justify-between">
                        <span className="flex items-center gap-2"><FileText size={16} className="text-indigo-500" /> C & A Tracker</span>
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full font-bold text-slate-600 dark:text-slate-300">Upcoming</span>
                      </h3>
                      
                      <div className="flex-grow space-y-3 overflow-y-auto custom-scrollbar pr-1">
                         {(() => {
                           const allPending = [...cts.map(c => ({...c, type: 'CT'})), ...assignments.map(a => ({...a, type: 'Assignment'}))].filter(item => !item.completed);
                           if (allPending.length === 0) {
                             return <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm font-medium opacity-60"><Monitor size={32} className="mb-2"/> All clear! No pending CTs or Assignments.</div>
                           }
                           
                           allPending.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
                           
                           return allPending.slice(0, 5).map(item => {
                              const deadlineDate = new Date(item.deadline);
                              const today = new Date();
                              today.setHours(0,0,0,0);
                              deadlineDate.setHours(0,0,0,0);
                              const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
                              
                              let dateColor = 'text-emerald-600 dark:text-emerald-400';
                              if(diffDays <= 3) dateColor = 'text-orange-500 font-bold';
                              if(diffDays <= 0) dateColor = 'text-red-500 font-bold';

                              return (
                                <div key={item.id} className="p-3.5 bg-white/70 dark:bg-slate-800/70 backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/5 shadow-sm">
                                  <div className="flex justify-between items-start mb-1.5">
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${item.type === 'CT' ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'}`}>
                                      {item.type}
                                    </span>
                                    <span className={`text-xs ${dateColor}`}>
                                      {diffDays === 0 ? 'Today' : diffDays === 1 ? 'Tomorrow' : diffDays < 0 ? 'Overdue' : `${diffDays} days left`}
                                    </span>
                                  </div>
                                  <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 truncate">{item.course}</p>
                                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.topic}</p>
                                </div>
                              );
                           });
                         })()}
                      </div>
                      
                      <button onClick={() => setActiveTab('assessments')} className="mt-4 w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300">View All</button>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'planner' && (
              <div className="max-w-5xl mx-auto space-y-6">
                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-black/20">
                  <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><CheckSquare size={20} className="text-emerald-500" /> Create Study Plan</h3>
                  <form onSubmit={addStudyPlan} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5">
                      <input required type="text" value={newPlan.topic} onChange={(e) => setNewPlan({...newPlan, topic: e.target.value})} placeholder="Subject / Topic to study" className="w-full px-4 py-3.5 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-white/10 text-sm font-semibold focus:ring-2 focus:ring-emerald-500/50 dark:text-white outline-none shadow-inner" />
                    </div>
                    <div className="md:col-span-3">
                      <input required type="date" value={newPlan.date} onChange={(e) => setNewPlan({...newPlan, date: e.target.value})} className="w-full px-4 py-3.5 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-white/10 text-sm font-semibold focus:ring-2 focus:ring-emerald-500/50 dark:text-white outline-none shadow-inner" />
                    </div>
                    <div className="md:col-span-4">
                      <input type="text" value={newPlan.timeSlot} onChange={(e) => setNewPlan({...newPlan, timeSlot: e.target.value})} placeholder="Time Slot (e.g. 8 PM - 10 PM)" className="w-full px-4 py-3.5 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-white/10 text-sm font-semibold focus:ring-2 focus:ring-emerald-500/50 dark:text-white outline-none shadow-inner" />
                    </div>
                    
                    <div className="md:col-span-12 flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
                      <div className="flex bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-1.5 rounded-xl w-full sm:w-auto gap-1 border border-white/40 dark:border-white/5 shadow-sm">
                        {['low', 'medium', 'high'].map(p => {
                          let activeClass = 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200';
                          if (newPlan.priority === p) {
                            if (p === 'low') activeClass = 'bg-blue-500/90 text-white shadow-md scale-105';
                            if (p === 'medium') activeClass = 'bg-orange-500/90 text-white shadow-md scale-105';
                            if (p === 'high') activeClass = 'bg-red-500/90 text-white shadow-md scale-105';
                          }
                          return (
                            <button key={p} type="button" onClick={() => setNewPlan({...newPlan, priority: p})} 
                              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold capitalize transition-all duration-300 outline-none ${activeClass}`}>
                              {p} Priority
                            </button>
                          );
                        })}
                      </div>

                      <button type="submit" className="w-full sm:w-auto bg-emerald-500/90 backdrop-blur-md hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 transition-all active:scale-95 flex items-center justify-center gap-2 outline-none border border-white/20"><Plus size={18} /> Add to Plan</button>
                    </div>
                  </form>
                </div>

                {/* Study Plan List Grouped by Date */}
                <div className="space-y-6">
                  {(() => {
                     if (studyPlans.length === 0) return <div className="p-16 text-center text-slate-500 text-sm font-medium bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-white/50 dark:border-white/10">No study plans created yet. Start planning!</div>;
                     
                     // Group by date
                     const grouped = {};
                     studyPlans.forEach(p => {
                       if (!grouped[p.date]) grouped[p.date] = [];
                       grouped[p.date].push(p);
                     });
                     
                     return Object.keys(grouped).map(dateStr => {
                       const d = new Date(dateStr);
                       const todayStr = new Date().toISOString().split('T')[0];
                       const isToday = dateStr === todayStr;
                       
                       return (
                         <div key={dateStr} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-white/50 dark:border-white/10 overflow-hidden shadow-xl shadow-slate-200/20 dark:shadow-black/20">
                            <div className="px-6 py-4 border-b border-black/5 dark:border-white/10 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                               <span className="font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                                 <Calendar size={16} className={isToday ? "text-emerald-500" : "text-slate-400"}/> 
                                 {isToday ? 'Today' : d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                               </span>
                               <span className="text-xs font-bold bg-white dark:bg-slate-800 px-2.5 py-1 rounded-md shadow-sm border border-slate-200 dark:border-slate-700">{grouped[dateStr].length} tasks</span>
                            </div>
                            <div className="divide-y divide-white/40 dark:divide-white/5">
                              {grouped[dateStr].map(p => (
                                <div key={p.id} className={`group flex items-center gap-4 px-6 py-4 transition-colors hover:bg-white/40 dark:hover:bg-slate-800/40 ${p.completed ? 'opacity-70' : ''}`}>
                                  <button onClick={() => toggleStudyPlan(p)} className="shrink-0 outline-none text-slate-400 dark:text-slate-500 hover:text-emerald-500 transition-colors">
                                    {p.completed ? <CheckCircle2 size={24} className="text-emerald-500" /> : <Circle size={24} />}
                                  </button>
                                  <div className="flex-grow min-w-0">
                                    <p className={`text-sm font-bold truncate transition-all ${p.completed ? 'line-through text-slate-500 dark:text-slate-400' : 'text-slate-800 dark:text-slate-200'}`}>{p.topic}</p>
                                    {p.timeSlot && <p className={`text-xs mt-0.5 font-semibold ${p.completed ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}><Clock size={12} className="inline mr-1 opacity-70 mb-0.5"/>{p.timeSlot}</p>}
                                  </div>
                                  <div className={`w-2.5 h-2.5 rounded-full shrink-0 shadow-sm ${p.priority === 'high' ? 'bg-red-500' : p.priority === 'medium' ? 'bg-orange-500' : 'bg-blue-500'}`} />
                                  <button onClick={() => setEditingStudyPlan(p)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-blue-500 transition-all outline-none" title="Edit Goal"><Edit2 size={18} /></button>
                                  <button onClick={() => deleteStudyPlan(p.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all outline-none" title="Delete Goal"><Trash2 size={18} /></button>
                                </div>
                              ))}
                            </div>
                         </div>
                       );
                     });
                  })()}
                </div>
              </div>
            )}

            {activeTab === 'assessments' && (
              <div className="space-y-6">
                {/* Header for C&A */}
                <div className="flex justify-between items-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-black/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-purple-500 to-blue-500"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">CT & Assignment Organizer</h3>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Track all your upcoming assessments in one place</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Left Column: Class Tests */}
                  <div className="space-y-6">
                     <div className="flex items-center gap-3 border-b border-slate-300 dark:border-slate-700 pb-3">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl"><AlertCircle size={20}/></div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Class Tests (CT)</h3>
                     </div>
                     
                     <form onSubmit={addCt} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-5 rounded-2xl border border-white/50 dark:border-white/10 shadow-sm space-y-3">
                        <input required type="text" placeholder="Course Name/Code" value={newCt.course} onChange={e=>setNewCt({...newCt, course: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-white/10 text-sm font-semibold focus:ring-2 focus:ring-purple-500/50 outline-none" />
                        <input required type="text" placeholder="Topic / Syllabus" value={newCt.topic} onChange={e=>setNewCt({...newCt, topic: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-white/10 text-sm font-semibold focus:ring-2 focus:ring-purple-500/50 outline-none" />
                        <div className="flex gap-3">
                           <input required type="date" value={newCt.deadline} onChange={e=>setNewCt({...newCt, deadline: e.target.value})} className="flex-grow px-4 py-2.5 rounded-xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-white/10 text-sm font-semibold outline-none" />
                           <button type="submit" className="bg-purple-500 hover:bg-purple-600 text-white px-5 rounded-xl font-bold shadow-md shadow-purple-500/30 transition-colors"><Plus size={18}/></button>
                        </div>
                     </form>

                     <div className="space-y-3">
                        {cts.sort((a,b) => new Date(a.deadline) - new Date(b.deadline)).map(ct => (
                          <div key={ct.id} className={`group bg-white/60 dark:bg-slate-900/60 p-4 rounded-2xl border transition-all shadow-sm flex gap-4 ${ct.completed ? 'opacity-60 border-white/30 dark:border-white/5' : 'border-purple-200 dark:border-purple-800/30 hover:border-purple-400 dark:hover:border-purple-500/50'}`}>
                             <button onClick={() => toggleCt(ct)} className="shrink-0 outline-none mt-1 text-slate-400 hover:text-purple-500 transition-colors">
                                {ct.completed ? <CheckCircle2 size={20} className="text-purple-500" /> : <Circle size={20} />}
                             </button>
                             <div className="flex-grow min-w-0">
                                <p className={`text-sm font-bold truncate ${ct.completed ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>{ct.course}</p>
                                <p className="text-xs font-semibold text-slate-500 truncate mt-0.5">{ct.topic}</p>
                                <p className={`text-[11px] font-bold mt-2 flex items-center gap-1 ${ct.completed ? 'text-slate-400' : 'text-purple-600 dark:text-purple-400'}`}><Calendar size={12}/> {new Date(ct.deadline).toLocaleDateString('en-US', {day:'numeric', month:'short', year:'numeric'})}</p>
                             </div>
                             <div className="opacity-0 group-hover:opacity-100 flex gap-1 self-start">
                               <button onClick={() => setEditingCt(ct)} className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors outline-none" title="Edit CT"><Edit2 size={16} /></button>
                               <button onClick={() => deleteCt(ct.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors outline-none" title="Delete CT"><Trash2 size={16} /></button>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>

                  {/* Right Column: Assignments */}
                  <div className="space-y-6">
                     <div className="flex items-center gap-3 border-b border-slate-300 dark:border-slate-700 pb-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl"><FileText size={20}/></div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Assignments</h3>
                     </div>
                     
                     <form onSubmit={addAssignment} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-5 rounded-2xl border border-white/50 dark:border-white/10 shadow-sm space-y-3">
                        <input required type="text" placeholder="Course Name/Code" value={newAssignment.course} onChange={e=>setNewAssignment({...newAssignment, course: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-white/10 text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 outline-none" />
                        <input required type="text" placeholder="Assignment Title / Info" value={newAssignment.topic} onChange={e=>setNewAssignment({...newAssignment, topic: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-white/10 text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 outline-none" />
                        <div className="flex gap-3">
                           <input required type="date" value={newAssignment.deadline} onChange={e=>setNewAssignment({...newAssignment, deadline: e.target.value})} className="flex-grow px-4 py-2.5 rounded-xl bg-white/60 dark:bg-slate-800/50 backdrop-blur-md border border-white/60 dark:border-white/10 text-sm font-semibold outline-none" />
                           <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-5 rounded-xl font-bold shadow-md shadow-blue-500/30 transition-colors"><Plus size={18}/></button>
                        </div>
                     </form>

                     <div className="space-y-3">
                        {assignments.sort((a,b) => new Date(a.deadline) - new Date(b.deadline)).map(ass => (
                          <div key={ass.id} className={`group bg-white/60 dark:bg-slate-900/60 p-4 rounded-2xl border transition-all shadow-sm flex gap-4 ${ass.completed ? 'opacity-60 border-white/30 dark:border-white/5' : 'border-blue-200 dark:border-blue-800/30 hover:border-blue-400 dark:hover:border-blue-500/50'}`}>
                             <button onClick={() => toggleAssignment(ass)} className="shrink-0 outline-none mt-1 text-slate-400 hover:text-blue-500 transition-colors">
                                {ass.completed ? <CheckCircle2 size={20} className="text-blue-500" /> : <Circle size={20} />}
                             </button>
                             <div className="flex-grow min-w-0">
                                <p className={`text-sm font-bold truncate ${ass.completed ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-200'}`}>{ass.course}</p>
                                <p className="text-xs font-semibold text-slate-500 truncate mt-0.5">{ass.topic}</p>
                                <p className={`text-[11px] font-bold mt-2 flex items-center gap-1 ${ass.completed ? 'text-slate-400' : 'text-blue-600 dark:text-blue-400'}`}><Calendar size={12}/> Due: {new Date(ass.deadline).toLocaleDateString('en-US', {day:'numeric', month:'short', year:'numeric'})}</p>
                             </div>
                             <div className="opacity-0 group-hover:opacity-100 flex gap-1 self-start">
                               <button onClick={() => setEditingAssignment(ass)} className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors outline-none" title="Edit Assignment"><Edit2 size={16} /></button>
                               <button onClick={() => deleteAssignment(ass.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors outline-none" title="Delete Assignment"><Trash2 size={16} /></button>
                             </div>
                          </div>
                        ))}
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* Routine and Link Vault Tabs */}
            {activeTab === 'routine' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-black/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500/80"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Weekly Schedule</h3>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Manage your classes across the week</p>
                  </div>
                  <div className="relative z-10 flex flex-wrap gap-2.5">
                    <button 
                      type="button"
                      onClick={() => setIsCalendarViewOpen(true)}
                      className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 p-2.5 rounded-xl font-bold text-sm flex items-center justify-center border border-black/5 dark:border-white/5 transition-colors shadow-sm active:scale-95 cursor-pointer"
                      title="Open Calendar Grid View"
                    >
                      <Calendar size={18} />
                    </button>
                    <label className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border border-black/5 dark:border-white/5 transition-colors cursor-pointer shadow-sm active:scale-95">
                      <Inbox size={18} /> Import Calendar (.ics)
                      <input 
                        type="file" 
                        accept=".ics" 
                        onChange={handleImportCalendar} 
                        className="hidden" 
                      />
                    </label>
                    <button onClick={() => { setIsAddingRoutine(true); setEditingRoutine(null); }} className="bg-blue-500/90 backdrop-blur-md text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors outline-none border border-white/20 active:scale-95"><Plus size={18} /> Add Class</button>
                  </div>
                </div>

                {isAddingRoutine && (
                  <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-6 md:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl max-w-4xl mx-auto animate-in zoom-in-95 relative z-[60]">
                    <button onClick={() => setIsAddingRoutine(false)} className="absolute top-6 right-6 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors outline-none"><X size={20} /></button>
                    <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-6">New Class Detail</h3>
                    <form onSubmit={addRoutine} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <input required placeholder="Course Name" value={newRoutine.course} onChange={e => setNewRoutine({...newRoutine, course: e.target.value})} className="p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl text-sm font-semibold border border-white/60 dark:border-white/10 shadow-sm focus:border-blue-500 outline-none dark:text-white" />
                      <input placeholder="Course Code" value={newRoutine.code} onChange={e => setNewRoutine({...newRoutine, code: e.target.value})} className="p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl text-sm font-semibold border border-white/60 dark:border-white/10 shadow-sm focus:border-blue-500 outline-none dark:text-white" />
                      <input placeholder="Faculty Initial" value={newRoutine.faculty} onChange={e => setNewRoutine({...newRoutine, faculty: e.target.value})} className="p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl text-sm font-semibold border border-white/60 dark:border-white/10 shadow-sm focus:border-blue-500 outline-none dark:text-white" />
                      <GlassSelect value={newRoutine.day} onChange={val => setNewRoutine({...newRoutine, day: val})} options={DAYS.map(d => ({value: d, label: d}))} />
                      <input placeholder="Time (e.g., 10:00 AM)" value={newRoutine.time} onChange={e => setNewRoutine({...newRoutine, time: e.target.value})} className="p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl text-sm font-semibold border border-white/60 dark:border-white/10 shadow-sm focus:border-blue-500 outline-none dark:text-white" />
                      <input placeholder="Ramadan Time" value={newRoutine.ramadanTime} onChange={e => setNewRoutine({...newRoutine, ramadanTime: e.target.value})} className="p-3.5 bg-indigo-50/50 dark:bg-indigo-900/30 backdrop-blur-md rounded-xl text-sm font-semibold border border-indigo-200/50 dark:border-indigo-800/30 shadow-sm focus:border-indigo-500 outline-none dark:text-white" />
                      <input placeholder="Room Number" value={newRoutine.room} onChange={e => setNewRoutine({...newRoutine, room: e.target.value})} className="p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl text-sm font-semibold border border-white/60 dark:border-white/10 shadow-sm focus:border-blue-500 outline-none dark:text-white" />
                      <div className="lg:col-span-4 flex justify-end mt-2">
                        <button type="submit" className="bg-blue-500/90 backdrop-blur-md hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 border border-white/20 transition-colors outline-none active:scale-95">Save Class</button>
                      </div>
                    </form>
                  </div>
                )}

                {editingRoutine && (
                  <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-6 md:p-8 rounded-3xl border border-blue-500/30 shadow-2xl max-w-4xl mx-auto animate-in zoom-in-95 relative z-[60]">
                    <button onClick={() => setEditingRoutine(null)} className="absolute top-6 right-6 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors outline-none"><X size={20} /></button>
                    <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-6">Edit Class Detail</h3>
                    <form onSubmit={editRoutineHandler} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <input required placeholder="Course Name" value={editingRoutine.course} onChange={e => setEditingRoutine({...editingRoutine, course: e.target.value})} className="p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl text-sm font-semibold border border-white/60 dark:border-white/10 shadow-sm focus:border-blue-500 outline-none dark:text-white" />
                      <input placeholder="Course Code" value={editingRoutine.code || ''} onChange={e => setEditingRoutine({...editingRoutine, code: e.target.value})} className="p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl text-sm font-semibold border border-white/60 dark:border-white/10 shadow-sm focus:border-blue-500 outline-none dark:text-white" />
                      <input placeholder="Faculty Initial" value={editingRoutine.faculty || ''} onChange={e => setEditingRoutine({...editingRoutine, faculty: e.target.value})} className="p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl text-sm font-semibold border border-white/60 dark:border-white/10 shadow-sm focus:border-blue-500 outline-none dark:text-white" />
                      <GlassSelect value={editingRoutine.day} onChange={val => setEditingRoutine({...editingRoutine, day: val})} options={DAYS.map(d => ({value: d, label: d}))} />
                      <input placeholder="Time (e.g., 10:00 AM)" value={editingRoutine.time || ''} onChange={e => setEditingRoutine({...editingRoutine, time: e.target.value})} className="p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl text-sm font-semibold border border-white/60 dark:border-white/10 shadow-sm focus:border-blue-500 outline-none dark:text-white" />
                      <input placeholder="Ramadan Time" value={editingRoutine.ramadanTime || ''} onChange={e => setEditingRoutine({...editingRoutine, ramadanTime: e.target.value})} className="p-3.5 bg-indigo-50/50 dark:bg-indigo-900/30 backdrop-blur-md rounded-xl text-sm font-semibold border border-indigo-200/50 dark:border-indigo-800/30 shadow-sm focus:border-indigo-500 outline-none dark:text-white" />
                      <input placeholder="Room Number" value={editingRoutine.room || ''} onChange={e => setEditingRoutine({...editingRoutine, room: e.target.value})} className="p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl text-sm font-semibold border border-white/60 dark:border-white/10 shadow-sm focus:border-blue-500 outline-none dark:text-white" />
                      <div className="lg:col-span-4 flex justify-end gap-3 mt-2">
                        <button type="button" onClick={() => setEditingRoutine(null)} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-sm transition-colors border border-black/5 dark:border-white/5 outline-none cursor-pointer">Cancel</button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/30 border border-white/20 transition-colors outline-none active:scale-95 cursor-pointer">Save Changes</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {DAYS.map(day => { 
                    const classes = routine
                      .filter(r => r.day === day)
                      .sort((a, b) => {
                        const timeA = parseTimeToMinutes(ramadanMode && a.ramadanTime ? a.ramadanTime : a.time);
                        const timeB = parseTimeToMinutes(ramadanMode && b.ramadanTime ? b.ramadanTime : b.time);
                        return timeA - timeB;
                      }); 
                    const style = DAY_STYLES[day]; 
                    return (
                      <div key={day} className={`rounded-3xl border overflow-hidden shadow-xl shadow-slate-200/20 dark:shadow-black/20 transition-all duration-200 hover:shadow-2xl ${style.bg} ${style.border}`}>
                        <div className="px-5 py-4 border-b border-black/5 dark:border-white/10 flex items-center justify-between relative bg-white/20 dark:bg-black/10">
                          <span className={`text-sm font-extrabold ${style.accent}`}>{day}</span>
                          <span className="text-xs font-bold text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md px-2.5 py-1 rounded-md shadow-sm border border-white/40 dark:border-white/10">{classes.length}</span>
                        </div>
                        <div className="p-4 space-y-3 min-h-[120px]">
                          {classes.length === 0 ? (
                             <p className="text-xs font-medium text-center text-slate-500 dark:text-slate-400 py-6">Free day!</p>
                          ) : (
                            classes.map(c => (
                              <div key={c.id} className="group p-4 rounded-2xl relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-sm transition-all hover:border-white/80 dark:hover:border-white/20 hover:-translate-y-0.5">
                                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mb-1.5 truncate">{c.course}</p>
                                <div className="flex flex-col gap-1 text-xs font-semibold text-slate-600 dark:text-slate-400">
                                  <span className={`flex items-center gap-1.5 font-bold ${style.accent}`}><Clock size={12} /> {ramadanMode && c.ramadanTime ? c.ramadanTime : c.time}</span>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <span className="flex items-center gap-1"><MapPin size={12} /> Room {c.room}</span>
                                    {c.faculty && <span>• {c.faculty}</span>}
                                  </div>
                                </div>
                                <button onClick={() => { setEditingRoutine(c); setIsAddingRoutine(false); }} className="absolute top-3 right-11 opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-blue-500 transition-all outline-none bg-white/80 dark:bg-slate-700/80 backdrop-blur-md rounded-md border border-white/50 dark:border-white/10 shadow-sm"><Edit2 size={14} /></button>
                                <button onClick={() => deleteRoutine(c.id)} className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 transition-all outline-none bg-white/80 dark:bg-slate-700/80 backdrop-blur-md rounded-md border border-white/50 dark:border-white/10 shadow-sm"><Trash2 size={14} /></button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ); 
                  })}
                </div>
              </div>
            )}

            {activeTab === 'links' && (
               <div className="space-y-6">
                  <div className="flex justify-between items-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-black/20 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500/80"></div>
                    <div className="relative z-10">
                      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Link Vault</h3>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Organize your important academic URLs</p>
                    </div>
                    <button onClick={() => setIsAddingLink(true)} className="relative z-10 bg-emerald-500/90 backdrop-blur-md text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors active:scale-95 outline-none border border-white/20"><Plus size={18} /> Add Link</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {CATEGORY_ORDER.map(k => { 
                      const cat = CATEGORIES[k.toUpperCase()]; 
                      const list = links.filter(l => l.category === k).sort((a, b) => {
                        if (a.starred && b.starred) return (a.starredAt || 0) - (b.starredAt || 0);
                        if (a.starred) return -1;
                        if (b.starred) return 1;
                        return 0; 
                      });

                      return (
                        <div key={k} className={`bg-white/80 dark:bg-slate-900/90 ${isMobileDevice ? 'backdrop-blur-2xl' : ''} rounded-3xl border border-white/50 dark:border-white/10 overflow-hidden flex flex-col h-[380px] shadow-xl shadow-slate-200/20 dark:shadow-black/20 hover:shadow-2xl transition-all duration-200`}>
                          <div className={`px-5 py-4 flex items-center justify-between border-b border-white/40 dark:border-white/10 ${isMobileDevice ? 'backdrop-blur-md' : ''} ${cat.bg}`}>
                            <div className="flex items-center gap-3">
                              <cat.icon className={cat.color} size={18} />
                              <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">{cat.label}</h4>
                            </div>
                            <div className="flex items-center gap-2">
                              {k === 'materials' && (
                                <>
                                  <button onClick={() => sendOtpForMaterialDelete()} className="p-1 hover:bg-red-500/10 text-slate-400 hover:text-red-500 rounded-lg transition-colors outline-none cursor-pointer" title="Delete All Materials"><Trash2 size={14} /></button>
                                  <button onClick={() => setIsMaterialsModalOpen(true)} className="p-1 hover:bg-blue-500/10 text-slate-400 hover:text-blue-500 rounded-lg transition-colors outline-none cursor-pointer" title="Expand Materials"><Maximize2 size={14} /></button>
                                </>
                              )}
                              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-md shadow-sm border border-white/40 dark:border-white/5">{list.length}</span>
                            </div>
                          </div>
                          <div className="p-3 space-y-2 overflow-y-auto flex-grow custom-scrollbar transform-gpu" style={{ contentVisibility: 'auto' }}>
                            {list.length === 0 ? (
                               <div className="h-full flex items-center justify-center text-xs font-medium text-slate-500">No links here yet.</div>
                            ) : (
                              list.map(l => {
                                const branding = getLinkBranding(l.url);
                                const BrandIcon = branding.icon;
                                return (
                                  <div key={l.id} className={`transform-gpu group flex items-center justify-between p-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md ${l.starred ? `${branding.starBorder} ${branding.starBg}` : 'border-white/40 dark:border-white/5 bg-white/40 dark:bg-slate-800/40 hover:bg-white/70 dark:hover:bg-slate-700/60'}`}>
                                    <div className="flex items-center gap-3 overflow-hidden outline-none flex-grow pr-2">
                                      <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleStarLink(l); }} className={`shrink-0 p-1.5 rounded-lg transition-all outline-none ${l.starred ? `${branding.starText} ${branding.starBg} border ${branding.starBorder}` : 'text-slate-300 dark:text-slate-600 hover:text-amber-400 group-hover:text-amber-400/70 hover:bg-white/60 dark:hover:bg-slate-700/60'}`}>
                                        <Star size={16} className={l.starred ? `fill-current ${branding.color}` : ""} />
                                      </button>
                                      <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 overflow-hidden outline-none flex-grow">
                                        <div className={`p-2 rounded-lg transition-colors shrink-0 shadow-sm border ${l.starred ? `${branding.starBg} ${branding.color} ${branding.starBorder}` : `bg-white/60 dark:bg-slate-800/60 text-slate-500 ${branding.hoverText} group-hover:bg-slate-100 dark:group-hover:bg-slate-700`}`}>
                                          <BrandIcon size={14} />
                                        </div>
                                        <div className="overflow-hidden">
                                          <p className={`font-bold text-sm truncate ${l.starred ? branding.starText : 'text-slate-800 dark:text-slate-200'}`}>{l.title}</p>
                                          <p className={`text-xs font-medium truncate mt-0.5 ${l.starred ? `${branding.starText} opacity-70` : 'text-slate-500 dark:text-slate-400'}`}>{l.url.replace(/^https?:\/\//, '')}</p>
                                          {l.category === 'materials' && l.materialTypes && l.materialTypes.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-1">
                                              {l.materialTypes.map(type => (
                                                <span key={type} className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[9px] font-bold text-slate-500 dark:text-slate-400 capitalize">{type}</span>
                                              ))}
                                            </div>
                                          )}
                                        </div>
                                      </a>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 flex gap-1 shrink-0">
                                      <button onClick={() => setEditingLink(l)} className="p-1.5 text-slate-400 hover:text-blue-500 transition-all outline-none" title="Edit Link"><Edit2 size={14} /></button>
                                      <button onClick={() => deleteLink(l.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-all outline-none" title="Delete Link"><Trash2 size={14} /></button>
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      ); 
                    })}
                  </div>
               </div>
            )}

            {activeTab === 'cgpa' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
                {/* 2-in-1 Sub-navigation Switcher */}
                <div className="flex bg-white/40 dark:bg-slate-900/40 p-1.5 rounded-2xl border border-white/50 dark:border-white/10 shadow-md max-w-sm mx-auto">
                  <button 
                    onClick={() => setCgpaTab('cgpa')}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all outline-none border-none flex items-center justify-center gap-2 ${
                      cgpaTab === 'cgpa' 
                        ? 'bg-orange-500 text-white shadow-md' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <Award size={14} /> CGPA Tracker
                  </button>
                  <button 
                    onClick={() => setCgpaTab('payment')}
                    className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition-all outline-none border-none flex items-center justify-center gap-2 ${
                      cgpaTab === 'payment' 
                        ? 'bg-orange-500 text-white shadow-md' 
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                    }`}
                  >
                    <CreditCard size={14} /> Payment Calc
                  </button>
                </div>

                {cgpaTab === 'cgpa' ? (
                  <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl space-y-6 animate-in fade-in duration-200">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">CGPA Calculator</h3>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Enter your previous records and current trimester courses to forecast your updated CGPA.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Previous CGPA</label>
                        <input 
                          type="number" 
                          step="0.01"
                          min="0"
                          max="4"
                          value={cgpaPrevCgpa} 
                          onChange={e => saveCgpaMeta(e.target.value, cgpaPrevCredit)}
                          placeholder="e.g. 3.50"
                          className="w-full px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-orange-500/50 outline-none text-slate-800 dark:text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Completed Credits</label>
                        <input 
                          type="number" 
                          min="0"
                          value={cgpaPrevCredit} 
                          onChange={e => saveCgpaMeta(cgpaPrevCgpa, e.target.value)}
                          placeholder="e.g. 60"
                          className="w-full px-4 py-2.5 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-orange-500/50 outline-none text-slate-800 dark:text-white"
                        />
                      </div>
                    </div>

                    <div className="divider border-b border-black/5 dark:border-white/10 my-2"></div>

                    <div className="space-y-4">
                      <label className="text-xs font-extrabold text-slate-600 dark:text-slate-300 block">Current Trimester Courses</label>
                      
                      <div className="space-y-3">
                        <div className="grid grid-cols-12 gap-3 text-[10px] font-extrabold text-slate-400 uppercase px-2 hidden sm:grid">
                          <div className="col-span-6">Subject Name</div>
                          <div className="col-span-3 text-center">Credit Hours (Cr)</div>
                          <div className="col-span-2 text-center">GPA</div>
                          <div className="col-span-1"></div>
                        </div>

                        {cgpaCourses.map((c, index) => (
                          <div key={c.id} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center p-3 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-white/50 dark:border-white/5 shadow-sm">
                            <div className="col-span-12 sm:col-span-6">
                              <input 
                                type="text" 
                                placeholder="Subject Name" 
                                value={c.name} 
                                onChange={e => {
                                  const list = [...cgpaCourses];
                                  list[index].name = e.target.value;
                                  setCgpaCourses(list);
                                }}
                                className="w-full px-3.5 py-2 bg-white/50 dark:bg-slate-800/50 rounded-xl text-xs font-semibold border border-white/60 dark:border-white/10 outline-none focus:border-orange-500 text-slate-800 dark:text-white" 
                              />
                            </div>
                            <div className="col-span-6 sm:col-span-3">
                              <input 
                                type="number" 
                                placeholder="Cr" 
                                value={c.credit} 
                                onChange={e => {
                                  const list = [...cgpaCourses];
                                  list[index].credit = e.target.value;
                                  setCgpaCourses(list);
                                }}
                                className="w-full px-3.5 py-2 bg-white/50 dark:bg-slate-800/50 rounded-xl text-xs font-semibold border border-white/60 dark:border-white/10 outline-none focus:border-orange-500 text-slate-800 dark:text-white text-center" 
                              />
                            </div>
                            <div className="col-span-5 sm:col-span-2">
                              <input 
                                type="number" 
                                step="0.01"
                                placeholder="GPA" 
                                value={c.gpa} 
                                onChange={e => {
                                  const list = [...cgpaCourses];
                                  list[index].gpa = e.target.value;
                                  setCgpaCourses(list);
                                }}
                                className="w-full px-3.5 py-2 bg-white/50 dark:bg-slate-800/50 rounded-xl text-xs font-semibold border border-white/60 dark:border-white/10 outline-none focus:border-orange-500 text-slate-800 dark:text-white text-center" 
                              />
                            </div>
                            <div className="col-span-1 flex justify-end">
                              <button 
                                type="button"
                                onClick={() => {
                                  setCgpaCourses(cgpaCourses.filter(item => item.id !== c.id));
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg outline-none transition-all border-none cursor-pointer"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-3 pt-2">
                        <button 
                          type="button" 
                          onClick={() => {
                            const nextId = cgpaCourses.length > 0 ? Math.max(...cgpaCourses.map(i => i.id)) + 1 : 1;
                            setCgpaCourses([...cgpaCourses, { id: nextId, name: '', credit: '', gpa: '' }]);
                          }} 
                          className="px-4 py-2 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 outline-none shadow-sm cursor-pointer"
                        >
                          <Plus size={14} /> Add Course
                        </button>

                        <button 
                          type="button" 
                          onClick={handleCalculateCgpa} 
                          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-md shadow-orange-500/20 active:scale-95 transition-all outline-none border border-white/20 cursor-pointer"
                        >
                          Calculate Result
                        </button>
                      </div>
                    </div>

                    {/* Calculated Result Output */}
                    {cgpaResultSummary && (
                      <div className="p-6 rounded-2xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 space-y-4 animate-in slide-in-from-bottom-5 duration-200">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-widest">Result Summary Breakdown</h4>
                          <button 
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(cgpaResultSummary.textReport);
                              showToast("Summary report copied! 📋", "success");
                            }}
                            className="px-3 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 outline-none border border-orange-500/10 cursor-pointer"
                          >
                            <Copy size={12} /> Copy Report
                          </button>
                        </div>

                        <pre className="font-mono text-[11px] leading-relaxed text-slate-700 dark:text-slate-300 bg-black/5 dark:bg-black/20 p-4 rounded-2xl overflow-x-auto max-h-[220px] custom-scrollbar border border-black/5 dark:border-white/5 whitespace-pre-wrap">
                          {cgpaResultSummary.textReport}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Payment Calculator Section */
                  <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl space-y-6 animate-in fade-in duration-200">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-1">UIU Trimester Payment Calculator</h3>
                      <p className="text-xs font-semibold text-slate-500">Calculate tuition waiver adjustments and installment schedules</p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Total Trimester Billing Amount (Tuition + Registration)</label>
                        <input 
                          type="number" 
                          min="0"
                          value={paymentAmount} 
                          onChange={e => setPaymentAmount(e.target.value)}
                          placeholder="Enter billing amount (e.g. 71500)"
                          className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-orange-500/50 outline-none text-slate-800 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Select Tuition Waiver</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { label: 'None', value: 1.0 },
                            { label: '25%', value: 0.75 },
                            { label: '50%', value: 0.50 },
                            { label: '100%', value: 0.0 }
                          ].map(w => (
                            <button
                              key={w.label}
                              onClick={() => setPaymentWaiver(w.value)}
                              className={`py-2.5 rounded-xl text-xs font-extrabold transition-all border outline-none cursor-pointer ${
                                paymentWaiver === w.value
                                  ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20'
                                  : 'bg-white/40 dark:bg-slate-800/40 border-white/60 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-800'
                              }`}
                            >
                              {w.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {paymentAmount && parseFloat(paymentAmount) >= 6500 ? (() => {
                      const totalInput = parseFloat(paymentAmount) || 0;
                      const regFee = 6500;
                      const tuitionFee = Math.max(0, totalInput - regFee);
                      const payableTuition = tuitionFee * paymentWaiver;
                      const waiverAmount = tuitionFee - payableTuition;
                      const netPayable = payableTuition + regFee;
                      
                      const first = netPayable * 0.40;
                      const second = netPayable * 0.30;
                      const third = netPayable * 0.30;

                      return (
                        <div className="p-6 rounded-2xl bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/20 space-y-4 animate-in slide-in-from-bottom-5 duration-200">
                          <h4 className="text-xs font-extrabold text-orange-600 dark:text-orange-400 uppercase tracking-widest">Payment Breakdown</h4>
                          <div className="divide-y divide-black/5 dark:divide-white/10 text-xs font-semibold text-slate-700 dark:text-slate-300 space-y-2">
                            <div className="flex justify-between items-center py-2">
                              <span>Registration Fee (Fixed, No Waiver)</span>
                              <span className="font-extrabold text-slate-900 dark:text-white">6,500/-</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                              <span>Tuition Fee</span>
                              <span className="font-extrabold text-slate-900 dark:text-white">{tuitionFee.toLocaleString()}/-</span>
                            </div>
                            {waiverAmount > 0 && (
                              <div className="flex justify-between items-center py-2 text-green-600 dark:text-green-400">
                                <span>Waiver Discount ({Math.round((1 - paymentWaiver) * 100)}%)</span>
                                <span className="font-extrabold">-{waiverAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}/-</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center py-3 text-sm text-slate-900 dark:text-white font-extrabold">
                              <span>NET PAYABLE AMOUNT</span>
                              <span className="text-orange-500">{netPayable.toLocaleString(undefined, {maximumFractionDigits: 0})}/-</span>
                            </div>
                          </div>

                          <div className="pt-4 border-t border-dashed border-orange-500/20">
                            <h5 className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">Installment Schedules</h5>
                            <div className="grid grid-cols-3 gap-3">
                              <div className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-white/50 dark:border-white/5">
                                <p className="text-[9px] font-extrabold text-slate-400 uppercase">1st (40%)</p>
                                <p className="text-sm font-black text-slate-800 dark:text-white mt-1">{first.toLocaleString(undefined, {maximumFractionDigits: 0})}/-</p>
                              </div>
                              <div className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-white/50 dark:border-white/5">
                                <p className="text-[9px] font-extrabold text-slate-400 uppercase">2nd (30%)</p>
                                <p className="text-sm font-black text-slate-800 dark:text-white mt-1">{second.toLocaleString(undefined, {maximumFractionDigits: 0})}/-</p>
                              </div>
                              <div className="p-3 bg-white/40 dark:bg-slate-800/40 rounded-xl border border-white/50 dark:border-white/5">
                                <p className="text-[9px] font-extrabold text-slate-400 uppercase">3rd (30%)</p>
                                <p className="text-sm font-black text-slate-800 dark:text-white mt-1">{third.toLocaleString(undefined, {maximumFractionDigits: 0})}/-</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })() : paymentAmount ? (
                      <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs font-semibold text-red-500 text-center">
                        Total billing amount cannot be less than Registration Fee (6,500/-)
                      </div>
                    ) : (
                      <div className="p-8 rounded-2xl bg-slate-100/50 dark:bg-slate-800/30 border border-dashed border-slate-300 dark:border-slate-800 text-xs font-bold text-slate-400 text-center">
                        Enter total trimester fee to display breakdown
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'inbox' && (
              <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex justify-between items-center bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-6 md:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-xl shadow-slate-200/20 dark:shadow-black/20 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500/80"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Notice Board & Inbox</h3>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Important updates and system alerts</p>
                  </div>
                </div>

                {user.email === ADMIN_EMAIL && (
                  <div className="bg-orange-50/50 dark:bg-orange-900/20 backdrop-blur-2xl p-6 rounded-3xl border border-orange-200/50 dark:border-orange-500/30 shadow-lg relative">
                    <h3 className="text-base font-extrabold text-slate-800 dark:text-white mb-4 flex items-center gap-2"><Send size={18} className="text-orange-500"/> Admin Broadcast Panel</h3>
                    <form onSubmit={sendGlobalNotice} className="space-y-3">
                      <input required type="text" placeholder="Notice Title (e.g., Eid Holidays)" value={newNotice.title} onChange={e=>setNewNotice({...newNotice, title: e.target.value})} className="w-full px-4 py-2.5 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/60 dark:border-white/10 text-sm font-semibold focus:ring-2 focus:ring-orange-500/50 outline-none shadow-sm" />
                      <textarea required placeholder="Write your message here..." value={newNotice.message} onChange={e=>setNewNotice({...newNotice, message: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-white/60 dark:border-white/10 text-sm font-semibold focus:ring-2 focus:ring-orange-500/50 outline-none shadow-sm min-h-[100px] resize-none custom-scrollbar" />
                      <div className="flex justify-end">
                        <button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-orange-500/30 transition-colors flex items-center gap-2"><Send size={16}/> Send to All Users</button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-white/50 dark:border-white/10 overflow-hidden shadow-xl shadow-slate-200/20 dark:shadow-black/20">
                   <div className="p-4 bg-slate-50/50 dark:bg-slate-800/30 border-b border-white/40 dark:border-white/10 flex justify-between items-center">
                     <span className="text-sm font-bold text-slate-600 dark:text-slate-300">All Messages</span>
                     <button onClick={markAllNoticesRead} className="text-xs font-bold text-orange-500 hover:text-orange-600 transition-colors">Mark all as read</button>
                   </div>
                   <div className="divide-y divide-white/40 dark:divide-white/5">
                     {announcements.length === 0 ? (
                       <div className="p-16 text-center text-slate-500 text-sm font-medium">No messages in your inbox.</div>
                     ) : (
                       announcements.map(notice => {
                         const isUnread = !readAnnouncements.includes(notice.id);
                         return (
                           <div key={notice.id} onClick={() => markNoticeAsRead(notice.id)} className={`p-6 transition-all cursor-pointer hover:bg-white/40 dark:hover:bg-slate-800/40 relative ${isUnread ? 'bg-orange-50/30 dark:bg-orange-900/10' : ''}`}>
                              {isUnread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500"></div>}
                              <div className="flex gap-4">
                                <div className={`p-3 rounded-2xl h-fit border shadow-sm ${isUnread ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-500/30' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                                   <Megaphone size={20} />
                                </div>
                                <div>
                                   <div className="flex items-center gap-2 mb-1">
                                      <h4 className={`text-base font-extrabold ${isUnread ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{notice.title}</h4>
                                      {isUnread && <span className="text-[10px] font-bold bg-orange-500 text-white px-2 py-0.5 rounded-full">NEW</span>}
                                   </div>
                                   <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 leading-relaxed whitespace-pre-wrap">{notice.message}</p>
                                   <p className="text-xs font-bold text-slate-400 flex items-center gap-1.5"><Clock size={12}/> {new Date(notice.createdAt).toLocaleString('en-US', {dateStyle: 'medium', timeStyle: 'short'})} • From: {notice.sender}</p>
                                </div>
                              </div>
                           </div>
                         );
                       })
                     )}
                   </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* AI HUB */}
      <div className="fixed bottom-24 lg:bottom-12 right-6 lg:right-12 z-[90] flex flex-col items-end gap-3">
        {aiMenuOpen && (
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border border-white/50 dark:border-white/10 p-2 rounded-3xl shadow-2xl animate-in slide-in-from-bottom-6 duration-300 w-64 mb-2 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/40 dark:border-white/5 flex items-center justify-between">
              <p className="text-xs font-extrabold text-slate-800 dark:text-white">AI Tools</p>
              <Sparkles size={14} className="text-blue-500" />
            </div>
            <div className="grid grid-cols-1 max-h-[300px] overflow-y-auto overflow-x-hidden custom-scrollbar py-2">
              {/* Custom Chatbot Trigger (Flowy) */}
              <BorderGlow
                edgeSensitivity={30}
                glowColor="30 90 70"
                backgroundColor={darkMode ? 'rgba(249, 115, 22, 0.08)' : 'rgba(249, 115, 22, 0.04)'}
                borderRadius={12}
                glowRadius={25}
                glowIntensity={1.0}
                coneSpread={20}
                colors={['#f97316', '#fb923c', '#fdba74']}
                className="mx-2 mb-1 cursor-pointer overflow-hidden border border-orange-500/20"
              >
                <button 
                  onClick={() => { setIsChatbotOpen(true); setAiMenuOpen(false); }} 
                  className="flex items-center gap-3 p-3 w-full hover:bg-orange-500/10 transition-colors group outline-none text-left bg-transparent border-none"
                >
                  <Bot className="text-orange-500 group-hover:scale-110 transition-transform duration-300" size={18} />
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200">Chat with Flowy</span>
                  <Sparkles size={13} className="ml-auto text-orange-500 animate-[spin_5s_linear_infinite]" />
                </button>
              </BorderGlow>

              <div className="h-[1px] bg-slate-200 dark:bg-slate-800 my-1 mx-4"></div>

              {AI_TOOLS.map(tool => { 
                const ToolIcon = tool.icon; 
                return (
                  <a key={tool.name} href={tool.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 mx-2 hover:bg-white/50 dark:hover:bg-slate-800/50 rounded-xl transition-colors group outline-none">
                    <ToolIcon className={`${tool.color} group-hover:scale-110 transition-transform`} size={18} />
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{tool.name}</span>
                    <ExternalLink size={12} className="ml-auto text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                ); 
              })}
            </div>
          </div>
        )}
        <button onClick={() => setAiMenuOpen(!aiMenuOpen)} className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-500/30 border border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 outline-none backdrop-blur-md ${aiMenuOpen ? 'bg-slate-800/90 dark:bg-slate-700/90 rotate-90' : 'bg-blue-600/90'}`}>
          {aiMenuOpen ? <X size={24} /> : <Bot size={24} />}
        </button>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden z-40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-t border-white/50 dark:border-white/10 pb-safe shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-center px-2 py-2">
          {[{id: 'dashboard', icon: LayoutDashboard}, {id: 'planner', icon: CheckSquare}, {id: 'routine', icon: Calendar}, {id: 'assessments', icon: FileText}, {id: 'links', icon: LinkIcon}, {id: 'cgpa', icon: Award}].map(item => { 
            const NavIcon = item.icon; 
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center justify-center w-12 h-14 rounded-2xl transition-all outline-none ${isActive ? 'text-orange-500 scale-105' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-orange-50/80 dark:bg-orange-500/20 shadow-sm border border-orange-200/50 dark:border-orange-800/30 backdrop-blur-md' : ''}`}>
                  <NavIcon size={20} />
                </div>
              </button>
            ); 
          })}
        </div>
      </nav>

      {/* VAULT MODAL */}
      {isVaultOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={closeVault}>
           <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-white/50 dark:border-white/10 relative max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
              <button onClick={closeVault} className="absolute top-6 right-6 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors z-20 outline-none shadow-sm border border-white/40 dark:border-white/10"><X size={20} /></button>
              
              {(!vaultConfig || !vaultConfig.passcode) ? (
                /* Configure Passcode Screen */
                <div className="flex-grow flex flex-col justify-center py-6">
                  <div className="text-center max-w-md mx-auto space-y-6">
                    <div className="w-16 h-16 mx-auto bg-indigo-500/10 dark:bg-indigo-500/25 border border-indigo-500/20 dark:border-indigo-500/40 rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm"><Lock size={28} /></div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Configure Secure Vault PIN</h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-1">Setup a 4-digit security PIN to restrict access to your sensitive URLs</p>
                    </div>
                    <form onSubmit={handleSetupPasscode} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          required 
                          type="password" 
                          maxLength="4" 
                          placeholder="4-digit PIN" 
                          value={setupPin}
                          onChange={e => setSetupPin(e.target.value.replace(/\D/g, ''))}
                          className="p-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl text-center text-lg font-bold border border-white/60 dark:border-white/10 focus:border-indigo-500 outline-none dark:text-white"
                        />
                        <input 
                          required 
                          type="password" 
                          maxLength="4" 
                          placeholder="Confirm PIN" 
                          value={confirmPin}
                          onChange={e => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                          className="p-3 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl text-center text-lg font-bold border border-white/60 dark:border-white/10 focus:border-indigo-500 outline-none dark:text-white"
                        />
                      </div>
                      {vaultPinError && <p className="text-xs font-bold text-red-500 text-center">{vaultPinError}</p>}
                      <button type="submit" className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md transition-colors border border-white/20 outline-none">Configure Passcode</button>
                    </form>
                  </div>
                </div>
              ) : vaultLockState === 'locked' ? (
                /* Unlock Keypad Screen */
                <div className="flex-grow flex flex-col items-center justify-center py-6">
                  <div className="w-16 h-16 bg-indigo-500/10 dark:bg-indigo-500/25 border border-indigo-500/20 dark:border-indigo-500/40 rounded-2xl flex items-center justify-center text-indigo-500 shadow-sm mb-4"><Lock size={28} /></div>
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-white mb-1">Hidden Vault Locked</h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-6">Enter your 4-digit security PIN code</p>
                  
                  {/* Circle indicators */}
                  <div className="flex gap-4 mb-8">
                    {[0,1,2,3].map(d => (
                      <div key={d} className={`w-3.5 h-3.5 rounded-full border border-indigo-400/40 transition-all ${vaultInputPin.length > d ? 'bg-indigo-500 shadow-md scale-110' : 'bg-transparent'}`} />
                    ))}
                  </div>

                  {vaultPinError && <p className="text-xs font-bold text-red-500 mb-4">{vaultPinError}</p>}
                  
                  {/* Digital Keypad */}
                  <div className="grid grid-cols-3 gap-4 max-w-[240px] w-full">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                      <button 
                        key={num} 
                        type="button" 
                        onClick={() => handlePinInput(num.toString())}
                        className="w-14 h-14 mx-auto rounded-full bg-white/55 dark:bg-slate-800/55 hover:bg-white/80 dark:hover:bg-slate-700/80 border border-white/40 dark:border-white/5 flex items-center justify-center text-sm font-bold shadow-sm transition-all active:scale-90 outline-none"
                      >
                        {num}
                      </button>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => { setVaultInputPin(''); setVaultPinError(''); }}
                      className="w-14 h-14 mx-auto rounded-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center text-xs font-bold transition-colors outline-none"
                    >
                      Clear
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handlePinInput('0')}
                      className="w-14 h-14 mx-auto rounded-full bg-white/55 dark:bg-slate-800/55 hover:bg-white/80 dark:hover:bg-slate-700/80 border border-white/40 dark:border-white/5 flex items-center justify-center text-sm font-bold shadow-sm transition-all active:scale-90 outline-none"
                    >
                      0
                    </button>
                    <button 
                      type="button" 
                      onClick={handleBackspace}
                      className="w-14 h-14 mx-auto rounded-full text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center justify-center text-xs font-bold transition-colors outline-none"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                /* Unlocked Vault links list */
                <>
                  <div className="mb-6 flex items-center gap-4 border-b border-white/40 dark:border-white/10 pb-5">
                    <div className="p-3 bg-indigo-100/60 dark:bg-indigo-900/40 backdrop-blur-md rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm border border-white/50 dark:border-white/5"><ShieldCheck size={28} /></div>
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Hidden Vault</h3>
                      <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Secure storage for sensitive links</p>
                    </div>
                    <button onClick={() => setVaultLockState('locked')} className="ml-auto text-xs font-bold text-slate-500 hover:text-indigo-500 px-3 py-1.5 bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 rounded-lg outline-none flex items-center gap-1.5 transition-colors"><Lock size={12}/> Lock Vault</button>
                  </div>
                  
                  <div className="flex-grow overflow-y-auto custom-scrollbar space-y-4 mb-6">
                    {vaultLinks.length > 0 ? vaultLinks.map(v => (
                      <div key={v.id} className="p-4 rounded-2xl bg-white/50 dark:bg-slate-800/40 backdrop-blur-md border border-white/60 dark:border-white/10 flex items-center justify-between group transition-colors hover:border-indigo-300/50 dark:hover:border-indigo-700/50 shadow-sm">
                        <div className="min-w-0 flex-grow pr-4">
                          <div className="flex items-center gap-2 mb-2">
                            <p className="font-extrabold text-sm text-slate-800 dark:text-slate-200 truncate">{v.title}</p>
                            {v.hint && <span className="flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-300 bg-white/60 dark:bg-slate-700/60 backdrop-blur-sm px-2.5 py-0.5 rounded-full shadow-sm border border-white/40 dark:border-white/5"><Lock size={10} /> {v.hint}</span>}
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={() => setShowVaultLinks({...showVaultLinks, [v.id]: !showVaultLinks[v.id]})} className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors outline-none bg-indigo-50/60 dark:bg-indigo-500/20 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-indigo-200/50 dark:border-indigo-800/30 shadow-sm">
                              {showVaultLinks[v.id] ? <EyeOff size={14} /> : <Eye size={14} />} 
                              {showVaultLinks[v.id] ? 'Hide Link' : 'Reveal Link'}
                            </button>
                          </div>
                          {showVaultLinks[v.id] && (
                            <div className="mt-3 p-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md rounded-xl border border-white/50 dark:border-white/10 animate-in slide-in-from-top-2 shadow-inner">
                              <a href={v.url} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-blue-500 break-all hover:underline flex items-center gap-2 outline-none">{v.url} <ExternalLink size={14} className="shrink-0" /></a>
                            </div>
                          )}
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 flex gap-1 items-center shrink-0">
                          <button onClick={() => setEditingVaultLink(v)} className="p-2 text-slate-500 hover:text-blue-500 transition-colors outline-none bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg border border-white/40 dark:border-white/5 shadow-sm" title="Edit Secure Link"><Edit2 size={14} /></button>
                          <button onClick={() => deleteVaultLink(v.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors outline-none bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg border border-white/40 dark:border-white/5 shadow-sm" title="Delete Secure Link"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    )) : <div className="py-12 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400"><Vault size={40} className="mb-3 opacity-50" /><p className="text-sm font-bold">Your vault is empty and secure.</p></div>}
                  </div>
    
                  <div className="pt-6 border-t border-white/40 dark:border-white/10">
                    {!isAddingVaultLink ? (
                      <button onClick={() => setIsAddingVaultLink(true)} className="w-full py-3.5 bg-indigo-600/90 backdrop-blur-md text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/30 active:scale-95 outline-none border border-white/20"><Plus size={18} /> Add Secure Link</button> 
                    ) : (
                      <form onSubmit={addVaultLink} className="space-y-4 animate-in slide-in-from-bottom-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input required placeholder="Link Title" className="p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl text-sm font-semibold border border-white/60 dark:border-white/10 focus:border-indigo-500 outline-none dark:text-white shadow-inner" value={newVaultLink.title} onChange={e => setNewVaultLink({...newVaultLink, title: e.target.value})} />
                          <input placeholder="Hint (Optional)" className="p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl text-sm font-semibold border border-white/60 dark:border-white/10 focus:border-indigo-500 outline-none dark:text-white shadow-inner" value={newVaultLink.hint} onChange={e => setNewVaultLink({...newVaultLink, hint: e.target.value})} />
                        </div>
                        <input required placeholder="Secure URL" className="w-full p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl text-sm font-semibold border border-white/60 dark:border-white/10 focus:border-indigo-500 outline-none dark:text-white shadow-inner" value={newVaultLink.url} onChange={e => setNewVaultLink({...newVaultLink, url: e.target.value})} />
                        <div className="flex gap-3">
                          <button type="submit" className="flex-1 py-3.5 bg-indigo-600/90 backdrop-blur-md hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/30 transition-colors active:scale-95 outline-none border border-white/20">Save to Vault</button>
                          <button type="button" onClick={() => setIsAddingVaultLink(false)} className="px-6 py-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md text-slate-700 dark:text-slate-300 hover:bg-white/70 dark:hover:bg-slate-700/60 rounded-xl font-bold text-sm transition-colors outline-none shadow-sm border border-white/40 dark:border-white/10">Cancel</button>
                        </div>
                      </form>
                    )}
                  </div>
                </>
              )}
           </div>
        </div>
      )}

      {/* ADD LINK MODAL */}
      {isAddingLink && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setIsAddingLink(false)}>
           <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 dark:border-white/10 relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setIsAddingLink(false)} className="absolute top-6 right-6 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors z-20 outline-none shadow-sm border border-white/40 dark:border-white/10"><X size={20} /></button>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-6 z-20 flex items-center gap-2"><LinkIcon size={20} className="text-emerald-500" /> Add New Link</h3>
              
              <form onSubmit={addLink} className="space-y-4 relative z-20">
                <input required value={newLink.title} onChange={e => setNewLink({...newLink, title: e.target.value})} placeholder="Website Title" className="w-full p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl border border-white/60 dark:border-white/10 shadow-inner text-sm font-semibold focus:border-emerald-500 dark:text-white outline-none" />
                <GlassSelect value={newLink.category} onChange={val => setNewLink({...newLink, category: val, materialTypes: val === 'materials' ? [] : (newLink.materialTypes || [])})} options={CATEGORY_ORDER.map(k => ({value: k, label: CATEGORIES[k.toUpperCase()].label}))} />
                
                {newLink.category === 'materials' && (
                  <div className="bg-slate-100/50 dark:bg-slate-800/40 p-4 rounded-2xl border border-white/40 dark:border-white/5 space-y-3">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Material Type (Select multiple)</span>
                    <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
                      {materialTypes.map(type => (
                        <label key={type} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={newLink.materialTypes?.includes(type)}
                            onChange={e => {
                              const list = newLink.materialTypes || [];
                              const updated = e.target.checked 
                                ? [...list, type] 
                                : list.filter(t => t !== type);
                              setNewLink({...newLink, materialTypes: updated});
                            }}
                            className="rounded text-emerald-500 focus:ring-emerald-500 w-4 h-4"
                          />
                          {type}
                        </label>
                      ))}
                    </div>
                    
                    {isAddingCustomMaterialType ? (
                      <div className="flex items-center gap-2 mt-2">
                        <input 
                          type="text" 
                          placeholder="Custom Type" 
                          value={customMaterialTypeInput}
                          onChange={e => setCustomMaterialTypeInput(e.target.value)}
                          className="flex-grow px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none dark:text-white"
                        />
                        <button 
                          type="button"
                          onClick={() => {
                            if (customMaterialTypeInput.trim()) {
                              const newType = customMaterialTypeInput.trim();
                              if (!materialTypes.includes(newType)) {
                                setMaterialTypes([...materialTypes, newType]);
                              }
                              setNewLink({
                                ...newLink, 
                                materialTypes: [...(newLink.materialTypes || []), newType]
                              });
                            }
                            setCustomMaterialTypeInput('');
                            setIsAddingCustomMaterialType(false);
                          }}
                          className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg font-bold text-xs"
                        >
                          Add
                        </button>
                        <button 
                          type="button" 
                          onClick={() => {
                            setCustomMaterialTypeInput('');
                            setIsAddingCustomMaterialType(false);
                          }}
                          className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        onClick={() => setIsAddingCustomMaterialType(true)}
                        className="mt-2 text-xs text-emerald-500 hover:text-emerald-600 font-bold flex items-center gap-1"
                      >
                        <Plus size={14} /> Add Custom Type
                      </button>
                    )}
                  </div>
                )}

                <input required value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} placeholder="URL (e.g., elms.uiu.ac.bd)" className="w-full p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl border border-white/60 dark:border-white/10 shadow-inner text-sm font-semibold focus:border-emerald-500 dark:text-white outline-none" />
                <div className="flex justify-end pt-4">
                  <button type="submit" className="w-full py-3.5 bg-emerald-500/90 backdrop-blur-md hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 border border-white/20 transition-colors active:scale-95 outline-none">Save Link</button>
                </div>
              </form>
           </div>
        </div>
      )}

      {/* SPOTLIGHT SEARCH MODAL */}
      {searchOpen && (
        <div className="fixed inset-0 z-[250] bg-slate-900/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-10 animate-in fade-in duration-150" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl overflow-hidden mt-10 flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5 dark:border-white/10">
              <Search size={20} className="text-slate-400 dark:text-slate-500" />
              <input 
                autoFocus 
                type="text" 
                placeholder="Search classes, plans, assessments, or links... (Esc to close)" 
                className="w-full bg-transparent border-none outline-none text-sm font-bold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === 'Escape') setSearchOpen(false); }}
              />
              <button onClick={() => setSearchOpen(false)} className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-slate-500 transition-colors"><X size={16} /></button>
            </div>
            <div className="flex-grow overflow-y-auto custom-scrollbar p-3 space-y-1.5">
              {searchQuery.trim() === '' ? (
                <div className="py-12 text-center text-slate-500 text-sm font-semibold flex flex-col items-center gap-2">
                  <Search size={32} className="opacity-40" />
                  Type to start searching...
                </div>
              ) : searchResults.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-sm font-semibold flex flex-col items-center gap-2">
                  <AlertCircle size={32} className="opacity-40" />
                  No matching items found.
                </div>
              ) : (
                searchResults.map((res, index) => (
                  <button 
                    key={index} 
                    onClick={res.action} 
                    className="w-full text-left p-3.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/80 border border-transparent hover:border-slate-200/50 dark:hover:border-slate-700/50 transition-all flex items-start justify-between group"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-md mr-2">{res.type}</span>
                      <p className="font-extrabold text-sm text-slate-800 dark:text-white mt-1.5 leading-none">{res.title}</p>
                      <p className="text-xs font-semibold text-slate-500 mt-1.5">{res.sub}</p>
                    </div>
                    <div className="p-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight size={14} className="text-orange-500" />
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATIONS PORTAL CONTAINER */}
      <div className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-12 sm:bottom-12 z-[200] flex flex-col gap-2 max-w-sm w-auto sm:w-full pointer-events-none">
        {toasts.map(toast => (
          <div key={toast.id} className={`toast-card pointer-events-auto p-4 rounded-2xl shadow-xl flex items-center gap-3 border ${
            toast.type === 'success' 
              ? 'bg-emerald-50/95 dark:bg-emerald-950/95 border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-200'
              : toast.type === 'error'
                ? 'bg-red-50/95 dark:bg-red-950/95 border-red-200 dark:border-red-900/50 text-red-800 dark:text-red-200'
                : 'bg-orange-50/95 dark:bg-orange-950/95 border-orange-200 dark:border-orange-900/50 text-orange-800 dark:text-orange-200'
          }`}>
            <div className="shrink-0">
              {toast.type === 'success' && <CheckCircle2 size={18} className="text-emerald-500" />}
              {toast.type === 'error' && <AlertCircle size={18} className="text-red-500" />}
              {toast.type === 'info' && <Sparkles size={18} className="text-orange-500" />}
            </div>
            <p className="text-xs font-bold leading-tight">{toast.message}</p>
            <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="ml-auto p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-lg text-current opacity-65 hover:opacity-100 transition-opacity border-none">
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
      {/* FULLSCREEN FOCUS MODAL */}
      {isFocusModalOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsFocusModalOpen(false)}>
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-6 sm:p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-4xl border border-white/50 dark:border-white/10 relative max-h-[90vh] overflow-y-auto custom-scrollbar flex flex-col md:flex-row gap-8 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsFocusModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors z-20 outline-none shadow-sm border border-white/40 dark:border-white/10"><X size={20} /></button>
            
            {/* Left Column: Interactive Circular Timer */}
            {(() => {
              const minutes = Math.floor(pomoTimeLeft / 60);
              const seconds = pomoTimeLeft % 60;
              const pct = ((pomoTotalDuration - pomoTimeLeft) / pomoTotalDuration) * 100;
              
              const radius = 64;
              const circumference = 2 * Math.PI * radius;
              const strokeDashoffset = circumference - (pct / 100) * circumference;
              
              return (
                <div className="flex-1 flex flex-col items-center justify-center border-r border-black/5 dark:border-white/5 pr-0 md:pr-8">
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
                    <Flame size={22} className={pomoActive ? "text-orange-500 animate-pulse" : "text-slate-400"} />
                    {pomoMode === 'work' ? 'Focus Session Active' : 'Break Time'}
                  </h3>
                  
                  {/* Big Circular Countdown Display */}
                  <div className="relative flex items-center justify-center shrink-0 mb-8">
                    <svg className="w-[160px] h-[160px]">
                      <circle className="text-slate-200 dark:text-slate-800" strokeWidth="8" stroke="currentColor" fill="transparent" r={radius} cx="80" cy="80" />
                      <circle className={`transition-all duration-100 ${pomoMode === 'work' ? 'text-orange-500' : 'text-teal-500'}`} strokeWidth="8" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" stroke="currentColor" fill="transparent" r={radius} cx="80" cy="80" style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }} />
                    </svg>
                    <span className="absolute text-3xl font-extrabold tracking-tight text-slate-800 dark:text-white">{minutes}:{seconds < 10 ? '0' + seconds : seconds}</span>
                  </div>
                  
                  {/* Controls */}
                  <div className="flex gap-3 w-full max-w-xs mb-6">
                    <button onClick={togglePomo} className={`flex-1 py-3 text-sm font-bold rounded-2xl text-white shadow-lg transition-all active:scale-95 outline-none flex items-center justify-center gap-2 border border-white/20 ${pomoActive ? 'bg-red-500/95 shadow-red-500/10' : 'bg-orange-500/90 shadow-orange-500/10 hover:bg-orange-600'}`}>
                      {pomoActive ? <Pause size={16} /> : <Play size={16} />}
                      {pomoActive ? 'Pause Session' : 'Start Focus'}
                    </button>
                    <button onClick={resetPomo} className="p-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl transition-all border border-black/5 dark:border-white/5 outline-none shadow-sm" title="Reset Timer"><RotateCcw size={20} /></button>
                  </div>
                  
                  {/* Adjustment Panel (Visible when paused) */}
                  <div className="w-full max-w-xs space-y-4">
                    <div className="opacity-80 transition-opacity">
                      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">Session Duration</p>
                      <div className="flex items-center gap-2 bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-black/5 dark:border-white/5 shadow-inner justify-between">
                        <button disabled={pomoActive} type="button" onClick={() => { 
                          const next = Math.max(10, focusDuration - 5); 
                          setFocusDuration(next); 
                          if (!pomoActive) {
                            setPomoTimeLeft(next * 60); 
                            setPomoTotalDuration(next * 60);
                          }
                          updateFocusConfig('focusDuration', next);
                        }} className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors outline-none disabled:opacity-40 border-none bg-transparent"><ChevronDown size={20} /></button>
                        
                        <div className="text-center">
                          <span className="text-lg font-extrabold text-slate-800 dark:text-white tracking-tight">{focusDuration}</span>
                          <span className="text-[10px] font-bold text-slate-400 block -mt-1 uppercase">mins</span>
                        </div>
                        
                        <button disabled={pomoActive} type="button" onClick={() => { 
                          const next = Math.min(180, focusDuration + 5); 
                          setFocusDuration(next); 
                          if (!pomoActive) {
                            setPomoTimeLeft(next * 60); 
                            setPomoTotalDuration(next * 60);
                          }
                          updateFocusConfig('focusDuration', next);
                        }} className="p-1 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors outline-none disabled:opacity-40 border-none bg-transparent"><ChevronUp size={20} /></button>
                      </div>
                    </div>
                    
                    {/* Skip Breaks Checkbox */}
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input 
                        type="checkbox" 
                        checked={skipBreaks} 
                        onChange={e => {
                          setSkipBreaks(e.target.checked);
                          updateFocusConfig('skipBreaks', e.target.checked);
                        }} 
                        className="rounded border-slate-300 text-orange-500 focus:ring-orange-500 w-4.5 h-4.5 bg-white/40 dark:bg-slate-800/40"
                      />
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Skip breaks</span>
                    </label>
                  </div>
                </div>
              );
            })()}
            
            {/* Right Column: Plant Grow & Goal Stats */}
            <div className="flex-grow flex flex-col justify-between">
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Daily Progress</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Streak</span>
                      <p className="text-2xl font-extrabold text-orange-500 mt-1">{focusStreak} <span className="text-xs text-slate-400 font-bold">days</span></p>
                    </div>
                    <div className="bg-slate-100/50 dark:bg-slate-800/50 p-4 rounded-2xl border border-black/5 dark:border-white/5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Goal Progress</span>
                      <p className="text-2xl font-extrabold text-slate-800 dark:text-white mt-1">
                        {Math.floor(completedFocusMinutes / 60)}h <span className="text-base">{completedFocusMinutes % 60}m</span>
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Tree grow display inside modal */}
                <div className="bg-slate-100/30 dark:bg-slate-800/30 p-6 rounded-3xl border border-black/5 dark:border-white/5 flex flex-col items-center">
                  <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Focus Tree Nursery</span>
                  <TreeGrow completedMinutes={completedFocusMinutes} dailyGoal={dailyFocusGoal} />
                </div>
              </div>
              
              {/* Daily Goal Settings Slider */}
              <div className="mt-6 pt-6 border-t border-black/5 dark:border-white/5">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Adjust Daily Goal</span>
                <div className="flex items-center gap-3">
                  <input 
                    type="range" 
                    min="30" 
                    max="480" 
                    step="30" 
                    value={dailyFocusGoal} 
                    onChange={e => {
                      const next = parseInt(e.target.value);
                      setDailyFocusGoal(next);
                      updateFocusConfig('dailyFocusGoal', next);
                    }}
                    className="flex-grow accent-orange-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 min-w-[70px] text-right">{Math.floor(dailyFocusGoal / 60)}h {dailyFocusGoal % 60}m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* STUDYFLOW AI CHATBOT MODAL */}
      <StudyFlowAIChatbot 
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
        user={user}
        routine={routine}
        studyPlans={studyPlans}
        cts={cts}
        assignments={assignments}
        links={links}
        completedFocusMinutes={completedFocusMinutes}
        dailyFocusGoal={dailyFocusGoal}
        focusStreak={focusStreak}
        focusDuration={focusDuration}
        customApiKey={customApiKey}
        onSaveCustomApiKey={handleSaveCustomApiKey}
      />

      {editingStudyPlan && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setEditingStudyPlan(null)}>
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-blue-500/30 shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setEditingStudyPlan(null)} className="absolute top-6 right-6 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors shadow-sm border border-white/40 dark:border-white/10 outline-none"><X size={20} /></button>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><CheckSquare size={20} className="text-blue-500" /> Edit Study Plan</h3>
            <form onSubmit={editStudyPlanHandler} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Subject / Topic</label>
                <input required type="text" value={editingStudyPlan.topic} onChange={(e) => setEditingStudyPlan({...editingStudyPlan, topic: e.target.value})} className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 dark:text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Date</label>
                <input required type="date" value={editingStudyPlan.date} onChange={(e) => setEditingStudyPlan({...editingStudyPlan, date: e.target.value})} className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 dark:text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Time Slot</label>
                <input type="text" value={editingStudyPlan.timeSlot || ''} onChange={(e) => setEditingStudyPlan({...editingStudyPlan, timeSlot: e.target.value})} placeholder="e.g. 8 PM - 10 PM" className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 dark:text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Priority</label>
                <div className="flex bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-1.5 rounded-xl gap-1 border border-white/40 dark:border-white/5">
                  {['low', 'medium', 'high'].map(p => {
                    let activeClass = 'text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200';
                    if (editingStudyPlan.priority === p) {
                      if (p === 'low') activeClass = 'bg-blue-500/90 text-white shadow-md';
                      if (p === 'medium') activeClass = 'bg-orange-500/90 text-white shadow-md';
                      if (p === 'high') activeClass = 'bg-red-500/90 text-white shadow-md';
                    }
                    return (
                      <button key={p} type="button" onClick={() => setEditingStudyPlan({...editingStudyPlan, priority: p})} className={`flex-1 px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all outline-none ${activeClass}`}>{p}</button>
                    );
                  })}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setEditingStudyPlan(null)} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-colors border border-black/5 dark:border-white/5">Cancel</button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-500/30 transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingCt && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setEditingCt(null)}>
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-blue-500/30 shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setEditingCt(null)} className="absolute top-6 right-6 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors shadow-sm border border-white/40 dark:border-white/10 outline-none"><X size={20} /></button>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><AlertCircle size={20} className="text-blue-500" /> Edit Class Test</h3>
            <form onSubmit={editCtHandler} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Course Name / Code</label>
                <input required type="text" value={editingCt.course} onChange={(e) => setEditingCt({...editingCt, course: e.target.value})} className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 dark:text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Topic / Syllabus</label>
                <input required type="text" value={editingCt.topic} onChange={(e) => setEditingCt({...editingCt, topic: e.target.value})} className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 dark:text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Date</label>
                <input required type="date" value={editingCt.deadline} onChange={(e) => setEditingCt({...editingCt, deadline: e.target.value})} className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 dark:text-white outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setEditingCt(null)} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-colors border border-black/5 dark:border-white/5">Cancel</button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-500/30 transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingAssignment && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setEditingAssignment(null)}>
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-blue-500/30 shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setEditingAssignment(null)} className="absolute top-6 right-6 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors shadow-sm border border-white/40 dark:border-white/10 outline-none"><X size={20} /></button>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><FileText size={20} className="text-blue-500" /> Edit Assignment</h3>
            <form onSubmit={editAssignmentHandler} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Course Name / Code</label>
                <input required type="text" value={editingAssignment.course} onChange={(e) => setEditingAssignment({...editingAssignment, course: e.target.value})} className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 dark:text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Topic / Syllabus</label>
                <input required type="text" value={editingAssignment.topic} onChange={(e) => setEditingAssignment({...editingAssignment, topic: e.target.value})} className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 dark:text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Date</label>
                <input required type="date" value={editingAssignment.deadline} onChange={(e) => setEditingAssignment({...editingAssignment, deadline: e.target.value})} className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 dark:text-white outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setEditingAssignment(null)} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-colors border border-black/5 dark:border-white/5">Cancel</button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-500/30 transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingLink && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setEditingLink(null)}>
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-blue-500/30 shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
            <button onClick={() => setEditingLink(null)} className="absolute top-6 right-6 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors shadow-sm border border-white/40 dark:border-white/10 outline-none"><X size={20} /></button>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><LinkIcon size={20} className="text-blue-500" /> Edit Resource Link</h3>
            <form onSubmit={editLinkHandler} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Link Title</label>
                <input required type="text" value={editingLink.title} onChange={(e) => setEditingLink({...editingLink, title: e.target.value})} className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 dark:text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Category</label>
                <GlassSelect value={editingLink.category} onChange={val => setEditingLink({...editingLink, category: val, materialTypes: val === 'materials' ? (editingLink.materialTypes || []) : []})} options={CATEGORY_ORDER.map(k => ({value: k, label: CATEGORIES[k.toUpperCase()].label}))} />
              </div>
              
              {editingLink.category === 'materials' && (
                <div className="bg-slate-100/50 dark:bg-slate-800/40 p-4 rounded-2xl border border-white/40 dark:border-white/5 space-y-3">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block">Material Type (Select multiple)</span>
                  <div className="flex flex-col gap-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
                    {materialTypes.map(type => (
                      <label key={type} className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={editingLink.materialTypes?.includes(type)}
                          onChange={e => {
                            const list = editingLink.materialTypes || [];
                            const updated = e.target.checked 
                              ? [...list, type] 
                              : list.filter(t => t !== type);
                            setEditingLink({...editingLink, materialTypes: updated});
                          }}
                          className="rounded text-blue-500 focus:ring-blue-500 w-4 h-4"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                  
                  {isAddingCustomMaterialType ? (
                    <div className="flex items-center gap-2 mt-2">
                      <input 
                        type="text" 
                        placeholder="Custom Type" 
                        value={customMaterialTypeInput}
                        onChange={e => setCustomMaterialTypeInput(e.target.value)}
                        className="flex-grow px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs outline-none dark:text-white"
                      />
                      <button 
                        type="button"
                        onClick={() => {
                          if (customMaterialTypeInput.trim()) {
                            const newType = customMaterialTypeInput.trim();
                            if (!materialTypes.includes(newType)) {
                              setMaterialTypes([...materialTypes, newType]);
                            }
                            setEditingLink({
                              ...editingLink, 
                              materialTypes: [...(editingLink.materialTypes || []), newType]
                            });
                          }
                          setCustomMaterialTypeInput('');
                          setIsAddingCustomMaterialType(false);
                        }}
                        className="px-3 py-1.5 bg-blue-500 text-white rounded-lg font-bold text-xs"
                      >
                        Add
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setCustomMaterialTypeInput('');
                          setIsAddingCustomMaterialType(false);
                        }}
                        className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => setIsAddingCustomMaterialType(true)}
                      className="mt-2 text-xs text-blue-500 hover:text-blue-600 font-bold flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Custom Type
                    </button>
                  )}
                </div>
              )}

              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">URL</label>
                <input required type="text" value={editingLink.url} onChange={(e) => setEditingLink({...editingLink, url: e.target.value})} className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 dark:text-white outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setEditingLink(null)} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-colors border border-black/5 dark:border-white/5">Cancel</button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-500/30 transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editingVaultLink && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setEditingVaultLink(null)}>
          <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-6 sm:p-8 rounded-3xl border border-blue-500/30 shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setEditingVaultLink(null)} className="absolute top-6 right-6 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors shadow-sm border border-white/40 dark:border-white/10 outline-none"><X size={20} /></button>
            <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2"><Vault size={20} className="text-blue-500 animate-pulse" /> Edit Secure Link</h3>
            <form onSubmit={editVaultLinkHandler} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Title</label>
                <input required type="text" value={editingVaultLink.title} onChange={(e) => setEditingVaultLink({...editingVaultLink, title: e.target.value})} className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 dark:text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Secure URL</label>
                <input required type="text" value={editingVaultLink.url} onChange={(e) => setEditingVaultLink({...editingVaultLink, url: e.target.value})} className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 dark:text-white outline-none" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">Hint / Decoy Description</label>
                <input type="text" value={editingVaultLink.hint || ''} onChange={(e) => setEditingVaultLink({...editingVaultLink, hint: e.target.value})} placeholder="Hint to remember what this is" className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/50 dark:text-white outline-none" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setEditingVaultLink(null)} className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-colors border border-black/5 dark:border-white/5">Cancel</button>
                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-blue-500/30 transition-colors">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MATERIALS EXPANDABLE MODAL */}
      {isMaterialsModalOpen && (
        <div className={`fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 ${isMobileDevice ? 'backdrop-blur-md' : ''} animate-in fade-in duration-200`} onClick={() => setIsMaterialsModalOpen(false)}>
          <div className={`bg-white/95 dark:bg-slate-950/95 ${isMobileDevice ? 'backdrop-blur-3xl' : ''} p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl w-full max-w-4xl max-h-[85vh] flex flex-col relative animate-in zoom-in-95 duration-200`} onClick={e => e.stopPropagation()}>
            <button onClick={() => setIsMaterialsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors outline-none shadow-sm border border-white/40 dark:border-white/10"><X size={20} /></button>
            
            <div className="mb-6 flex items-center gap-3">
              <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-2xl border border-white/40 dark:border-white/5 shadow-sm"><BookOpen size={24} /></div>
              <div>
                <h3 className="text-xl font-extrabold text-slate-800 dark:text-white">Study Materials Segment</h3>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Class slides, notes, question banks, and helpful directories</p>
              </div>
            </div>

            {/* Sub-tab navigation filtering by Material Types using GlassSelect Dropdown */}
            <div className="mb-6 w-full sm:max-w-xs relative z-30">
              <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-2">Filter Material Type</label>
              <GlassSelect 
                value={activeMaterialTypeTab} 
                onChange={val => setActiveMaterialTypeTab(val)} 
                options={[
                  { value: 'all', label: `All Materials (${links.filter(l => l.category === 'materials').length})` },
                  ...materialTypes.map(type => {
                    const count = links.filter(l => l.category === 'materials' && l.materialTypes?.includes(type)).length;
                    return { value: type, label: `${type} (${count})` };
                  })
                ]} 
              />
            </div>

            <div className="flex-grow overflow-y-auto custom-scrollbar pr-1 min-h-[300px] mb-4 transform-gpu" style={{ contentVisibility: 'auto' }}>
              {(() => {
                const filtered = links.filter(l => {
                  if (l.category !== 'materials') return false;
                  if (activeMaterialTypeTab === 'all') return true;
                  return l.materialTypes?.includes(activeMaterialTypeTab);
                });

                if (filtered.length === 0) {
                  return (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 py-12">
                      <BookOpen size={48} className="opacity-20 mb-3" />
                      <p className="text-sm font-bold">No materials found in this category.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filtered.map(l => {
                      const branding = getLinkBranding(l.url);
                      const BrandIcon = branding.icon;
                      return (
                        <div key={l.id} className={`transform-gpu group flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 shadow-sm hover:shadow-md ${l.starred ? `${branding.starBorder} ${branding.starBg}` : 'border-white/40 dark:border-white/5 bg-white/40 dark:bg-slate-800/40 hover:bg-white/70 dark:hover:bg-slate-700/60'}`}>
                          <div className="flex items-center gap-3 overflow-hidden outline-none flex-grow pr-2">
                            <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleStarLink(l); }} className={`shrink-0 p-1.5 rounded-lg transition-all outline-none ${l.starred ? `${branding.starText} ${branding.starBg} border ${branding.starBorder}` : 'text-slate-300 dark:text-slate-600 hover:text-amber-400 group-hover:text-amber-400/70 hover:bg-white/60 dark:hover:bg-slate-700/60'}`}>
                              <Star size={16} className={l.starred ? `fill-current ${branding.color}` : ""} />
                            </button>
                            <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 overflow-hidden outline-none flex-grow">
                              <div className={`p-2 rounded-lg transition-colors shrink-0 shadow-sm border ${l.starred ? `${branding.starBg} ${branding.color} ${branding.starBorder}` : `bg-white/60 dark:bg-slate-800/60 text-slate-500 ${branding.hoverText} group-hover:bg-slate-100 dark:group-hover:bg-slate-700`}`}>
                                <BrandIcon size={16} />
                              </div>
                              <div className="overflow-hidden">
                                <p className={`font-bold text-sm truncate ${l.starred ? branding.starText : 'text-slate-800 dark:text-slate-200'}`}>{l.title}</p>
                                <p className={`text-xs font-medium truncate mt-0.5 ${l.starred ? `${branding.starText} opacity-70` : 'text-slate-500 dark:text-slate-400'}`}>{l.url.replace(/^https?:\/\//, '')}</p>
                                {l.materialTypes && l.materialTypes.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {l.materialTypes.map(t => (
                                      <span key={t} className="px-2 py-0.5 rounded bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-[9px] font-bold text-slate-500 dark:text-slate-400 capitalize">{t}</span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </a>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 flex gap-1 shrink-0">
                            <button onClick={() => setEditingLink(l)} className="p-1.5 text-slate-400 hover:text-blue-500 transition-all outline-none" title="Edit Link"><Edit2 size={16} /></button>
                            <button onClick={() => deleteLink(l.id)} className="p-1.5 text-slate-400 hover:text-red-500 transition-all outline-none" title="Delete Link"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
            
            {!isMobileDevice && (
              <div className="pt-4 border-t border-white/40 dark:border-white/10 flex justify-between items-center">
                <button onClick={() => { setIsMaterialsModalOpen(false); sendOtpForMaterialDelete(); }} className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl font-bold text-xs transition-all flex items-center gap-2 outline-none border border-red-500/10 cursor-pointer"><Trash2 size={14} /> Clear All Trimester Materials</button>
                <button onClick={() => { setIsMaterialsModalOpen(false); setIsAddingLink(true); setNewLink({...newLink, category: 'materials', materialTypes: activeMaterialTypeTab !== 'all' ? [activeMaterialTypeTab] : []}); }} className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-md shadow-emerald-500/25 transition-all flex items-center gap-1.5 outline-none border border-white/10 cursor-pointer"><Plus size={14} /> Add Material Link</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* OTP VERIFICATION MODAL */}
      {isOtpModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200" onClick={() => setIsOtpModalOpen(false)}>
          <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl max-w-md w-full text-center space-y-6 animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="w-16 h-16 bg-red-500/10 dark:bg-red-500/25 border border-red-500/25 rounded-3xl flex items-center justify-center text-red-500 mx-auto">
              <ShieldAlert size={32} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">Verify Your Action</h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                You are about to delete <span className="font-extrabold text-red-500">ALL</span> academic materials. Enter the 6-digit verification code sent to your email <span className="font-extrabold text-slate-800 dark:text-white">{user?.email}</span> to confirm.
              </p>
            </div>

            <div className="space-y-4">
              <input 
                type="text" 
                maxLength={6}
                value={userOtpInput}
                onChange={e => setUserOtpInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-Digit OTP" 
                className="w-full text-center tracking-[0.5em] font-extrabold text-lg px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-red-500/50 dark:text-white outline-none"
              />
              {isOtpServiceFailed && (
                <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/20 rounded-xl p-3.5 text-left space-y-1">
                  <span className="text-[10px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider block">OTP Service Limit Exceeded</span>
                  <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">
                    Due to high traffic or monthly limits, email delivery is currently paused. Please use this backup code to proceed: <span className="font-extrabold text-amber-600 dark:text-amber-400 select-all">{generatedOtp}</span>
                  </p>
                </div>
              )}
              {!process.env.REACT_APP_EMAILJS_PUBLIC_KEY && !isOtpServiceFailed && (
                <div className="bg-orange-500/5 dark:bg-orange-500/10 border border-orange-500/15 rounded-xl p-3 text-left">
                  <span className="text-[10px] font-bold text-orange-500 dark:text-orange-400 uppercase tracking-wider block mb-1">Developer Helper Tooltip</span>
                  <p className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 leading-relaxed">Since you have not set up EmailJS in your `.env` file, your code is: <span className="font-extrabold text-orange-600 dark:text-orange-400">{generatedOtp}</span></p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => setIsOtpModalOpen(false)}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold text-xs transition-all outline-none border border-black/5 dark:border-white/5 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="button"
                onClick={executeBatchDeleteMaterials}
                className="py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-xs shadow-md shadow-red-500/10 active:scale-95 transition-all outline-none border border-white/10 cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CALENDAR IMPORT CONFIRMATION MODAL */}
      {importConfirmData && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl p-6 sm:p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl max-w-md w-full text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-blue-500/10 dark:bg-blue-500/25 border border-blue-500/25 rounded-3xl flex items-center justify-center text-blue-500 mx-auto">
              <Calendar size={32} />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">Import Class Routine</h3>
              <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed">
                We found <span className="font-extrabold text-blue-500">{importConfirmData.eventsCount}</span> classes in your calendar file. How would you like to import them?
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                type="button"
                onClick={() => executeCalendarImport(importConfirmData, true)}
                className="py-3 px-4 bg-red-500/90 hover:bg-red-600 text-white rounded-xl font-bold text-xs shadow-md shadow-red-500/10 active:scale-95 transition-all outline-none border border-white/10 cursor-pointer"
              >
                Replace
              </button>
              <button 
                type="button"
                onClick={() => executeCalendarImport(importConfirmData, false)}
                className="py-3 px-4 bg-blue-500/90 hover:bg-blue-600 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/10 active:scale-95 transition-all outline-none border border-white/10 cursor-pointer"
              >
                Keep
              </button>
            </div>

            <button 
              type="button"
              onClick={() => setImportConfirmData(null)}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors outline-none cursor-pointer"
            >
              Cancel Import
            </button>
          </div>
        </div>
      )}
      {/* FULLSCREEN CALENDAR VIEW OVERLAY */}
      {isCalendarViewOpen && (
        <div className={`${darkMode ? 'dark bg-black/80' : 'bg-slate-900/60'} fixed inset-0 z-[150] backdrop-blur-sm flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200`}>
          <div className="w-full sm:max-w-6xl h-full sm:h-[90vh] bg-white dark:bg-[#0b0a0c] text-slate-800 dark:text-zinc-50 rounded-none sm:rounded-3xl border-none sm:border border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 relative">
            
            {/* Header section */}
            <div className="px-6 py-4.5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between bg-white dark:bg-[#0b0a0c] relative z-20">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-xl">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-800 dark:text-white leading-none">Weekly Routine</h3>
                  <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-1">summer26 • {routine.length} classes</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2.5">
                <div className="hidden sm:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-500 px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                  Tentative
                </div>
                
                <button 
                  type="button"
                  onClick={() => downloadICS(calendarEvents, "routine.ics")}
                  className="bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
                  title="Export Calendar File (.ics)"
                >
                  <Inbox size={14} />
                  Export .ics
                </button>

                <div className="w-px h-5 bg-slate-200 dark:bg-zinc-800 mx-1"></div>

                <button 
                  type="button"
                  onClick={() => setIsCalendarViewOpen(false)}
                  className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-transparent dark:hover:bg-white/5 text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-white rounded-xl transition-colors border-none outline-none cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Calendar grid wrapper */}
            <div className="flex-grow overflow-hidden bg-white dark:bg-[#0b0a0c] relative z-10 select-none flex flex-col">
              <GoogleCalendarWeekly 
                events={calendarEvents} 
                timeZone="Asia/Dhaka" 
                weekStartsOn={6} 
                showExport={false}
                className="flex-grow border-none bg-transparent shadow-none"
              />
            </div>

            <div className="px-6 py-4 border-t border-slate-200 dark:border-zinc-800 text-center text-[10px] font-bold text-slate-500 bg-white dark:bg-[#0b0a0c] z-20 flex flex-col sm:flex-row justify-between items-center gap-2">
              <span>Calendar by @monzim/calendar</span>
              <span className="text-slate-400 dark:text-zinc-600">Double click or click any class slot to view details</span>
            </div>
          </div>
        </div>
      )}

      {/* PWA INSTALLATION BANNER */}
      {isMobileDevice && !dismissedInstallBanner && (deferredPrompt || isIosSafari) && (
        <div className="fixed bottom-24 left-4 right-4 z-[110] bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col gap-4 animate-in slide-in-from-bottom-8 duration-300">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-orange-500/10 border border-orange-500/20 text-orange-500 rounded-2xl shrink-0">
                <Sparkles size={20} className="animate-pulse" />
              </div>
              <div className="text-left">
                <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">Install StudyFlow App</h4>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-0.5 leading-relaxed">
                  {isIosSafari 
                    ? "Tap the Share button ⇧ and select 'Add to Home Screen' for a native-like experience." 
                    : "Install the web application to run full-screen with native performance."}
                </p>
              </div>
            </div>
            <button 
              onClick={() => setDismissedInstallBanner(true)} 
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors outline-none shrink-0"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex items-center gap-3 w-full">
            {!isIosSafari && (
              <button 
                onClick={handleInstallClick}
                className="flex-grow bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-md active:scale-98 transition-all cursor-pointer outline-none text-center"
              >
                Install
              </button>
            )}
            <button 
              onClick={() => setDismissedInstallBanner(true)}
              className="flex-grow bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 py-2.5 rounded-xl text-xs font-bold active:scale-98 transition-all cursor-pointer outline-none text-center"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {renderLanyardModal()}
      {renderBackupModals()}
      {renderTransitionOverlay()}
    </div>
  );
}
