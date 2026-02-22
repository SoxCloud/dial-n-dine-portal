import React from 'react';
import { LayoutDashboard, Users, BarChart3, Settings, Moon, Sun, LogOut } from 'lucide-react';
import { User, UserRole } from '../types';

export const Sidebar = ({ user, activeTab, setActiveTab, onLogout, isDarkMode, toggleTheme }: any) => {
  const menuItems = user.role === UserRole.ADMIN 
    ? [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'agents', label: 'Agent Roster', icon: Users },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'config', label: 'Sheet Config', icon: Settings },
      ]
    : [{ id: 'my-stats', label: 'My Dashboard', icon: LayoutDashboard }];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 flex flex-col z-50 transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg shadow-indigo-500/20">O</div>
          <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">DnD Help-Desk</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
              activeTab === item.id 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-4">
        {/* THEME TOGGLE BUTTON */}
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        >
          <span className="text-xs font-bold uppercase tracking-widest">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-slate-800 flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-400">
            {user.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
            <p className="text-[10px] text-slate-500 uppercase font-black">{user.role}</p>
          </div>
        </div>
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors text-sm font-bold">
          <LogOut size={18} /> Sign Out
        </button>
      </div>
    </aside>
  );
};