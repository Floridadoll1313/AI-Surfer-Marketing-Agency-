import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Sparkles, 
  Wand2, 
  MessageSquare, 
  Map as MapIcon, 
  ShoppingBag, 
  Newspaper, 
  Database,
  Terminal,
  ArrowRight,
  Zap,
  Globe,
  Waves,
  Brain,
  Users,
  Bot,
  Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthProvider';
import { cn } from '../lib/utils';

export const MembersArea = () => {
  const { user, subscriptionTier } = useAuth();

  const toolCategories = [
    {
      title: "Hatteras Business Nodes",
      description: "Proprietary digital engines, builds, and secure automated environments.",
      items: [
        { name: 'Rodanthe Web Builds', path: '/rodanthe', icon: Globe, color: 'text-neon-cyan', bg: 'bg-neon-cyan/5', detail: 'Frontend & Backend Architecture', tier: 'technologist' },
        { name: 'Avon Game Builds', path: '/avon', icon: Zap, color: 'text-neon-yellow', bg: 'bg-neon-yellow/5', detail: 'Interactive Media Systems', tier: 'technologist' },
        { name: 'Buxton Workflows', path: '/buxton', icon: Database, color: 'text-neon-purple', bg: 'bg-neon-purple/5', detail: 'Active Pipelines & Logic', tier: 'technologist' },
        { name: 'Frisco Automations', path: '/frisco', icon: Bot, color: 'text-neon-green', bg: 'bg-neon-green/5', detail: 'Autonomous Systems', tier: 'architect' },
        { name: 'Hatteras Vault', path: '/hatteras', icon: Lock, color: 'text-neon-red', bg: 'bg-neon-red/5', detail: 'Confidential Process Maps & SOPs', tier: 'architect' },
      ]
    },
    {
      title: "Neural Synthesizers",
      description: "Harness the power of Gemini, Veo, and Lyria for manifestation.",
      items: [
        { name: 'Creative Studio', path: '/studio', icon: Wand2, color: 'text-neon-cyan', bg: 'bg-neon-cyan/5', detail: 'Image & Video Synthesis', tier: 'technologist' },
        { name: 'Neural Navigator', path: '/ai-surfer', icon: Sparkles, color: 'text-neon-green', bg: 'bg-neon-green/5', detail: 'Multi-turn Intelligence', tier: 'technologist' },
        { name: 'Prompt Toolkit', path: '/toolkit', icon: Terminal, color: 'text-white', bg: 'bg-white/5', detail: 'Advanced Prompt Macros', tier: 'technologist' },
      ]
    },
    {
      title: "Collective Identity",
      description: "Connect and synchronize with the Hatteras member network.",
      items: [
        { name: 'Sanctuary Chat', path: '/chat', icon: MessageSquare, color: 'text-neon-cyan', bg: 'bg-neon-cyan/5', detail: 'Encrypted Collective Stream', tier: 'technologist' },
        { name: 'Architect Directory', path: '/directory', icon: Users, color: 'text-neon-yellow', bg: 'bg-neon-yellow/5', detail: 'Member Registry', tier: 'technologist' },
        { name: 'Tidal Map', path: '/map', icon: MapIcon, color: 'text-neon-pink', bg: 'bg-neon-pink/5', detail: 'Hatteras Interactive Nodes', tier: 'technologist' },
      ]
    },
    {
      title: "Neural Reserves",
      description: "Access curated assets and specialized marketplace nodes.",
      items: [
        { name: 'Collective Daily', path: '/news', icon: Newspaper, color: 'text-neon-green', bg: 'bg-neon-green/5', detail: 'Intelligence Updates', tier: 'technologist' },
        { name: 'The Marketplace', path: '/marketplace', icon: ShoppingBag, color: 'text-neon-pink', bg: 'bg-neon-pink/5', detail: 'Digital Asset Exchange', tier: 'technologist' },
        { name: 'Supabase Vault', path: '/supabase-vault', icon: Database, color: 'text-neon-purple', bg: 'bg-neon-purple/5', detail: 'Secure Data Persistence', tier: 'technologist' },
      ]
    }
  ];

  if (!user) return null;

  return (
    <div className="relative min-h-screen">
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-black">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.05),transparent_70%)]" />
        <div className="absolute top-[-20%] right-[-20%] w-[60%] h-[60%] bg-neon-purple/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-20%] left-[-20%] w-[60%] h-[60%] bg-neon-cyan/5 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-7xl mx-auto py-16 px-6">
        {/* Header section */}
        <header className="mb-20 space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-neon-cyan/10 rounded-lg border border-neon-cyan/20">
                <Shield className="text-neon-cyan" size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-500">The Sanctuary // Members Only Area</span>
            </div>
            
            {/* Display Active Subscription Tier Badge */}
            <div className="px-4 py-1.5 rounded-full bg-slate-900 border border-white/10 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                Tier: <span className="text-white bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent font-extrabold">{subscriptionTier}</span>
              </span>
            </div>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-7xl font-black italic tracking-tighter uppercase leading-[0.9] bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-400 to-slate-800"
          >
            Welcome to the <br/>
            <span className="text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">Collective Sanctuary</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 max-w-2xl text-xl font-light tracking-wide leading-relaxed italic"
          >
            "Where the neural dunes meet the digital tide." Explore your exclusive toolset and connect with the Hatteras architects.
          </motion.p>
        </header>

        {/* Member Categories Grid */}
        <div className="space-y-24">
          {toolCategories.map((category, catIndex) => (
            <section key={category.title} className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-l-4 border-neon-cyan pl-8">
                <div className="space-y-2">
                  <h2 className="text-3xl font-black italic tracking-tighter uppercase text-white">{category.title}</h2>
                  <p className="text-slate-500 text-sm font-light tracking-widest">{category.description}</p>
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent mx-8 hidden md:block" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.items.map((item, index) => {
                  const isLocked = item.tier === 'architect' && subscriptionTier !== 'architect';
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: catIndex * 0.1 + index * 0.05 }}
                    >
                      <Link 
                        to={item.path}
                        className={cn(
                          "group relative overflow-hidden p-8 glass-card rounded-[2.5rem] border transition-all block h-full",
                          isLocked 
                            ? "border-neon-pink/15 bg-neon-pink/5 hover:border-neon-pink/30 hover:shadow-[0_0_30px_rgba(255,0,255,0.05)]" 
                            : "border-white/5 hover:border-white/20 hover:shadow-[0_0_40px_rgba(0,255,255,0.05)]"
                        )}
                      >
                        {isLocked && (
                          <div className="absolute top-6 right-6 px-3 py-1 rounded-full bg-neon-pink/20 border border-neon-pink/40 text-[8px] font-black uppercase tracking-widest text-neon-pink flex items-center gap-1.5 animate-pulse">
                            <Lock size={10} /> Architect Premium
                          </div>
                        )}
                        
                        <div className={cn("p-4 rounded-2xl mb-8 inline-flex transition-transform duration-500 group-hover:rotate-12", item.bg)}>
                          {isLocked ? <Lock size={28} className="text-neon-pink" /> : <item.icon size={28} className={item.color} />}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-black italic text-2xl text-white uppercase tracking-tighter group-hover:text-neon-cyan transition-colors">
                              {item.name}
                            </h4>
                            <ArrowRight className="text-slate-800 group-hover:text-neon-cyan transition-all transform -rotate-45 group-hover:rotate-0" size={20} />
                          </div>
                          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-loose">{item.detail}</p>
                        </div>
                        <div className="mt-8 flex items-center gap-2 justify-between">
                          <div className="flex items-center gap-2">
                            <div className={cn("w-1.5 h-1.5 rounded-full animate-pulse", isLocked ? "bg-neon-pink" : "bg-neon-cyan")} />
                            <span className="text-[8px] font-black uppercase tracking-[0.3em] text-slate-700">
                              {isLocked ? "ACCESS: LOCKED" : "ACCESS: OPTIMIZED"}
                            </span>
                          </div>
                          {item.tier && !isLocked && (
                            <span className="text-[8px] font-bold text-neon-cyan bg-neon-cyan/5 px-2 py-0.5 rounded border border-neon-cyan/10 uppercase tracking-widest">
                              {item.tier}
                            </span>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Footer info or quick sync */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 p-16 glass-card rounded-[3rem] border border-white/5 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Waves size={150} className="text-neon-cyan" />
          </div>
          <div className="relative z-10 flex flex-col items-center">
             <Brain className="text-neon-cyan mb-8 animate-pulse" size={48} />
             <h3 className="text-3xl font-black italic mb-4 tracking-tighter uppercase">Sync Completed</h3>
             <p className="text-slate-400 mb-8 max-w-xl text-sm font-light tracking-widest leading-relaxed">
               Your neural connection to the Hatteras Collective is optimized. All tools are currently functioning at peak performance.
             </p>
             <Link 
               to="/dashboard"
               className="px-10 py-5 bg-white/5 border border-white/10 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-xl hover:bg-white/10 transition-all flex items-center gap-2"
             >
               Return to Global Dashboard <ArrowRight size={14} />
             </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
