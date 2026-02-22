import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { AgentDashboard } from './components/AgentDashboard';
import { AgentRoster } from './components/AgentRoster';
import { Login } from './components/Login';
import { User, UserRole, Agent } from './types';
import { fetchAllDashboardData } from './services/sheetService';
import { AlertCircle, RefreshCw } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default date range: Feb 1st 2026 to Today
  const [dateRange, setDateRange] = useState({
    start: '2026-02-01',
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  // Load Data with Error Handling
  const loadData = async () => {
    setLoading(true);
    try {
      const data = await fetchAllDashboardData();
      if (data.agents && data.agents.length > 0) {
        setAgents(data.agents);
        setError(null);
      } else {
        setError("No agent data found in spreadsheet.");
      }
    } catch (err) {
      setError("Failed to connect to Google Sheets. Check your Sheet ID.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLogin = (email: string) => {
    const mail = email.toLowerCase().trim();
    
    // Admin Login
    if (mail === 'callcenter@dialndine.com') {
      setUser({ id: 'admin', name: 'Admin', email: mail, role: UserRole.ADMIN, avatarUrl: '' });
      return true;
    }

    // Agent Login - Enhanced matching logic
    const foundAgent = agents.find(a => a.email.toLowerCase() === mail);
    if (foundAgent) {
      setUser({ 
        id: foundAgent.id, 
        name: foundAgent.name, 
        email: foundAgent.email, 
        role: UserRole.AGENT, 
        avatarUrl: foundAgent.avatarUrl || '' 
      });
      setActiveTab('my-stats');
      return true;
    }
    return false;
  };

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white">
      <RefreshCw className="animate-spin mb-4 text-indigo-500" size={32} />
      <p className="font-medium animate-pulse">Syncing with OmniDesk Sheets...</p>
    </div>
  );

  if (!user) return <Login onLogin={handleLogin} />;

  // Find the logged-in agent's full data object
  const currentAgentData = agents.find(a => a.id === user.id);

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-[#0f172a] overflow-hidden transition-colors duration-300">
      <Sidebar 
        user={user} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={() => setUser(null)} 
        isDarkMode={isDarkMode} 
        toggleTheme={() => setIsDarkMode(!isDarkMode)} 
      />
      
      <main className="flex-1 overflow-y-auto lg:ml-64 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
        )}

        {user.role === UserRole.ADMIN ? (
          <>
            {activeTab === 'dashboard' && <AdminDashboard agents={agents} dateRange={dateRange} onDateChange={setDateRange} />}
            {activeTab === 'agents' && <AgentRoster agents={agents} />}
          </>
        ) : (
          /* AGENT VIEW: Safety check to ensure data exists */
          currentAgentData ? (
            <AgentDashboard agent={currentAgentData} dateRange={dateRange} onDateChange={setDateRange} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <p>Error loading your specific agent profile.</p>
              <button onClick={loadData} className="mt-4 text-indigo-400 underline">Reload Data</button>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default App;