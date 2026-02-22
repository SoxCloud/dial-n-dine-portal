import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { 
  Users, Phone, Clock, CheckCircle, Sheet, Sparkles, RefreshCw, 
  ExternalLink, Search, TrendingUp, AlertCircle, Calendar, ChevronRight
} from 'lucide-react';
import { marked } from 'marked';
import { Agent, AgentStatus } from '../types';
import { StatCard } from './StatCard';
import { analyzeTeamPerformance } from '../services/geminiService';

interface AdminDashboardProps {
  agents: Agent[];
  onRefresh?: () => void;
  lastSynced?: Date;
  isSyncing?: boolean;
  onAgentSelect?: (agentId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
    agents, 
    onRefresh, 
    lastSynced = new Date(),
    isSyncing = false,
    onAgentSelect
}) => {
  const [insightHtml, setInsightHtml] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const today = new Date().toISOString().split('T')[0];
  const [dateRange, setDateRange] = useState({
      start: today,
      end: today
  });

  // Aggregated Metrics
  const totalCalls = agents.reduce((acc, curr) => acc + curr.metrics.callsTaken, 0);
  const avgCSAT = (agents.reduce((acc, curr) => acc + curr.metrics.csatScore, 0) / agents.length).toFixed(2);
  const avgAHT = Math.round(agents.reduce((acc, curr) => acc + curr.metrics.avgHandleTime, 0) / agents.length);
  const onlineAgents = agents.filter(a => a.status !== AgentStatus.OFFLINE).length;

  const handleGenerateInsights = async () => {
    setIsLoadingInsight(true);
    const result = await analyzeTeamPerformance(agents);
    const html = await marked.parse(result);
    setInsightHtml(html);
    setIsLoadingInsight(false);
  };

  const filteredAgents = agents.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusData = [
    { name: 'Online', value: agents.filter(a => a.status === AgentStatus.ONLINE).length, color: '#10b981' },
    { name: 'On Call', value: agents.filter(a => a.status === AgentStatus.ON_CALL).length, color: '#f59e0b' },
    { name: 'Away', value: agents.filter(a => a.status === AgentStatus.AWAY).length, color: '#6366f1' },
    { name: 'Offline', value: agents.filter(a => a.status === AgentStatus.OFFLINE).length, color: '#94a3b8' },
  ];

  const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const periodLabel = dateRange.start === dateRange.end 
    ? 'Today' 
    : `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm">Real-time performance metrics from Master Sheet</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3">
           <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
             <Calendar size={18} className="text-slate-500 dark:text-slate-300 ml-2" />
             <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  title="Start date for filtering metrics"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="bg-transparent border-none focus:ring-0 text-sm text-slate-700 dark:text-slate-200 outline-none w-32"
                />
                <span className="text-slate-400">-</span>
                <input 
                  type="date" 
                  title="End date for filtering metrics"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="bg-transparent border-none focus:ring-0 text-sm text-slate-700 dark:text-slate-200 outline-none w-32"
                />
             </div>
           </div>
           
           <button 
                onClick={onRefresh}
                disabled={isSyncing}
                className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-full text-xs font-medium transition-colors"
           >
             <RefreshCw size={14} className={isSyncing ? "animate-spin" : ""} />
             <span>Synced: {lastSynced.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
           </button>

           <button 
            onClick={handleGenerateInsights}
            disabled={isLoadingInsight}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-lg hover:shadow-lg hover:shadow-indigo-500/20 transition-all disabled:opacity-70"
           >
             {isLoadingInsight ? (
               <RefreshCw size={18} className="animate-spin" />
             ) : (
               <Sparkles size={18} />
             )}
             <span>{isLoadingInsight ? 'Analyzing...' : 'AI Insights'}</span>
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={`Total Calls (${periodLabel})`}
          value={totalCalls} 
          icon={Phone} 
          trend="up" 
          trendValue="+12%"
          colorClass="text-blue-500"
        />
        <StatCard 
          title="Avg Handle Time" 
          value={`${avgAHT}s`} 
          icon={Clock} 
          trend="down" 
          trendValue="-5%" 
          colorClass="text-amber-500"
        />
        <StatCard 
          title="Team CSAT" 
          value={avgCSAT} 
          icon={CheckCircle} 
          trend="up" 
          trendValue="+0.2"
          colorClass="text-emerald-500"
        />
        <StatCard 
          title="Active Agents" 
          value={`${onlineAgents}/${agents.length}`} 
          icon={Users} 
          trend="neutral"
          colorClass="text-violet-500"
        />
      </div>

      {/* AI Insights Panel */}
      {insightHtml && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-indigo-100 dark:border-indigo-900 relative overflow-hidden animate-slide-up">
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-indigo-500" />
           <div className="flex items-center gap-2 mb-4">
             <Sparkles className="text-indigo-500" size={24} />
             <h2 className="text-lg font-bold text-slate-900 dark:text-white">Gemini Performance Analysis</h2>
           </div>
           <div 
             className="prose prose-sm dark:prose-invert max-w-none prose-headings:text-slate-800 dark:prose-headings:text-slate-200 prose-p:text-slate-600 dark:prose-p:text-slate-400"
             dangerouslySetInnerHTML={{ __html: insightHtml }} 
           />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Charts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-6">Call Volume per Agent</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <BarChart data={agents}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}}
                    tickFormatter={(value) => value.split(' ')[0]} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#64748b', fontSize: 12}} 
                  />
                  <Tooltip 
                    cursor={{fill: '#f1f5f9'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="metrics.callsTaken" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
             <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200">Agent Performance Table</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search agents..." 
                    className="pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full md:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
             </div>
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-700/50">
                   <tr>
                     <th className="px-4 py-3 rounded-l-lg">Agent</th>
                     <th className="px-4 py-3">Status</th>
                     <th className="px-4 py-3 text-right">Calls</th>
                     <th className="px-4 py-3 text-right">Solved</th>
                     <th className="px-4 py-3 text-right">CSAT</th>
                     <th className="px-4 py-3 rounded-r-lg text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                   {filteredAgents.map((agent) => (
                     <tr 
                        key={agent.id} 
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                        onClick={() => onAgentSelect && onAgentSelect(agent.id)}
                     >
                       <td className="px-4 py-3 font-medium text-slate-900 dark:text-white flex items-center gap-3">
                         <img src={agent.avatarUrl} alt={agent.name} className="w-8 h-8 rounded-full object-cover" />
                         {agent.name}
                       </td>
                       <td className="px-4 py-3">
                         <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                           agent.status === AgentStatus.ONLINE ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                           agent.status === AgentStatus.ON_CALL ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                           agent.status === AgentStatus.AWAY ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300' :
                           'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'
                         }`}>
                           <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                             agent.status === AgentStatus.ONLINE ? 'bg-green-500' :
                             agent.status === AgentStatus.ON_CALL ? 'bg-amber-500' :
                             agent.status === AgentStatus.AWAY ? 'bg-indigo-500' :
                             'bg-slate-500'
                           }`}></span>
                           {agent.status}
                         </span>
                       </td>
                       <td className="px-4 py-3 text-right">{agent.metrics.callsTaken}</td>
                       <td className="px-4 py-3 text-right">{agent.metrics.ticketsSolved}</td>
                       <td className="px-4 py-3 text-right font-semibold text-brand-600 dark:text-brand-400">{agent.metrics.csatScore}</td>
                       <td className="px-4 py-3 text-right">
                         <button 
                            className="text-brand-600 hover:text-brand-500 font-medium flex items-center justify-end gap-1 ml-auto"
                            onClick={(e) => {
                                e.stopPropagation();
                                if(onAgentSelect) onAgentSelect(agent.id);
                            }}
                         >
                           View <ChevronRight size={14} />
                         </button>
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </div>
        </div>

        {/* Right Column: Status & Activity */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Current Status</h3>
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{onlineAgents}</span>
                <p className="text-xs text-slate-500">Active</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
              <TrendingUp size={18} className="text-brand-500" />
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                { time: '2m ago', text: 'Sarah closed ticket #4928', type: 'success' },
                { time: '15m ago', text: 'Michael flagged call #3921 for review', type: 'warning' },
                { time: '32m ago', text: 'System sync with Sheet complete', type: 'info' },
                { time: '1h ago', text: 'Robert logged off (Break)', type: 'neutral' },
              ].map((activity, i) => (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                    activity.type === 'success' ? 'bg-green-500' : 
                    activity.type === 'warning' ? 'bg-amber-500' :
                    activity.type === 'info' ? 'bg-blue-500' : 'bg-slate-400'
                  }`} />
                  <div>
                    <p className="text-slate-700 dark:text-slate-300">{activity.text}</p>
                    <span className="text-xs text-slate-400">{activity.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
           <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <AlertCircle size={24} className="text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-lg mb-1">Queue Alert</h4>
                <p className="text-indigo-100 text-sm mb-3">Call volume is 15% higher than predicted for this hour.</p>
                <button className="text-xs font-semibold bg-white text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                  View Queue
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};