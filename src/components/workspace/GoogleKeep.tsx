import React, { useState, useEffect } from 'react';
import { FileText, Clock } from 'lucide-react';
import { getAccessToken } from '../AuthProvider';

interface KeepNote {
  name: string;
  title: string;
  body: {
    text: { text: string }
  };
  createTime: string;
}

export const GoogleKeep = () => {
  const [notes, setNotes] = useState<KeepNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotes = async () => {
      const token = getAccessToken();
      if (!token) return;
      
      setLoading(true);
      try {
        const response = await fetch('https://keep.googleapis.com/v1/notes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.notes) {
          setNotes(data.notes);
        } else {
          setNotes([]);
        }
      } catch (err) {
        setError('Failed to load Keep notes or Keep API is not enabled.');
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const token = getAccessToken();
  if (!token) {
    return (
      <div className="p-6 bg-black/40 border border-white/10 rounded-2xl">
        <h3 className="text-xl font-bold mb-2">Google Keep</h3>
        <p className="text-slate-500 text-sm">Please log in and authorize Workspace access.</p>
      </div>
    );
  }

  return (
    <div className="p-6 glass-card border border-white/5 rounded-2xl flex flex-col h-96">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-neon-yellow">
          <FileText size={24} /> Keep Notes
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
        {loading ? (
          <p className="text-slate-500 text-sm italic text-center py-4">Syncing...</p>
        ) : error ? (
          <p className="text-neon-pink text-sm italic">{error}</p>
        ) : notes.length > 0 ? (
          notes.map(note => (
            <div key={note.name} className="p-3 bg-white/5 border border-white/10 rounded-lg flex flex-col gap-2 hover:border-neon-yellow/30 transition-colors">
              <div className="flex justify-between items-start">
                 <p className="text-sm font-medium text-slate-200">{note.title || 'Untitled'}</p>
                 <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock size={10}/> {new Date(note.createTime).toLocaleDateString()}</span>
              </div>
              {note.body?.text?.text && (
                 <p className="text-xs text-slate-400 line-clamp-3">{note.body.text.text}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-slate-500 text-sm italic text-center py-4">No notes found</p>
        )}
      </div>
    </div>
  );
};
