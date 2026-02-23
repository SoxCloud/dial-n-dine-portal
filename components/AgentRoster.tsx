import React from 'react';
import { Agent } from '../types';
import { Mail, PhoneCall, Star, ArrowRight } from 'lucide-react';

interface Props {
  agents: Agent[];
  onViewAgent: (id: string) => void;
}

export const AgentRoster: React.FC<Props> = ({ agents, onViewAgent }) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Roster</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Directory of all synchronized personnel.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent) => {
          const lastEval = agent.evaluations[agent.evaluations.length - 1];
          const totalCalls = agent.history.reduce((sum, day) => sum + day.answeredCalls, 0);

          return (
            <div key={agent.id} className="bg-white dark:bg-[#1e293b] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between group hover:border-indigo-500/50 transition-all">
              <div>
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

              <button 
                onClick={() => onViewAgent(agent.id)} 
                className="mt-6 w-full bg-slate-100 dark:bg-slate-800/80 hover:dark:bg-indigo-600 hover:bg-indigo-500 text-slate-600 dark:text-slate-300 hover:text-white py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all">
                View Profile <ArrowRight size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};