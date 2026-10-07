import React, { useEffect, useState } from 'react';
import { X, Trophy, Award, Activity, Flame, Shield, User } from 'lucide-react';
import { api } from '../services/api';

export const PlayerModal = ({ playerName, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!playerName) return;
    setLoading(true);
    setError(null);
    api.getPlayerProfile(playerName)
      .then(data => {
        setProfile(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load player profile');
        setLoading(false);
      });
  }, [playerName]);

  if (!playerName) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="glass-card w-full max-w-2xl rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden relative">
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-cyan-900/60 via-indigo-900/40 to-slate-900 p-6 border-b border-slate-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-900/60 hover:bg-slate-800 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {loading ? (
            <div className="animate-pulse space-y-2">
              <div className="h-8 bg-slate-700 rounded w-1/2"></div>
              <div className="h-4 bg-slate-800 rounded w-1/4"></div>
            </div>
          ) : profile ? (
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg text-white">
                <User className="w-8 h-8" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black text-white">{profile.name}</h2>
                  {profile.is_all_rounder && (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Flame className="w-3 h-3 text-emerald-400" /> All-Rounder
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-300 mt-1">
                  <span className="font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-cyan-400">
                    {profile.team}
                  </span>
                  <span>IPL 2024 Player Profile</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {loading && (
            <div className="text-center py-12 text-slate-400">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              Loading player statistics...
            </div>
          )}

          {error && (
            <div className="p-4 bg-rose-950/30 border border-rose-800 text-rose-300 rounded-xl text-center text-sm">
              {error}
            </div>
          )}

          {!loading && profile && (
            <>
              {/* Ranks summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                  <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-lg">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Batting Rank (Runs)</span>
                    <span className="text-lg font-bold text-slate-100">
                      {profile.batting_rank ? `#${profile.batting_rank}` : 'N/A'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Bowling Rank (Wickets)</span>
                    <span className="text-lg font-bold text-slate-100">
                      {profile.bowling_rank ? `#${profile.bowling_rank}` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Batting Stats Section */}
              {profile.batting ? (
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold border-b border-slate-800 pb-2">
                    <Activity className="w-4 h-4" /> Batting Performance
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      <span className="text-xs text-slate-400 block">Total Runs</span>
                      <span className="text-xl font-extrabold text-cyan-300">{profile.batting.Runs}</span>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      <span className="text-xs text-slate-400 block">Batting Avg</span>
                      <span className="text-xl font-extrabold text-slate-100">{profile.batting.Batting_Average}</span>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      <span className="text-xs text-slate-400 block">Strike Rate</span>
                      <span className="text-xl font-extrabold text-emerald-400">{profile.batting.Strike_Rate}</span>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      <span className="text-xs text-slate-400 block">Boundaries (4s/6s)</span>
                      <span className="text-xl font-extrabold text-amber-400">{profile.batting.Fours} / {profile.batting.Sixes}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 flex justify-between px-1">
                    <span>Matches: {profile.batting.Matches}</span>
                    <span>Innings: {profile.batting.Innings}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/30 rounded-xl border border-slate-800/60 p-4 text-center text-xs text-slate-500">
                  No batting statistics recorded in IPL 2024 dataset.
                </div>
              )}

              {/* Bowling Stats Section */}
              {profile.bowling ? (
                <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-5 space-y-4">
                  <div className="flex items-center gap-2 text-indigo-400 font-bold border-b border-slate-800 pb-2">
                    <Shield className="w-4 h-4" /> Bowling Performance
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      <span className="text-xs text-slate-400 block">Wickets</span>
                      <span className="text-xl font-extrabold text-indigo-300">{profile.bowling.Wickets}</span>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      <span className="text-xs text-slate-400 block">Economy</span>
                      <span className="text-xl font-extrabold text-emerald-400">{profile.bowling.Economy}</span>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      <span className="text-xs text-slate-400 block">Bowling Avg</span>
                      <span className="text-xl font-extrabold text-slate-100">{profile.bowling.Bowling_Average}</span>
                    </div>
                    <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                      <span className="text-xs text-slate-400 block">Strike Rate</span>
                      <span className="text-xl font-extrabold text-amber-400">{profile.bowling.Bowling_Strike_Rate}</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 flex justify-between px-1">
                    <span>Balls Bowled: {profile.bowling.Balls}</span>
                    <span>Innings: {profile.bowling.Innings}</span>
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/30 rounded-xl border border-slate-800/60 p-4 text-center text-xs text-slate-500">
                  No bowling statistics recorded in IPL 2024 dataset.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
