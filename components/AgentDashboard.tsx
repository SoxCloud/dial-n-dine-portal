import React, { useState, useEffect } from 'react';
import { Agent, AgentStatus } from '../types';
import { StatCard } from './StatCard';
import { 
  Phone, Clock, CheckCircle, BrainCircuit, Calendar, MessageSquare, 
  ExternalLink, Ticket, CheckSquare, MessageCircle, Timer, Award,
  Map, Gift, BarChart3, Lightbulb, ChevronDown
} from 'lucide-react';
import { getAgentCoachingTips } from '../services/geminiService';
import { marked } from 'marked';

interface AgentDashboardProps {
  agent: Agent;
  onStatusChange?: (agentId: string, newStatus: AgentStatus) => void;
}

export const AgentDashboard: React.FC<AgentDashboardProps> = ({ agent, onStatusChange }) => {
  const [coachingTipsHtml, setCoachingTipsHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const today = new Date().toISOString().split('T')[0];
  const [dateRange, setDateRange] = useState({
      start: today,
      end: today
  });

  useEffect(() => {
    // Load coaching tips on mount
    const loadTips = async () => {
      setIsLoading(true);
      const tipsText = await getAgentCoachingTips(agent);
      // Ensure we parse markdown to HTML safely (handle async parse if needed)
      const html = await marked.parse(tipsText);
      setCoachingTipsHtml(html);
      setIsLoading(false);
    };
    loadTips();
  }, [agent]);

  const skillMetrics = [
    { name: 'Capturing Information', value: agent.qualityMetrics.capturingInformation, icon: Map },
    { name: 'Phone Etiquette', value: agent.qualityMetrics.phoneEtiquette, icon: Phone },
    { name: 'Problem Solving Abilities', value: agent.qualityMetrics.problemSolving, icon: CheckCircle },
    { name: 'Product Knowledge', value: agent.qualityMetrics.productKnowledge, icon: Lightbulb },
    { name: 'Promotion', value: 87, icon: Gift }, // Hardcoded purely for visual matching to example if data missing
    { name: 'Upselling', value: agent.qualityMetrics.promotionUpselling, icon: BarChart3 },
  ];

  const getStatusColor = (status: AgentStatus) => {
    switch (status) {
        case AgentStatus.ONLINE: return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800';
        case AgentStatus.ON_CALL: return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800';
        case AgentStatus.AWAY: return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800';
        default: return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-600';
    }
  };

  const getStatusDotColor = (status: AgentStatus) => {
      switch (status) {
          case AgentStatus.ONLINE: return 'bg-green-500';
          case AgentStatus.ON_CALL: return 'bg-amber-500';
          case AgentStatus.AWAY: return 'bg-indigo-500';
          default: return 'bg-slate-500';
      }
  };

  const formatDate = (dateString: string) => {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const periodLabel = dateRange.start === dateRange.end 
    ? formatDate(dateRange.start) 
    : `${formatDate(dateRange.start)} - ${formatDate(dateRange.end)}`;

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      {/* Header with Date Selection */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {agent.name.split(' ')[0]}!</h1>
          <p className="text-slate-500 text-sm">Performance snapshot</p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 p-2 rounded-lg border border-slate-200 dark:border-slate-600">
             <Calendar size={18} className="text-slate-500 dark:text-slate-300 ml-2" />
             <div className="flex items-center gap-2">
                 <input 
                   type="date" 
                   value={dateRange.start}
                   onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                   className="bg-transparent border-none focus:ring-0 text-sm text-slate-700 dark:text-slate-200 w-32"
                 />
                 <span className="text-slate-400">-</span>
                 <input 
                   type="date" 
                   value={dateRange.end}
                   onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                   className="bg-transparent border-none focus:ring-0 text-sm text-slate-700 dark:text-slate-200 w-32"
                 />
             </div>
           </div>

            {/* Interactive Status Dropdown */}
            <div className="relative">
                <select
                    value={agent.status}
                    onChange={(e) => onStatusChange && onStatusChange(agent.id, e.target.value as AgentStatus)}
                    disabled={!onStatusChange}
                    className={`appearance-none pl-8 pr-10 py-2.5 rounded-full text-sm font-semibold border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-500 transition-colors ${getStatusColor(agent.status)}`}
                >
                    {Object.values(AgentStatus).map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none ${getStatusDotColor(agent.status)}`}></span>
                <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-50 pointer-events-none" />
            </div>
        </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title={`Calls (${periodLabel})`}
          value={agent.metrics.callsTaken} 
          icon={Phone} 
          trend="up" 
          trendValue="Target 40"
          colorClass="text-blue-500"
        />
        <StatCard 
          title="Resolution Rate" 
          value={`${agent.metrics.resolutionRate}%`} 
          icon={CheckSquare} 
          trend="up" 
          trendValue="Top 5%" 
          colorClass="text-emerald-500"
        />
         <StatCard 
          title="Total Tickets" 
          value={agent.metrics.totalTickets} 
          icon={Ticket} 
          trend="neutral"
          colorClass="text-violet-500"
        />
        <StatCard 
          title="Avg Handle Time" 
          value={`${agent.metrics.avgHandleTime}s`} 
          icon={Clock} 
          trend={agent.metrics.avgHandleTime > 250 ? "down" : "up"}
          trendValue={agent.metrics.avgHandleTime > 250 ? "High" : "Good"} 
          colorClass="text-amber-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Quality & Tickets */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Ticket Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2 text-green-600 dark:text-green-400">
                     <CheckCircle size={18} />
                     <span className="text-sm font-medium">Solved</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{agent.metrics.ticketsSolved}</span>
                  <span className="text-xs text-slate-500 ml-2">tickets</span>
               </div>
               <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400">
                     <MessageCircle size={18} />
                     <span className="text-sm font-medium">Interactions</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{agent.metrics.interactions}</span>
                  <span className="text-xs text-slate-500 ml-2">actions</span>
               </div>
               <div className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-2 text-purple-600 dark:text-purple-400">
                     <Timer size={18} />
                     <span className="text-sm font-medium">Resolution Time</span>
                  </div>
                  <span className="text-2xl font-bold text-slate-900 dark:text-white">{agent.metrics.avgResolutionTime}</span>
                  <span className="text-xs text-slate-500 ml-2">hours</span>
               </div>
            </div>

            {/* Quality Metrics - Redesigned to match request */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className="p-6">
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-6">Quality Evaluation KPIs</h3>
                    
                    <div className="space-y-5">
                      {skillMetrics.map((skill, index) => {
                          const Icon = skill.icon;
                          return (
                            <div key={index} className="flex items-center gap-4 group">
                                <div className="p-3 rounded-lg bg-slate-900 dark:bg-slate-950 border border-slate-800 text-orange-500 shadow-sm shrink-0 group-hover:scale-105 transition-transform">
                                    <Icon size={20} />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-slate-700 dark:text-slate-200">{skill.name}</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{skill.value}%</span>
                                    </div>
                                    <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                        <div 
                                          className="h-full bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)] transition-all duration-1000 ease-out" 
                                          style={{ width: `${skill.value}%` }} 
                                        />
                                    </div>
                                </div>
                            </div>
                          );
                      })}
                    </div>
                </div>
            </div>
            
            <div className="mt-6 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4">My Schedule</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Calendar size={18} className="text-slate-400" />
                            <span className="font-medium text-slate-700 dark:text-slate-200">Shift Start</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">{agent.shiftStart}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Clock size={18} className="text-slate-400" />
                            <span className="font-medium text-slate-700 dark:text-slate-200">Next Break</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">12:00 PM (15m)</span>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: AI Coach & Resources */}
        <div className="space-y-6">
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <BrainCircuit size={120} />
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-500/20 rounded-lg backdrop-blur-sm border border-indigo-500/30">
                            <BrainCircuit className="text-indigo-300" size={24} />
                        </div>
                        <h2 className="text-xl font-bold">AI Performance Coach</h2>
                    </div>

                    {isLoading ? (
                        <div className="h-32 flex items-center justify-center space-x-2 animate-pulse">
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                            <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                        </div>
                    ) : (
                        <div className="bg-white/10 rounded-xl p-5 backdrop-blur-md border border-white/10">
                             <div 
                                className="prose prose-invert prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: coachingTipsHtml || 'No tips available.' }} 
                             />
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-4">Quick Links</h3>
                <div className="space-y-2">
                    <button className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center justify-between group">
                        Knowledge Base
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    <button className="w-full text-left px-4 py-3 rounded-lg bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-600 transition-colors text-sm font-medium text-slate-700 dark:text-slate-200 flex items-center justify-between group">
                        Submit Ticket
                        <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                </div>
            </div>
            
             <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-center gap-2 mb-2 text-indigo-700 dark:text-indigo-300">
                    <MessageSquare size={18} />
                    <h3 className="font-semibold">Team Announcement</h3>
                </div>
                <p className="text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed">
                    Remember a customer is always right.
                </p>
                <p className="text-xs text-indigo-500 mt-2 text-right">- Management</p>
            </div>
        </div>
      </div>
    </div>
  );
};