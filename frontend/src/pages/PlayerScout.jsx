import React, { useEffect, useState } from 'react';
import { Search, Trophy, Medal, Award, Sparkles, Filter } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';

export const PlayerScout = ({ onSelectPlayer }) => {
  const [category, setCategory] = useState('batting');
  const [metric, setMetric] = useState('Runs');
  const [scoutData, setScoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const battingMetrics = [
    { label: 'Total Runs', key: 'Runs' },
    { label: 'Batting Average', key: 'Batting_Average' },
    { label: 'Strike Rate', key: 'Strike_Rate' },
    { label: 'Fours (4s)', key: 'Fours' },
    { label: 'Sixes (6s)', key: 'Sixes' },
  ];

  const bowlingMetrics = [
    { label: 'Wickets', key: 'Wickets' },
    { label: 'Economy Rate', key: 'Economy' },
    { label: 'Bowling Average', key: 'Bowling_Average' },
    { label: 'Strike Rate', key: 'Bowling_Strike_Rate' },
  ];

  useEffect(() => {
    // Reset metric when category changes
    if (category === 'batting') {
      setMetric('Runs');
    } else {
      setMetric('Wickets');
    }
  }, [category]);

  const loadScout = () => {
    setLoading(true);
    setError(null);
    api.scoutPlayers(category, metric)
      .then(res => {
        setScoutData(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch scouting rankings');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadScout();
  }, [category, metric]);

  const getRankBadge = (rank) => {
    if (rank === 1) return <span className="text-xl">🥇</span>;
    if (rank === 2) return <span className="text-xl">🥈</span>;
    if (rank === 3) return <span className="text-xl">🥉</span>;
    return <span className="font-mono text-xs text-slate-500 font-bold">#{rank}</span>;
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase mb-1">
          <Search className="w-4 h-4" /> Talent & Performance Scout
        </div>
        <h1 className="text-3xl font-black text-white">
          Player <span className="gradient-text-gold">Scout Leaderboards</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Dynamic category and metric based ranking engine for IPL 2024 scouting.
        </p>
      </div>

      {/* Scout Filters */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-5">
          {/* Category Toggle */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              onClick={() => setCategory('batting')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                category === 'batting'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Batting Leaderboard
            </button>
            <button
              onClick={() => setCategory('bowling')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
                category === 'bowling'
                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Bowling Leaderboard
            </button>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {(category === 'batting' ? battingMetrics : bowlingMetrics).map((m) => (
              <button
                key={m.key}
                onClick={() => setMetric(m.key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  metric === m.key
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scout Dynamic Insight Banner */}
        {scoutData && (
          <div className="p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-400 uppercase block">Scout Insight</span>
              <p className="text-xs text-slate-200 font-medium">{scoutData.insight}</p>
            </div>
          </div>
        )}
      </div>

      {/* Rankings List */}
      {loading ? (
        <LoadingSkeleton type="table" />
      ) : error ? (
        <ErrorAlert message={error} onRetry={loadScout} />
      ) : scoutData && (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex justify-between items-center text-xs font-semibold text-slate-300">
            <span>Ranked Players (1 to {scoutData.rankings.length})</span>
            <span className="text-amber-400 font-mono">Metric: {scoutData.metric.replace('_', ' ')}</span>
          </div>

          <div className="divide-y divide-slate-800/60">
            {scoutData.rankings.map((player, idx) => {
              const rank = idx + 1;
              const val = player[metric];

              return (
                <div
                  key={player.Player}
                  onClick={() => onSelectPlayer(player.Player)}
                  className={`p-4 flex items-center justify-between hover:bg-amber-500/10 cursor-pointer transition-colors ${
                    rank <= 3 ? 'bg-amber-950/10' : ''
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 text-center flex-shrink-0">
                      {getRankBadge(rank)}
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-white">{player.Player}</h4>
                      <span className="text-xs font-bold text-cyan-400 font-mono">{player.Team}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block uppercase">{metric.replace('_', ' ')}</span>
                    <span className="text-xl font-black text-amber-400 font-mono">
                      {val}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
