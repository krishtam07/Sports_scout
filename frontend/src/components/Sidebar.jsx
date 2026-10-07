import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Zap,
  Target,
  Calculator,
  BarChart2,
  TrendingUp,
  GitCompare,
  Search,
  Flame,
  Info,
  X
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose, onSelectPlayer }) => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Batting Analysis', path: '/batting', icon: Zap },
    { label: 'Bowling Analysis', path: '/bowling', icon: Target },
    { label: 'Statistical Analysis', path: '/statistics', icon: Calculator },
    { label: 'Visualizations', path: '/visualizations', icon: BarChart2 },
    { label: 'Linear Regression', path: '/regression', icon: TrendingUp },
    { label: 'Player Comparison', path: '/compare', icon: GitCompare },
    { label: 'Player Scout', path: '/scout', icon: Search },
    { label: 'All-Rounders', path: '/all-rounders', icon: Flame },
    { label: 'About Project', path: '/about', icon: Info },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-950/95 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xl shadow-lg shadow-cyan-500/20">
              🏏
            </div>
            <div>
              <h1 className="font-black text-lg text-white tracking-wider">
                SPORTS <span className="text-cyan-400">SCOUT</span>
              </h1>
              <p className="text-[10px] font-semibold tracking-wide text-slate-400">
                IPL 2024 Analytics
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-sm shadow-cyan-500/10 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`
                }
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer info badge */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              B.Tech Project Mode
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">
              Data-Driven Python/FastAPI & React Pipeline
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
