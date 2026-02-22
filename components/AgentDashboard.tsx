import React from 'react';
import { Agent } from '../types';
import { Star, MessageSquare, TrendingUp, AlertCircle } from 'lucide-react';

interface Props {
  agent: Agent;
}

export const AgentDashboard: React.FC<Props> = ({ agent }) => {
  const latestEval = agent.evaluations[agent.evaluations.length - 1];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-brand-600 to-brand-800 rounded-3xl p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Welcome back, {agent.name}!</h1>
        <p className="opacity-90 mt-2">Here is your performance summary from the latest evaluations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Score */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-amber-500">
            <Star size={20} fill="currentColor" />
            <h3 className="font-bold text-slate-900 dark:text-white">Latest QA Score</h3>
          </div>
          <div className="text-5xl font-black text-brand-600">{latestEval?.score || 0}%</div>
          <p className="text-sm text-slate-500 mt-2 font-medium">Evaluated by: {latestEval?.evaluator || 'N/A'}</p>
        </div>

        {/* Positive Points */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 mb-4 text-green-500">
            <TrendingUp size={20} />
            <h3 className="font-bold text-slate-900 dark:text-white">What You're Doing Well</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 italic">"{latestEval?.positivePoints || 'No feedback yet.'}"</p>
        </div>

        {/* Improvement Areas */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
          <div className="flex items-center gap-2 mb-4 text-red-500">
            <AlertCircle size={20} />
            <h3 className="font-bold text-slate-900 dark:text-white">Focus Areas for Growth</h3>
          </div>
          <p className="text-slate-600 dark:text-slate-400 font-medium">{latestEval?.improvementAreas || 'Keep up the good work!'}</p>
        </div>
      </div>
    </div>
  );
};