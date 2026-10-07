import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export const ErrorAlert = ({ title = "Connection Error", message = "Unable to connect to Sports Scout backend.", onRetry }) => {
  return (
    <div className="glass-card border border-rose-500/30 rounded-xl p-6 text-center max-w-xl mx-auto my-8 bg-rose-950/20 shadow-xl">
      <div className="inline-flex p-3 bg-rose-500/10 rounded-full text-rose-400 mb-3">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h3 className="text-xl font-bold text-slate-100 mb-2">{title}</h3>
      <p className="text-slate-400 text-sm mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white font-medium px-4 py-2 rounded-lg transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" /> Try Reconnecting
        </button>
      )}
    </div>
  );
};
