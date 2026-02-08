import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../app/store';
import { SleepLatencyBucket, CONTEXT_TAGS, NAP_TYPE_INFO } from '../app/types';
import { getRoiInterpretation } from '../utils/scoring';
import { formatDuration } from '../utils/time';

export const Debrief: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentNapType, 
    currentEnergyBefore, 
    completeSession,
    addToast 
  } = useAppStore();

  const [energyAfter, setEnergyAfter] = useState(5);
  const [focusAfter, setFocusAfter] = useState(5);
  const [grogginessAfter, setGrogginessAfter] = useState(5);
  const [sleepLatency, setSleepLatency] = useState<SleepLatencyBucket>('2-5');
  const [contextTags, setContextTags] = useState<string[]>([]);

  if (!currentNapType) {
    navigate('/');
    return null;
  }

  const napInfo = NAP_TYPE_INFO[currentNapType];
  const isCoffeeNap = currentNapType === 'coffee20';

  const handleContextTagToggle = (tag: string) => {
    setContextTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else if (prev.length < 2) {
        return [...prev, tag];
      }
      return prev; // Don't add if already at max 2
    });
  };

  const handleSubmit = () => {
    const sessionData = {
      napType: currentNapType,
      coffee: isCoffeeNap,
      coffeeDoseMg: isCoffeeNap ? 100 : undefined,
      energyBefore: currentEnergyBefore,
      energyAfter,
      focusAfter,
      grogginessAfter,
      sleepLatencyBucket: sleepLatency,
      contextTags: contextTags.length > 0 ? contextTags : undefined,
      audioDurationSec: napInfo.duration,
      audioListenedSec: napInfo.duration, // Assume full listen for now
    };

    completeSession(sessionData);
    
    // Calculate and show ROI interpretation
    const roiScore = (energyAfter - currentEnergyBefore) + (focusAfter / 2) - (grogginessAfter / 1.5);
    const interpretation = getRoiInterpretation(roiScore);
    addToast(`Score: ${roiScore.toFixed(1)} - ${interpretation}`, 'success');
    
    navigate('/');
  };

  const sleepLatencyOptions: { value: SleepLatencyBucket; label: string }[] = [
    { value: '<2', label: '< 2 min' },
    { value: '2-5', label: '2–5 min' },
    { value: '5-10', label: '5–10 min' },
    { value: '>10', label: '> 10 min' },
    { value: 'no_sleep', label: 'Je ne pense pas avoir dormi' },
  ];

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-sm mx-auto px-6 pt-12 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="h1">Debrief</h1>
          <p className="caption text-secondary">
            {napInfo.name} • {formatDuration(napInfo.duration)}
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {/* Q1: Energy After */}
          <div className="glass-card-raised p-6">
            <label className="block body text-primary mb-4">
              Q1) Énergie maintenant ?
            </label>
            <div className="slider-premium">
              <div className="slider-track" />
              <div 
                className="slider-fill" 
                style={{ width: `${(energyAfter / 10) * 100}%` }}
              />
              <input
                type="range"
                min="0"
                max="10"
                value={energyAfter}
                onChange={(e) => setEnergyAfter(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ padding: 0, margin: 0 }}
              />
            </div>
            <div className="flex justify-between caption text-secondary mt-3">
              <span>0</span>
              <span className="body text-primary font-medium">{energyAfter}</span>
              <span>10</span>
            </div>
          </div>

          {/* Q2: Focus After */}
          <div className="glass-card-raised p-6">
            <label className="block body text-primary mb-4">
              Q2) Focus maintenant ?
            </label>
            <div className="slider-premium">
              <div className="slider-track" />
              <div 
                className="slider-fill" 
                style={{ width: `${(focusAfter / 10) * 100}%` }}
              />
              <input
                type="range"
                min="0"
                max="10"
                value={focusAfter}
                onChange={(e) => setFocusAfter(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ padding: 0, margin: 0 }}
              />
            </div>
            <div className="flex justify-between caption text-secondary mt-3">
              <span>0</span>
              <span className="body text-primary font-medium">{focusAfter}</span>
              <span>10</span>
            </div>
          </div>

          {/* Q3: Grogginess */}
          <div className="glass-card-raised p-6">
            <label className="block body text-primary mb-4">
              Q3) Grogginess (tête dans le cul) ?
            </label>
            <div className="slider-premium">
              <div className="slider-track" />
              <div 
                className="slider-fill" 
                style={{ width: `${(grogginessAfter / 10) * 100}%` }}
              />
              <input
                type="range"
                min="0"
                max="10"
                value={grogginessAfter}
                onChange={(e) => setGrogginessAfter(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ padding: 0, margin: 0 }}
              />
            </div>
            <div className="flex justify-between caption text-secondary mt-3">
              <span>0</span>
              <span className="body text-primary font-medium">{grogginessAfter}</span>
              <span>10</span>
            </div>
          </div>

          {/* Q4: Sleep Latency */}
          <div className="glass-card-raised p-6">
            <label className="block body text-primary mb-4">
              Q4) Temps d'endormissement estimé
            </label>
            <div className="space-y-3">
              {sleepLatencyOptions.map((option) => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sleepLatency"
                    value={option.value}
                    checked={sleepLatency === option.value}
                    onChange={(e) => setSleepLatency(e.target.value as SleepLatencyBucket)}
                    className="w-4 h-4 text-primary bg-surface-raised border-border rounded focus:ring-2 focus:ring-primary focus:ring-opacity-30"
                  />
                  <span className="body text-secondary">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Context Tags (Optional) */}
          <div className="glass-card-raised p-6">
            <label className="block body text-primary mb-4">
              Contexte (optionnel) - Max 2 tags
            </label>
            <div className="grid grid-cols-2 gap-3">
              {CONTEXT_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleContextTagToggle(tag)}
                  disabled={!contextTags.includes(tag) && contextTags.length >= 2}
                  className={`
                    px-3 py-2 rounded-12 caption font-medium transition-all duration-200
                    ${contextTags.includes(tag)
                      ? 'bg-primary text-white'
                      : 'bg-surface-raised border border-border text-secondary hover:bg-surface'
                    }
                    ${!contextTags.includes(tag) && contextTags.length >= 2
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer hover:scale-105 active:scale-95'
                    }
                  `}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="btn-cta w-full"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
};
