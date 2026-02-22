import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { AdminDashboard } from './components/AdminDashboard';
import { AgentDashboard } from './components/AgentDashboard';
import { AgentRoster } from './components/AgentRoster';
import { Login } from './components/Login';
import { User, UserRole, Agent, AgentStatus } from './types';
import { ArrowLeft } from 'lucide-react';
import { fetchAllDashboardData } from './services/sheetService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [viewingAgentId, setViewingAgentId] = useState<string | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState('all');
  const [isSyncing, setIsSyncing] = useState(false);

  const loadData = async () => {
    setIsSyncing(true);
    const data = await fetchAllDashboardData();
    setAgents(data.agents);
    setAvailableDates(data.availableDates);
    setIsSyncing(false);
  };

  useEffect(() => { loadData(); }, []);

  const handleLogin = (email: string) => {
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail === 'callcenter@dialndine.com') {
      setUser({ id: 'admin', name: 'Admin', email: cleanEmail, role: UserRole.ADMIN, avatarUrl: '' });
      return true;
    }
    const found = agents.find(a => a.email.toLowerCase() === cleanEmail);
    if (found) {
      setUser({ ...found });
      setActiveTab('my-stats');
      return true;
    }
    return false;
  };

  if (!user) return <Login onLogin={handleLogin} />;

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden">
      <Sidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} onLogout={() => setUser(null)} />
      <main className="flex-1 overflow-y-auto lg:ml-64 p-8">
        {user.role === UserRole.ADMIN ? (
          <>
            {activeTab === 'dashboard' && <AdminDashboard agents={agents} selectedDate={selectedDate} onDateChange={setSelectedDate} availableDates={availableDates} />}
            {activeTab === 'agents' && !viewingAgentId && <AgentRoster agents={agents} onAgentSelect={setViewingAgentId} />}
            {activeTab === 'agents' && viewingAgentId && (
              <div>
                <button onClick={() => setViewingAgentId(null)} className="flex items-center mb-4 text-brand-600"><ArrowLeft size={16}/> Back</button>
                <AgentDashboard agent={agents.find(a => a.id === viewingAgentId)!} />
              </div>
            )}
          </>
        ) : (
          <AgentDashboard agent={agents.find(a => a.id === user.id)!} />
        )}
      </main>
    </div>
  );
};

export default App;