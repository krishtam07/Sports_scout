import React, { useEffect, useState } from 'react';
import { GitCompare, Flame, Trophy, Shield, Sparkles, Check } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';

export const PlayerComparison = () => {
  const [allPlayers, setAllPlayers] = useState([]);
  const [player1, setPlayer1] = useState('');
  const [player2, setPlayer2] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getPlayers().then(list => {
      setAllPlayers(list || []);
      if (list && list.length >= 2) {
        setPlayer1(list[0]);
        setPlayer2(list[1]);
      }
    }).catch(() => {});
  }, []);

  const handleCompare = () => {
    if (!player1 || !player2) return;
    setLoading(true);
    setError(null);
    api.comparePlayers(player1, player2)
      .then(res => {
        setComparison(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to compare players');
        setLoading(false);
      });
  };

  useEffect(() => {
    if (player1 && player2) {
      handleCompare();
    }
  }, [player1, player2]);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase mb-1">
          <GitCompare className="w-4 h-4" /> Head-To-Head Analytics
        </div>
        <h1 className="text-3xl font-black text-white">
          Player <span className="gradient-text-cyan">Comparison Engine</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Side-by-side metric comparison and automated comparative synthesis.
        </p>
      </div>

      {/* Selectors Panel */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Player 1 Dropdown */}
          <div>
            <label className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-2">
              Select Player 1
            </label>
            <select
              value={player1}
              onChange={(e) => setPlayer1(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none"
            >
              {allPlayers.map(p => (
                <option key={p} value={p} disabled={p === player2}>{p}</option>
              ))}
            </select>
          </div>

          {/* Player 2 Dropdown */}
          <div>
            <label className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-2">
              Select Player 2
            </label>
            <select
              value={player2}
              onChange={(e) => setPlayer2(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 focus:border-purple-500 rounded-xl px-4 py-3 text-sm font-bold text-white focus:outline-none"
            >
              {allPlayers.map(p => (
                <option key={p} value={p} disabled={p === player1}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {loading && <LoadingSkeleton type="cards" count={2} />}

      {/* Error state */}
      {error && <ErrorAlert message={error} onRetry={handleCompare} />}

      {/* Comparison Display */}
      {!loading && comparison && (
        <div className="space-y-6">
          {/* Dynamically Generated Summary Insight */}
          <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-purple-950/30 flex items-start gap-4">
            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-2xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider block mb-1">
                Automated Scout Comparison Insight
              </span>
              <p className="text-sm font-medium text-slate-200 leading-relaxed">
                "{comparison.summary}"
              </p>
            </div>
          </div>

          {/* Side-By-Side Player Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Player 1 Card */}
            <PlayerCard playerProfile={comparison.player1} accentColor="cyan" opponentProfile={comparison.player2} />

            {/* Player 2 Card */}
            <PlayerCard playerProfile={comparison.player2} accentColor="purple" opponentProfile={comparison.player1} />
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for individual side-by-side player card
const PlayerCard = ({ playerProfile, accentColor, opponentProfile }) => {
  const p = playerProfile;
  const opp = opponentProfile;

  if (!p) return null;

  const isBetter = (val1, val2, higherIsBetter = true) => {
    if (val1 === undefined || val2 === undefined || val1 === null || val2 === null) return false;
    return higherIsBetter ? val1 > val2 : val1 < val2;
  };

  return (
    <div className={`glass-card rounded-2xl p-6 border ${accentColor === 'cyan' ? 'border-cyan-500/30' : 'border-purple-500/30'} space-y-6`}>
      {/* Player Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black text-white">{p.name}</h2>
            <span className="text-xs font-bold text-cyan-400 font-mono">{p.team}</span>
          </div>
          {p.is_all_rounder && (
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Flame className="w-3 h-3 text-emerald-400" /> All-Rounder
            </span>
          )}
        </div>
      </div>

      {/* Batting Comparison Table */}
      {p.batting ? (
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Batting Metrics
          </span>

          <div className="space-y-2 text-xs">
            <MetricRow
              label="Total Runs"
              value={p.batting.Runs}
              oppValue={opp?.batting?.Runs}
              higherIsBetter={true}
              highlight={isBetter(p.batting.Runs, opp?.batting?.Runs, true)}
            />
            <MetricRow
              label="Batting Average"
              value={p.batting.Batting_Average}
              oppValue={opp?.batting?.Batting_Average}
              higherIsBetter={true}
              highlight={isBetter(p.batting.Batting_Average, opp?.batting?.Batting_Average, true)}
            />
            <MetricRow
              label="Strike Rate"
              value={p.batting.Strike_Rate}
              oppValue={opp?.batting?.Strike_Rate}
              higherIsBetter={true}
              highlight={isBetter(p.batting.Strike_Rate, opp?.batting?.Strike_Rate, true)}
            />
            <MetricRow
              label="Boundaries (4s / 6s)"
              value={`${p.batting.Fours} / ${p.batting.Sixes}`}
            />
          </div>
        </div>
      ) : (
        <div className="text-xs text-slate-500 p-3 bg-slate-900/40 rounded-xl text-center">
          No Batting Stats Recorded
        </div>
      )}

      {/* Bowling Comparison Table */}
      {p.bowling ? (
        <div className="space-y-3 pt-4 border-t border-slate-800">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
            Bowling Metrics
          </span>

          <div className="space-y-2 text-xs">
            <MetricRow
              label="Wickets"
              value={p.bowling.Wickets}
              oppValue={opp?.bowling?.Wickets}
              higherIsBetter={true}
              highlight={isBetter(p.bowling.Wickets, opp?.bowling?.Wickets, true)}
            />
            <MetricRow
              label="Economy Rate"
              value={p.bowling.Economy}
              oppValue={opp?.bowling?.Economy}
              higherIsBetter={false}
              highlight={isBetter(p.bowling.Economy, opp?.bowling?.Economy, false)}
            />
            <MetricRow
              label="Bowling Average"
              value={p.bowling.Bowling_Average}
              oppValue={opp?.bowling?.Bowling_Average}
              higherIsBetter={false}
              highlight={isBetter(p.bowling.Bowling_Average, opp?.bowling?.Bowling_Average, false)}
            />
          </div>
        </div>
      ) : (
        <div className="text-xs text-slate-500 p-3 bg-slate-900/40 rounded-xl text-center">
          No Bowling Stats Recorded
        </div>
      )}
    </div>
  );
};

const MetricRow = ({ label, value, highlight }) => (
  <div className={`flex justify-between items-center p-2.5 rounded-xl transition-colors ${highlight ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-slate-900/60 border border-slate-800'}`}>
    <span className="text-slate-400 font-medium">{label}</span>
    <span className={`font-bold font-mono ${highlight ? 'text-emerald-400 flex items-center gap-1 text-sm' : 'text-slate-200'}`}>
      {value}
      {highlight && <Check className="w-3.5 h-3.5 text-emerald-400" />}
    </span>
  </div>
);
