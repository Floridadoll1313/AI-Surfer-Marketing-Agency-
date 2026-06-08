import React, { useState, useEffect } from 'react';
import { CheckCircle, Clock } from 'lucide-react';
import { getAccessToken } from '../AuthProvider';

interface TaskList {
  id: string;
  title: string;
}

interface Task {
  id: string;
  title: string;
  status: string;
  due?: string;
  completed?: string;
}

export const GoogleTasks = () => {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedList, setSelectedList] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTaskLists = async () => {
      const token = getAccessToken();
      if (!token) return;
      
      setLoading(true);
      try {
        const response = await fetch('https://tasks.googleapis.com/tasks/v1/users/@me/lists', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.items) {
          setTaskLists(data.items);
          if (data.items.length > 0) {
            setSelectedList(data.items[0].id);
          }
        }
      } catch (err) {
        setError('Failed to load task lists');
      } finally {
        setLoading(false);
      }
    };
    fetchTaskLists();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = getAccessToken();
      if (!token || !selectedList) return;
      
      setLoading(true);
      try {
        const response = await fetch(`https://tasks.googleapis.com/tasks/v1/lists/${selectedList}/tasks?showCompleted=false`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.items) {
          setTasks(data.items);
        } else {
          setTasks([]);
        }
      } catch (err) {
        setError('Failed to load tasks');
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [selectedList]);

  const token = getAccessToken();
  if (!token) {
    return (
      <div className="p-6 bg-black/40 border border-white/10 rounded-2xl">
        <h3 className="text-xl font-bold mb-2">Google Tasks</h3>
        <p className="text-slate-500 text-sm">Please log in and authorize Workspace access.</p>
      </div>
    );
  }

  return (
    <div className="p-6 glass-card border border-white/5 rounded-2xl flex flex-col h-96">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-2 text-neon-cyan">
          <CheckCircle size={24} /> Tasks Engine
        </h3>
        {taskLists.length > 0 && (
          <select 
            className="bg-black/50 border border-white/10 rounded p-1 text-xs text-slate-300"
            value={selectedList || ''}
            onChange={(e) => setSelectedList(e.target.value)}
          >
            {taskLists.map(list => (
              <option key={list.id} value={list.id}>{list.title}</option>
            ))}
          </select>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
        {loading ? (
          <p className="text-slate-500 text-sm italic text-center py-4">Syncing...</p>
        ) : error ? (
          <p className="text-neon-pink text-sm italic">{error}</p>
        ) : tasks.length > 0 ? (
          tasks.map(task => (
            <div key={task.id} className="p-3 bg-white/5 border border-white/10 rounded-lg flex items-start gap-3 hover:border-neon-cyan/30 transition-colors">
              <div className="mt-1 w-4 h-4 rounded border border-slate-500 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-200">{task.title}</p>
                {task.due && (
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1 flex items-center gap-1">
                    <Clock size={10} /> Due: {new Date(task.due).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-slate-500 text-sm italic text-center py-4">No pending tasks found</p>
        )}
      </div>
    </div>
  );
};
