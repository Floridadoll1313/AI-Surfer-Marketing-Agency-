import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Users } from 'lucide-react';
import { getAccessToken } from '../AuthProvider';

interface CalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  htmlLink: string;
}

export const GoogleCalendar = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const token = getAccessToken();
      if (!token) return;
      
      setLoading(true);
      try {
        const timeMin = new Date().toISOString();
        const response = await fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${encodeURIComponent(timeMin)}&maxResults=10&singleEvents=true&orderBy=startTime`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.items) {
          setEvents(data.items);
        } else {
          setEvents([]);
        }
      } catch (err) {
        setError('Failed to load calendar events');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const token = getAccessToken();
  if (!token) {
    return (
      <div className="p-6 bg-black/40 border border-white/10 rounded-2xl">
        <h3 className="text-xl font-bold mb-2">Google Calendar</h3>
        <p className="text-slate-500 text-sm">Please log in and authorize Workspace access.</p>
      </div>
    );
  }

  return (
    <div className="p-6 glass-card border border-white/5 rounded-2xl flex flex-col h-96">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-neon-pink">
          <CalendarIcon size={24} /> Chronos Pipeline
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
        {loading ? (
          <p className="text-slate-500 text-sm italic text-center py-4">Syncing timeline...</p>
        ) : error ? (
          <p className="text-neon-pink text-sm italic">{error}</p>
        ) : events.length > 0 ? (
          events.map(event => {
            const startDate = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date!);
            const isAllDay = !event.start.dateTime;
            
            return (
              <a 
                href={event.htmlLink}
                target="_blank"
                rel="noreferrer"
                key={event.id} 
                className="p-3 bg-white/5 border border-white/10 rounded-lg flex flex-col gap-2 hover:border-neon-pink/30 hover:bg-white/10 transition-colors block"
              >
                <div className="flex justify-between items-start gap-4">
                  <p className="text-sm font-medium text-slate-200 line-clamp-1">{event.summary || '(No title)'}</p>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest flex items-center gap-1 font-mono">
                    <Clock size={10} className="text-neon-pink" /> 
                    {startDate.toLocaleDateString()} {isAllDay ? '(All Day)' : startDate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </a>
            );
          })
        ) : (
          <p className="text-slate-500 text-sm italic text-center py-4">Timeline clear</p>
        )}
      </div>
    </div>
  );
};
