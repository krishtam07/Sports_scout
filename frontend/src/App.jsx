import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { PlayerModal } from './components/PlayerModal';

import { Dashboard } from './pages/Dashboard';
import { BattingAnalysis } from './pages/BattingAnalysis';
import { BowlingAnalysis } from './pages/BowlingAnalysis';
import { StatisticalAnalysis } from './pages/StatisticalAnalysis';
import { Visualizations } from './pages/Visualizations';
import { LinearRegression } from './pages/LinearRegression';
import { PlayerComparison } from './pages/PlayerComparison';
import { PlayerScout } from './pages/PlayerScout';
import { AllRounders } from './pages/AllRounders';
import { AboutProject } from './pages/AboutProject';

export function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const handleSelectPlayer = (name) => {
    if (name) {
      setSelectedPlayer(name);
    }
  };

  const handleCloseModal = () => {
    setSelectedPlayer(null);
  };

  return (
    <Router>
      <div className="flex min-h-screen bg-[#0b0f19] text-slate-100 font-sans selection:bg-cyan-500 selection:text-white">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSelectPlayer={handleSelectPlayer}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
          {/* Header Navbar */}
          <Navbar
            onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            onSelectPlayer={handleSelectPlayer}
          />

          {/* Page Body Viewport */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard onSelectPlayer={handleSelectPlayer} />} />
              <Route path="/batting" element={<BattingAnalysis onSelectPlayer={handleSelectPlayer} />} />
              <Route path="/bowling" element={<BowlingAnalysis onSelectPlayer={handleSelectPlayer} />} />
              <Route path="/statistics" element={<StatisticalAnalysis />} />
              <Route path="/visualizations" element={<Visualizations onSelectPlayer={handleSelectPlayer} />} />
              <Route path="/regression" element={<LinearRegression onSelectPlayer={handleSelectPlayer} />} />
              <Route path="/compare" element={<PlayerComparison />} />
              <Route path="/scout" element={<PlayerScout onSelectPlayer={handleSelectPlayer} />} />
              <Route path="/all-rounders" element={<AllRounders onSelectPlayer={handleSelectPlayer} />} />
              <Route path="/about" element={<AboutProject />} />
            </Routes>
          </main>
        </div>

        {/* Global Player Profile Modal */}
        {selectedPlayer && (
          <PlayerModal
            playerName={selectedPlayer}
            onClose={handleCloseModal}
          />
        )}
      </div>
    </Router>
  );
}

export default App;
