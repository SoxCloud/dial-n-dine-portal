import React from 'react';
import { LayoutDashboard, Users, Settings, LogOut, BarChart3, HelpCircle, Sun, Moon } from 'lucide-react';
import { User, UserRole } from '../types';

interface SidebarProps {
  user: User;
  onLogout: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  user, 
  onLogout, 
  activeTab, 
  setActiveTab,
  isDarkMode,
  toggleTheme
}) => {
  const adminLinks = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
    { id: 'agents', icon: Users, label: 'Agent Roster' },
    { id: 'analytics', icon: BarChart3, label: 'Analytics' },
    { id: 'settings', icon: Settings, label: 'Sheet Config' },
  ];

  const agentLinks = [
    { id: 'my-stats', icon: LayoutDashboard, label: 'My Dashboard' },
    { id: 'resources', icon: HelpCircle, label: 'Resources' },
  ];

  const links = user.role === UserRole.ADMIN ? adminLinks : agentLinks;

  return (
    <div className="h-screen w-20 lg:w-64 bg-slate-900 text-white flex flex-col transition-all duration-300 z-50 fixed left-0 top-0 shadow-xl">
      <div className="p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-slate-700">
        <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-lg shadow-brand-500/30 text-white font-bold text-xl">
          O
        </div>
        <span className="hidden lg:block font-bold text-xl tracking-tight">DnD Help-Desk</span>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-900/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
              }`}
            >
              <Icon size={22} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
              <span className="hidden lg:block font-medium">{link.label}</span>
              {isActive && (
                <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors mb-2"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span className="hidden lg:block text-sm">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <div className="flex items-center gap-3 mb-4 px-2 mt-4">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-bold text-slate-300">
            {user.name.charAt(0)}
          </div>
          <div className="hidden lg:block overflow-hidden">
            <p className="text-sm font-medium text-white truncate">{user.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-colors"
        >
          <LogOut size={20} />
          <span className="hidden lg:block text-sm">Sign Out</span>
        </button>
      </div>
    </div>
  );
};