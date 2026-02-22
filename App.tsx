import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { AgentDashboard } from './components/AgentDashboard';
import { AgentRoster } from './components/AgentRoster';
import { Login } from './components/Login';
import { User, UserRole, Agent, AgentStatus } from './types';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { fetchAllDashboardData } from './services/sheetService';

const App: React.FC = () => {
  // --- Core State ---
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewingAgentId, setViewingAgentId] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]); // Initialized empty (No mock data)
  
  // --- Data & Sync State ---
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('all');
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, AgentStatus>>({});

  // --- Theme State ---
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('omniDesk_theme');
      return savedTheme ? savedTheme === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('omniDesk_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('omniDesk_theme', 'light');
    }
  }, [darkMode]);

  // --- Data Loading Logic ---
  const loadDashboardData = async () => {
    setIsSyncing(true);
    try {
      const result = await fetchAllDashboardData();
      
      if (result.agents.length > 0) {
        // Apply any status overrides (Online/Offline) stored in browser memory
        const storedOverrides = localStorage.getItem('omniDesk_statusOverrides');
        const currentOverrides = storedOverrides ? JSON.parse(storedOverrides) : statusOverrides;
        
        const mergedData = result.agents.map(agent => ({
          ...agent,
          status: currentOverrides[agent.id] || agent.status
        }));

        setAgents(mergedData);
        setAvailableDates(result.availableDates);
        setLastSynced(new Date());
      }
    } catch (error) {
      console.error("Dashboard failed to sync with Google Sheets:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    
    // Check for existing status overrides on startup
    const stored = localStorage.getItem('omniDesk_statusOverrides');
    if (stored) setStatusOverrides(JSON.parse(stored));
  }, []);

  // --- Event Handlers ---
  const handleStatusChange = (agentId: string, newStatus: AgentStatus) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, status: newStatus } : a));
    const newOverrides = { ...statusOverrides, [agentId]: newStatus };
    setStatusOverrides(newOverrides);
    localStorage.setItem('omniDesk_statusOverrides', JSON.stringify(newOverrides));
  };

  const handleLogin = (email: string): boolean => {
    const cleanEmail = email.toLowerCase().trim();
    
    // 1. Admin Access
    if (cleanEmail === 'callcenter@dialndine.com') {
      setUser({
        id: 'admin-main',
        name: 'Call Center Admin',
        email: cleanEmail,
        role: UserRole.ADMIN,
        avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=0e8de9&color=fff'
      });
      setActiveTab('dashboard');
      return true;
    }

    // 2. Agent Access (Matched against your Spreadsheet emails)
    const foundAgent = agents.find(a => a.email.toLowerCase() === cleanEmail);
    if (foundAgent) {
      handleStatusChange(foundAgent.id, AgentStatus.ONLINE);
      setUser({
        id: foundAgent.id,
        name: foundAgent.name,
        email: foundAgent.email,
        role: UserRole.AGENT,
        avatarUrl: foundAgent.avatarUrl
      });
      setActiveTab('my-stats');
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    if (user?.role === UserRole.AGENT) {
      handleStatusChange(user.id, AgentStatus.OFFLINE);
    }
    setUser(null);
    setViewingAgentId(null);
  };

  const handleAgentSelect = (agentId: string) => {
    setActiveTab('agents'); 
    setViewingAgentId(agentId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden text-slate-900 dark:text-slate-100">
      <Sidebar 
        user={user} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={(tab) => { setActiveTab(tab); setViewingAgentId(null); }}
        isDarkMode={darkMode}
        toggleTheme={() => setDarkMode(!darkMode)}
      />
      
      <main className="flex-1 overflow-y-auto lg:ml-64 custom-scrollbar">
        {/* Loading Overlay for Sync */}
        {isSyncing && agents.length === 0 && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="animate-spin text-brand-600" size={40} />
              <p className="font-medium animate-pulse">Syncing with Google Sheets...</p>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-8 lg:px-8 max-w-7xl">
          {/* ADMIN INTERFACE */}
          {user.role === UserRole.ADMIN && (
            <>
              {activeTab === 'dashboard' && (
                <AdminDashboard 
                  agents={agents} 
                  availableDates={availableDates}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  onRefresh={loadDashboardData}
                  isSyncing={isSyncing}
                  lastSynced={lastSynced}
                />
              )}
              
              {activeTab === 'agents' && !viewingAgentId && (
                <AgentRoster 
                  agents={agents} 
                  onAgentSelect={handleAgentSelect}
                  onStatusChange={handleStatusChange}
                />
              )}

              {activeTab === 'agents' && viewingAgentId && (
                <div className="animate-slide-up">
                  <button 
                    onClick={() => setViewingAgentId(null)}
                    className="flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-6 transition-colors font-medium text-sm"
                  >
                    <ArrowLeft size={16} /> Back to Roster
                  </button>
                  <AgentDashboard 
                    agent={agents.find(a => a.id === viewingAgentId)!} 
                    selectedDate={selectedDate}
                  />
                </div>
              )}

              {activeTab === 'analytics' && (
                <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl shadow-sm text-center border border-slate-200 dark:border-slate-800">
                  <h2 className="text-xl font-bold mb-2">Advanced Trends</h2>
                  <p className="text-slate-500">Deep dive historical data module connected to Spreadsheet.</p>
                </div>
              )}
            </>
          )}

          {/* AGENT INTERFACE */}
          {user.role === UserRole.AGENT && (
            <>
              {activeTab === 'my-stats' && (
                <AgentDashboard 
                  agent={agents.find(a => a.id === user.id)!} 
                  selectedDate={selectedDate}
                />
              )}
              {activeTab === 'resources' && (
                <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl shadow-sm text-center border border-slate-200 dark:border-slate-800">
                  <h2 className="text-xl font-bold mb-2">Agent Resources</h2>
                  <p className="text-slate-500">Access training guides and scripts here.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
