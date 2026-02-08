import React from 'react';
import { AppRouter } from './routes';
import { useAppStore } from './store';
import { ToastContainer } from '../components/Toast';

const App: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  return (
    <div className="app">
      <AppRouter />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default App;
