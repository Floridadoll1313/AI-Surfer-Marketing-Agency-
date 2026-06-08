import React, { useState } from 'react';
import { FileText, Send, CheckCircle, AlertOctagon } from 'lucide-react';
import { getAccessToken } from '../AuthProvider';

export const GoogleForms = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const token = getAccessToken();
    if (!token) return;

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('https://forms.googleapis.com/v1/forms', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          info: {
            title,
            documentTitle: title
          }
        })
      });

      const data = await response.json();
      
      if (data.formId) {
        // Step 2: Add description if provided
        if (description.trim()) {
          await fetch(`https://forms.googleapis.com/v1/forms/${data.formId}:batchUpdate`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              requests: [{
                updateFormInfo: {
                  info: { description },
                  updateMask: 'description'
                }
              }]
            })
          });
        }
        
        setSuccess(data.responderUri);
        setTitle('');
        setDescription('');
      } else {
        setError('Failed to generate blueprint. Check API scopes.');
      }
    } catch (err) {
      setError('Network or structural error during blueprint generation.');
    } finally {
      setLoading(false);
    }
  };

  const token = getAccessToken();
  if (!token) {
    return (
      <div className="p-6 bg-black/40 border border-white/10 rounded-2xl h-full">
        <h3 className="text-xl font-bold mb-2">Data Assimilation Nodes</h3>
        <p className="text-slate-500 text-sm">Please log in and authorize Workspace access.</p>
      </div>
    );
  }

  return (
    <div className="p-6 glass-card border border-white/5 rounded-2xl flex flex-col h-96">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-neon-green">
          <FileText size={24} /> Form Generator
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
        <form onSubmit={handleCreateForm} className="space-y-4">
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Form Vector Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-neon-green outline-none transition-colors"
              placeholder="e.g. AI Workflow Intake"
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Payload Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm focus:border-neon-green outline-none transition-colors resize-none h-20"
              placeholder="Enter purpose of assimilation..."
            />
          </div>
          
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="w-full bg-neon-green/10 border border-neon-green/30 text-neon-green py-2 rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-neon-green hover:text-black transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Synthesizing...' : <><Send size={16} /> Deploy Node</>}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 bg-neon-pink/10 border border-neon-pink/30 rounded-xl flex items-start gap-2">
            <AlertOctagon size={16} className="text-neon-pink shrink-0 mt-0.5" />
            <p className="text-xs text-neon-pink">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 p-3 bg-neon-green/10 border border-neon-green/30 rounded-xl flex items-start gap-2">
            <CheckCircle size={16} className="text-neon-green shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-neon-green font-bold">Node Deployed Successfully</p>
              <a href={success} target="_blank" rel="noreferrer" className="text-[10px] text-slate-300 underline mt-1 block break-all hover:text-white">
                Access Form URI
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
