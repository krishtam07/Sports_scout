import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export const FormulaCard = ({ title, formula, explanation, variables = [] }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass-card rounded-xl p-5 border border-slate-800 bg-slate-900/40">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
          <BookOpen className="w-4 h-4" />
          <span>{title}</span>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition-colors"
        >
          {expanded ? 'Hide Details' : 'How is this calculated?'}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      <div className="my-3 p-3 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-center text-cyan-300 text-lg tracking-wide overflow-x-auto">
        {formula}
      </div>

      {expanded && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-300 space-y-2 animate-fadeIn">
          <p className="leading-relaxed text-slate-300">{explanation}</p>
          {variables.length > 0 && (
            <div className="mt-2 bg-slate-900/80 p-2.5 rounded border border-slate-800/60">
              <span className="font-semibold text-slate-400 block mb-1">Variable Definitions:</span>
              <ul className="list-disc list-inside space-y-1 text-slate-400">
                {variables.map((item, idx) => (
                  <li key={idx}>
                    <strong className="text-cyan-400">{item.symbol}</strong>: {item.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
