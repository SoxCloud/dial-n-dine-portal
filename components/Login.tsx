import React, { useState } from 'react';
import { LogIn, Mail, ShieldCheck, Loader2 } from 'lucide-react';

export const Login = ({ onLogin }: { onLogin: (email: string) => boolean | Promise<boolean> }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await onLogin(email);
    if (!success) {
      setError('Access denied. Please check your credentials.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 font-sans">
      <div className="max-w-md w-full">
        <div className="bg-[#1e293b] rounded-3xl shadow-2xl p-8 border border-slate-800 relative overflow-hidden">
          {/* Decorative Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full"></div>
          
          <div className="text-center mb-10 relative">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 mb-4 shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">OmniDesk Intel Portal</h1>
            <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest font-semibold">Authorized Access Only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-[#0f172a] border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  placeholder="name@dialndine.com"
                  required
                />
              </div>
            </div>

            {error && <div className="text-red-400 text-xs font-bold bg-red-400/10 p-3 rounded-lg border border-red-400/20">{error}</div>}

            <button
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" /> : <><LogIn size={20} /> Sign In</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};