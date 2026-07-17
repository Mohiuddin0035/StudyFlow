import React, { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, Send, X, Loader2, Settings, Trash2 } from 'lucide-react';

const StudyFlowAIChatbot = ({
  isOpen,
  onClose,
  user,
  routine = [],
  studyPlans = [],
  cts = [],
  assignments = [],
  links = [],
  completedFocusMinutes = 0,
  dailyFocusGoal = 240,
  focusStreak = 0,
  focusDuration = 30,
  customApiKey = '',
  onSaveCustomApiKey
}) => {
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hii! I'm Flowy, your StudyFlow AI buddy. Ask me anything about your class routine, study plan, or tests! 🚀" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const chatEndRef = useRef(null);

  // Sync tempApiKey when customApiKey changes
  useEffect(() => {
    setTempApiKey(customApiKey);
  }, [customApiKey]);

  // Auto scroll to bottom
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isOpen, showSettings]);

  const assembleContext = () => {
    const tzOptions = { timeZone: 'Asia/Dhaka' };
    const now = new Date();
    const todayStr = now.toLocaleDateString('en-CA', tzOptions);
    const todayDayName = now.toLocaleDateString('en-US', { ...tzOptions, weekday: 'long' });
    const currentDateTimeStr = now.toLocaleString('en-US', {
      ...tzOptions,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    const todayClasses = routine.filter(r => r.day.toLowerCase() === todayDayName.toLowerCase());

    let ctx = `You are Flowy, a helpful and friendly academic companion for the student ${user?.displayName || 'User'}.
Current Time: ${currentDateTimeStr} (Today is ${todayDayName}, ${todayStr}).

Here is the student's current workspace data:

1. TODAY'S CLASS SCHEDULE (Today is ${todayDayName}):
${todayClasses.length === 0 ? 'No classes are scheduled for today.' : todayClasses.map(r => `- ${r.course} (${r.code}) at ${r.time} in Room ${r.room} (Faculty: ${r.faculty || 'N/A'})`).join('\n')}

2. WEEKLY CLASS ROUTINE (FULL TIMETABLE):
${routine.length === 0 ? 'No routine classes added.' : routine.map(r => `- ${r.day}: ${r.course} (${r.code}) at ${r.time} in Room ${r.room} (Faculty: ${r.faculty || 'N/A'})`).join('\n')}

3. STUDY PLAN:
${studyPlans.length === 0 ? 'No study plans added.' : studyPlans.map(p => `- ${p.date}: ${p.topic} [Slot: ${p.timeSlot || 'Anytime'}] [Priority: ${p.priority}] [${p.completed ? 'Completed' : 'Pending'}]`).join('\n')}

4. CLASS TESTS (CTS) & ASSIGNMENTS:
- Class Tests:
${cts.length === 0 ? 'No Class Tests (CTs) added.' : cts.map(c => `- ${c.course} CT on ${c.topic} (Deadline: ${c.deadline}) [${c.completed ? 'Completed' : 'Pending'}]`).join('\n')}
- Assignments:
${assignments.length === 0 ? 'No Assignments added.' : assignments.map(a => `- ${a.course} Assignment on ${a.topic} (Deadline: ${a.deadline}) [${a.completed ? 'Completed' : 'Pending'}]`).join('\n')}

5. FOCUS STATISTICS:
- Completed Focus Time Today: ${completedFocusMinutes} minutes
- Daily Focus Goal: ${dailyFocusGoal} minutes
- Active Streak: ${focusStreak} days
- Default Session Duration: ${focusDuration} minutes

6. SAVED RESOURCE LINKS:
${links.length === 0 ? 'No resource links saved.' : links.map(l => `- ${l.title}: ${l.url} [Category: ${l.category}] [Starred: ${l.starred ? 'Yes' : 'No'}]`).join('\n')}

INSTRUCTIONS:
- Introduce yourself as Flowy.
- Greet the student based on the current time of day: say "Good morning" if it's morning (5 AM to 12 PM), "Good afternoon" if it's afternoon (12 PM to 5 PM), or "Good evening/Good night" if it's evening/night (5 PM to 5 AM). Never say "Good morning" if the current hour is in the afternoon or evening.
- If the user asks who you are or what you are, reply with: "I'm Flowy, your StudyFlow AI buddy. I can help you manage and organize your class routine, study plans, tests, links, and track your focus sessions!" (keep it friendly and structured).
- If the user asks who built you, who is the dev of StudyFlow, or who made this website, reply with: "I am Flowy, a StudyFlow assistant! I was developed by Moheuddin Sikder Saikat, a UIU (United International University) CSE undergraduate student from the 242 batch. He worked incredibly hard to bring his vision of StudyFlow to life, creating a space to help you organize and conquer your academic schedule."
- Do NOT automatically blurt out the student's entire timetable or statistics upon a simple greeting like 'hi', 'hello', 'hii' or similar. Just respond with a friendly greeting first, and only provide specific schedule or study information if they explicitly ask for it.
- If the student asks about today's schedule, refer ONLY to the "TODAY'S CLASS SCHEDULE" section. If that section says "No classes are scheduled for today", state clearly that they have no classes today. Do NOT fetch classes from other days in the "WEEKLY CLASS ROUTINE" section for today's schedule. Only suggest upcoming classes on other days if you explicitly mention they are for a future date (e.g. tomorrow or next week).
- Be supportive, encouraging, motivational, and help them organize or optimize their tough schedules when they express feeling overwhelmed.
- Keep your answers concise, structured, and easy to read.`;

    return ctx;
  };

  const callChatbotAPI = async (messagesList) => {
    const defaultKeys = [
      
      //keys
    ];

    // Prioritize user's custom API key if defined, then fall back to defaults
    const keys = customApiKey ? [customApiKey, ...defaultKeys] : defaultKeys;

    const models = [
      "openrouter/free",
      "meta-llama/llama-3.2-3b-instruct:free"
    ];

    const makeRequest = async (key, model) => {
      const bodyData = {
        model: model,
        messages: [
          { role: 'system', content: assembleContext() },
          ...messagesList.map(m => ({ role: m.role, content: m.content }))
        ],
        temperature: 0.7
      };

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key}`,
          'HTTP-Referer': 'https://studyflow-3686a.firebaseapp.com',
          'X-Title': 'StudyFlow AI Client'
        },
        body: JSON.stringify(bodyData)
      });
      
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          throw new Error("KEY_AUTH_FAILED");
        }
        throw new Error(`API Error: ${res.status}`);
      }
      
      const data = await res.json();
      if (data.error) {
        const code = data.error.code;
        if (code === 401 || code === 403) {
          throw new Error("KEY_AUTH_FAILED");
        }
        throw new Error(`OpenRouter Error: ${data.error.message || data.error}`);
      }
      
      return data.choices?.[0]?.message?.content || "";
    };

    for (const key of keys) {
      for (const model of models) {
        try {
          const reply = await makeRequest(key, model);
          if (reply) return reply;
        } catch (e) {
          console.warn(`Model ${model} failed with key:`, e);
          if (e.message === "KEY_AUTH_FAILED") {
            break; // Skip other models for this key
          }
        }
      }
    }

    throw new Error("LIMIT_EXHAUSTED");
  };

  const handleSendChatMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userMessage = { role: 'user', content: chatInput.trim() };
    const updatedMessages = [...chatMessages, userMessage];
    
    setChatMessages(updatedMessages);
    setChatInput('');
    setChatLoading(true);

    try {
      const response = await callChatbotAPI(updatedMessages);
      setChatMessages([...updatedMessages, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error("Chat error:", err);
      let errorMsg = "Sorry, I encountered an issue connection to the AI engine. Please try again.";
      if (err.message === "LIMIT_EXHAUSTED") {
        errorMsg = "Today's AI usage limit is over. Please come again tomorrow or after the refresh time! ⏳";
      }
      setChatMessages([...updatedMessages, { role: 'assistant', content: errorMsg }]);
    } finally {
      setChatLoading(false);
    }
  };

  const handleClearChat = () => {
    setChatMessages([
      { role: 'assistant', content: "Hii! I'm Flowy, your StudyFlow AI buddy. Ask me anything about your class routine, study plan, or tests! 🚀" }
    ]);
  };

  const handleSaveKey = (e) => {
    e.preventDefault();
    if (onSaveCustomApiKey) {
      onSaveCustomApiKey(tempApiKey.trim());
    }
    setShowSettings(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-xl border border-white/50 dark:border-white/10 relative h-[600px] max-h-[85vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200 transform-gpu" onClick={e => e.stopPropagation()}>
        
        {/* Header */}
        <div className="p-5 border-b border-white/40 dark:border-white/5 flex items-center gap-3 relative">
          <div className="p-2 bg-orange-500/10 rounded-xl border border-orange-500/20 text-orange-500 shadow-sm"><Bot size={22} /></div>
          <div>
            <h3 className="text-base font-extrabold text-slate-800 dark:text-white leading-none mb-1 flex items-center gap-1.5">Flowy <Sparkles size={12} className="text-orange-500 animate-pulse" /></h3>
            <p className="text-[11px] font-bold text-slate-500">{customApiKey ? 'Custom AI Mode 🔑' : 'Shared AI Mode'}</p>
          </div>
          
          <div className="ml-auto flex items-center gap-1.5 relative z-10">
            <button 
              onClick={() => setShowSettings(!showSettings)} 
              className={`p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-all outline-none cursor-pointer ${showSettings ? 'text-orange-500 bg-orange-50 dark:bg-orange-500/10 border-orange-500/20' : ''}`}
              title="AI Settings"
            >
              <Settings size={15} />
            </button>
            <button 
              onClick={handleClearChat} 
              className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 hover:text-red-550 dark:hover:text-red-400 transition-colors outline-none cursor-pointer" 
              title="Clear Chat"
            >
              <Trash2 size={15} />
            </button>
            <button 
              onClick={onClose} 
              className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors outline-none cursor-pointer" 
              title="Close"
            >
              <X size={15} />
            </button>
          </div>
        </div>
        
        {showSettings ? (
          /* SETTINGS VIEW */
          <div className="flex-grow p-6 space-y-6 flex flex-col justify-between bg-slate-50/20 dark:bg-slate-950/20 overflow-y-auto custom-scrollbar transform-gpu">
            <div className="space-y-4">
              <h4 className="text-sm font-extrabold text-slate-800 dark:text-white">Configure custom OpenRouter key</h4>
              <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                If the shared workspace API keys hit rate limits or exhaust daily quotas, you can enter your own free OpenRouter API key below.
              </p>
              
              <form onSubmit={handleSaveKey} className="space-y-4 pt-2">
                <div>
                  <label className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1.5">OpenRouter API Key</label>
                  <input 
                    type="password"
                    value={tempApiKey}
                    onChange={e => setTempApiKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="w-full px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-xs font-bold focus:ring-2 focus:ring-orange-500/50 outline-none dark:text-white"
                  />
                </div>
                
                <div className="flex gap-2.5 pt-2">
                  <button type="submit" className="flex-grow bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition-all outline-none border border-white/10 cursor-pointer">Save Key</button>
                  {customApiKey && (
                    <button 
                      type="button" 
                      onClick={() => {
                        if (onSaveCustomApiKey) onSaveCustomApiKey('');
                        setTempApiKey('');
                        setShowSettings(false);
                      }} 
                      className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500 font-bold text-xs px-4 py-3 rounded-xl active:scale-95 transition-all outline-none cursor-pointer"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            <div className="p-4 rounded-2xl bg-white/40 dark:bg-slate-800/40 border border-black/5 dark:border-white/5 space-y-2">
              <span className="text-[10px] font-extrabold text-orange-500 uppercase tracking-wider block">How to get a free API Key:</span>
              <ol className="list-decimal list-inside text-[11px] font-semibold text-slate-500 space-y-1">
                <li>Go to <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline inline-flex items-center gap-0.5">openrouter.ai/keys</a>.</li>
                <li>Sign up / sign in (takes 30 seconds).</li>
                <li>Click <strong>Create Key</strong>, name it "StudyFlow", copy and paste it here!</li>
              </ol>
            </div>
          </div>
        ) : (
          /* CHAT VIEW */
          <>
            {/* Chat Messages */}
            <div className="flex-grow overflow-y-auto custom-scrollbar p-5 space-y-4 flex flex-col bg-slate-50/10 dark:bg-slate-950/10 transform-gpu">
              {chatMessages.map((msg, index) => {
                const isUser = msg.role === 'user';
                return (
                  <div key={index} className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
                    <span className="text-[9px] font-bold text-slate-400 mb-1 px-1.5 uppercase select-none">{isUser ? 'You' : 'Flowy'}</span>
                    <div className={`p-3.5 rounded-2xl max-w-[85%] text-xs font-semibold leading-relaxed shadow-sm whitespace-pre-wrap border ${
                      isUser 
                        ? 'bg-orange-500 text-white rounded-tr-none border-orange-600/10 shadow-orange-500/5'
                        : 'bg-white/60 dark:bg-slate-800/60 dark:text-slate-200 rounded-tl-none border-white/50 dark:border-white/5'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                );
              })}
              
              {/* If limits are hit, display configuration prompt card */}
              {chatMessages.length > 0 && chatMessages[chatMessages.length - 1].content.includes("usage limit") && (
                <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex flex-col gap-2.5 max-w-[90%] self-start animate-in zoom-in-95 duration-200">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Want to bypass rate limits instantly?</p>
                  <p className="text-[11px] font-semibold text-slate-500 leading-normal">
                    You can input your own free OpenRouter API key so your personal workspace has dedicated chat limits.
                  </p>
                  <button 
                    onClick={() => setShowSettings(true)}
                    className="self-start px-4 py-2 bg-orange-500 text-white font-bold text-xs rounded-lg shadow-sm border border-white/10 hover:bg-orange-600 transition-colors cursor-pointer"
                  >
                    Setup API Key 🔑
                  </button>
                </div>
              )}
              
              {chatLoading && (
                <div className="flex flex-col items-start animate-pulse">
                  <span className="text-[9px] font-bold text-slate-400 mb-1 px-1.5 uppercase">Flowy</span>
                  <div className="p-3.5 rounded-2xl rounded-tl-none bg-white/60 dark:bg-slate-800/60 dark:text-slate-200 text-xs font-semibold border border-white/50 dark:border-white/5 shadow-sm flex items-center gap-1.5">
                    <Loader2 size={12} className="animate-spin text-orange-500" />
                    <span>Analyzing your workspace data...</span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>
            
            {/* Input Bar */}
            <form onSubmit={handleSendChatMessage} className="p-4 bg-slate-50/50 dark:bg-slate-900/50 border-t border-white/40 dark:border-white/10 flex gap-2 items-center">
              <input 
                required 
                type="text" 
                value={chatInput} 
                onChange={e => setChatInput(e.target.value)} 
                placeholder="Ask: 'what is my schedule today?' or get motivation..." 
                className="flex-grow px-4 py-3 bg-white/50 dark:bg-slate-800/50 border border-white/60 dark:border-white/10 rounded-xl text-xs font-semibold focus:ring-2 focus:ring-orange-500/50 outline-none dark:text-white shadow-inner"
              />
              <button 
                type="submit" 
                disabled={chatLoading}
                className="p-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md shadow-orange-500/20 active:scale-95 transition-all outline-none border border-white/20 disabled:opacity-50 cursor-pointer"
              >
                <Send size={14} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default StudyFlowAIChatbot;
