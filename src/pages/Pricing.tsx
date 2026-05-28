import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, Shield, Crown, AlertOctagon } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { useLocation } from 'react-router-dom';

declare global {
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'stripe-pricing-table': any;
      }
    }
  }
}

export const Pricing = () => {
  const { user } = useAuth();
  const location = useLocation();
  const needsUpgrade = location.state?.needsUpgrade;
  
  useEffect(() => {
    // Inject Stripe Pricing Table script safely
    const scriptId = 'stripe-pricing-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;
    
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://js.stripe.com/v3/pricing-table.js';
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      // We don't necessarily need to remove the Stripe script, as it can be reused.
      // Removing it might cause issues if the web component requires it across re-renders.
    };
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto py-24 px-6 md:px-12">
      {/* Hero Section */}
      <div className="text-center mb-20 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 text-neon-cyan text-[10px] font-black uppercase tracking-[0.3em]"
        >
          <Zap size={12} className="animate-pulse" /> Transmission Active
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none"
        >
          Neural <br/>
          <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] text-neon-cyan">Pathways</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-slate-500 text-xl font-light tracking-widest uppercase italic max-w-2xl mx-auto"
        >
          Choose your trajectory through the digital dune. Cinematic systems, 
          automation ecosystems, and AI‑powered creative tools — all aligned with your vision.
        </motion.p>
      </div>

      {needsUpgrade && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto mb-12 p-8 rounded-3xl bg-neon-pink/10 border-2 border-neon-pink/40 text-center shadow-[0_0_35px_rgba(255,0,255,0.15)] flex flex-col md:flex-row items-center gap-6 justify-center"
        >
          <div className="p-4 bg-neon-pink/20 rounded-full border border-neon-pink/40 shrink-0">
            <AlertOctagon className="text-neon-pink animate-pulse" size={32} />
          </div>
          <div className="text-center md:text-left space-y-1">
            <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">ARCHITECT PORTAL LOCKED</h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xl">
              This business automation requires the premium <strong className="text-neon-pink uppercase tracking-widest font-black">Architect Tier</strong>. 
              Synchronize your active account with the higher tier plan below to unlock custom engines, system SOPs, and advanced integration processes.
            </p>
          </div>
        </motion.div>
      )}

      {/* Stripe Pricing Table Integration */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="glass-card rounded-[2.5rem] border border-white/5 p-4 md:p-8 bg-black/40 overflow-hidden shadow-2xl relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/5 to-transparent pointer-events-none" />
        
        <stripe-pricing-table
          pricing-table-id="prctbl_1TQw5yRwAZCPDqtylQB0Si0N"
          publishable-key="pk_live_51Q2XUORwAZCPDqtydW4uiu9lb4c3lQmiD3stgOYTwouLpIZgGshtd83dt82kZl8olvhEIvJAVBTZJnCuUnCK757o00guoyHSoi"
          client-reference-id={user?.uid || undefined}
          customer-email={user?.email || undefined}
        ></stripe-pricing-table>
      </motion.div>

      {/* Footer / Decor */}
      <div className="mt-24 text-center">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.5em] mb-4">
          Secure Neural Transmission Protected by Shoal Guard
        </p>
        <div className="flex justify-center gap-8 opacity-20">
          <Shield className="text-white" size={32} />
          <Crown className="text-white" size={32} />
          <Zap className="text-white" size={32} />
        </div>
      </div>
    </div>
  );
};

