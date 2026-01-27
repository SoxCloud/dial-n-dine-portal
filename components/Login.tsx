import React, { useState } from 'react';
import { ShieldCheck, User, LogIn, AlertCircle, Mail } from 'lucide-react';

interface LoginProps {
  onLogin: (email: string) => boolean;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
        setError('Please enter an email address.');
        return;
    }
    
    setError('');
    setIsLoading(true);

    // Simulate network delay for better UX
    setTimeout(() => {
      const success = onLogin(email);
      if (!success) {
        setError('Access denied. Email not found in the active roster.');
        setIsLoading(false);
      }
      // On success, component unmounts
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-brand-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-brand-500/30 mb-4">
            O
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dial n Dine</h1>
          <p className="text-slate-500 mt-2">DnD Help-Desk Performance Management Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Work Email
            </label>
            <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@dialndine.com"
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all text-slate-900 dark:text-white"
                />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 rounded-lg flex items-start gap-3 animate-fade-in">
                <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold shadow-lg shadow-brand-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    <span>Sign In</span>
                    <LogIn size={18} />
                </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-start gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs text-slate-500 dark:text-slate-400">
                <ShieldCheck className="shrink-0 text-slate-400" size={16} />
                <div>
                    <p className="font-semibold mb-1 text-slate-700 dark:text-slate-300">Login Credentials:</p>
                    <div className="grid grid-cols-[60px_1fr] gap-1">
                        <span>Admin:</span> <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">enter admin email</code>
                        <span>Agent:</span> <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">sarah.j@dialndine.com</code>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};