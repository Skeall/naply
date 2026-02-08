import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { Session } from '../pages/Session';
import { Debrief } from '../pages/Debrief';
import { History } from '../pages/History';
import { Stats } from '../pages/Stats';
import { Settings } from '../pages/Settings';
import { BottomNav } from '../components/BottomNav';
import { ToastContainer } from '../components/Toast';
import { useAppStore, initializeStore } from './store';
import { useEffect } from 'react';

const AppContent: React.FC = () => {
  const { refreshSessions, toasts, removeToast } = useAppStore();

  useEffect(() => {
    // Initialize store with localStorage data
    initializeStore();
    refreshSessions();
  }, [refreshSessions]);

  return (
    <div className="min-h-screen relative">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/session" element={<Session />} />
        <Route path="/debrief" element={<Debrief />} />
        <Route path="/history" element={<History />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      <BottomNav />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
};
