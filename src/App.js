import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  CheckCircle2, Circle, Plus, Trash2, Calendar, Link as LinkIcon, 
  BookOpen, School, Wrench, Users, Coffee, LayoutDashboard,
  ExternalLink, Clock, MapPin, Sparkles, Loader2, X, Moon, Sun,
  UserCircle, MoonStar, Zap, Bell, LogOut, Mail, Lock,
  Bot, MessageSquare, Search, BrainCircuit, Cpu,
  ShieldCheck, Vault, Eye, EyeOff, Menu, Heart, UserPlus, Quote,
  ArrowRight, ArrowLeft,
  ChevronDown, Star,
  Monitor, CheckSquare, FileText, Send, Inbox, Megaphone, AlertCircle
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getFirestore, collection, doc, setDoc, addDoc, deleteDoc, 
  onSnapshot, updateDoc
} from 'firebase/firestore';
import { 
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword,
  signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile,
  signOut, setPersistence, browserSessionPersistence
} from 'firebase/auth';

// --- FIREBASE CONFIGURATION ---
const firebaseConfig = {
  apiKey: "AIzaSyBNPdHfnwBRNeHBlV9WI8oOUKV1TEy4LdE",
  authDomain: "studyflow-3686a.firebaseapp.com",
  projectId: "studyflow-3686a",
  storageBucket: "studyflow-3686a.firebasestorage.app",
  messagingSenderId: "178478131685",
  appId: "1:178478131685:web:7621636018e64269a8270c"
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const appId = (typeof window !== 'undefined' && window.__app_id) ? window.__app_id : 'uiu-studyflow-v4.26'; 

setPersistence(auth, browserSessionPersistence);

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

const TYPEWRITER_ITEMS = [
  { text: "organizing your course schedule.", color: "text-blue-600 dark:text-blue-400" },
  { text: "planning your daily studies.", color: "text-emerald-600 dark:text-emerald-400" },
  { text: "tracking CTs & Assignments.", color: "text-rose-600 dark:text-rose-400" },
  { text: "managing your academic resources.", color: "text-purple-600 dark:text-purple-400" }
];

// --- CUSTOM HOOKS & COMPONENTS ---
const TypewriterEffect = ({ items, typingSpeed = 50, deletingSpeed = 30, pauseDuration = 2000 }) => {
  const [text, setText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);

  useEffect(() => {
    let timer;
    const i = loopNum % items.length;
    const fullText = items[i].text;

    if (isDeleting) {
      timer = setTimeout(() => {
        setText(fullText.substring(0, text.length - 1));
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setText(fullText.substring(0, text.length + 1));
      }, typingSpeed);
    }

    if (!isDeleting && text === fullText) {
      timer = setTimeout(() => setIsDeleting(true), pauseDuration);
    } else if (isDeleting && text === '') {
      timer = setTimeout(() => {
        setIsDeleting(false);
        setLoopNum(prev => prev + 1);
      }, 300); 
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, items, typingSpeed, deletingSpeed, pauseDuration]);

  const currentColor = items[loopNum % items.length].color;

  return (
    <span className={`inline-flex items-center transition-colors duration-300 font-bold ${currentColor}`}>
      {text}
      <span className="animate-pulse inline-block ml-[2px] opacity-70 w-[2px] h-[1.1em] bg-current translate-y-[1px]"></span>
    </span>
  );
};

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
  <div className="mt-8 p-5 bg-white/40 dark:bg-slate-800/40 backdrop-blur-md rounded-2xl border border-white/50 dark:border-white/10 shadow-sm group transition-all hover:shadow-md">
    <style>{`
      @keyframes heartPulse {
        0%, 100% { transform: scale(1); opacity: 1; }
        50% { transform: scale(1.15); opacity: 0.8; }
      }
      .animate-heart { animation: heartPulse 2s ease-in-out infinite; }
    `}</style>
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">StudyFlow UIU</span>
      <span className="bg-orange-100/80 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">v 3.28</span>
    </div>
    <p className="text-xs font-medium text-slate-600 dark:text-slate-400 leading-relaxed mb-3">
      Developed with <span className="inline-flex items-center justify-center animate-heart text-red-500 mx-0.5"><Heart size={12} fill="currentColor" /></span> by <span className="text-slate-800 dark:text-white font-bold">Moheuddin Sikder Saikat</span><br/>(CSE 242)
    </p>
    <div className="pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
      <a href="mailto:msaikat2420035@bscse.uiu.ac.bd" className="flex items-center gap-2 text-xs font-semibold text-orange-500 hover:text-orange-600 hover:underline transition-colors break-all outline-none">
        <Mail size={14} className="shrink-0" /> Contact for feedback
      </a>
    </div>
  </div>
);

export default function App() {
  // --- CORE STATE ---
  const [user, setUser] = useState(null);
  const [showCover, setShowCover] = useState(true); // NEW: Controls the Cover Page visibility
  const [authMode, setAuthMode] = useState('login'); 
  const [authData, setAuthData] = useState({ email: '', password: '', username: '' });
  const [authLoading, setAuthLoading] = useState(true); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  // --- UI STATE ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(false); // Default Day Mode
  const [ramadanMode, setRamadanMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // --- DATA STATE ---
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
  const [newLink, setNewLink] = useState({ title: '', url: '', category: 'official' });
  const [newVaultLink, setNewVaultLink] = useState({ title: '', url: '', hint: '' });
  
  const [newCt, setNewCt] = useState({ course: '', topic: '', deadline: '' });
  const [newAssignment, setNewAssignment] = useState({ course: '', topic: '', deadline: '' });
  
  const [newNotice, setNewNotice] = useState({ title: '', message: '' });
  
  // --- INTERACTION STATE ---
  const [isAddingRoutine, setIsAddingRoutine] = useState(false);
  const [isAddingLink, setIsAddingLink] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isAddingVaultLink, setIsAddingVaultLink] = useState(false);
  const [aiMenuOpen, setAiMenuOpen] = useState(false);
  const [showVaultLinks, setShowVaultLinks] = useState({});
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  const notificationRef = useRef(null);
  const profileRef = useRef(null);

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

  // --- CLOCK ENGINE ---
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- DERIVED DATA ---
  const currentDayClassesList = useMemo(() => {
    const jsDayToName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return routine.filter(r => r.day === jsDayToName[currentTime.getDay()]);
  }, [routine, currentTime]); 

  const todaysStudyPlans = useMemo(() => {
    const pad = (n) => n < 10 ? '0'+n : n;
    const todayStr = `${currentTime.getFullYear()}-${pad(currentTime.getMonth()+1)}-${pad(currentTime.getDate())}`;
    return studyPlans.filter(p => p.date === todayStr);
  }, [studyPlans, currentTime]);

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

  // --- AUTH HANDLERS ---
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
    } catch (err) {
      setAuthError(err.message.replace('Firebase:', '').replace('auth/', ''));
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
    setShowCover(false); // Return to auth page instead of cover page
    setAuthData({ email: '', password: '', username: '' }); // Clear user credentials for security
    setAuthMode('login'); // Ensure it resets to login view
    setAuthError(''); // Clear any leftover errors
    setIsProfileModalOpen(false);
    setIsVaultOpen(false);
    setMobileSidebarOpen(false);
    setQuoteRevealed(false);
    setDailyQuote("");
  };

  // --- DATA SYNC (FIRESTORE) ---
  useEffect(() => {
    if (!user) return;
    
    // User specific collections
    const plansRef = collection(db, 'artifacts', appId, 'users', user.uid, 'studyPlans');
    const routineRef = collection(db, 'artifacts', appId, 'users', user.uid, 'routine');
    const linksRef = collection(db, 'artifacts', appId, 'users', user.uid, 'links');
    const vaultRef = collection(db, 'artifacts', appId, 'users', user.uid, 'vaultLinks');
    const ctsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'cts');
    const assignmentsRef = collection(db, 'artifacts', appId, 'users', user.uid, 'assignments');
    
    // Global and user settings
    const quoteDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'quoteData');
    const readAnnouncementsDoc = doc(db, 'artifacts', appId, 'users', user.uid, 'settings', 'readAnnouncements');
    const globalAnnouncementsRef = collection(db, 'artifacts', appId, 'public', 'data', 'global_notifications');

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
    };
  }, [user]);

  // --- HANDLERS ---
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
  };

  // Study Planner Handlers
  const addStudyPlan = async (e) => {
    e.preventDefault();
    if (!newPlan.topic || !newPlan.date || !user) return;
    const data = { ...newPlan, completed: false, createdAt: Date.now() };
    setNewPlan({ topic: '', date: '', timeSlot: '', priority: 'medium' });
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'studyPlans'), data);
  };
  const toggleStudyPlan = async (plan) => { if (user) await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'studyPlans', plan.id), { completed: !plan.completed }); };
  const deleteStudyPlan = async (id) => { if (user) await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'studyPlans', id)); };
  
  // CT Handlers
  const addCt = async (e) => {
    e.preventDefault();
    if (!newCt.course || !newCt.deadline || !user) return;
    const data = { ...newCt, completed: false, createdAt: Date.now() };
    setNewCt({ course: '', topic: '', deadline: '' });
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'cts'), data);
  };
  const toggleCt = async (ct) => { if(user) await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'cts', ct.id), { completed: !ct.completed }); };
  const deleteCt = async (id) => { if(user) await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'cts', id)); };

  // Assignment Handlers
  const addAssignment = async (e) => {
    e.preventDefault();
    if (!newAssignment.course || !newAssignment.deadline || !user) return;
    const data = { ...newAssignment, completed: false, createdAt: Date.now() };
    setNewAssignment({ course: '', topic: '', deadline: '' });
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'assignments'), data);
  };
  const toggleAssignment = async (ass) => { if(user) await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'assignments', ass.id), { completed: !ass.completed }); };
  const deleteAssignment = async (id) => { if(user) await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'assignments', id)); };

  // Admin Notification Handler
  const sendGlobalNotice = async (e) => {
    e.preventDefault();
    if (!newNotice.title || !newNotice.message || user.email !== ADMIN_EMAIL) return;
    const data = { ...newNotice, sender: user.displayName, createdAt: Date.now() };
    setNewNotice({ title: '', message: '' });
    await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'global_notifications'), data);
  };

  // Shared Handlers
  const addRoutine = async (e) => {
    e.preventDefault();
    if (!newRoutine.course || !user) return;
    const data = { ...newRoutine };
    setNewRoutine({ day: 'Saturday', course: '', code: '', faculty: '', time: '', room: '', ramadanTime: '' });
    setIsAddingRoutine(false);
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'routine'), data);
  };
  const deleteRoutine = async (id) => { if (user) await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'routine', id)); };

  const addLink = async (e) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url || !user) return;
    let url = newLink.url.startsWith('http') ? newLink.url : 'https://' + newLink.url;
    const data = { ...newLink, url };
    setNewLink({ title: '', url: '', category: 'official' });
    setIsAddingLink(false);
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'links'), data);
  };
  const deleteLink = async (id) => { if (user) await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', id)); };
  const toggleStarLink = async (link) => {
    if (!user) return;
    const isStarred = !!link.starred;
    await updateDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'links', link.id), { starred: !isStarred, starredAt: !isStarred ? Date.now() : null });
  };

  const addVaultLink = async (e) => {
    e.preventDefault();
    if (!newVaultLink.title || !newVaultLink.url || !user) return;
    let url = newVaultLink.url.startsWith('http') ? newVaultLink.url : 'https://' + newVaultLink.url;
    const data = { ...newVaultLink, url, createdAt: Date.now() };
    setNewVaultLink({ title: '', url: '', hint: '' });
    setIsAddingVaultLink(false);
    await addDoc(collection(db, 'artifacts', appId, 'users', user.uid, 'vaultLinks'), data);
  };
  const deleteVaultLink = async (id) => { if (id && user) await deleteDoc(doc(db, 'artifacts', appId, 'users', user.uid, 'vaultLinks', id)); };

  // --- UI COMPONENTS ---
  const NavItem = ({ id, icon: Icon, label, onClick }) => (
    <button 
      onClick={() => { setActiveTab(id); if (onClick) onClick(); }} 
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 relative w-full ${activeTab === id ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 translate-x-1 font-bold' : 'text-slate-600 dark:text-slate-300 hover:bg-white/40 dark:hover:bg-slate-800/40 font-medium'} outline-none`}
    >
      <Icon size={18} /> 
      <span className="text-sm capitalize">{label}</span>
      {id === 'inbox' && unreadAnnouncementsCount > 0 && (
        <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{unreadAnnouncementsCount}</span>
      )}
    </button>
  );

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

  if (!user) {
    if (showCover) {
      // --- COVER PAGE (Landing) ---
      return (
        <div className="min-h-screen relative flex flex-col items-center justify-center bg-[#fafafa] dark:bg-[#0a0a0a] transition-colors duration-500 font-sans overflow-hidden">
          <style dangerouslySetInnerHTML={{__html: `
            @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
            * { font-family: 'Plus Jakarta Sans', sans-serif; }
          `}} />
          
          {/* Subtle Background Glows for Premium Feel */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-20%] left-[50%] -translate-x-1/2 w-[800px] h-[600px] bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-[120px] opacity-70" />
          </div>

          {/* Header */}
          <header className="absolute top-0 w-full p-6 lg:px-12 flex justify-between items-center z-50">
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="p-1.5 bg-orange-500/10 rounded-lg group-hover:bg-orange-500/20 transition-colors">
                <School size={22} className="text-orange-500" />
              </div>
              <span className="font-extrabold text-lg dark:text-white text-slate-800 tracking-tight">StudyFlow</span>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2.5 rounded-full border border-slate-200/60 dark:border-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors outline-none shadow-sm backdrop-blur-md"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </header>

          {/* Main Content */}
          <div className="flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-700 z-10 px-4 mt-10">
            
            {/* Live Workspace Badge */}
            <div className="mb-8 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[11px] uppercase tracking-wider font-bold flex items-center gap-2.5 shadow-[0_0_15px_rgba(16,185,129,0.15)] backdrop-blur-md">
               <div className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
               </div>
               <span className="drop-shadow-[0_0_8px_rgba(16,185,129,0.6)]">Workspace Online</span>
            </div>

            {/* Title & Subtitle */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 tracking-tighter py-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300">Study</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-orange-400 dark:from-orange-400 dark:to-orange-300">Flow</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-[500px] text-sm md:text-base mb-12 font-medium leading-relaxed">
              Your ultimate academic workspace. Streamline your routines, track deadlines, and conquer the chaos with ease.
            </p>

            {/* Sleek Feature Pills */}
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mb-12">
               {[
                 { icon: BookOpen, text: 'Academics' },
                 { icon: CheckSquare, text: 'Organize' },
                 { icon: ShieldCheck, text: 'Secure' }
               ].map((item, idx) => (
                 <div key={idx} className="flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-slate-200/60 dark:border-white/5 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md transition-all hover:border-orange-500/30 dark:hover:border-orange-500/30 hover:bg-white/80 dark:hover:bg-slate-800/80 hover:-translate-y-0.5 shadow-sm">
                   <item.icon className="text-orange-500" size={18} />
                   <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{item.text}</span>
                 </div>
               ))}
            </div>

            {/* Premium Action Button */}
            <button 
              onClick={() => setShowCover(false)} 
              className="group relative bg-orange-500 hover:bg-orange-600 text-white px-8 py-3.5 rounded-2xl font-bold text-sm md:text-base flex items-center gap-2.5 transition-all shadow-[0_8px_30px_rgb(249,115,22,0.3)] hover:shadow-[0_8px_30px_rgb(249,115,22,0.5)] active:scale-95 mb-8 outline-none overflow-hidden"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              <span className="relative z-10">Enter Workspace</span> 
              <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <style>{`@keyframes shimmer { 100% { transform: translateX(100%); } }`}</style>
            </button>

            {/* Smarter Bottom Subtext */}
            <p className="text-xs text-slate-400 dark:text-slate-500 max-w-[340px] font-medium leading-relaxed">
              Join thousands of students taking control of their academic journey. Fast, secure, and entirely yours.
            </p>
          </div>
        </div>
      );
    }

    // --- AUTH PAGE (Login/Signup) ---
    return (
      <div className="min-h-screen relative flex items-center justify-center p-6 transition-colors duration-500 font-sans overflow-hidden bg-slate-50 dark:bg-slate-950">
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
          * { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}} />
        
        {/* Back Button to Cover Page */}
        <button 
          onClick={() => setShowCover(true)}
          className="absolute top-6 left-6 flex items-center gap-1.5 text-slate-500 hover:text-orange-500 dark:text-slate-400 dark:hover:text-orange-400 transition-colors z-50 font-bold text-sm outline-none bg-white/50 dark:bg-slate-800/50 backdrop-blur-md px-4 py-2 rounded-xl shadow-sm border border-slate-200/50 dark:border-white/10"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-orange-400/30 dark:bg-orange-600/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-[100px]" />
        </div>
        <div className="w-full max-w-md space-y-8 animate-in fade-in duration-500 relative z-10 transform-gpu mt-8 md:mt-0">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500/90 backdrop-blur-md rounded-2xl text-white shadow-xl shadow-orange-500/30 mb-6 border border-white/20"><School size={32} /></div>
            <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">StudyFlow</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-2">Your Personal Academic Workspace</p>
          </div>
          
          <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl p-8 rounded-3xl border border-white/50 dark:border-white/10 shadow-2xl relative overflow-hidden">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6 text-center">{authMode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
            
            <form onSubmit={handleAuth} className="space-y-4 relative z-10">
              {authMode === 'signup' && (
                <div className="relative group">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                  <input required type="text" placeholder="Your Name" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 font-medium text-sm focus:ring-2 focus:ring-orange-500/50 dark:text-white outline-none transition-all shadow-sm" value={authData.username} onChange={e => setAuthData({...authData, username: e.target.value})} />
                </div>
              )}
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input required type="email" placeholder="Email Address" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 font-medium text-sm focus:ring-2 focus:ring-orange-500/50 dark:text-white outline-none transition-all shadow-sm" value={authData.email} onChange={e => setAuthData({...authData, email: e.target.value})} />
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input required type="password" placeholder="Password" className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-white/40 dark:border-white/10 font-medium text-sm focus:ring-2 focus:ring-orange-500/50 dark:text-white outline-none transition-all shadow-sm" value={authData.password} onChange={e => setAuthData({...authData, password: e.target.value})} />
              </div>
              
              {authError && <div className="bg-red-50/80 dark:bg-red-900/20 p-3 rounded-xl border border-red-200/50 dark:border-red-900/30 text-sm font-medium text-red-600 leading-tight">{authError}</div>}
              {resetSent && <div className="bg-emerald-50/80 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-200/50 dark:border-emerald-900/30 text-sm font-medium text-emerald-600 text-center">Password reset link sent to your email.</div>}
              
              <button 
                type="submit" disabled={isSubmitting}
                className="w-full bg-orange-500/90 backdrop-blur-md text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-orange-500/30 hover:bg-orange-600 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 outline-none border border-white/20"
              >
                {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : (authMode === 'login' ? 'Sign In' : 'Sign Up')}
              </button>
            </form>
            
            <div className="mt-6 flex flex-col items-center gap-3 relative z-10 text-center">
              <button onClick={() => { setAuthMode(authMode === 'login' ? 'signup' : 'login'); setAuthError(''); }} className="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors outline-none">{authMode === 'login' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}</button>
              {authMode === 'login' && <button onClick={handleForgotPassword} className="text-xs font-medium text-slate-500 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors outline-none">Forgot password?</button>}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 overflow-hidden relative">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-glow { animation: glowCustom 2.5s ease-in-out infinite; }
        @keyframes glowCustom {
          0%, 100% { opacity: 1; filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.8)); text-shadow: 0 0 10px rgba(249,115,22,0.8); }
          50% { opacity: 0.5; filter: drop-shadow(0 0 0px rgba(249, 115, 22, 0)); text-shadow: none; }
        }
        
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(249, 115, 22, 0.4); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(249, 115, 22, 0.6); }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(249, 115, 22, 0.5); }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(249, 115, 22, 0.8); }

        .dark input[type="date"] { color-scheme: dark; }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; opacity: 0.6; transition: 0.2s; }
        input[type="date"]::-webkit-calendar-picker-indicator:hover { opacity: 1; }
      `}} />

      {/* Background Orbs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-orange-400/20 dark:bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/20 dark:bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] bg-purple-400/20 dark:bg-purple-500/10 rounded-full blur-[120px]" />
      </div>
      
      {/* SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-[100] lg:relative lg:translate-x-0 w-72 lg:w-64 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-r border-white/50 dark:border-white/10 flex flex-col p-6 transition-transform duration-300 overflow-y-auto custom-scrollbar shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${mobileSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8 px-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-orange-500/90 backdrop-blur-md rounded-lg flex items-center justify-center text-white shadow-lg border border-white/20"><School size={18} /></div>
            <h1 className="text-lg font-bold tracking-tight text-slate-800 dark:text-white">StudyFlow</h1>
          </div>
          <button onClick={() => setMobileSidebarOpen(false)} className="lg:hidden p-2 text-slate-500 hover:text-orange-500 outline-none"><X size={20} /></button>
        </div>
        
        <nav className="flex flex-col gap-1.5 flex-grow mb-6 relative z-10">
          <NavItem id="dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setMobileSidebarOpen(false)} />
          <NavItem id="planner" icon={CheckSquare} label="Study Planner" onClick={() => setMobileSidebarOpen(false)} />
          <NavItem id="routine" icon={Calendar} label="Routine" onClick={() => setMobileSidebarOpen(false)} />
          <NavItem id="assessments" icon={FileText} label="C & A" onClick={() => setMobileSidebarOpen(false)} />
          <NavItem id="links" icon={LinkIcon} label="Link Vault" onClick={() => setMobileSidebarOpen(false)} />
        </nav>

        <div className="relative z-10"><CreditSection /></div>
        
        <div className="mt-auto pt-6 border-t border-slate-200/50 dark:border-slate-700/50 relative z-10 space-y-2">
           <button onClick={() => setRamadanMode(!ramadanMode)} className="w-full flex items-center justify-between group outline-none p-2 hover:bg-white/40 dark:hover:bg-slate-800/40 rounded-xl transition-colors">
              <div className="flex items-center gap-3 text-sm font-semibold text-slate-600 dark:text-slate-300"><MoonStar size={18} className="text-indigo-400" /> Ramadan Mode</div>
              <div className={`w-9 h-5 rounded-full p-0.5 transition-colors shadow-inner ${ramadanMode ? 'bg-indigo-500/90 backdrop-blur-sm' : 'bg-slate-300/50 dark:bg-slate-700/50'}`}><div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${ramadanMode ? 'translate-x-4' : 'translate-x-0'}`} /></div>
           </button>
           
           <NavItem id="inbox" icon={Inbox} label="Inbox" onClick={() => setMobileSidebarOpen(false)} />
           
           <div className="pt-4 mt-2 flex items-center justify-between px-2">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-white/50 dark:bg-slate-800/50 backdrop-blur-md flex items-center justify-center text-slate-500 border border-white/40 dark:border-white/10 shadow-sm"><UserCircle size={16} /></div>
                <div className="overflow-hidden"><p className="text-sm font-bold text-slate-800 dark:text-white truncate max-w-[120px]">{user.displayName}</p></div>
              </div>
              <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors outline-none"><LogOut size={16} /></button>
           </div>
        </div>
      </aside>

      {mobileSidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[99] lg:hidden" onClick={() => setMobileSidebarOpen(false)} />}

      <main className="flex-grow overflow-y-auto relative bg-transparent custom-scrollbar z-10 transform-gpu" style={{ WebkitOverflowScrolling: 'touch' }}>
        <header className="sticky top-0 z-50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-2xl px-6 lg:px-8 py-4 flex justify-between items-center border-b border-white/50 dark:border-white/10 shadow-sm transform-gpu">
          <div className="flex items-center gap-3">
             <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 text-slate-600 dark:text-slate-400 hover:text-orange-500 transition-colors outline-none"><Menu size={22} /></button>
             <h2 className="text-lg font-bold text-slate-800 dark:text-white capitalize">{activeTab === 'assessments' ? 'CT & Assignments' : activeTab}</h2>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="px-3 py-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl border border-white/60 dark:border-white/10 shadow-sm text-xs font-bold text-slate-700 hidden sm:flex items-center gap-2 tabular-nums">
              <Clock size={14} className="text-orange-500" /> <span className="dark:text-slate-300">{currentTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })}</span>
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
                      <button onClick={() => { setActiveTab('inbox'); setIsNotificationsOpen(false); }} className="w-full text-center text-xs font-bold text-orange-500 hover:text-orange-600 p-1.5">View All in Inbox</button>
                    </div>
                  </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button onClick={() => setIsProfileModalOpen(!isProfileModalOpen)} className="p-2.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full border border-white/60 dark:border-white/10 shadow-sm transition-all text-slate-600 dark:text-slate-400 hover:text-orange-500 outline-none"><UserCircle size={18} /></button>
              {isProfileModalOpen && (
                  <div className="absolute right-0 mt-3 w-[260px] sm:w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-4 z-50 animate-in zoom-in-95 duration-200">
                    <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                      <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user.displayName}</p>
                      <p className="text-xs font-medium text-slate-500 truncate">{user.email}</p>
                    </div>
                    
                    {/* Dark Mode inside Profile */}
                    <div className="mb-2 pb-2 border-b border-slate-200 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-400 mb-2 px-2 uppercase tracking-wide">Appearance</p>
                      <div className="grid grid-cols-2 gap-2">
                         <button onClick={() => setDarkMode(false)} className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${!darkMode ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}><Sun size={14}/> Light</button>
                         <button onClick={() => setDarkMode(true)} className={`flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-bold transition-all ${darkMode ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400'}`}><Moon size={14}/> Dark</button>
                      </div>
                    </div>

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
                        <h2 className="text-xl lg:text-2xl font-extrabold text-slate-800 dark:text-white leading-tight mb-1.5 flex items-center gap-2">
                          Welcome back, {user?.displayName?.split(' ')[0] || 'Student'}! <span>👋</span>
                        </h2>
                        <div className="text-sm lg:text-base font-semibold text-slate-600 dark:text-slate-400 block sm:inline-block mt-1">
                          <span className="mr-1.5 normal-case font-medium">StudyFlow is here to help you by-</span>
                          <span className="text-lg lg:text-xl transition-all">
                            <TypewriterEffect items={TYPEWRITER_ITEMS} />
                          </span>
                        </div>
                      </div>
                  </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                  {/* Daily Inspiration */}
                  <div className="relative overflow-hidden rounded-3xl bg-slate-900/80 backdrop-blur-2xl p-8 text-white shadow-xl border border-white/10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                    <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center md:items-start justify-between">
                      <div className="flex-grow w-full">
                        <div className="flex items-center gap-2 mb-4 text-orange-400 animate-glow">
                          <Quote size={20} className="drop-shadow-md" />
                          <span className="text-xs font-bold uppercase tracking-wider">Daily Inspiration</span>
                        </div>
                        <div className="min-h-[80px] flex flex-col justify-center">
                          {!quoteRevealed ? (
                            <div>
                              <h3 className="text-lg font-bold text-slate-300 italic mb-5">"Unlock today's motivation to get started."</h3>
                              <button onClick={handleRevealQuote} className="inline-flex items-center gap-2 bg-orange-500/90 backdrop-blur-md text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-600 transition-all outline-none shadow-lg shadow-orange-500/30 active:scale-95 border border-white/20"><Zap size={16} /> Reveal Quote</button>
                            </div>
                          ) : (
                            <div className="animate-in slide-in-from-bottom-2 duration-500">
                              <h3 className="text-xl md:text-2xl font-bold mb-3 leading-relaxed">"{dailyQuote}"</h3>
                              <p className="text-xs font-semibold text-slate-400 flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-400" /> Daily quote unlocked</p>
                            </div>
                          )}
                        </div>
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
                                  <button onClick={() => deleteStudyPlan(p.id)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all outline-none"><Trash2 size={18} /></button>
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
                             <button onClick={() => deleteCt(ct.id)} className="opacity-0 group-hover:opacity-100 self-start p-1.5 text-slate-400 hover:text-red-500 transition-colors outline-none"><Trash2 size={16} /></button>
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
                             <button onClick={() => deleteAssignment(ass.id)} className="opacity-0 group-hover:opacity-100 self-start p-1.5 text-slate-400 hover:text-red-500 transition-colors outline-none"><Trash2 size={16} /></button>
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
                  <button onClick={() => setIsAddingRoutine(true)} className="relative z-10 bg-blue-500/90 backdrop-blur-md text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-blue-500/30 hover:bg-blue-600 transition-colors outline-none border border-white/20"><Plus size={18} /> Add Class</button>
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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {DAYS.map(day => { 
                    const classes = routine.filter(r => r.day === day); 
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
                        <div key={k} className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-white/50 dark:border-white/10 overflow-hidden flex flex-col h-[380px] shadow-xl shadow-slate-200/20 dark:shadow-black/20 hover:shadow-2xl transition-all duration-200">
                          <div className={`px-5 py-4 flex items-center justify-between border-b border-white/40 dark:border-white/10 backdrop-blur-md ${cat.bg}`}>
                            <div className="flex items-center gap-3">
                              <cat.icon className={cat.color} size={18} />
                              <h4 className="font-extrabold text-slate-800 dark:text-slate-200 text-sm">{cat.label}</h4>
                            </div>
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400 bg-white/50 dark:bg-black/20 px-2 py-0.5 rounded-md shadow-sm border border-white/40 dark:border-white/5">{list.length}</span>
                          </div>
                          <div className="p-3 space-y-2 overflow-y-auto flex-grow custom-scrollbar">
                            {list.length === 0 ? (
                               <div className="h-full flex items-center justify-center text-xs font-medium text-slate-500">No links here yet.</div>
                            ) : (
                              list.map(l => (
                                <div key={l.id} className={`group flex items-center justify-between p-3 rounded-xl border transition-colors hover:-translate-y-0.5 shadow-sm hover:shadow-md ${l.starred ? 'border-amber-300/60 dark:border-amber-500/40 bg-amber-50/80 dark:bg-amber-500/10' : 'border-white/40 dark:border-white/5 bg-white/40 dark:bg-slate-800/40 hover:bg-white/70 dark:hover:bg-slate-700/60'}`}>
                                  <div className="flex items-center gap-3 overflow-hidden outline-none flex-grow pr-2">
                                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleStarLink(l); }} className={`shrink-0 p-1.5 rounded-lg transition-all outline-none ${l.starred ? 'text-amber-500 hover:text-amber-600 bg-amber-100/50 dark:bg-amber-900/30' : 'text-slate-300 dark:text-slate-600 hover:text-amber-400 group-hover:text-amber-400/70 hover:bg-white/60 dark:hover:bg-slate-700/60'}`}>
                                      <Star size={16} className={l.starred ? "fill-amber-500" : ""} />
                                    </button>
                                    <a href={l.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 overflow-hidden outline-none flex-grow">
                                      <div className={`p-2 rounded-lg transition-colors shrink-0 shadow-sm border border-white/40 dark:border-white/5 ${l.starred ? 'bg-amber-100/80 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-200/50 dark:border-amber-700/50' : 'bg-white/60 dark:bg-slate-800/60 text-slate-500 group-hover:text-emerald-500 group-hover:bg-emerald-50/80 dark:group-hover:bg-emerald-500/20'}`}>
                                        <ExternalLink size={14} />
                                      </div>
                                      <div className="overflow-hidden">
                                        <p className={`font-bold text-sm truncate ${l.starred ? 'text-amber-700 dark:text-amber-300' : 'text-slate-800 dark:text-slate-200'}`}>{l.title}</p>
                                        <p className={`text-xs font-medium truncate mt-0.5 ${l.starred ? 'text-amber-600/70 dark:text-amber-400/70' : 'text-slate-500 dark:text-slate-400'}`}>{l.url.replace(/^https?:\/\//, '')}</p>
                                      </div>
                                    </a>
                                  </div>
                                  <button onClick={() => deleteLink(l.id)} className="shrink-0 opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-500 transition-all outline-none"><Trash2 size={16} /></button>
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
            <div className="grid grid-cols-1 max-h-[300px] overflow-y-auto custom-scrollbar py-2">
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

      {/* MOBILE BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden z-40 bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border-t border-white/50 dark:border-white/10 pb-safe shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
        <div className="flex justify-around items-center px-2 py-2">
          {[{id: 'dashboard', icon: LayoutDashboard}, {id: 'planner', icon: CheckSquare}, {id: 'routine', icon: Calendar}, {id: 'assessments', icon: FileText}, {id: 'links', icon: LinkIcon}].map(item => { 
            const NavIcon = item.icon; 
            const isActive = activeTab === item.id;
            return (
              <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center justify-center w-16 h-14 rounded-2xl transition-all outline-none ${isActive ? 'text-orange-500 scale-105' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
                <div className={`p-1.5 rounded-xl transition-colors ${isActive ? 'bg-orange-50/80 dark:bg-orange-500/20 shadow-sm border border-orange-200/50 dark:border-orange-800/30 backdrop-blur-md' : ''}`}>
                  <NavIcon size={22} />
                </div>
              </button>
            ); 
          })}
        </div>
      </nav>

      {/* VAULT MODAL */}
      {isVaultOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
           <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-6 md:p-8 rounded-3xl shadow-2xl w-full max-w-2xl border border-white/50 dark:border-white/10 relative max-h-[85vh] overflow-hidden flex flex-col">
              <button onClick={() => setIsVaultOpen(false)} className="absolute top-6 right-6 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors z-20 outline-none shadow-sm border border-white/40 dark:border-white/10"><X size={20} /></button>
              
              <div className="mb-8 flex items-center gap-4 border-b border-white/40 dark:border-white/10 pb-6">
                <div className="p-3 bg-indigo-100/60 dark:bg-indigo-900/40 backdrop-blur-md rounded-2xl text-indigo-600 dark:text-indigo-400 shadow-sm border border-white/50 dark:border-white/5"><ShieldCheck size={28} /></div>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-1">Hidden Vault</h3>
                  <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Secure storage for sensitive links</p>
                </div>
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
                    <button onClick={() => deleteVaultLink(v.id)} className="p-2 text-slate-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 outline-none bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-lg border border-white/40 dark:border-white/5 shadow-sm"><Trash2 size={18} /></button>
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
           </div>
        </div>
      )}

      {/* ADD LINK MODAL */}
      {isAddingLink && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
           <div className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-3xl p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 dark:border-white/10 relative">
              <button onClick={() => setIsAddingLink(false)} className="absolute top-6 right-6 p-2 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-full text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors z-20 outline-none shadow-sm border border-white/40 dark:border-white/10"><X size={20} /></button>
              <h3 className="text-xl font-extrabold text-slate-800 dark:text-white mb-6 z-20 flex items-center gap-2"><LinkIcon size={20} className="text-emerald-500" /> Add New Link</h3>
              
              <form onSubmit={addLink} className="space-y-4 relative z-20">
                <input required value={newLink.title} onChange={e => setNewLink({...newLink, title: e.target.value})} placeholder="Website Title" className="w-full p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl border border-white/60 dark:border-white/10 shadow-inner text-sm font-semibold focus:border-emerald-500 dark:text-white outline-none" />
                <GlassSelect value={newLink.category} onChange={val => setNewLink({...newLink, category: val})} options={CATEGORY_ORDER.map(k => ({value: k, label: CATEGORIES[k.toUpperCase()].label}))} />
                <input required value={newLink.url} onChange={e => setNewLink({...newLink, url: e.target.value})} placeholder="URL (e.g., elms.uiu.ac.bd)" className="w-full p-3.5 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-xl border border-white/60 dark:border-white/10 shadow-inner text-sm font-semibold focus:border-emerald-500 dark:text-white outline-none" />
                <div className="flex justify-end pt-4">
                  <button type="submit" className="w-full py-3.5 bg-emerald-500/90 backdrop-blur-md hover:bg-emerald-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/30 border border-white/20 transition-colors active:scale-95 outline-none">Save Link</button>
                </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}