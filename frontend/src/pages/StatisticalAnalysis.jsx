import React, { useEffect, useState } from 'react';
import { Calculator, Sigma, TrendingUp, HelpCircle, Percent } from 'lucide-react';
import { api } from '../services/api';
import { StatCard } from '../components/StatCard';
import { FormulaCard } from '../components/FormulaCard';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { ErrorAlert } from '../components/ErrorAlert';

export const StatisticalAnalysis = () => {
  const [stats, setStats] = useState(null);
  const [correlation, setCorrelation] = useState(null);
  const [probability, setProbability] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAllStats = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      api.getStatistics(),
      api.getCorrelation(),
      api.getProbability()
    ])
      .then(([statsRes, corrRes, probRes]) => {
        setStats(statsRes);
        setCorrelation(corrRes);
        setProbability(probRes);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load statistical calculations.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAllStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="cards" count={4} />
        <LoadingSkeleton type="cards" count={4} />
      </div>
    );
  }

  if (error) {
    return <ErrorAlert message={error} onRetry={loadAllStats} />;
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase mb-1">
          <Calculator className="w-4 h-4" /> B.Tech Mathematical Engine
        </div>
        <h1 className="text-3xl font-black text-white">
          Statistical <span className="gradient-text-cyan">Analysis & Theory</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Descriptive metrics, Pearson & Spearman correlation coefficients, and probability distributions.
        </p>
      </div>

      {/* 1. BATTING STATISTICAL METRICS */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-l-4 border-cyan-400 pl-3">
          Batting Statistical Metrics (Runs & Strike Rate)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Mean Runs (x̄)"
            value={stats.batting.runs.mean}
            subtitle={`Median: ${stats.batting.runs.median}`}
            icon={Sigma}
            color="cyan"
          />
          <StatCard
            title="Variance of Runs (s²)"
            value={stats.batting.runs.variance}
            subtitle={`Std Dev: ${stats.batting.runs.std_dev}`}
            icon={Calculator}
            color="emerald"
          />
          <StatCard
            title="Mean Strike Rate (x̄)"
            value={stats.batting.strike_rate.mean}
            subtitle={`Median: ${stats.batting.strike_rate.median}`}
            icon={Sigma}
            color="amber"
          />
          <StatCard
            title="Variance Strike Rate (s²)"
            value={stats.batting.strike_rate.variance}
            subtitle={`Std Dev: ${stats.batting.strike_rate.std_dev}`}
            icon={Calculator}
            color="purple"
          />
        </div>
      </div>

      {/* 2. BOWLING STATISTICAL METRICS */}
      <div className="space-y-4 pt-4 border-t border-slate-800/80">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 border-l-4 border-purple-400 pl-3">
          Bowling Statistical Metrics (Wickets & Economy)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Mean Wickets (x̄)"
            value={stats.bowling.wickets.mean}
            subtitle={`Median: ${stats.bowling.wickets.median}`}
            icon={Sigma}
            color="purple"
          />
          <StatCard
            title="Variance Wickets (s²)"
            value={stats.bowling.wickets.variance}
            subtitle={`Std Dev: ${stats.bowling.wickets.std_dev}`}
            icon={Calculator}
            color="rose"
          />
          <StatCard
            title="Mean Economy (x̄)"
            value={stats.bowling.economy.mean}
            subtitle={`Median: ${stats.bowling.economy.median}`}
            icon={Sigma}
            color="cyan"
          />
          <StatCard
            title="Variance Economy (s²)"
            value={stats.bowling.economy.variance}
            subtitle={`Std Dev: ${stats.bowling.economy.std_dev}`}
            icon={Calculator}
            color="amber"
          />
        </div>
      </div>

      {/* 3. PEARSON & SPEARMAN CORRELATIONS */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-400" /> Bivariate Correlation Analysis
          </h2>
          <span className="text-xs text-slate-400 font-mono">Dynamically Evaluated</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Batting Correlation Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs text-cyan-400 font-bold uppercase tracking-wider">Batting Dataset</span>
              <h3 className="text-base font-bold text-white">Runs vs Strike Rate Correlation</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Pearson Correlation (r)</span>
                  <span className="text-sm text-cyan-300 font-mono">{correlation.batting.pearson.interpretation}</span>
                </div>
                <span className="text-xl font-black text-cyan-400 font-mono">
                  {correlation.batting.pearson.coefficient}
                </span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Spearman Rank Correlation (rₛ)</span>
                  <span className="text-sm text-emerald-300 font-mono">{correlation.batting.spearman.interpretation}</span>
                </div>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  {correlation.batting.spearman.coefficient}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic bg-slate-900/40 p-2.5 rounded border border-slate-800/60">
              Note: Correlation measures statistical association strength, not direct causation.
            </p>
          </div>

          {/* Bowling Correlation Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <span className="text-xs text-purple-400 font-bold uppercase tracking-wider">Bowling Dataset</span>
              <h3 className="text-base font-bold text-white">Wickets vs Economy Correlation</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Pearson Correlation (r)</span>
                  <span className="text-sm text-purple-300 font-mono">{correlation.bowling.pearson.interpretation}</span>
                </div>
                <span className="text-xl font-black text-purple-400 font-mono">
                  {correlation.bowling.pearson.coefficient}
                </span>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">Spearman Rank Correlation (rₛ)</span>
                  <span className="text-sm text-amber-300 font-mono">{correlation.bowling.spearman.interpretation}</span>
                </div>
                <span className="text-xl font-black text-amber-400 font-mono">
                  {correlation.bowling.spearman.coefficient}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 italic bg-slate-900/40 p-2.5 rounded border border-slate-800/60">
              Note: Correlation measures statistical association strength, not direct causation.
            </p>
          </div>
        </div>
      </div>

      {/* 4. PROBABILITY ANALYSIS */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Percent className="w-5 h-5 text-amber-400" /> Empirical Probability Analysis
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-cyan-400 uppercase">Batting Threshold P(Runs &gt; 400)</span>
            <div className="flex justify-between items-baseline">
              <h3 className="text-base font-bold text-white">Player scores &gt; 400 runs</h3>
              <span className="text-2xl font-black text-cyan-400">{probability.batting_runs_gt_400.percentage}%</span>
            </div>
            <p className="text-xs text-slate-400">
              {probability.batting_runs_gt_400.favorable_outcomes} out of {probability.batting_runs_gt_400.total_outcomes} batters reached this milestone.
            </p>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-blue-500 h-full rounded-full"
                style={{ width: `${probability.batting_runs_gt_400.percentage}%` }}
              ></div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-3">
            <span className="text-xs font-bold text-purple-400 uppercase">Bowling Threshold P(Wickets ≥ 15)</span>
            <div className="flex justify-between items-baseline">
              <h3 className="text-base font-bold text-white">Player takes ≥ 15 wickets</h3>
              <span className="text-2xl font-black text-purple-400">{probability.bowling_wickets_gte_15.percentage}%</span>
            </div>
            <p className="text-xs text-slate-400">
              {probability.bowling_wickets_gte_15.favorable_outcomes} out of {probability.bowling_wickets_gte_15.total_outcomes} bowlers reached this milestone.
            </p>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
                style={{ width: `${probability.bowling_wickets_gte_15.percentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* 5. MATHEMATICAL FORMULAS REFERENCE */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-400" /> Formulations & Mathematical Definitions
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <FormulaCard
            title="Sample Mean Formula"
            formula="x̄ = Σx / n"
            explanation="The arithmetic mean calculates the central value of a statistical distribution by taking the sum of all observed metric values divided by sample size n."
            variables={[
              { symbol: "Σx", description: "Sum of all player metric values" },
              { symbol: "n", description: "Total number of player records in sample" }
            ]}
          />

          <FormulaCard
            title="Sample Variance Formula"
            formula="s² = Σ(x − x̄)² / (n − 1)"
            explanation="Variance measures how far numbers in the dataset are spread out from their average mean value, adjusted with Bessel's correction (n - 1)."
            variables={[
              { symbol: "x̄", description: "Sample mean" },
              { symbol: "n - 1", description: "Degrees of freedom for unbiased sample estimator" }
            ]}
          />

          <FormulaCard
            title="Standard Deviation"
            formula="s = √s²"
            explanation="The square root of variance, expressing variability in the original measurement unit of the metric."
            variables={[
              { symbol: "s²", description: "Calculated sample variance" }
            ]}
          />

          <FormulaCard
            title="Pearson Correlation (r)"
            formula="r = Cov(X,Y) / (σₓ × σᵧ)"
            explanation="Quantifies the linear covariance between two continuous variables normalized by the product of their standard deviations."
            variables={[
              { symbol: "Cov(X,Y)", description: "Covariance between variables X and Y" },
              { symbol: "σₓ, σᵧ", description: "Standard deviations of X and Y" }
            ]}
          />

          <FormulaCard
            title="Spearman Rank Correlation (r⛥)"
            formula="rₛ = 1 − 6Σd² / (n(n² − 1))"
            explanation="Non-parametric rank correlation measuring monotonic relationships between ordinal or ranked variables."
            variables={[
              { symbol: "d", description: "Difference between ranks of corresponding variables" },
              { symbol: "n", description: "Number of paired observations" }
            ]}
          />

          <FormulaCard
            title="Classical Probability"
            formula="P(A) = Favorable / Total"
            explanation="Measures the relative frequency of favorable player performance outcomes over the total sample size."
            variables={[
              { symbol: "Favorable", description: "Count of players satisfying metric criteria" },
              { symbol: "Total", description: "Total player cohort size" }
            ]}
          />
        </div>
      </div>
    </div>
  );
};
