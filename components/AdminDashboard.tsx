import React from 'react';
import { Agent } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PhoneCall, Clock, CheckCircle, Download, Calendar } from 'lucide-react';

interface Props {
  agents: Agent[];
  dateRange: { start: string, end: string };
  onDateChange: (range: { start: string, end: string }) => void;
}

export const AdminDashboard: React.FC<Props> = ({ agents, dateRange, onDateChange }) => {
  
  // Filter and Aggregate Data based on Range
  const tableData = agents.map(agent => {
    const stats = agent.history.filter(h => h.date >= dateRange.start && h.date <= dateRange.end);
    const evals = agent.evaluations.filter(e => e.date >= dateRange.start && e.date <= dateRange.end);
    
    return {
      name: agent.name,
      calls: stats.reduce((acc, curr) => acc + curr.answeredCalls, 0),
      solved: stats.reduce((acc, curr) => acc + curr.transactions, 0),
      csat: evals.length > 0 ? (evals.reduce((acc, curr) => acc + curr.score, 0) / evals.length).toFixed(1) : 0,
      status: 'Offline'
    };
  });

  const exportToCSV = () => {
    const headers = "Agent Name,Total Calls,Resolved Tickets,Avg CSAT\n";
    const csvData = tableData.map(row => `${row.name},${row.calls},${row.solved},${row.csat}`).join("\n");
    const blob = new Blob([headers + csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `OmniDesk_Report_${dateRange.start}_to_${dateRange.end}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 text-slate-200 animate-in fade-in duration-500">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white">Operations Overview</h1>
          <p className="text-slate-400 text-sm">Real-time metrics from Master Sheet</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs">
            <Calendar size={14} className="mx-2 text-slate-500" />
            <input type="date" title="Start date" value={dateRange.start} onChange={(e) => onDateChange({...dateRange, start: e.target.value})} className="bg-transparent text-white outline-none" />
            <span className="mx-2 text-slate-500">to</span>
            <input type="date" title="End date" value={dateRange.end} onChange={(e) => onDateChange({...dateRange, end: e.target.value})} className="bg-transparent text-white outline-none pr-2" />
          </div>
          <button onClick={exportToCSV} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors shadow-lg">
            <Download size={16} className="mr-2" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Calls" value={tableData.reduce((a, b) => a + b.calls, 0)} icon={<PhoneCall/>} color="text-emerald-400" />
        <StatCard title="Total Resolved" value={tableData.reduce((a, b) => a + b.solved, 0)} icon={<Clock/>} color="text-indigo-400" />
        <StatCard title="Team Avg CSAT" value="86%" icon={<CheckCircle/>} color="text-emerald-400" />
      </div>

      <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
        <h3 className="text-xs font-semibold mb-6 uppercase tracking-wider text-slate-400">Call Volume per Agent</h3>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tableData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={10} axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: '#334155'}} contentStyle={{backgroundColor: '#0f172a', border: '1px solid #1e293b'}} />
              <Bar dataKey="calls" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-[#1e293b] p-6 rounded-2xl border border-slate-800">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 bg-slate-800 rounded-lg text-slate-400">{icon}</div>
    </div>
    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">{title}</p>
    <p className={`text-3xl font-bold ${color}`}>{value}</p>
  </div>
);