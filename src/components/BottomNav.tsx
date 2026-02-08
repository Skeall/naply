import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/history', label: 'Historique', icon: '📊' },
  { path: '/stats', label: 'Stats', icon: '📈' },
  { path: '/settings', label: 'Réglages', icon: '⚙️' },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      <div className="glass-card mx-0 mb-0 rounded-t-20">
        <div className="grid grid-cols-4 py-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  flex flex-col items-center py-2 px-1 rounded-12 transition-all duration-200
                  ${isActive 
                    ? 'text-primary' 
                    : 'text-secondary hover:text-primary'
                  }
                `}
              >
                <span className={`text-[18px] mb-1 ${isActive ? 'opacity-100' : 'opacity-60'}`}>
                  {item.icon}
                </span>
                <span className="caption">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Safe area for iPhone */}
      <div className="h-0 bg-transparent" />
    </nav>
  );
};
