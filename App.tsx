import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { AgentDashboard } from './components/AgentDashboard';
import { AgentRoster } from './components/AgentRoster';
import { Login } from './components/Login';
import { SheetConfig } from './components/SheetConfig';
import { User, UserRole, Agent, AgentStatus } from './types';
import { MOCK_AGENTS, GOOGLE_SHEET_ID } from './constants';
import { ArrowLeft } from 'lucide-react';
import { fetchSheetData } from './services/sheetService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewingAgentId, setViewingAgentId] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>(MOCK_AGENTS);
  
  // Tracks if we successfully loaded from a sheet. 
  // If false, we are using the Manual Roster from constants.ts (which is fine!)
  const [isSheetConnected, setIsSheetConnected] = useState(false);
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, AgentStatus>>({});

  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('omniDesk_theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply Theme
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('omniDesk_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('omniDesk_theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(prev => !prev);

  // Load status overrides from local storage on mount
  useEffect(() => {
    const storedOverrides = localStorage.getItem('omniDesk_statusOverrides');
    if (storedOverrides) {
      try {
        setStatusOverrides(JSON.parse(storedOverrides));
      } catch (e) {
        console.error("Failed to parse status overrides", e);
      }
    }
  }, []);

  // Apply overrides whenever agents or statusOverrides change
  useEffect(() => {
    if (Object.keys(statusOverrides).length > 0) {
      setAgents(prevAgents => 
        prevAgents.map(agent => 
          statusOverrides[agent.id] ? { ...agent, status: statusOverrides[agent.id] } : agent
        )
      );
    }
  }, [statusOverrides]); 

  // Function to load data from sheet
  const loadSheetData = async (manualId?: string) => {
    // Priority: 1. Manual Argument, 2. Hardcoded Constant, 3. LocalStorage
    const sheetId = manualId || GOOGLE_SHEET_ID || localStorage.getItem('omniDesk_sheetId');
    
    if (sheetId) {
      setIsSyncing(true);
      try {
        const sheetData = await fetchSheetData(sheetId);
        if (sheetData.length > 0) {
          // Apply stored overrides to the fresh sheet data
          const storedOverridesStr = localStorage.getItem('omniDesk_statusOverrides');
          const currentOverrides = storedOverridesStr ? JSON.parse(storedOverridesStr) : statusOverrides;
          
          const mergedData = sheetData.map(agent => ({
            ...agent,
            status: currentOverrides[agent.id] || agent.status
          }));

          setAgents(mergedData);
          setIsSheetConnected(true);
          setLastSynced(new Date());
          return true;
        }
      } catch (e) {
        console.error("Failed to load sheet data, falling back to constants/mock", e);
        setIsSheetConnected(false);
        return false;
      } finally {
        setIsSyncing(false);
      }
    } else {
        // No Sheet ID found, use Manual Roster from constants.ts
        const storedOverridesStr = localStorage.getItem('omniDesk_statusOverrides');
        const currentOverrides = storedOverridesStr ? JSON.parse(storedOverridesStr) : statusOverrides;
        
        // Ensure we are using the MOCK_AGENTS (Manual Roster) as the source
        setAgents(MOCK_AGENTS.map(a => ({
            ...a,
            status: currentOverrides[a.id] || a.status
        })));
        
        setIsSheetConnected(false);
        return false;
      }
  };

  useEffect(() => {
    loadSheetData();

    // Listen for config updates
    const handleConfigUpdate = () => loadSheetData();
    window.addEventListener('sheetConfigUpdated', handleConfigUpdate);
    return () => window.removeEventListener('sheetConfigUpdated', handleConfigUpdate);
  }, []);

  const handleStatusChange = (agentId: string, newStatus: AgentStatus) => {
    // 1. Update State
    setAgents(prevAgents => prevAgents.map(a => 
        a.id === agentId ? { ...a, status: newStatus } : a
    ));

    // 2. Persist to State & LocalStorage
    const newOverrides = { ...statusOverrides, [agentId]: newStatus };
    setStatusOverrides(newOverrides);
    localStorage.setItem('omniDesk_statusOverrides', JSON.stringify(newOverrides));
  };

  const handleLogin = (email: string): boolean => {
    const normalizedEmail = email.toLowerCase().trim();
    
    // 1. Check Admin Credentials (Hardcoded backup)
    if (normalizedEmail === 'callcenter@dialndine.com') {
      setUser({
        id: 'admin-main',
        name: 'Call Center Admin',
        email: 'callcenter@dialndine.com',
        role: UserRole.ADMIN,
        avatarUrl: 'https://ui-avatars.com/api/?name=Admin&background=0e8de9&color=fff'
      });
      setActiveTab('dashboard');
      return true;
    }

    // 2. Check Agent Roster (Sheet or Manual List)
    const foundAgent = agents.find(a => a.email.toLowerCase() === normalizedEmail);
    
    if (foundAgent) {
      // Auto-set status to ONLINE on login
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

    // 3. Login Failed
    return false;
  };

  const handleLogout = () => {
    // Auto-set status to OFFLINE on logout if it's an agent
    if (user && user.role === UserRole.AGENT) {
        handleStatusChange(user.id, AgentStatus.OFFLINE);
    }
    setUser(null);
    setViewingAgentId(null);
  };

  const handleAgentSelect = (agentId: string) => {
    setActiveTab('agents'); // Switch tab to ensure AgentDashboard is rendered
    setViewingAgentId(agentId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToRoster = () => {
    setViewingAgentId(null);
  };

  // Reset drill-down when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setViewingAgentId(null);
  };

  if (!user) {
    return (
      <Login 
        onLogin={handleLogin} 
        // We are considered "Configured" if we have agents loaded (either from sheet OR manual roster)
        // This prevents the "Setup Required" warning when using manual mode.
        isConfigured={agents.length > 0}
        usingSheet={isSheetConnected}
      />
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Sidebar 
        user={user} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={handleTabChange}
        isDarkMode={darkMode}
        toggleTheme={toggleTheme}
      />
      
      <main className="flex-1 overflow-y-auto lg:ml-64 custom-scrollbar">
        <div className="container mx-auto px-4 py-8 lg:px-8 max-w-7xl">
          {user.role === UserRole.ADMIN && (
            <>
              {activeTab === 'dashboard' && (
                <AdminDashboard 
                    agents={agents} 
                    onRefresh={() => loadSheetData()}
                    lastSynced={lastSynced}
                    isSyncing={isSyncing}
                    onAgentSelect={handleAgentSelect}
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
                        onClick={handleBackToRoster}
                        className="flex items-center gap-2 text-slate-500 hover:text-brand-600 mb-6 transition-colors font-medium text-sm"
                    >
                        <ArrowLeft size={16} />
                        Back to Roster
                    </button>
                    <AgentDashboard 
                        agent={agents.find(a => a.id === viewingAgentId) || agents[0]} 
                        onStatusChange={handleStatusChange}
                    />
                </div>
              )}

              {activeTab === 'settings' && <SheetConfig />}
              {activeTab === 'analytics' && (
                <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm text-center">
                    <h2 className="text-xl font-bold mb-2">Advanced Analytics</h2>
                    <p className="text-slate-500">Historical data trends module.</p>
                </div>
              )}
            </>
          )}

          {user.role === UserRole.AGENT && (
            <>
              {activeTab === 'my-stats' && (
                <AgentDashboard 
                  agent={agents.find(a => a.id === user.id) || agents[0]} 
                  onStatusChange={handleStatusChange}
                />
              )}
              {activeTab === 'resources' && (
                 <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm text-center">
                    <h2 className="text-xl font-bold mb-2">Knowledge Base</h2>
                    <p className="text-slate-500">Access training materials and scripts here.</p>
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