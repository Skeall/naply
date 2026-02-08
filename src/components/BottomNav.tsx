import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Accueil', icon: '🌙' },
  { path: '/history', label: 'Historique', icon: '📊' },
  { path: '/stats', label: 'Stats', icon: '📈' },
  { path: '/settings', label: 'Réglages', icon: '⚙️' },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40">
      <div className="glass-card border-t border-slate-700 rounded-t-lg mx-0.5 mb-0">
        <div className="grid grid-cols-4 py-0.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  flex flex-col items-center py-0.5 px-0.5 rounded-md transition-all duration-300
                  ${isActive 
                    ? 'text-sky-400 bg-sky-400 bg-opacity-10' 
                    : 'text-slate-400 hover:text-slate-200'
                  }
                `}
              >
                <span className="text-sm">{item.icon}</span>
                <span className="text-xs font-light tracking-wide">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
