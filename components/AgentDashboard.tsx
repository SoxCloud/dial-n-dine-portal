import React, { useState } from 'react';
import { Agent } from '../types';
import { PhoneCall, CheckCircle, Ticket, Clock, BrainCircuit, Calendar, Star, MessageSquare } from 'lucide-react';

interface Props {
  agent: Agent;
  dateRange: { start: string, end: string };
  onDateChange: (range: { start: string, end: string }) => void;
}

export const AgentDashboard: React.FC<Props> = ({ agent, dateRange, onDateChange }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'evals'>('overview');

  // Filter Data based on the new Date Range
  const filteredHistory = agent.history.filter(h => h.date >= dateRange.start && h.date <= dateRange.end);
  const filteredEvals = agent.evaluations.filter(e => e.date >= dateRange.start && e.date <= dateRange.end);

  const totalCalls = filteredHistory.reduce((acc, curr) => acc + curr.answeredCalls, 0);
  const totalSolved = filteredHistory.reduce((acc, curr) => acc + curr.transactions, 0);
  const avgAHT = filteredHistory.length > 0 ? filteredHistory[0].aht : '0s';
  const latestEval = filteredEvals.length > 0 ? filteredEvals[filteredEvals.length - 1] : null;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between bg-[#1e293b] p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, {agent.name.split(' ')[0]}!</h1>
          <p className="text-slate-400 text-sm mt-1">Showing performance for the selected period</p>
        </div>
        <div className="flex items-center gap-3 mt-4 md:mt-0 bg-slate-900/50 p-2 rounded-2xl border border-slate-800">
          <Calendar size={16} className="text-indigo-400 ml-2" />
          <input 
            type="date" 
            value={dateRange.start} 
            onChange={(e) => onDateChange({...dateRange, start: e.target.value})}
            className="bg-transparent text-white text-xs outline-none cursor-pointer"
            title="Start date"
            placeholder="Start date"
          />
          <span className="text-slate-600 font-bold">-</span>
          <input 
            type="date" 
            value={dateRange.end} 
            onChange={(e) => onDateChange({...dateRange, end: e.target.value})}
            className="bg-transparent text-white text-xs outline-none cursor-pointer"
            title="End date"
            placeholder="End date"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Calls Handled" value={totalCalls} icon={<PhoneCall/>} color="text-indigo-400" />
        <StatCard title="Latest QA Score" value={latestEval ? `${latestEval.score}%` : 'N/A'} icon={<Star/>} color="text-amber-400" />
        <StatCard title="Tickets Solved" value={totalSolved} icon={<Ticket/>} color="text-emerald-400" />
        <StatCard title="Avg Handle Time" value={avgAHT} icon={<Clock/>} color="text-slate-300" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Performance Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1e293b] rounded-3xl border border-slate-800 overflow-hidden shadow-lg">
            <div className="flex border-b border-slate-800">
              <button onClick={() => setActiveTab('overview')} className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'overview' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/5' : 'text-slate-500 hover:text-slate-300'}`}>Quality KPIs</button>
              <button onClick={() => setActiveTab('evals')} className={`px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all ${activeTab === 'evals' ? 'text-indigo-400 border-b-2 border-indigo-400 bg-indigo-500/5' : 'text-slate-500 hover:text-slate-300'}`}>Evaluator Comments</button>
            </div>

            <div className="p-8">
              {activeTab === 'overview' ? (
                <div className="space-y-6">
                  {/* Visual Progress Bars */}
                  <KPIBar label="Capturing Information" value={latestEval?.score || 0} />
                  <KPIBar label="Phone Etiquette" value={latestEval ? Math.min(100, latestEval.score + 5) : 0} />
                  <KPIBar label="Problem Solving" value={latestEval?.score || 0} />
                  <KPIBar label="Product Knowledge" value={latestEval ? Math.max(0, latestEval.score - 10) : 0} />
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredEvals.length === 0 ? (
                    <p className="text-slate-500 text-center py-10">No evaluations found for this date range.</p>
                  ) : filteredEvals.map((ev, i) => (
                    <div key={i} className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-indigo-400 uppercase tracking-tighter">{ev.date} • Evaluated by {ev.evaluator}</span>
                        <span className="bg-indigo-500/10 text-indigo-400 px-2 py-1 rounded text-[10px] font-black">{ev.score}%</span>
                      </div>
                      <p className="text-sm text-emerald-400 leading-relaxed italic"><span className="font-bold uppercase text-[10px] mr-2">Positives:</span> "{ev.positivePoints}"</p>
                      <p className="text-sm text-orange-400 leading-relaxed italic"><span className="font-bold uppercase text-[10px] mr-2">Growth:</span> "{ev.improvementAreas}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right: AI Coach Sidebar */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600/20 to-slate-900 p-6 rounded-3xl border border-indigo-500/20 shadow-2xl relative overflow-hidden">
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"></div>
             <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/40"><BrainCircuit size={20}/></div>
                <h3 className="text-sm font-black uppercase tracking-widest text-white">AI Coach</h3>
             </div>
             <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-indigo-500/50 pl-4 py-1">
               {latestEval 
                ? `Based on your ${latestEval.score}% score, I recommend focusing on your product knowledge regarding the new promotion. Your empathy scores are excellent!` 
                : "Select a date range with evaluations to receive personalized AI coaching insights."}
             </p>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800">
             <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Links</h3>
             <div className="space-y-2">
                <button className="w-full text-left px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-800 transition-all">Knowledge Base</button>
                <button className="w-full text-left px-4 py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold rounded-xl border border-slate-800 transition-all">Submit Support Ticket</button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-[#1e293b] p-6 rounded-3xl border border-slate-800 shadow-lg group hover:border-indigo-500/30 transition-all">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-900 rounded-xl text-slate-500 group-hover:text-indigo-400 transition-colors">{icon}</div>
    </div>
    <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">{title}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);

const KPIBar = ({ label, value }: { label: string, value: number }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[11px] font-black text-slate-400 uppercase tracking-tighter">
      <span>{label}</span>
      <span className="text-white">{value}%</span>
    </div>
    <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
      <div 
        className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)] transition-all duration-1000" 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);