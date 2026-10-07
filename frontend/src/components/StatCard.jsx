import React from 'react';

export const StatCard = ({ title, value, subtitle, icon: Icon, color = "cyan", onClick }) => {
  const colorStyles = {
    cyan: "from-cyan-500/20 to-blue-500/5 text-cyan-400 border-cyan-500/20",
    emerald: "from-emerald-500/20 to-teal-500/5 text-emerald-400 border-emerald-500/20",
    amber: "from-amber-500/20 to-orange-500/5 text-amber-400 border-amber-500/20",
    purple: "from-purple-500/20 to-indigo-500/5 text-purple-400 border-purple-500/20",
    rose: "from-rose-500/20 to-pink-500/5 text-rose-400 border-rose-500/20",
  };

  return (
    <div
      onClick={onClick}
      className={`glass-card glass-card-hover rounded-xl p-5 border bg-gradient-to-br ${colorStyles[color] || colorStyles.cyan} relative overflow-hidden group ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">{title}</span>
        {Icon && (
          <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800">
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="text-2xl lg:text-3xl font-extrabold text-slate-100 tracking-tight my-1">
        {value}
      </div>
      {subtitle && (
        <p className="text-xs text-slate-400 font-medium truncate mt-1">
          {subtitle}
        </p>
      )}
    </div>
  );
};
