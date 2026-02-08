import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Session } from '../pages/Session';
import { Debrief } from '../pages/Debrief';
import { Stats } from '../pages/Stats';
import { Settings } from '../pages/Settings';
import { EnergyInput } from '../pages/EnergyInput';
import { BottomNav } from '../components/BottomNav';

const AppRouterContent: React.FC = () => {
  const location = useLocation();
  
  return (
    <div className="relative min-h-screen">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/energy-input" element={<EnergyInput />} />
        <Route path="/session" element={<Session />} />
        <Route path="/debrief" element={<Debrief />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      {/* Hide BottomNav on session and energy-input pages for immersive experience */}
      {location.pathname !== '/session' && location.pathname !== '/energy-input' && <BottomNav />}
    </div>
  );
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <AppRouterContent />
    </Router>
  );
};

export { AppRouter };
