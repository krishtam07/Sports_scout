import React, { useEffect, useState } from 'react';
import { Flame, Zap, Target, Award, User } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';

export const AllRounders = ({ onSelectPlayer }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllRounders = () => {
    setLoading(true);
    setError(null);
    api.getAllRounders()
      .then(res => {
        setData(res || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to detect all-rounders');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAllRounders();
  }, []);

  if (loading) {
    return <LoadingSkeleton type="table" />;
  }

  if (error) {
    return <ErrorAlert message={error} onRetry={loadAllRounders} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase mb-1">
          <Flame className="w-4 h-4" /> Dual Skill Recognition Engine
        </div>
        <h1 className="text-3xl font-black text-white">
          IPL 2024 <span className="gradient-text-emerald">All-Rounder Analysis</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Dynamically evaluated by merging batting and bowling datasets on matching player records.
        </p>
      </div>

      {/* Summary info card */}
      <div className="glass-card rounded-2xl p-5 border border-emerald-500/30 bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-950 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {data.length} Dual-Skill All-Rounders Detected
            </h3>
            <p className="text-xs text-slate-400">
              Players featuring active contributions in both Batting and Bowling datasets.
            </p>
          </div>
        </div>
      </div>

      {/* All-Rounders Main Table */}
      <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-300 border-b border-slate-800 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3.5 px-4">Player</th>
                <th className="py-3.5 px-4">Team</th>
                <th className="py-3.5 px-4 text-right bg-cyan-950/30 text-cyan-300">Runs</th>
                <th className="py-3.5 px-4 text-right bg-cyan-950/30 text-cyan-300">Bat Avg</th>
                <th className="py-3.5 px-4 text-right bg-cyan-950/30 text-cyan-300">Bat SR</th>
                <th className="py-3.5 px-4 text-right bg-purple-950/30 text-purple-300">Wkts</th>
                <th className="py-3.5 px-4 text-right bg-purple-950/30 text-purple-300">Bowl Avg</th>
                <th className="py-3.5 px-4 text-right bg-purple-950/30 text-purple-300">Economy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {data.map((player) => (
                <tr
                  key={player.Player}
                  onClick={() => onSelectPlayer(player.Player)}
                  className="hover:bg-emerald-500/10 cursor-pointer transition-colors group"
                >
                  <td className="py-3 px-4 font-bold text-slate-100 group-hover:text-emerald-300 flex items-center gap-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    {player.Player}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">{player.Team}</td>
                  <td className="py-3 px-4 text-right font-black text-cyan-400 bg-cyan-950/10">{player.Runs}</td>
                  <td className="py-3 px-4 text-right text-slate-300 bg-cyan-950/10">{player.Batting_Average}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-400 bg-cyan-950/10">{player.Strike_Rate}</td>
                  <td className="py-3 px-4 text-right font-black text-purple-400 bg-purple-950/10">{player.Wickets}</td>
                  <td className="py-3 px-4 text-right text-slate-300 bg-purple-950/10">{player.Bowling_Average}</td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-400 bg-purple-950/10">{player.Economy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
