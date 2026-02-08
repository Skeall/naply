import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppStore } from '../app/store';
import { NAP_TYPE_INFO } from '../app/types';

export const EnergyInput: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentEnergyBefore, startSession } = useAppStore();
  const [energyLevel, setEnergyLevel] = React.useState(5);

  const napType = location.state?.napType as keyof typeof NAP_TYPE_INFO;

  if (!napType) {
    navigate('/');
    return null;
  }

  const napInfo = NAP_TYPE_INFO[napType];

  const handleStartSession = () => {
    setCurrentEnergyBefore(energyLevel);
    startSession(napType, energyLevel);
    navigate('/session');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-sm mx-auto px-6 pt-12 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full glass-card text-secondary hover:text-primary transition-all duration-200"
          >
            ←
          </button>
          <h1 className="h1">Énergie maintenant</h1>
          <p className="caption">
            {napInfo.name} • {napInfo.duration} minutes
          </p>
        </div>

        {/* Energy Slider - Enhanced Design */}
        <div className="glass-card-raised p-6">
          <div className="space-y-6">
            <label className="block body text-primary">
              Quel est votre niveau d'énergie maintenant ?
            </label>
            
            {/* Enhanced Slider with Visual Indicators */}
            <div className="space-y-4">
              {/* Scale Numbers */}
              <div className="flex justify-between caption text-secondary">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <span key={num} className="text-xs">{num}</span>
                ))}
              </div>
              
              {/* Enhanced Slider */}
              <div className="relative">
                <div className="slider-premium">
                  <div className="slider-track" />
                  <div 
                    className="slider-fill" 
                    style={{ width: `${(energyLevel / 10) * 100}%` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={energyLevel}
                    onChange={(e) => setEnergyLevel(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    style={{ padding: 0, margin: 0 }}
                  />
                </div>
                
                {/* Draggable Thumb Indicator */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full shadow-lg border-2 border-white transition-all duration-200"
                  style={{ left: `calc(${(energyLevel / 10) * 100}% - 12px)` }}
                >
                  <div className="absolute inset-0 bg-primary/30 rounded-full animate-ping" />
                </div>
              </div>
              
              {/* Current Value Display */}
              <div className="text-center">
                <div className="h1 text-primary">{energyLevel}</div>
                <div className="caption text-secondary">sur 10</div>
              </div>
            </div>
          </div>
        </div>

        {/* Nap Info */}
        <div className="glass-card-raised p-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="nap-icon">
                {napType === 'nap10' ? '⚡' :
                 napType === 'nap15' ? '🌊' :
                 napType === 'nap20' ? '☀️' : '☕'}
              </div>
              <div>
                <div className="nap-title">{napInfo.name}</div>
                <div className="nap-description">{napInfo.description}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={handleStartSession}
          className="btn-cta w-full"
        >
          Commencer la session
        </button>
      </div>
    </div>
  );
};
