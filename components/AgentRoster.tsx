import React, { useState } from 'react';
import { Agent, AgentStatus } from '../types';
import { Search, Filter, ChevronRight, User, ChevronDown } from 'lucide-react';

interface AgentRosterProps {
  agents: Agent[];
  onAgentSelect: (agentId: string) => void;
  onStatusChange: (agentId: string, newStatus: AgentStatus) => void;
}

export const AgentRoster: React.FC<AgentRosterProps> = ({ agents, onAgentSelect, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          agent.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Agent Roster</h1>
          <p className="text-slate-500 text-sm">Manage and monitor team members</p>
        </div>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                  type="text" 
                  placeholder="Find agent..." 
                  className="pl-9 pr-4 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <select 
                    className="pl-9 pr-8 py-2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 appearance-none cursor-pointer"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value={AgentStatus.ONLINE}>Online</option>
                    <option value={AgentStatus.ON_CALL}>On Call</option>
                    <option value={AgentStatus.AWAY}>Away</option>
                    <option value={AgentStatus.OFFLINE}>Offline</option>
                </select>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="px-6 py-4 font-medium">Agent Name</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium text-right">Calls Taken</th>
                <th className="px-6 py-4 font-medium text-right">CSAT</th>
                <th className="px-6 py-4 font-medium text-right">Res. Rate</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {filteredAgents.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={agent.avatarUrl} alt={agent.name} className="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm" />
                      <div>
                        <div className="font-semibold text-slate-900 dark:text-white">{agent.name}</div>
                        <div className="text-xs text-slate-500">{agent.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                     <div className="relative inline-block">
                        <select
                            value={agent.status}
                            onChange={(e) => onStatusChange(agent.id, e.target.value as AgentStatus)}
                            className={`appearance-none pl-6 pr-8 py-1 rounded-full text-xs font-medium border cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-500 transition-colors ${getStatusColor(agent.status)}`}
                        >
                            {Object.values(AgentStatus).map((status) => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <span className={`absolute left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full pointer-events-none ${getStatusDotColor(agent.status)}`}></span>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 opacity-50 pointer-events-none" />
                     </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{agent.department}</td>
                  <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">{agent.metrics.callsTaken}</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-bold ${
                        agent.metrics.csatScore >= 4.5 ? 'text-emerald-500' : 
                        agent.metrics.csatScore >= 4.0 ? 'text-blue-500' : 'text-amber-500'
                    }`}>
                        {agent.metrics.csatScore}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-700 dark:text-slate-300">{agent.metrics.resolutionRate}%</td>
                  <td className="px-6 py-4 text-right">
                    <button 
                        onClick={() => onAgentSelect(agent.id)}
                        className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium text-xs flex items-center justify-end gap-1 ml-auto group-hover:underline"
                    >
                        View Profile <ChevronRight size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAgents.length === 0 && (
              <div className="p-12 text-center text-slate-500">
                  <User size={48} className="mx-auto mb-3 opacity-20" />
                  <p>No agents found matching your criteria.</p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};