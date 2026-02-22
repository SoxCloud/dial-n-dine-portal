import React from 'react';
import { Agent } from '../types';
import { Mail, PhoneCall, Star } from 'lucide-react';

export const AgentRoster = ({ agents }: { agents: Agent[] }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Roster</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Directory of all synchronized personnel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => {
          const lastEval = agent.evaluations[agent.evaluations.length - 1];
          const totalCalls = agent.history.reduce((sum, day) => sum + day.answeredCalls, 0);

          return (
            <div key={agent.id} className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <img src={agent.avatarUrl} alt={agent.name} className="w-16 h-16 rounded-full border-2 border-slate-100 dark:border-slate-700" />
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{agent.name}</h3>
                  <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <Mail size={12} className="mr-1" /> {agent.email}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Total Calls</p>
                  <p className="text-lg font-bold text-slate-700 dark:text-slate-300 flex items-center"><PhoneCall size={14} className="mr-2 text-indigo-500"/> {totalCalls}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Latest CSAT</p>
                  <p className="text-lg font-bold text-slate-700 dark:text-slate-300 flex items-center"><Star size={14} className="mr-2 text-amber-500"/> {lastEval?.score || 'N/A'}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};