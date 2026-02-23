import React from 'react';
import { Agent } from '../types';
import { PhoneCall, Clock, CheckCircle, Users, Activity, Search, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Props {
  agents: Agent[];
  dateRange: { start: string; end: string };
  onDateChange: (range: { start: string; end: string }) => void;
  onViewAgent: (id: string) => void;
}

export const AdminDashboard: React.FC<Props> = ({ agents, dateRange, onDateChange, onViewAgent }) => {
  // Calculate real-time totals from agent data
  const totalCalls = agents.reduce((sum, a) => sum + (a.history[0]?.answeredCalls || 0), 0);
  const avgCSAT = agents.length 
    ? (agents.reduce((sum, a) => sum + (a.evaluations[0]?.score || 0), 0) / agents.length).toFixed(1) 
    : "0";

  const chartData = agents.map(a => ({
    name: a.name.split(' ')[0],
    calls: a.history[0]?.answeredCalls || 0
  }));

  return (
    <div className="space-y-6">
      {/* Header Area with Restored Date Range */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm">Real-time performance metrics from Master Sheet</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-[#1e293b] border border-slate-800 rounded-xl px-4 py-2 flex items-center gap-2">
            <Calendar size={14} className="text-indigo-400" />
            <div className="flex items-center gap-1 text-xs text-white">
              <input 
                type="date" 
                value={dateRange.start}
                onChange={(e) => onDateChange({ ...dateRange, start: e.target.value })}
                className="bg-transparent outline-none border-none focus:ring-0 w-28"
              />
              <span className="text-slate-600">-</span>
              <input 
                type="date" 
                value={dateRange.end}
                onChange={(e) => onDateChange({ ...dateRange, end: e.target.value })}
                className="bg-transparent outline-none border-none focus:ring-0 w-28"
              />
            </div>
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors">
            <Activity size={14}/> AI Insights
          </button>
        </div>
      </div>

      {/* Stats Grid - Now using Dynamic Data */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Total Calls" value={totalCalls} change="+12%" icon={<PhoneCall className="text-blue-400"/>} />
        <MetricCard title="Avg Handle Time" value="85s" change="-5%" isNegative icon={<Clock className="text-orange-400"/>} />
        <MetricCard title="Team CSAT" value={`${avgCSAT}%`} change="+0.2%" icon={<CheckCircle className="text-emerald-400"/>} />
        <MetricCard title="Active Agents" value={`0/${agents.length}`} icon={<Users className="text-purple-400"/>} />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call Volume Chart */}
        <div className="lg:col-span-2 bg-[#1e293b]/50 border border-slate-800 p-6 rounded-2xl">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <Activity className="text-indigo-400" size={18}/> Call Volume per Agent
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#2d3748'}} 
                  contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff'}} 
                />
                <Bar dataKey="calls" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Current Status Donut Area */}
        <div className="bg-[#1e293b]/50 border border-slate-800 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <h3 className="text-white font-semibold mb-4 w-full text-left">Current Status</h3>
          <div className="relative h-48 w-48 flex items-center justify-center">
             <div className="absolute inset-0 border-8 border-slate-800 rounded-full"></div>
             <div className="absolute inset-0 border-8 border-indigo-500 rounded-full border-t-transparent -rotate-45"></div>
             <div className="flex flex-col">
               <span className="text-4xl font-black text-white">0</span>
               <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Active</span>
             </div>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-8 w-full text-[10px] font-bold uppercase tracking-wider">
            <div className="flex items-center justify-center gap-2 text-slate-400 bg-slate-900/50 py-2 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
            </div>
            <div className="flex items-center justify-center gap-2 text-slate-400 bg-slate-900/50 py-2 rounded-lg">
              <span className="w-2 h-2 rounded-full bg-orange-500"></span> On Call
            </div>
          </div>
        </div>
      </div>

      {/* Agent Performance Table */}
      <div className="bg-[#1e293b]/50 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/20">
          <h3 className="text-white font-semibold">Agent Performance Table</h3>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14}/>
            <input 
              type="text" 
              placeholder="Search agents..." 
              className="bg-slate-900 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-xs text-white focus:border-indigo-500 outline-none w-64 transition-all" 
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50 text-[10px] uppercase font-black text-slate-500 tracking-widest">
              <tr>
                <th className="px-6 py-4">Agent Name</th>
                <th className="px-6 py-4">Current Status</th>
                <th className="px-6 py-4 text-center">Answered</th>
                <th className="px-6 py-4 text-center">Tickets</th>
                <th className="px-6 py-4 text-center">CSAT</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-indigo-500/5 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-slate-700 to-slate-600 flex items-center justify-center text-[11px] font-black text-white shadow-inner">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm font-bold text-slate-200">{agent.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-slate-900/80 border border-slate-800 rounded-full text-[10px] font-bold text-slate-500 flex items-center w-fit gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span> Offline
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-black text-slate-300 text-center">{agent.history[0]?.answeredCalls || 0}</td>
                  <td className="px-6 py-4 text-sm font-black text-slate-300 text-center">{agent.history[0]?.transactions || 0}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-black text-indigo-400">{agent.evaluations[0]?.score || 0}%</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => onViewAgent(agent.id)} 
                      className="bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
                    >
                      View Stats
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, change, icon, isNegative }: any) => (
  <div className="bg-[#1e293b]/50 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group hover:border-indigo-500/50 transition-all shadow-lg">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mb-1">{title}</p>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-black text-white">{value}</span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${isNegative ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
            {change}
          </span>
        </div>
      </div>
      <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-indigo-400 group-hover:scale-110 transition-transform">
        {icon}
      </div>
    </div>
  </div>
);