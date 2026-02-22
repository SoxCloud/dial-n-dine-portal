import React from 'react';
import { Agent } from '../types';
import { PhoneCall, CheckCircle, Clock, BookOpen, Send, Megaphone, Target, BarChart2 } from 'lucide-react';

interface Props {
  agent: Agent;
  dateRange: { start: string; end: string };
  onDateChange: (range: any) => void;
}

export const AgentDashboard: React.FC<Props> = ({ agent, dateRange, onDateChange }) => {
  // Extract most recent data
  const latestEval = agent.evaluations[agent.evaluations.length - 1];
  const kpis = latestEval?.kpis || { product: 0, etiquette: 0, solving: 0, upsell: 0, promo: 0, capture: 0 };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Banner */}
      <div className="bg-[#1e293b] p-8 rounded-2xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {agent.name.split(' ')[0]}!</h1>
            <p className="text-slate-400">Performance snapshot from {new Date(dateRange.start).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}</p>
          </div>
          <div className="flex gap-4 items-center">
             <input 
               type="date" 
               value={dateRange.start} 
               onChange={(e) => onDateChange({...dateRange, start: e.target.value})}
               className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
             />
             <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-lg text-sm font-bold">
               <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Online
             </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <AgentMetricCard title="Calls (Feb 22)" value="20" target="Target 40" icon={<PhoneCall className="text-indigo-400"/>} />
        <AgentMetricCard title="Resolution Rate" value="86%" trend="Top 5%" icon={<CheckCircle className="text-emerald-400"/>} />
        <AgentMetricCard title="Total Tickets" value="50" icon={<Target className="text-purple-400"/>} />
        <AgentMetricCard title="Avg Handle Time" value="90s" trend="Good" icon={<Clock className="text-amber-400"/>} />
      </div>

      {/* Secondary KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><CheckCircle size={20}/></div>
          <div><p className="text-2xl font-bold text-white">43 <span className="text-[10px] text-slate-500 uppercase">tickets</span></p><p className="text-[10px] text-emerald-500 uppercase font-bold tracking-widest">Solved</p></div>
        </div>
        <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-500"><MessageSquare size={20}/></div>
          <div><p className="text-2xl font-bold text-white">105 <span className="text-[10px] text-slate-500 uppercase">actions</span></p><p className="text-[10px] text-indigo-500 uppercase font-bold tracking-widest">Interactions</p></div>
        </div>
        <div className="bg-[#1e293b] p-4 rounded-xl border border-slate-800 flex items-center gap-4">
          <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500"><Clock size={20}/></div>
          <div><p className="text-2xl font-bold text-white">45 <span className="text-[10px] text-slate-500 uppercase">hours</span></p><p className="text-[10px] text-purple-500 uppercase font-bold tracking-widest">Resolution Time</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quality Evaluation Score Bars */}
        <div className="lg:col-span-2 bg-[#1e293b] p-8 rounded-2xl border border-slate-800">
          <h3 className="text-white font-bold mb-8 flex items-center gap-2">
            <BarChart2 className="text-indigo-400" /> Quality Evaluation KPIs
          </h3>
          <div className="space-y-8">
            <KPIBar label="Capturing Information" icon={<Target size={16}/>} value={kpis.capture} />
            <KPIBar label="Phone Etiquette" icon={<PhoneCall size={16}/>} value={kpis.etiquette} />
            <KPIBar label="Problem Solving Abilities" icon={<CheckCircle size={16}/>} value={kpis.solving} />
            <KPIBar label="Product Knowledge" icon={<BookOpen size={16}/>} value={kpis.product} />
            <KPIBar label="Promotion" icon={<Megaphone size={16}/>} value={kpis.promo} />
            <KPIBar label="Upselling" icon={<BarChart2 size={16}/>} value={kpis.upsell} />
          </div>
        </div>

        {/* AI Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
             <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><Target size={20}/></div>
                <h3 className="text-white font-bold">AI Performance Coach</h3>
             </div>
             <div className="flex flex-col items-center justify-center py-12 text-slate-500 italic text-sm">
                <div className="flex gap-1 mb-4">
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></div>
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100"></div>
                   <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200"></div>
                </div>
                Analyzing your latest calls...
             </div>
          </div>

          <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
             <h3 className="text-white font-bold mb-4">Quick Links</h3>
             <button className="w-full text-left p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs mb-3 hover:border-indigo-500 transition-colors">Knowledge Base</button>
             <button className="w-full text-left p-3 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs hover:border-indigo-500 transition-colors">Submit Ticket</button>
          </div>

          <div className="bg-indigo-900/20 p-6 rounded-2xl border border-indigo-500/20">
             <h3 className="text-indigo-400 font-bold mb-2 flex items-center gap-2"><Megaphone size={16}/> Team Announcement</h3>
             <p className="text-slate-400 text-xs italic">"Remember a customer is always right."</p>
             <p className="text-indigo-500 text-[10px] font-bold mt-2 uppercase text-right">- Management</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const AgentMetricCard = ({ title, value, trend, target, icon }: any) => (
  <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 group hover:border-indigo-500/50 transition-all">
    <div className="flex justify-between mb-4">
      <div className="p-2 bg-slate-900 rounded-lg border border-slate-800 group-hover:bg-indigo-500/10 transition-colors">{icon}</div>
      <div className="text-[10px] uppercase font-black text-slate-500 tracking-tighter">ID: 810881446</div>
    </div>
    <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">{title}</p>
    <div className="flex items-baseline gap-2">
      <p className="text-3xl font-black text-white">{value}</p>
      {trend && <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">↑ {trend}</span>}
      {target && <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5">↑ {target}</span>}
    </div>
  </div>
);

const KPIBar = ({ label, icon, value }: any) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <div className="flex items-center gap-3 text-slate-300">
        <div className="p-1.5 bg-slate-800 rounded text-indigo-400">{icon}</div>
        <span className="text-xs font-bold">{label}</span>
      </div>
      <span className="text-xs font-black text-white">{value}%</span>
    </div>
    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div 
        className="h-full bg-gradient-to-r from-orange-600 to-orange-400 shadow-[0_0_10px_rgba(234,88,12,0.5)] transition-all duration-1000" 
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);