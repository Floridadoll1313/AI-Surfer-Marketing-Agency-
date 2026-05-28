import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Send, User, LogIn, Lock, Hash } from 'lucide-react';
import { useAuth, getAccessToken } from '../components/AuthProvider';

interface ChatSpace {
  name: string;
  displayName: string;
  type: string;
}

interface ChatMessage {
  name: string;
  sender: {
    name: string;
    displayName: string;
    avatarUrl: string;
  };
  text: string;
  createTime: string;
}

export const MemberChat = () => {
  const [spaces, setSpaces] = useState<ChatSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<ChatSpace | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingSpaces, setLoadingSpaces] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const { user, login, accessToken } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!accessToken) {
      setSpaces([]);
      setMessages([]);
      setSelectedSpace(null);
      return;
    }

    const fetchSpaces = async () => {
      setLoadingSpaces(true);
      try {
        const response = await fetch('https://chat.googleapis.com/v1/spaces', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await response.json();
        if (data.spaces) {
          setSpaces(data.spaces);
        }
      } catch (error) {
        console.error("Failed to load Google Chat spaces", error);
      } finally {
        setLoadingSpaces(false);
      }
    };

    fetchSpaces();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken || !selectedSpace) return;

    const fetchMessages = async () => {
      setLoadingMessages(true);
      try {
        const response = await fetch(`https://chat.googleapis.com/v1/${selectedSpace.name}/messages`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const data = await response.json();
        if (data.messages) {
          setMessages(data.messages);
        } else {
          setMessages([]);
        }
      } catch (error) {
        console.error("Failed to load messages", error);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
    // In a real app we'd poll or use a webhook for live updates. For now we just load once on select.
  }, [accessToken, selectedSpace]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !accessToken || !selectedSpace) return;

    const messageText = newMessage;
    setNewMessage(''); // optimistic clear
    
    // Check if modifying data, simulate confirmation logic, but since it's just posting a message a confirmation isn't strictly needed for every chat message, but is a good idea for destructive actions. We'll proceed directly for simple chat.
    try {
      const response = await fetch(`https://chat.googleapis.com/v1/${selectedSpace.name}/messages`, {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: messageText }),
      });
      const newMsg = await response.json();
      if (newMsg.name) {
        setMessages((prev) => [...prev, newMsg]);
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 h-[calc(100vh-150px)] flex flex-col">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8 px-4"
      >
        <div className="flex items-center gap-4">
          <MessageSquare className="text-neon-cyan" size={32} />
          <h1 className="text-4xl font-black italic tracking-tighter">MEMBER CHAT</h1>
        </div>
        {user ? (
          <div className="flex items-center gap-2 px-4 py-2 glass-card rounded-full border border-white/10">
            <User size={16} className="text-neon-cyan" />
            <span className="text-xs font-bold uppercase tracking-widest">{user.displayName}</span>
          </div>
        ) : (
          <button 
            onClick={login}
            className="flex items-center gap-2 px-4 py-2 bg-neon-cyan text-black rounded-full text-xs font-black uppercase tracking-widest hover:bg-white transition-colors"
          >
            <LogIn size={16} /> Login to Google Chat
          </button>
        )}
      </motion.div>

      <div className="flex-1 glass-card rounded-3xl border border-white/10 overflow-hidden flex flex-row">
        
        {/* Sidebar Spaces List */}
        <div className="w-1/3 border-r border-white/10 flex flex-col bg-black/20">
          <div className="p-4 border-b border-white/10 font-bold uppercase tracking-widest text-xs text-slate-400">
            Google Chat Spaces
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
            {!user ? (
              <div className="p-4 text-xs text-slate-500 italic text-center">Login required</div>
            ) : loadingSpaces ? (
              <div className="p-4 text-xs text-slate-500 italic text-center">Loading spaces...</div>
            ) : spaces.length > 0 ? (
              spaces.map(space => (
                <button
                  key={space.name}
                  onClick={() => setSelectedSpace(space)}
                  className={`w-full text-left flex items-center p-3 rounded-xl transition-colors mb-1 truncate ${
                    selectedSpace?.name === space.name 
                      ? 'bg-neon-cyan/10 border border-neon-cyan/30 text-neon-cyan' 
                      : 'hover:bg-white/5 text-slate-300'
                  }`}
                >
                  <Hash size={16} className="mr-2 shrink-0 opacity-50" />
                  <span className="truncate text-sm font-medium">{space.displayName || 'Unnamed Space'}</span>
                </button>
              ))
            ) : (
              <div className="p-4 text-xs text-slate-500 italic text-center">No spaces found.</div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar relative">
            {!user ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 italic bg-black/40">
                <Lock className="mb-4 opacity-20" size={48} />
                <p>Authentication required</p>
                <button
                  onClick={login}
                  className="mt-4 px-6 py-2 border border-neon-cyan/50 text-neon-cyan rounded-full uppercase tracking-widest text-xs font-bold hover:bg-neon-cyan/10 transition-colors"
                >
                  Authorize Google Chat
                </button>
              </div>
            ) : !selectedSpace ? (
              <div className="h-full flex items-center justify-center text-slate-500 italic text-sm">
                Select a space to view messages
              </div>
            ) : loadingMessages ? (
              <div className="h-full flex items-center justify-center text-slate-500 italic text-sm">
                Loading messages...
              </div>
            ) : (
              <>
                <div className="text-center text-xs text-slate-500 uppercase tracking-widest pb-4 border-b border-white/5 mb-4">
                  --- Start of {selectedSpace.displayName} ---
                </div>
                {messages.map((msg) => {
                  const isMe = msg.sender.displayName === user.displayName;
                  return (
                    <motion.div 
                      key={msg.name}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          {!isMe && msg.sender.avatarUrl && (
                            <img src={msg.sender.avatarUrl} alt="" className="w-5 h-5 rounded-full" referrerPolicy="no-referrer" />
                          )}
                          <span className={isMe ? 'text-neon-cyan' : 'text-slate-400'}>{msg.sender.displayName}</span>
                        </span>
                        <span className="text-[8px] text-slate-700 font-mono">
                          {new Date(msg.createTime).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className={`px-4 py-2 text-sm max-w-[85%] ${
                        isMe 
                          ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30 rounded-2xl rounded-tr-sm' 
                          : 'bg-white/5 text-slate-200 border border-white/10 rounded-2xl rounded-tl-sm'
                      }`}>
                        {msg.text}
                      </div>
                    </motion.div>
                  )
                })}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {user && selectedSpace && (
            <form onSubmit={handleSendMessage} className="p-4 bg-black/40 border-t border-white/10 flex gap-4">
              <input 
                type="text" 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Message ${selectedSpace.displayName}...`}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-3 focus:border-neon-cyan outline-none transition-colors"
                disabled={!accessToken}
              />
              <button 
                type="submit"
                disabled={!newMessage.trim() || !accessToken}
                className="bg-neon-cyan text-black p-3 rounded-xl hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
