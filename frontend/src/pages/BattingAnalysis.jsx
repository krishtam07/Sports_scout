import React, { useEffect, useState } from 'react';
import { Search, Filter, ArrowUpDown, Zap, RotateCcw, AlertCircle } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';

export const BattingAnalysis = ({ onSelectPlayer }) => {
  const [data, setData] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Sort states
  const [search, setSearch] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('ALL');
  const [minRuns, setMinRuns] = useState(0);
  const [minSr, setMinSr] = useState(0);
  const [sortBy, setSortBy] = useState('Runs');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    api.getTeams().then(res => setTeams(res || [])).catch(() => {});
  }, []);

  const fetchBattingData = () => {
    setLoading(true);
    setError(null);
    api.getBatting({
      team: selectedTeam,
      search: search.trim(),
      min_runs: minRuns,
      min_sr: minSr,
      sort_by: sortBy,
      order: order
    })
      .then(res => {
        setData(res || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load batting analysis data');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBattingData();
  }, [selectedTeam, search, minRuns, minSr, sortBy, order]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedTeam('ALL');
    setMinRuns(0);
    setMinSr(0);
    setSortBy('Runs');
    setOrder('desc');
  };

  const handleSortToggle = (column) => {
    if (sortBy === column) {
      setOrder(order === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(column);
      setOrder('desc');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase mb-1">
          <Zap className="w-4 h-4" /> Batting Intelligence
        </div>
        <h1 className="text-3xl font-black text-white">
          Batting <span className="gradient-text-cyan">Performance Analysis</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Dynamic metrics, filtering, and statistical ranking of IPL 2024 batters.
        </p>
      </div>

      {/* Control Panel / Filters */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Player Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search player name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
            />
          </div>

          {/* Team Filter Dropdown */}
          <div className="w-full lg:w-48">
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">All IPL Teams</option>
              {teams.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="w-full lg:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500/50 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="Runs">Sort by Runs</option>
              <option value="Batting_Average">Sort by Average</option>
              <option value="Strike_Rate">Sort by Strike Rate</option>
              <option value="Fours">Sort by 4s</option>
              <option value="Sixes">Sort by 6s</option>
            </select>
          </div>

          {/* Reset Filters Button */}
          <button
            onClick={handleResetFilters}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        </div>

        {/* Sliders for Min Runs & Min SR */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-800/60">
          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Minimum Runs</span>
              <span className="font-mono text-cyan-400 font-bold">{minRuns} runs</span>
            </div>
            <input
              type="range"
              min="0"
              max="700"
              step="25"
              value={minRuns}
              onChange={(e) => setMinRuns(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Minimum Strike Rate</span>
              <span className="font-mono text-emerald-400 font-bold">{minSr} SR</span>
            </div>
            <input
              type="range"
              min="0"
              max="220"
              step="10"
              value={minSr}
              onChange={(e) => setMinSr(Number(e.target.value))}
              className="w-full accent-emerald-400 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex justify-between items-center text-xs text-slate-400 px-1">
        <span>Showing <strong className="text-white">{data.length}</strong> matching batters</span>
        <span>Sorted by <strong className="text-cyan-400">{sortBy}</strong> ({order.toUpperCase()})</span>
      </div>

      {/* Main Table */}
      {loading ? (
        <LoadingSkeleton type="table" />
      ) : error ? (
        <ErrorAlert message={error} onRetry={fetchBattingData} />
      ) : data.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800 space-y-3">
          <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-200">No Players Found</h3>
          <p className="text-xs text-slate-400">No batters match the selected filter criteria.</p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-xl text-xs font-semibold hover:bg-cyan-500/30 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/90 text-slate-300 border-b border-slate-800 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">#</th>
                  <th className="py-3.5 px-4 cursor-pointer hover:text-cyan-400" onClick={() => handleSortToggle('Player')}>
                    Player
                  </th>
                  <th className="py-3.5 px-4">Team</th>
                  <th className="py-3.5 px-4 text-center">Matches</th>
                  <th className="py-3.5 px-4 text-center">Innings</th>
                  <th className="py-3.5 px-4 text-right cursor-pointer hover:text-cyan-400" onClick={() => handleSortToggle('Runs')}>
                    <div className="flex items-center justify-end gap-1">
                      Runs {sortBy === 'Runs' && <ArrowUpDown className="w-3 h-3 text-cyan-400" />}
                    </div>
                  </th>
                  <th className="py-3.5 px-4 text-right cursor-pointer hover:text-cyan-400" onClick={() => handleSortToggle('Batting_Average')}>
                    <div className="flex items-center justify-end gap-1">
                      Avg {sortBy === 'Batting_Average' && <ArrowUpDown className="w-3 h-3 text-cyan-400" />}
                    </div>
                  </th>
                  <th className="py-3.5 px-4 text-right cursor-pointer hover:text-cyan-400" onClick={() => handleSortToggle('Strike_Rate')}>
                    <div className="flex items-center justify-end gap-1">
                      SR {sortBy === 'Strike_Rate' && <ArrowUpDown className="w-3 h-3 text-cyan-400" />}
                    </div>
                  </th>
                  <th className="py-3.5 px-4 text-right">4s</th>
                  <th className="py-3.5 px-4 text-right">6s</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {data.map((player, idx) => (
                  <tr
                    key={player.Player}
                    onClick={() => onSelectPlayer(player.Player)}
                    className="hover:bg-cyan-500/10 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {player.Player}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">{player.Team}</td>
                    <td className="py-3 px-4 text-center text-slate-300">{player.Matches}</td>
                    <td className="py-3 px-4 text-center text-slate-300">{player.Innings}</td>
                    <td className="py-3 px-4 text-right font-black text-cyan-400 text-sm">{player.Runs}</td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-200">{player.Batting_Average}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-400 font-mono">{player.Strike_Rate}</td>
                    <td className="py-3 px-4 text-right text-slate-400 font-mono">{player.Fours}</td>
                    <td className="py-3 px-4 text-right text-amber-400 font-bold font-mono">{player.Sixes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
