import React from 'react';
import { motion } from 'motion/react';
import { Bot, Terminal, Activity, Zap, LogIn } from 'lucide-react';
import { GoogleTasks } from '../components/workspace/GoogleTasks';
import { GoogleCalendar } from '../components/workspace/GoogleCalendar';
import { GoogleMail } from '../components/workspace/GoogleMail';
import { GoogleForms } from '../components/workspace/GoogleForms';
import { useAuth } from '../components/AuthProvider';

import { GoogleKeep } from '../components/workspace/GoogleKeep';

export const Automations = () => {
  const { user, login } = useAuth();

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-4 mb-4">
            <Bot className="text-neon-cyan" size={40} />
            <h1 className="text-5xl font-black italic tracking-tighter uppercase text-white">Workspace Core</h1>
          </div>
          <p className="text-slate-400 text-xl font-light tracking-wide">Live system feeds and authorized Workspace bindings.</p>
        </div>
        
        {!user && (
          <button
            onClick={login}
            className="flex items-center gap-2 px-6 py-3 bg-neon-cyan text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-colors h-fit"
          >
            <LogIn size={16} /> Authorize Workspace
          </button>
        )}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        <GoogleTasks />
        <GoogleKeep />
        <GoogleCalendar />
        <GoogleMail />
        <GoogleForms />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-white/10 pt-16">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-black italic tracking-tighter uppercase text-neon-cyan">The Neural Net (How it Works)</h2>
          <div className="space-y-4">
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <h4 className="text-white font-bold mb-2">1. Cognitive Mapping</h4>
              <p className="text-slate-400 text-sm">We train LLMs on your specific business domain, giving them the "brain" needed to make context-aware decisions.</p>
            </div>
            <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
              <h4 className="text-white font-bold mb-2">2. Tool Integration</h4>
              <p className="text-slate-400 text-sm">Agents are equipped with custom API tools, allowing them to perform actions like searching the web, updating records, or sending emails.</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-3xl font-black italic tracking-tighter uppercase text-neon-pink">The Yield (Business Value)</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-neon-pink/10 rounded-xl flex items-center justify-center border border-neon-pink/20 shrink-0">
                <Bot size={20} className="text-neon-pink" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Human-Level Scalability</h4>
                <p className="text-slate-400 text-sm">Handle thousands of customer inquiries or data analysis tasks simultaneously without increasing your headcount.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-neon-cyan/10 rounded-xl flex items-center justify-center border border-neon-cyan/20 shrink-0">
                <Activity size={20} className="text-neon-cyan" />
              </div>
              <div>
                <h4 className="text-white font-bold mb-1">Live Synchronization</h4>
                <p className="text-slate-400 text-sm">Real-time binding to your Google Workspace account ensures seamless operations and data continuity.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
