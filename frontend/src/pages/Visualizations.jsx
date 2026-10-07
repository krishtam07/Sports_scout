import React, { useEffect, useState } from 'react';
import { BarChart2, PieChart, Activity, Layers, Target, Zap } from 'lucide-react';
import { api } from '../services/api';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ScatterChart, Scatter, ZAxis, Cell
} from 'recharts';

export const Visualizations = ({ onSelectPlayer }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadVisualizations = () => {
    setLoading(true);
    setError(null);
    api.getVisualizations()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load visualization data');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadVisualizations();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="chart" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <LoadingSkeleton type="chart" />
          <LoadingSkeleton type="chart" />
        </div>
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} onRetry={loadVisualizations} />;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase mb-1">
          <BarChart2 className="w-4 h-4" /> Dynamic Interactive Charts
        </div>
        <h1 className="text-3xl font-black text-white">
          Visualizations & <span className="gradient-text-cyan">Distributions</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Histograms, boxplot quartile metrics, and multi-variable scatter plots derived from IPL 2024 CSV datasets.
        </p>
      </div>

      {/* 1. HISTOGRAMS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Runs Distribution Histogram */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Zap className="w-4 h-4 text-cyan-400" /> Runs Distribution Histogram
              </h3>
              <p className="text-xs text-slate-400">Frequency distribution of total runs scored</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.runs_histogram} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="bin" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val) => [`${val} players`, 'Player Count']}
                />
                <Bar dataKey="count" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wickets Distribution Histogram */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" /> Wickets Distribution Histogram
              </h3>
              <p className="text-xs text-slate-400">Frequency distribution of total wickets taken</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.wickets_histogram} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="bin" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val) => [`${val} players`, 'Player Count']}
                />
                <Bar dataKey="count" fill="#a855f7" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 2. RUNS BOXPLOT SUMMARY METRICS */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-400" /> Runs Box Plot Quartile Summary
            </h3>
            <p className="text-xs text-slate-400">Five-number summary breakdown (Min, Q1, Median, Q3, Max, IQR)</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Minimum</span>
            <span className="text-xl font-bold text-slate-200">{data.runs_box_plot.min}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">25th Percentile (Q1)</span>
            <span className="text-xl font-bold text-cyan-400">{data.runs_box_plot.q1}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-cyan-500/30 bg-cyan-950/20">
            <span className="text-[10px] text-cyan-300 block uppercase font-bold">Median (Q2)</span>
            <span className="text-2xl font-black text-cyan-300">{data.runs_box_plot.median}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">75th Percentile (Q3)</span>
            <span className="text-xl font-bold text-emerald-400">{data.runs_box_plot.q3}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Maximum</span>
            <span className="text-xl font-bold text-amber-400">{data.runs_box_plot.max}</span>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase">Interquartile Range (IQR)</span>
            <span className="text-xl font-bold text-indigo-400">{data.runs_box_plot.iqr}</span>
          </div>
        </div>
      </div>

      {/* 3. SCATTER PLOTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Runs vs Strike Rate Scatter Plot */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Runs vs Strike Rate Scatter
              </h3>
              <p className="text-xs text-slate-400">Click dot to inspect player details</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="Strike_Rate" name="Strike Rate" type="number" domain={['dataMin - 10', 'dataMax + 10']} stroke="#64748b" fontSize={10} />
                <YAxis dataKey="Runs" name="Runs" type="number" stroke="#64748b" fontSize={10} />
                <ZAxis dataKey="Player" name="Player" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const p = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-bold text-cyan-300">{p.Player} ({p.Team})</p>
                          <p className="text-slate-300">Runs: <strong className="text-white">{p.Runs}</strong></p>
                          <p className="text-slate-300">Strike Rate: <strong className="text-emerald-400">{p.Strike_Rate}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={data.runs_vs_sr} fill="#38bdf8">
                  {data.runs_vs_sr.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill="#38bdf8"
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => onSelectPlayer(entry.Player)}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Wickets vs Economy Scatter Plot */}
        <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-purple-400" /> Wickets vs Economy Scatter
              </h3>
              <p className="text-xs text-slate-400">Click dot to inspect player details</p>
            </div>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="Economy" name="Economy" type="number" domain={['dataMin - 0.5', 'dataMax + 0.5']} stroke="#64748b" fontSize={10} />
                <YAxis dataKey="Wickets" name="Wickets" type="number" stroke="#64748b" fontSize={10} />
                <ZAxis dataKey="Player" name="Player" />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  content={({ payload }) => {
                    if (payload && payload.length) {
                      const p = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-2.5 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-bold text-purple-300">{p.Player} ({p.Team})</p>
                          <p className="text-slate-300">Wickets: <strong className="text-white">{p.Wickets}</strong></p>
                          <p className="text-slate-300">Economy: <strong className="text-emerald-400">{p.Economy}</strong></p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Scatter data={data.wickets_vs_econ} fill="#a855f7">
                  {data.wickets_vs_econ.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill="#a855f7"
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => onSelectPlayer(entry.Player)}
                    />
                  ))}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
