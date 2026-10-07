import React from 'react';
import { Info, Award, BookOpen, Code2, Cpu, CheckCircle2 } from 'lucide-react';

export const AboutProject = () => {
  const methods = [
    'Arithmetic Mean (x̄)',
    'Sample Variance (s²)',
    'Standard Deviation (s)',
    'Median & Percentile Quantiles',
    'Pearson Correlation Coefficient (r)',
    'Spearman Rank Correlation (rₛ)',
    'Empirical Probability P(A)',
    'Scikit-Learn Linear Regression (y = mx + c)',
    'Dynamic Data Visualizations'
  ];

  const technologies = [
    { name: 'React.js 19', role: 'Interactive Component Frontend', category: 'Frontend' },
    { name: 'Tailwind CSS v4', role: 'Dark Sports Modern Styling', category: 'Frontend' },
    { name: 'Recharts', role: 'Dynamic SVG Responsive Charts', category: 'Frontend' },
    { name: 'FastAPI', role: 'Asynchronous Python Web Framework', category: 'Backend' },
    { name: 'Pandas & NumPy', role: 'Dynamic CSV Ingestion & Stats', category: 'Data Science' },
    { name: 'Scikit-Learn', role: 'Machine Learning Linear Regression', category: 'ML Engine' }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase mb-1">
          <Info className="w-4 h-4" /> B.Tech Academic Project Portfolio
        </div>
        <h1 className="text-3xl font-black text-white">
          About <span className="gradient-text-cyan">SPORTS SCOUT</span>
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Turning IPL Performance Data into Statistical Insights
        </p>
      </div>

      {/* Project Overview Card */}
      <div className="glass-card rounded-2xl p-6 border border-cyan-500/30 bg-gradient-to-r from-cyan-950/30 via-slate-900 to-slate-950 space-y-3">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest block">Project Objective</span>
        <p className="text-base text-slate-200 font-medium leading-relaxed">
          "To analyze IPL 2024 cricket player performance using mathematical and statistical techniques and provide an interactive player scouting system."
        </p>
      </div>

      {/* Statistical Methods Section */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5 text-amber-400" /> Statistical & Mathematical Methods Implemented
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {methods.map((method, idx) => (
            <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center gap-2.5 text-xs text-slate-200 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{method}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Cpu className="w-5 h-5 text-purple-400" /> System Architecture & Tech Stack
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technologies.map((tech, idx) => (
            <div key={idx} className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-purple-400 uppercase">{tech.category}</span>
              <h4 className="text-sm font-bold text-white">{tech.name}</h4>
              <p className="text-xs text-slate-400">{tech.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
