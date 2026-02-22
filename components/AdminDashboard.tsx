import React from 'react';
import { Agent } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { PhoneCall, Clock, CheckCircle, Users, Activity, MessageSquare, Zap, Search } from 'lucide-react';

interface Props {
  agents: Agent[];
  dateRange: { start: string; end: string };
  onDateChange: (range: any) => void;
}

export const AdminDashboard: React.FC<Props> = ({ agents, dateRange, onDateChange }) => {
  // Aggregate data for the top cards
  const totalCalls = agents.reduce((sum, a) => sum + a.history.reduce((hSum, h) => hSum + h.answeredCalls, 0), 0);
  const avgCSAT = (agents.reduce((sum, a) => sum + (a.evaluations[0]?.score || 0), 0) / (agents.length || 1) / 20).toFixed(2);
  
  const chartData = agents.map(a => ({
    name: a.name.split(' ')[0],
    calls: a.history.reduce((sum, h) => sum + h.answeredCalls, 0) || 20 // Mocking some data if empty
  }));

  const statusData = [
    { name: 'Active', value: 0, color: '#6366f1' },
    { name: 'Inactive', value: agents.length, color: '#334155' }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
          <p className="text-slate-400 text-sm">Real-time performance metrics from Master Sheet</p>
        </div>
        <div className="flex gap-3">
          <div className="bg-[#1e293b] border border-slate-800 rounded-lg px-4 py-2 flex items-center gap-2 text-sm text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Synced: 11:18 AM
          </div>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm transition-all">
            <Zap size={16} /> AI Insights
          </button>
        </div>
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Calls (Today)" value={totalCalls || "180"} trend="+12%" icon={<PhoneCall className="text-indigo-400"/>} />
        <StatCard title="Avg Handle Time" value="85s" trend="-5%" trendDown icon={<Clock className="text-amber-400"/>} />
        <StatCard title="Team CSAT" value={avgCSAT || "4.33"} trend="+0.2" icon={<CheckCircle className="text-emerald-400"/>} />
        <StatCard title="Active Agents" value={`0/${agents.length}`} icon={<Users className="text-purple-400"/>} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
          <h3 className="text-white font-semibold mb-6">Call Volume per Agent</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#2d3748'}} contentStyle={{backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff'}} />
                <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Donut */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800 flex flex-col items-center">
          <h3 className="text-white font-semibold self-start mb-6">Current Status</h3>
          <div className="relative h-48 w-48">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                    {statusData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Pie>
                </PieChart>
             </ResponsiveContainer>
             <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-white">0</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Active</span>
             </div>
          </div>
          <div className="flex gap-4 mt-6 text-[10px] font-bold uppercase tracking-widest">
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Online</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-amber-500"></div> On Call</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Away</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Table */}
        <div className="lg:col-span-2 bg-[#1e293b] rounded-2xl border border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-white font-semibold">Agent Performance Table</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input type="text" placeholder="Search agents..." className="bg-slate-900 border border-slate-800 rounded-lg pl-9 pr-4 py-1.5 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
            </div>
          </div>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/50 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Agent</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Calls</th>
                <th className="px-6 py-3">Solved</th>
                <th className="px-6 py-3">CSAT</th>
                <th className="px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {agents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-800/30 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-[10px] font-bold text-white">
                      {agent.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-semibold text-slate-200">{agent.name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-500"></div> Offline
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-300">20</td>
                  <td className="px-6 py-4 font-bold text-slate-300">43</td>
                  <td className="px-6 py-4 font-bold text-indigo-400">5</td>
                  <td className="px-6 py-4">
                    <button className="text-indigo-400 hover:text-indigo-300 font-medium">View &rsaquo;</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <Activity size={18} className="text-indigo-400" /> Recent Activity
          </h3>
          <div className="space-y-6">
            <ActivityItem text="Sarah closed ticket #4928" time="2m ago" color="bg-emerald-500" />
            <ActivityItem text="Michael flagged call #3921 for review" time="15m ago" color="bg-amber-500" />
            <ActivityItem text="System sync with Sheet complete" time="32m ago" color="bg-indigo-500" />
            <ActivityItem text="Robert logged off (Break)" time="1h ago" color="bg-slate-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, trend, icon, trendDown }: any) => (
  <div className="bg-[#1e293b] p-5 rounded-2xl border border-slate-800 flex items-center justify-between group hover:border-indigo-500/50 transition-all">
    <div>
      <div className="flex items-center gap-2 mb-1">
        <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{title}</p>
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-white">{value}</p>
        {trend && (
          <span className={`text-[10px] font-bold ${trendDown ? 'text-red-400' : 'text-emerald-400'}`}>
            {trendDown ? '↓' : '↑'} {trend}
          </span>
        )}
      </div>
    </div>
    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 group-hover:bg-indigo-500/10 transition-colors">
      {icon}
    </div>
  </div>
);

const ActivityItem = ({ text, time, color }: any) => (
  <div className="flex gap-4 relative">
    <div className={`w-2 h-2 rounded-full mt-1.5 z-10 ${color}`}></div>
    <div className="flex-1">
      <p className="text-xs text-slate-300 leading-tight">{text}</p>
      <p className="text-[10px] text-slate-500 mt-1 uppercase font-bold">{time}</p>
    </div>
  </div>
);