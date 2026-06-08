import React, { useState, useEffect } from 'react';
import { Mail, Clock, Inbox, Search } from 'lucide-react';
import { getAccessToken } from '../AuthProvider';

interface GmailMessage {
  id: string;
  snippet: string;
  payload?: {
    headers: { name: string; value: string }[];
  }
}

export const GoogleMail = () => {
  const [messages, setMessages] = useState<GmailMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmails = async () => {
      const token = getAccessToken();
      if (!token) return;
      
      setLoading(true);
      try {
        // Fetch message IDs first
        const listResponse = await fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=8&q=is:unread`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const listData = await listResponse.json();
        
        if (listData.messages && listData.messages.length > 0) {
          // Fetch full messages in parallel
          const messagePromises = listData.messages.map((msg: { id: string }) => 
            fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`, {
              headers: { Authorization: `Bearer ${token}` }
            }).then(r => r.json())
          );
          
          const fullMessages = await Promise.all(messagePromises);
          setMessages(fullMessages);
        } else {
          setMessages([]);
        }
      } catch (err) {
        setError('Failed to load transmission stream');
      } finally {
        setLoading(false);
      }
    };
    fetchEmails();
  }, []);

  const getHeader = (message: GmailMessage, headerName: string) => {
    return message.payload?.headers.find(h => h.name.toLowerCase() === headerName.toLowerCase())?.value || 'Unknown';
  };

  const token = getAccessToken();
  if (!token) {
    return (
      <div className="p-6 bg-black/40 border border-white/10 rounded-2xl">
        <h3 className="text-xl font-bold mb-2">Sector Comm Stream</h3>
        <p className="text-slate-500 text-sm">Please log in and authorize Workspace access.</p>
      </div>
    );
  }

  return (
    <div className="p-6 glass-card border border-white/5 rounded-2xl flex flex-col h-96">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-neon-yellow">
          <Mail size={24} /> Transmission Logs
        </h3>
        <div className="px-2 py-1 bg-neon-yellow/10 border border-neon-yellow/20 rounded text-[10px] uppercase font-black tracking-widest text-neon-yellow flex items-center gap-1">
          <Inbox size={12} /> Unread
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
        {loading ? (
          <p className="text-slate-500 text-sm italic text-center py-4">Intercepting signals...</p>
        ) : error ? (
          <p className="text-neon-pink text-sm italic">{error}</p>
        ) : messages.length > 0 ? (
          messages.map(msg => (
            <a 
              href={`https://mail.google.com/mail/u/0/#inbox/${msg.id}`}
              target="_blank"
              rel="noreferrer"
              key={msg.id} 
              className="p-3 bg-white/5 border border-white/10 rounded-lg flex flex-col gap-1 hover:border-neon-yellow/30 hover:bg-white/10 transition-colors block"
            >
              <p className="text-xs font-bold text-slate-200 line-clamp-1">{getHeader(msg, 'From').replace(/<[^>]+>/g, '')}</p>
              <p className="text-[10px] font-bold text-neon-yellow line-clamp-1">{getHeader(msg, 'Subject') || '(No Subject)'}</p>
              <p className="text-[10px] text-slate-500 line-clamp-2 mt-1">{msg.snippet}</p>
            </a>
          ))
        ) : (
          <p className="text-slate-500 text-sm italic text-center py-4">No unread signals</p>
        )}
      </div>
    </div>
  );
};
