import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { AgentDashboard } from './components/AgentDashboard';
import { AgentRoster } from './components/AgentRoster';
import { Login } from './components/Login';
import { User, UserRole, Agent } from './types';
import { fetchAllDashboardData } from './services/sheetService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // New Date Range State (Defaults to current month)
  const [dateRange, setDateRange] = useState({
    start: '2026-02-01',
    end: new Date().toISOString().split('T')[0] // Today's date
  });

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    fetchAllDashboardData().then(data => {
      setAgents(data.agents);
      setLoading(false);
    });
  }, []);

  const handleLogin = (email: string) => {
    const mail = email.toLowerCase().trim();
    if (mail === 'callcenter@dialndine.com') {
      setUser({ id: 'admin', name: 'Admin', email: mail, role: UserRole.ADMIN, avatarUrl: '' });
      return true;
    }
    const found = agents.find(a => a.email.toLowerCase() === mail);
    if (found) {
      setUser({ id: found.id, name: found.name, email: found.email, role: UserRole.AGENT, avatarUrl: found.avatarUrl || '' });
      setActiveTab('my-stats');
      return true;
    }
    return false;
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-white">Loading Portal...</div>;
  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0f172a] overflow-hidden transition-colors duration-300">
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setUser(null)} isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
      <main className="flex-1 overflow-y-auto lg:ml-64 p-8">
        {user.role === UserRole.ADMIN ? (
          <>
            {activeTab === 'dashboard' && <AdminDashboard agents={agents} dateRange={dateRange} onDateChange={setDateRange} />}
            {activeTab === 'agents' && <AgentRoster agents={agents} />}
          </>
        ) : (
          <AgentDashboard agent={agents.find(a => a.id === user.id)!} dateRange={dateRange} onDateChange={setDateRange} />
        )}
      </main>
    </div>
  );
};

export default App;