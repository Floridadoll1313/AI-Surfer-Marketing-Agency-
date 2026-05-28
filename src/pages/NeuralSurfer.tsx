import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, Brain, Zap, Loader2, Trash2, Globe, ExternalLink, ChevronRight, Waves, MessageSquare } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'model';
  content: string;
}

export const NeuralSurfer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    try {
      // In AI Studio, GEMINI_API_KEY is automatically available in the environment
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages, userMessage].map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: "You are the Ocean Tide Drop AI Surfer, a digital navigator for the Hatteras Collective. You help users understand AI, automation, and the digital dunes. Use oceanic metaphors and maintain a sleek, technical, yet adventurous tone. Your goal is to guide users through the informational waves of the digital reef.",
        }
      });

      const modelResponse: Message = { 
        role: 'model', 
        content: response.text || "The data stream encountered a ripple. Let's try to catch the next wave."
      };

      setMessages(prev => [...prev, modelResponse]);
    } catch (error) {
      console.error('Neural connection failed:', error);
      setMessages(prev => [...prev, { role: 'model', content: "Neural link interrupted. The digital abyss is currently unstable. Please try to reinitialize." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 h-[calc(100vh-160px)] flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-neon-cyan/20 rounded-2xl border border-neon-cyan/30 shadow-[0_0_15px_rgba(0,255,255,0.2)]">
            <Waves className="text-neon-cyan" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black italic tracking-tighter flex items-center gap-2">
              NEURAL <span className="text-neon-cyan">SURFER</span>
            </h1>
            <p className="text-[10px] tracking-[0.4em] text-slate-500 uppercase font-black">Autonomous Chatbot v1.0</p>
          </div>
        </div>
        
        <button 
          onClick={() => setMessages([])}
          className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
          title="Reset Neural Stream"
        >
          <Trash2 size={20} />
        </button>
      </motion.div>

      <div className="flex-1 glass-card rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col relative shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/10 to-transparent pointer-events-none opacity-50" />
        
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative z-10">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-8 opacity-40">
              <div className="relative">
                <div className="absolute inset-0 bg-neon-cyan/20 blur-3xl rounded-full" />
                <Bot size={80} className="text-neon-cyan relative animate-bounce" />
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-black italic tracking-tight uppercase">Connection Ready</h3>
                <p className="text-xs font-light tracking-[0.25em] uppercase max-w-xs mx-auto leading-relaxed">
                  The AI Surfer is waiting to ride the informational waves with you.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3">
                {['What is the Neon Reef?', 'How do I start building?', 'Explain the Vault'].map(q => (
                  <button 
                    key={q}
                    onClick={() => setInput(q)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold uppercase tracking-widest hover:border-neon-cyan transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`flex gap-5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border-2 ${
                  msg.role === 'user' 
                    ? 'bg-neon-cyan/20 border-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.3)] text-neon-cyan' 
                    : 'bg-white/5 border-white/10 text-slate-400'
                }`}>
                  {msg.role === 'user' ? <User size={20} /> : <Waves size={20} />}
                </div>
                <div className={`max-w-[75%] p-6 rounded-3xl text-sm leading-relaxed shadow-xl ${
                  msg.role === 'user'
                    ? 'bg-neon-cyan text-black font-semibold rounded-tr-none'
                    : 'bg-white/5 text-slate-200 border border-white/10 rounded-tl-none backdrop-blur-sm'
                }`}>
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-5"
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                <Waves size={20} className="animate-spin-slow" />
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl rounded-tl-none flex items-center gap-2">
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" />
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-6 bg-black/60 border-t border-white/10 flex gap-4 relative z-10 backdrop-blur-xl">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about the Digital Collective..."
            className="flex-1 bg-white/5 border-2 border-white/10 rounded-2xl px-6 py-4 focus:border-neon-cyan outline-none transition-all text-white placeholder-slate-500 font-light"
          />
          <button 
            type="submit"
            disabled={isTyping || !input.trim()}
            className="bg-neon-cyan text-black px-8 py-4 rounded-2xl font-black uppercase tracking-tighter hover:bg-white hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-3 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
          >
            {isTyping ? <Loader2 className="animate-spin" size={20} /> : <><span className="hidden sm:inline">SEND LINK</span> <ChevronRight size={20} /></>}
          </button>
        </form>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">
        <div className="flex gap-6">
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neon-green" /> Stream: Verified</span>
          <span className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-neon-cyan outline outline-offset-2 outline-neon-cyan/20" /> Latency: 42ms</span>
        </div>
        <div className="flex gap-4">
          <span className="text-neon-cyan">Model: Gemini 3 Flash</span>
          <span>© Hatteras Digital Collective</span>
        </div>
      </div>
    </div>
  );
};
