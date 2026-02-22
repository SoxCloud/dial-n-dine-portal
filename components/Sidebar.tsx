import React from 'react';
import { LayoutDashboard, Users, BarChart3, Settings, Moon, Sun, LogOut, ShieldCheck, PlayCircle } from 'lucide-react';
import { User, UserRole } from '../types';

export const Sidebar = ({ user, activeTab, setActiveTab, onLogout, isDarkMode, toggleTheme }: any) => {
  const menuItems = user.role === UserRole.ADMIN 
    ? [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'agents', label: 'Agent Roster', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      ]
    : [
        { id: 'dashboard', label: 'My Dashboard', icon: LayoutDashboard },
        { id: 'evaluations', label: 'Evaluated Calls', icon: PlayCircle },
      ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-[#0f172a] border-r border-slate-800 flex flex-col z-50">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black">O</div>
          <span className="text-xl font-bold text-white tracking-tight">DnD Help-Desk</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-4">
        <button onClick={toggleTheme} className="w-full flex items-center justify-between px-4 py-2 bg-slate-900 rounded-xl text-slate-400 text-xs font-bold">
          <span>{isDarkMode ? 'LIGHT MODE' : 'DARK MODE'}</span>
          {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
        <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-2xl border border-slate-800 text-white">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold">{user.name.charAt(0)}</div>
          <div className="overflow-hidden"><p className="text-xs font-bold truncate">{user.name}</p></div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-xl text-xs font-bold transition-all">
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </aside>
  );
};