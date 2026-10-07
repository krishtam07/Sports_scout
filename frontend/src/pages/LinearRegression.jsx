import React, { useEffect, useState } from 'react';
import { TrendingUp, Award, Info, HelpCircle } from 'lucide-react';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';
import {
  ComposedChart, Scatter, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';

export const LinearRegression = ({ onSelectPlayer }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadRegression = () => {
    setLoading(true);
    setError(null);
    api.getRegression()
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to compute linear regression');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadRegression();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="cards" count={3} />
        <LoadingSkeleton type="chart" />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} onRetry={loadRegression} />;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase mb-1">
          <TrendingUp className="w-4 h-4" /> Machine Learning Engine (Scikit-Learn)
        </div>
        <h1 className="text-3xl font-black text-white">
          Linear <span className="gradient-text-cyan">Regression Analysis</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Predicting Total Runs based on Strike Rate using ordinary least squares regression.
        </p>
      </div>

      {/* Regression Parameters Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Slope (m)"
          value={data.slope}
          subtitle="Change in Runs per 1 unit Strike Rate"
          icon={TrendingUp}
          color="cyan"
        />
        <StatCard
          title="Y-Intercept (c)"
          value={data.intercept}
          subtitle="Baseline predicted runs at 0 SR"
          icon={Award}
          color="purple"
        />
        <StatCard
          title="Coefficient of Determination (R²)"
          value={data.r2_score}
          subtitle={`${data.r2_percentage}% variance explained`}
          icon={Info}
          color="emerald"
        />
      </div>

      {/* Fitted Regression Equation Banner */}
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-slate-950 text-center space-y-2">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">
          Fitted Linear Model Equation
        </span>
        <div className="text-2xl lg:text-3xl font-mono font-black text-white tracking-wide">
          {data.equation}
        </div>
      </div>

      {/* Interactive Chart with Scatter Points & Fitted Line */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">
              Strike Rate (X) vs Total Runs (Y) Regression Fit
            </h3>
            <p className="text-xs text-slate-400">Cyan dots = Actual Player Data Points | Red Line = Fitted OLS Model</p>
          </div>
        </div>

        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 10, right: 10, left: -10, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="strike_rate" name="Strike Rate" type="number" domain={['dataMin - 10', 'dataMax + 10']} stroke="#64748b" fontSize={10} />
              <YAxis dataKey="runs" name="Runs" type="number" stroke="#64748b" fontSize={10} />
              <Tooltip
                content={({ payload }) => {
                  if (payload && payload.length) {
                    const p = payload[0].payload;
                    if (p.player) {
                      return (
                        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
                          <p className="font-bold text-cyan-300">{p.player} ({p.team})</p>
                          <p className="text-slate-300">Strike Rate: <strong className="text-emerald-400">{p.strike_rate}</strong></p>
                          <p className="text-slate-300">Actual Runs: <strong className="text-white">{p.runs}</strong></p>
                          <p className="text-slate-300">Predicted Runs: <strong className="text-cyan-400">{p.predicted_runs}</strong></p>
                          <p className="text-slate-400 text-[10px]">Residual: {p.residual}</p>
                        </div>
                      );
                    }
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {/* Actual Data Scatter Points */}
              <Scatter name="Actual Batting Records" data={data.data_points} fill="#38bdf8" />
              {/* Fitted Regression Line */}
              <Line
                name="Fitted Linear Regression Line"
                data={data.line_points}
                dataKey="runs"
                xDataKey="strike_rate"
                stroke="#f43f5e"
                strokeWidth={3}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* R² Simple English Explanation Card */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <HelpCircle className="w-5 h-5" /> What does R² mean in simple English?
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">
          {data.interpretation}
        </p>
      </div>
    </div>
  );
};
