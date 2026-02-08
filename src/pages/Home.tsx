import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../app/store';
import { Slider } from '../components/Slider';
import { NAP_TYPE_INFO } from '../app/types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentEnergyBefore, 
    setCurrentEnergyBefore, 
    startSession,
    sessions 
  } = useAppStore();

  // Today's sessions
  const todaySessions = sessions.filter(session => {
    const sessionDate = new Date(session.createdAt).toDateString();
    const today = new Date().toDateString();
    return sessionDate === today;
  });

  const handleNapStart = (type: typeof NAP_TYPE_INFO[keyof typeof NAP_TYPE_INFO]) => {
    startSession(type.key, currentEnergyBefore);
    navigate('/session');
  };

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-md mx-auto pt-8 space-y-8 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="floating-element">
            <h1 className="text-5xl font-light text-sage-100 tracking-wide calm-text">
              Naply
            </h1>
            <div className="text-naply-400 text-sm font-light tracking-widest mt-2">
              MOMENTS DE PAUSE
            </div>
          </div>
        </div>

        {/* Energy Input */}
        <div className="glass-card">
          <div className="space-y-4">
            <label className="block text-sage-200 text-sm font-light tracking-wide">
              Votre énergie maintenant
            </label>
            <Slider
              value={currentEnergyBefore}
              onChange={setCurrentEnergyBefore}
              label=""
            />
            <div className="text-center">
              <span className="text-3xl font-light text-naply-400">
                {currentEnergyBefore}
              </span>
              <span className="text-sage-400 text-sm ml-2">/ 10</span>
            </div>
          </div>
        </div>

        {/* Nap Types */}
        <div className="space-y-6">
          <h2 className="text-sage-200 text-lg font-light text-center tracking-wide">
            Choisissez votre format
          </h2>
          <div className="space-y-4">
            {Object.values(NAP_TYPE_INFO).map((napType) => (
              <div 
                key={napType.key}
                onClick={() => handleNapStart(napType)}
                className="nap-button cursor-pointer"
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-medium text-sage-100 mb-1">
                        {napType.name}
                      </h3>
                      <p className="text-sage-400 text-sm font-light">
                        {napType.description}
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="text-naply-400 text-2xl font-light">
                        {napType.duration}min
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Today's Summary */}
        {todaySessions.length > 0 && (
          <div className="glass-card">
            <h3 className="text-sage-200 text-lg font-light mb-4 tracking-wide">
              Aujourd'hui
            </h3>
            <div className="space-y-3">
              {todaySessions.slice(0, 3).map((session) => (
                <div key={session.id} className="flex items-center justify-between">
                  <div>
                    <div className="text-sage-300 text-sm">
                      {NAP_TYPE_INFO[session.napType].name}
                    </div>
                    <div className="text-sage-500 text-xs">
                      {new Date(session.createdAt).toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  <div className="text-naply-400 font-medium">
                    {session.roiScore > 0 ? '+' : ''}{session.roiScore.toFixed(1)}
                  </div>
                </div>
              ))}
              {todaySessions.length > 3 && (
                <div className="text-sage-500 text-xs text-center">
                  +{todaySessions.length - 3} autre{todaySessions.length - 3 > 1 ? 's' : ''}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card text-center">
            <div className="text-2xl font-light text-naply-400">
              {todaySessions.length}
            </div>
            <div className="text-xs text-sage-400 tracking-wide">
              SIESTES AUJ.
            </div>
          </div>
          <div className="glass-card text-center">
            <div className="text-2xl font-light text-naply-400">
              {sessions.length}
            </div>
            <div className="text-xs text-sage-400 tracking-wide">
              TOTAL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
