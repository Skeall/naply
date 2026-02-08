import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../app/store';
import { NAP_TYPE_INFO } from '../app/types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { 
    sessions 
  } = useAppStore();

  // Today's sessions
  const todaySessions = sessions.filter(session => {
    const sessionDate = new Date(session.createdAt).toDateString();
    const today = new Date().toDateString();
    return sessionDate === today;
  });

  const totalMinutesToday = todaySessions.reduce((acc, session) => acc + session.audioDurationSec / 60, 0);

  const handleNapClick = (type: keyof typeof NAP_TYPE_INFO) => {
    navigate('/energy-input', { state: { napType: type } });
  };

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-sm mx-auto px-6 pt-12 space-y-8">
        {/* Header - Left Aligned */}
        <div className="space-y-2">
          <h1 className="h1">Naply</h1>
          <p className="caption">Reset en 10–20 min</p>
        </div>

        {/* Nap Formats Section */}
        <div className="space-y-4">
          <h2 className="h2">Choisis ton format</h2>
          <div className="space-y-3">
            {Object.entries(NAP_TYPE_INFO).map(([key, info]) => (
              <button
                key={key}
                onClick={() => handleNapClick(key as keyof typeof NAP_TYPE_INFO)}
                className="nap-option-card w-full"
              >
                <div className="nap-icon">
                  {key === 'nap10' ? '⚡' :
                   key === 'nap15' ? '🌊' :
                   key === 'nap20' ? '☀️' : '☕'}
                </div>
                <div className="nap-content">
                  <div className="nap-title">{info.name}</div>
                  <div className="nap-description">{info.description}</div>
                </div>
                <div className="nap-badge">{info.duration}min</div>
              </button>
            ))}
          </div>
        </div>

        {/* Today's Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="stats-card">
            <div className="stats-value">{Math.round(totalMinutesToday)}</div>
            <div className="stats-label">Minutes récupérées aujourd'hui</div>
          </div>
          <div className="stats-card">
            <div className="stats-value">{todaySessions.length}</div>
            <div className="stats-label">Naps aujourd'hui</div>
          </div>
        </div>
      </div>
    </div>
  );
};
