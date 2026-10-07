import React, { useEffect, useState } from 'react';
import { Users, Flame, Trophy, Shield, Activity, BarChart, ArrowUpRight, Zap, Target } from 'lucide-react';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';

export const Dashboard = ({ onSelectPlayer }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = () => {
    setLoading(true);
    setError(null);
    api.getDashboard()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to connect to backend dataset.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="cards" count={4} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LoadingSkeleton type="table" />
          <LoadingSkeleton type="table" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} onRetry={loadData} />;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs tracking-wider uppercase mb-1">
            <span>🏏 Live IPL 2024 Dataset</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Performance <span className="gradient-text-cyan">Dashboard</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Turning IPL Performance Data into Statistical Insights
          </p>
        </div>
      </div>

      {/* Dynamic KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Batters"
          value={data.total_batters}
          subtitle="Recorded IPL 2024 Batting Profiles"
          icon={Users}
          color="cyan"
        />
        <StatCard
          title="Total Bowlers"
          value={data.total_bowlers}
          subtitle="Recorded IPL 2024 Bowling Profiles"
          icon={Shield}
          color="purple"
        />
        <StatCard
          title="Total League Runs"
          value={data.total_runs.toLocaleString()}
          subtitle="Cumulative runs in dataset"
          icon={Activity}
          color="emerald"
        />
        <StatCard
          title="Total League Wickets"
          value={data.total_wickets.toLocaleString()}
          subtitle="Cumulative wickets in dataset"
          icon={Flame}
          color="amber"
        />
      </div>

      {/* Top Scorer & Top Bowler Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Highest Run Scorer */}
        <div
          onClick={() => onSelectPlayer(data.top_run_scorer.Player)}
          className="glass-card glass-card-hover rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-br from-cyan-950/30 via-slate-900 to-slate-950 cursor-pointer relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-400" /> Orange Cap / Top Scorer
            </span>
            <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white group-hover:text-cyan-300 transition-colors">
              {data.top_run_scorer.Player}
            </h3>
            <p className="text-xs font-semibold text-cyan-400">{data.top_run_scorer.Team}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Runs</span>
              <span className="text-xl font-black text-cyan-300">{data.top_run_scorer.Runs}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Average</span>
              <span className="text-xl font-bold text-slate-200">{data.top_run_scorer.Batting_Average}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Strike Rate</span>
              <span className="text-xl font-bold text-emerald-400">{data.top_run_scorer.Strike_Rate}</span>
            </div>
          </div>
        </div>

        {/* Highest Wicket Taker */}
        <div
          onClick={() => onSelectPlayer(data.top_wicket_taker.Player)}
          className="glass-card glass-card-hover rounded-2xl p-6 border border-purple-500/30 bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-950 cursor-pointer relative overflow-hidden group"
        >
          <div className="flex justify-between items-start mb-4">
            <span className="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-purple-400" /> Purple Cap / Top Wicket Taker
            </span>
            <ArrowUpRight className="w-5 h-5 text-slate-500 group-hover:text-purple-400 transition-colors" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white group-hover:text-purple-300 transition-colors">
              {data.top_wicket_taker.Player}
            </h3>
            <p className="text-xs font-semibold text-purple-400">{data.top_wicket_taker.Team}</p>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800 text-center">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Wickets</span>
              <span className="text-xl font-black text-purple-300">{data.top_wicket_taker.Wickets}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Economy</span>
              <span className="text-xl font-bold text-emerald-400">{data.top_wicket_taker.Economy}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Average</span>
              <span className="text-xl font-bold text-slate-200">{data.top_wicket_taker.Bowling_Average}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Lists Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Batsmen */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4 text-cyan-400" /> Top 5 Batsmen (Runs)
            </h3>
            <span className="text-xs text-slate-500">Sorted by Runs</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800/60 pb-2">
                  <th className="py-2 px-2">Player</th>
                  <th className="py-2 px-2">Team</th>
                  <th className="py-2 px-2 text-right">Runs</th>
                  <th className="py-2 px-2 text-right">Avg</th>
                  <th className="py-2 px-2 text-right">SR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {data.top5_batsmen.map((player, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onSelectPlayer(player.Player)}
                    className="hover:bg-cyan-500/10 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-2 font-semibold text-slate-200 flex items-center gap-2">
                      <span className="w-4 text-slate-500 text-[11px]">#{idx + 1}</span>
                      {player.Player}
                    </td>
                    <td className="py-2.5 px-2 text-slate-400 font-mono text-[11px]">{player.Team}</td>
                    <td className="py-2.5 px-2 text-right font-black text-cyan-400">{player.Runs}</td>
                    <td className="py-2.5 px-2 text-right text-slate-300">{player.Batting_Average}</td>
                    <td className="py-2.5 px-2 text-right text-emerald-400 font-mono">{player.Strike_Rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top 5 Bowlers */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800">
          <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
            <h3 className="font-bold text-slate-100 flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-purple-400" /> Top 5 Bowlers (Wickets)
            </h3>
            <span className="text-xs text-slate-500">Sorted by Wickets</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800/60 pb-2">
                  <th className="py-2 px-2">Player</th>
                  <th className="py-2 px-2">Team</th>
                  <th className="py-2 px-2 text-right">Wkts</th>
                  <th className="py-2 px-2 text-right">Avg</th>
                  <th className="py-2 px-2 text-right">Econ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {data.top5_bowlers.map((player, idx) => (
                  <tr
                    key={idx}
                    onClick={() => onSelectPlayer(player.Player)}
                    className="hover:bg-purple-500/10 cursor-pointer transition-colors"
                  >
                    <td className="py-2.5 px-2 font-semibold text-slate-200 flex items-center gap-2">
                      <span className="w-4 text-slate-500 text-[11px]">#{idx + 1}</span>
                      {player.Player}
                    </td>
                    <td className="py-2.5 px-2 text-slate-400 font-mono text-[11px]">{player.Team}</td>
                    <td className="py-2.5 px-2 text-right font-black text-purple-400">{player.Wickets}</td>
                    <td className="py-2.5 px-2 text-right text-slate-300">{player.Bowling_Average}</td>
                    <td className="py-2.5 px-2 text-right text-emerald-400 font-mono">{player.Economy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Team Aggregated Runs & Wickets Overview Chart */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart className="w-5 h-5 text-cyan-400" /> Team Performance Overview (IPL 2024 Dataset)
            </h3>
            <p className="text-xs text-slate-400">Total Runs & Wickets produced by team members in dataset</p>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <ReBarChart data={data.team_summary} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="team" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="runs" name="Total Runs" fill="#38bdf8" radius={[4, 4, 0, 0]} />
              <Bar dataKey="wickets" name="Total Wickets (x20 scale)" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </ReBarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
