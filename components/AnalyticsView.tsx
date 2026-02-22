import React from 'react';
import { Agent } from '../types';
import { StatCard } from './StatCard';
import { TrendingUp, Users, Award, ShieldAlert, BarChart3, Activity } from 'lucide-react';

interface Props {
  agents: Agent[];
}

export const AnalyticsView: React.FC<Props> = ({ agents }) => {
  // 1. Data Aggregation
  const totalCalls = agents.reduce((acc, curr) => acc + (curr.history[0]?.answeredCalls || 0), 0);
  const avgQA = Math.round(agents.reduce((acc, curr) => acc + (curr.evaluations[0]?.score || 0), 0) / agents.length);
  const totalSolved = agents.reduce((acc, curr) => acc + (curr.history[0]?.solvedTickets || 0), 0);
  
  // 2. Sort agents for the "Top Performers" list
  const topAgents = [...agents].sort((a, b) => (b.evaluations[0]?.score || 0) - (a.evaluations[0]?.score || 0)).slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden bg-[#1e293b]/40 border border-slate-800 p-8 rounded-[2rem] backdrop-blur-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <BarChart3 className="text-indigo-500" size={32} /> Operational Analytics
            </h2>
            <p className="text-slate-400 mt-2 font-medium">Aggregated team performance across {agents.length} active agents.</p>
          </div>
          <div className="hidden md:block text-right">
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
              Live Feed Active
            </span>
          </div>
        </div>
      </div>

      {/* METRIC GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Team Calls" value={totalCalls} subText="+12% from last week" icon={<Users/>} color="text-blue-400" />
        <StatCard title="Team QA Average" value={`${avgQA}%`} subText="Target: 85%" icon={<Award/>} color="text-emerald-400" />
        <StatCard title="Total Resolutions" value={totalSolved} subText="Across all channels" icon={<TrendingUp/>} color="text-purple-400" />
        <StatCard title="System Uptime" value="99.9%" subText="No issues detected" icon={<Activity/>} color="text-blue-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* TEAM DISTRIBUTION CHART (Left 8 cols) */}
        <div className="lg:col-span-8 bg-[#1e293b]/40 border border-slate-800 p-8 rounded-[2rem]">
          <h3 className="text-white font-black text-sm uppercase tracking-widest mb-8 flex items-center gap-2">
            <BarChart3 size={16} className="text-indigo-500"/> Call Volume Distribution
          </h3>
          <div className="flex items-end justify-between h-64 gap-2 md:gap-4 px-2">
            {agents.map((agent, i) => {
              const height = (agent.history[0]?.answeredCalls || 0) * 4; // Scale for visual
              return (
                <div key={i} className="flex-1 flex flex-col items-center group">
                  <div 
                    className="w-full bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-xl transition-all duration-1000 group-hover:from-indigo-400 group-hover:to-indigo-300 relative"
                    style={{ height: `${height}px` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
                      {agent.history[0]?.answeredCalls}
                    </div>
                  </div>
                  <p className="text-[10px] text-slate-500 font-bold mt-4 uppercase truncate w-full text-center">
                    {agent.name.split(' ')[0]}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* TOP PERFORMERS SIDEBAR (Right 4 cols) */}
        <div className="lg:col-span-4 bg-[#1e293b]/40 border border-slate-800 p-8 rounded-[2rem]">
          <h3 className="text-white font-black text-sm uppercase tracking-widest mb-6">Top Performers</h3>
          <div className="space-y-4">
            {topAgents.map((agent, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 hover:border-indigo-500/30 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-[10px]">
                    #{i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{agent.name}</p>
                    <p className="text-[9px] text-slate-500 font-black uppercase">{agent.history[0]?.answeredCalls} Calls</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-400">{agent.evaluations[0]?.score}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};