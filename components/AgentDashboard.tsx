import React from "react";
import { Agent } from "../types";
import {
  PhoneCall,
  CheckCircle,
  Clock,
  BookOpen,
  Target,
  LayoutGrid,
  Activity,
  Calendar,
  PlayCircle,
  MessageSquare,
  ChevronLeft,
  TrendingUp,
  Award,
  Zap,
} from "lucide-react";

interface Props {
  agent: Agent;
  dateRange: { start: string; end: string };
  onDateChange: (range: { start: string; end: string }) => void;
  viewMode: "stats" | "evaluations";
  onBack?: () => void;
  showToggle?: boolean;
  onToggleView?: (mode: "stats" | "evaluations") => void;
}

export const AgentDashboard: React.FC<Props> = ({
  agent,
  dateRange,
  onDateChange,
  viewMode,
  onBack,
  showToggle,
  onToggleView,
}) => {
  const kpis = agent.evaluations[0]?.kpis || {
    capture: 0,
    etiquette: 0,
    solving: 0,
    product: 0,
  };
  const currentScore = agent.evaluations[0]?.score || 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* --- PREMIUM HEADER --- */}
      <div className="relative overflow-hidden bg-[#1e293b]/40 border border-slate-800 p-8 rounded-[2rem] backdrop-blur-md shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[100px] -mr-32 -mt-32"></div>

        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            {onBack && (
              <button
                onClick={onBack}
                aria-label="Back"
                className="p-3 bg-slate-900/80 border border-slate-700 rounded-2xl text-indigo-400 hover:scale-105 transition-all"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-black text-white tracking-tight">
                  {onBack
                    ? `${agent.name}'s Profile`
                    : `Welcome, ${agent.name.split(" ")[0]}!`}
                </h1>
                <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  Analytics Mode
                </span>
              </div>
              <p className="text-slate-400 text-sm font-medium">
                Detailed QA breakdown and performance history
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* ADMIN TOGGLE: This allows Admin to switch between Stats and Calls */}
            {showToggle && onToggleView && (
              <div className="flex bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 backdrop-blur-xl">
                <button
                  onClick={() => onToggleView("stats")}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "stats" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                  Stats
                </button>
                <button
                  onClick={() => onToggleView("evaluations")}
                  className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${viewMode === "evaluations" ? "bg-indigo-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
                >
                  Calls
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-2.5 rounded-2xl shadow-inner">
              <Calendar size={16} className="text-indigo-400 ml-2" />
              <div className="flex items-center gap-2 text-xs text-white font-bold pr-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) =>
                    onDateChange({ ...dateRange, start: e.target.value })
                  }
                  className="bg-transparent border-none focus:ring-0 w-28 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {viewMode === "stats" ? (
        /* --- VIEW 1: PERFORMANCE OVERVIEW --- */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PremiumStatCard
                title="Calls Handled"
                value={agent.history[0]?.answeredCalls || 0}
                sub="vs 40 Target"
                icon={<PhoneCall />}
                color="text-blue-400"
              />
              <PremiumStatCard
                title="QA Average"
                value={`${currentScore}%`}
                sub="Above Team Avg"
                icon={<Zap />}
                color="text-emerald-400"
              />
              <PremiumStatCard
                title="Handle Time"
                value="92s"
                sub="Goal: 90s"
                icon={<Clock />}
                color="text-orange-400"
              />
            </div>

            <div className="bg-[#1e293b]/40 border border-slate-800 p-8 rounded-[2rem] relative overflow-hidden">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-600/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
                    <TrendingUp size={20} />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    Consolidated Competency
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <ThickKPI
                  label="Information Capture"
                  value={kpis.capture || 0}
                  color="bg-blue-500"
                />
                <ThickKPI
                  label="Phone Etiquette"
                  value={kpis.etiquette || 0}
                  color="bg-indigo-500"
                />
                <ThickKPI
                  label="Problem Solving"
                  value={kpis.solving || 0}
                  color="bg-purple-500"
                />
                <ThickKPI
                  label="Product Knowledge"
                  value={kpis.product || 0}
                  color="bg-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-900 border border-indigo-500/30 p-8 rounded-[2rem] shadow-2xl group">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                  <Award className="text-white" size={24} />
                </div>
                <h4 className="text-white font-bold text-lg">
                  AI Performance Coach
                </h4>
              </div>
              <div className="bg-slate-950/40 rounded-2xl p-5 border border-white/5 mb-6 text-sm italic text-indigo-100/90 leading-relaxed">
                "Agent demonstrated consistent empathy scores. Recommended
                coaching: focus on refining the closing pitch to increase
                conversion."
              </div>
              <button className="w-full py-3 bg-white text-indigo-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-50 transition-colors">
                Deep Dive Insights
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* --- VIEW 2: EVALUATED CALLS (DETAILED) --- */
        <div className="grid grid-cols-1 gap-6 animate-in slide-in-from-bottom-6 duration-500">
          {agent.evaluations.map((evalItem, idx) => (
            <div
              key={idx}
              className="bg-[#1e293b]/40 border border-slate-800 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl group hover:border-indigo-500/40 transition-all"
            >
              <div className="p-6 border-b border-slate-800 flex flex-col md:flex-row justify-between items-center bg-slate-900/40 gap-4">
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-indigo-600/20 rounded-2xl text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl">
                      Call Feedback #{1000 + idx}
                    </h3>
                    <div className="flex gap-4 mt-1 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Calendar size={12} className="text-indigo-500" />{" "}
                        {dateRange.start}
                      </span>
                      <span className="flex items-center gap-1.5 font-bold">
                        <Clock size={12} className="text-indigo-500" /> 04:32
                        MINS
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950 px-8 py-3 rounded-2xl border border-slate-800 text-center min-w-[160px]">
                  <p className="text-[9px] text-indigo-400 font-black uppercase mb-0.5 tracking-widest">
                    Score
                  </p>
                  <span
                    className={`text-3xl font-black ${evalItem.score >= 90 ? "text-emerald-400" : "text-orange-400"}`}
                  >
                    {evalItem.score}%
                  </span>
                </div>
              </div>

              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                    KPI Scorecard
                  </h4>
                  <ThickKPI
                    label="Phone Etiquette"
                    value={evalItem.kpis.etiquette}
                    color="bg-blue-500"
                  />
                  <ThickKPI
                    label="Problem Solving"
                    value={evalItem.kpis.solving}
                    color="bg-indigo-500"
                  />
                  <ThickKPI
                    label="Product Knowledge"
                    value={evalItem.kpis.product}
                    color="bg-purple-500"
                  />
                  <ThickKPI
                    label="Information Capture"
                    value={evalItem.kpis.capture}
                    color="bg-emerald-500"
                  />
                </div>

                <div className="flex flex-col h-full">
                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">
                    Evaluator Comments
                  </h4>
                  <div className="flex-1 bg-slate-900/60 rounded-3xl p-6 border border-slate-800 relative">
                    <p className="text-slate-300 text-sm leading-relaxed italic relative z-10">
                      "
                      {evalItem.comments ||
                        "Agent demonstrated excellent control over the call flow. Focus area: Ensure script compliance during the mandatory privacy disclosure."}
                      "
                    </p>
                    <div className="mt-8 pt-6 border-t border-slate-800/50 flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>Status: Finalized</span>
                      <span className="text-indigo-400">OmniDesk QA Team</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* --- SHARED STYLED COMPONENTS --- */

const PremiumStatCard = ({ title, value, sub, icon, color }: any) => (
  <div className="bg-[#1e293b]/40 border border-slate-800 p-6 rounded-[2rem] group hover:bg-slate-800/40 transition-all shadow-lg">
    <div
      className={`p-3 bg-slate-900/80 w-fit rounded-2xl border border-slate-800 mb-6 ${color} group-hover:scale-110 transition-transform shadow-inner`}
    >
      {React.cloneElement(icon, { size: 22 })}
    </div>
    <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">
      {title}
    </p>
    <div className="flex items-baseline gap-2">
      <span className="text-3xl font-black text-white leading-none">
        {value}
      </span>
      <span className="text-[9px] font-bold text-slate-500 tracking-tighter">
        {sub}
      </span>
    </div>
  </div>
);

const ThickKPI = ({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center px-1">
      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tight">
        {label}
      </span>
      <span className="text-xs font-black text-white bg-slate-900 px-2 py-0.5 rounded-lg border border-slate-800">
        {value}%
      </span>
    </div>
    <div className="h-4 bg-slate-950 rounded-full border border-slate-800/80 overflow-hidden p-[3px] shadow-inner">
      <div
        className={`h-full rounded-full transition-all duration-1000 ${color} shadow-[0_0_15px_rgba(99,102,241,0.2)]`}
        style={{ width: `${value}%` }}
      ></div>
    </div>
  </div>
);
