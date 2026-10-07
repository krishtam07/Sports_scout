import React from 'react';

export const LoadingSkeleton = ({ type = 'cards', count = 4 }) => {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {Array.from({ length: count }).map((_, idx) => (
          <div key={idx} className="h-32 bg-slate-800/60 rounded-xl border border-slate-700/50 p-4 flex flex-col justify-between">
            <div className="h-4 bg-slate-700 rounded w-1/2"></div>
            <div className="h-8 bg-slate-700 rounded w-3/4"></div>
            <div className="h-3 bg-slate-700 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 animate-pulse space-y-3">
        <div className="h-10 bg-slate-800/80 rounded w-full"></div>
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="h-8 bg-slate-800/40 rounded w-full"></div>
        ))}
      </div>
    );
  }

  if (type === 'chart') {
    return (
      <div className="h-80 bg-slate-900/60 border border-slate-800 rounded-xl p-6 animate-pulse flex flex-col justify-between">
        <div className="h-6 bg-slate-800 rounded w-1/3"></div>
        <div className="h-56 bg-slate-800/40 rounded w-full"></div>
      </div>
    );
  }

  return null;
};
