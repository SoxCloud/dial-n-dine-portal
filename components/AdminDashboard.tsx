import React from 'react';
import { Agent, DailyStats } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Users, PhoneCall, Clock, CheckCircle } from 'lucide-react';

interface Props {
  agents: Agent[];
  selectedDate: string;
  onDateChange: (date: string) => void;
  availableDates: string[];
}

export const AdminDashboard: React.FC<Props> = ({ agents, selectedDate, onDateChange, availableDates }) => {
  // Aggregate data based on selected date
  const filteredStats = agents.map(agent => {
    const stats = selectedDate === 'all' 
      ? agent.history 
      : agent.history.filter(h => h.date === selectedDate);
    
    return {
      name: agent.name,
      calls: stats.reduce((acc, curr) => acc + curr.answeredCalls, 0),
      resolution: stats.length > 0 ? stats[0].resolutionRate : 0
    };
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Operations Overview</h1>
        <select 
          value={selectedDate} 
          onChange={(e) => onDateChange(e.target.value)}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Dates</option>
          {availableDates.map(date => <option key={date} value={date}>{date}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Agents" value={agents.length} icon={<Users />} color="bg-blue-500" />
        <StatCard title="Calls Handled" value={filteredStats.reduce((a, b) => a + b.calls, 0)} icon={<PhoneCall />} color="bg-green-500" />
      </div>

      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-lg font-semibold mb-6">Calls by Agent</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filteredStats}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calls" fill="#0e8de9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }: any) => (
  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
    <div className="flex items-center gap-4">
      <div className={`${color} p-3 rounded-xl text-white`}>{icon}</div>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);