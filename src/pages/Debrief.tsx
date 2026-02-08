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
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-md mx-auto pt-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Debrief</h1>
          <p className="text-gray-400 text-sm">
            {napInfo.name} • {formatDuration(napInfo.duration)}
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {/* Q1: Energy After */}
          <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Q1) Énergie maintenant ?
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={energyAfter}
              onChange={(e) => setEnergyAfter(Number(e.target.value))}
              className="slider w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span className="text-blue-400 font-bold">{energyAfter}</span>
              <span>10</span>
            </div>
          </div>

          {/* Q2: Focus After */}
          <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Q2) Focus maintenant ?
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={focusAfter}
              onChange={(e) => setFocusAfter(Number(e.target.value))}
              className="slider w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span className="text-blue-400 font-bold">{focusAfter}</span>
              <span>10</span>
            </div>
          </div>

          {/* Q3: Grogginess */}
          <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Q3) Grogginess (tête dans le cul) ?
            </label>
            <input
              type="range"
              min="0"
              max="10"
              value={grogginessAfter}
              onChange={(e) => setGrogginessAfter(Number(e.target.value))}
              className="slider w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0</span>
              <span className="text-blue-400 font-bold">{grogginessAfter}</span>
              <span>10</span>
            </div>
          </div>

          {/* Q4: Sleep Latency */}
          <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Q4) Temps d'endormissement estimé
            </label>
            <div className="space-y-2">
              {sleepLatencyOptions.map((option) => (
                <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="sleepLatency"
                    value={option.value}
                    checked={sleepLatency === option.value}
                    onChange={(e) => setSleepLatency(e.target.value as SleepLatencyBucket)}
                    className="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-300">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Context Tags (Optional) */}
          <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Contexte (optionnel) - Max 2 tags
            </label>
            <div className="grid grid-cols-2 gap-2">
              {CONTEXT_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => handleContextTagToggle(tag)}
                  disabled={!contextTags.includes(tag) && contextTags.length >= 2}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-colors
                    ${contextTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }
                    ${!contextTags.includes(tag) && contextTags.length >= 2
                      ? 'opacity-50 cursor-not-allowed'
                      : 'cursor-pointer'
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
          className="btn-primary w-full text-lg py-4"
        >
          Enregistrer
        </button>
      </div>
    </div>
  );
};
