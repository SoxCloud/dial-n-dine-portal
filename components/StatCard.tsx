import React from 'react';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ElementType;
  colorClass?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  trend, 
  trendValue, 
  icon: Icon,
  colorClass = "text-brand-500" 
}) => {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden group hover:shadow-md transition-shadow">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
        <Icon size={64} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-2 rounded-lg bg-slate-50 dark:bg-slate-700 ${colorClass}`}>
            <Icon size={20} />
          </div>
          <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</h3>
        </div>
        
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{value}</span>
          
          {trend && (
            <div className={`flex items-center text-xs font-semibold mb-1 px-1.5 py-0.5 rounded-full ${
              trend === 'up' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30' : 
              trend === 'down' ? 'text-red-600 bg-red-50 dark:bg-red-900/30' : 
              'text-slate-500 bg-slate-100 dark:bg-slate-700'
            }`}>
              {trend === 'up' && <ArrowUp size={12} className="mr-0.5" />}
              {trend === 'down' && <ArrowDown size={12} className="mr-0.5" />}
              {trend === 'neutral' && <Minus size={12} className="mr-0.5" />}
              {trendValue}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};