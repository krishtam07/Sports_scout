import React, { useState, useEffect, useRef } from 'react';
import { Menu, Search, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export const Navbar = ({ onToggleSidebar, onSelectPlayer }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [status, setStatus] = useState('checking'); // 'checking' | 'ok' | 'error'
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Load player list for quick search
    api.getPlayers()
      .then(data => {
        setPlayers(data || []);
        setStatus('ok');
      })
      .catch(() => {
        setStatus('error');
      });
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredPlayers([]);
      setShowDropdown(false);
      return;
    }
    const q = searchQuery.toLowerCase();
    const matches = players.filter(p => p.toLowerCase().includes(q)).slice(0, 8);
    setFilteredPlayers(matches);
    setShowDropdown(true);
  }, [searchQuery, players]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (name) => {
    onSelectPlayer(name);
    setSearchQuery('');
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Mobile Menu Button */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Search Input Container */}
      <div className="relative flex-1 max-w-md" ref={dropdownRef}>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search any player (e.g. Virat Kohli, Bumrah, Narine)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.trim() && setShowDropdown(true)}
            className="w-full bg-slate-900/90 border border-slate-800 focus:border-cyan-500/50 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
          />
        </div>

        {/* Dynamic Search Dropdown */}
        {showDropdown && filteredPlayers.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 animate-fadeIn max-h-60 overflow-y-auto">
            <div className="p-2 text-[10px] font-semibold text-slate-500 border-b border-slate-800 uppercase tracking-wider">
              Matching Players ({filteredPlayers.length})
            </div>
            {filteredPlayers.map((name) => (
              <button
                key={name}
                onClick={() => handleSelect(name)}
                className="w-full text-left px-4 py-2.5 text-xs text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-400 flex items-center gap-2 transition-colors border-b border-slate-800/40 last:border-0"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>{name}</span>
              </button>
            ))}
          </div>
        )}

        {showDropdown && searchQuery.trim() && filteredPlayers.length === 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-800 rounded-xl p-3 text-center text-xs text-slate-400 shadow-xl z-50">
            No player found matching "{searchQuery}"
          </div>
        )}
      </div>

      {/* Live System Status Badge */}
      <div className="hidden sm:flex items-center gap-2 bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-full text-xs">
        {status === 'ok' && (
          <>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-300 font-medium text-[11px]">Backend Live</span>
          </>
        )}
        {status === 'checking' && (
          <>
            <div className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
            <span className="text-slate-400 text-[11px]">Connecting...</span>
          </>
        )}
        {status === 'error' && (
          <>
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-rose-400 font-medium text-[11px]">API Offline</span>
          </>
        )}
      </div>
    </header>
  );
};
