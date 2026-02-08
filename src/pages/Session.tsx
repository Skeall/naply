import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../app/store';
import { AUDIO_PATHS, NAP_TYPE_INFO } from '../app/types';
import { formatTime } from '../utils/time';

export const Session: React.FC = () => {
  const navigate = useNavigate();
  const { currentNapType, currentEnergyBefore } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  if (!currentNapType) {
    navigate('/');
    return null;
  }

  const napInfo = NAP_TYPE_INFO[currentNapType];
  const audioPath = AUDIO_PATHS[currentNapType];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Auto-navigate to debrief when audio ends
      navigate('/debrief');
    };

    const handleError = () => {
      setAudioError(true);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    // Try to load the audio
    audio.load();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioPath, navigate]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || audioError) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        setAudioError(true);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleEndEarly = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }
    navigate('/debrief');
  };

  if (audioError) {
    return (
      <div className="min-h-screen pb-20 px-4 flex items-center justify-center">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="text-6xl">⚠️</div>
          <h1 className="text-2xl font-bold text-white">Audio manquant</h1>
          <p className="text-gray-400">
            Le fichier audio pour cette session n'est pas encore disponible. 
            Ajoutez le fichier MP3 dans le dossier /public/audio/ pour activer cette fonctionnalité.
          </p>
          <button
            onClick={() => navigate('/debrief')}
            className="btn-primary w-full"
          >
            Continuer vers le debrief
          </button>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary w-full"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-md mx-auto pt-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">{napInfo.name}</h1>
          <p className="text-gray-400 text-sm">
            Énergie avant: {currentEnergyBefore}/10
          </p>
        </div>

        {/* Audio Player */}
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
          <div className="text-center mb-6">
            <button
              onClick={togglePlayPause}
              className="w-20 h-20 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl transition-colors"
            >
              {isPlaying ? '⏸️' : '▶️'}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <input
              type="range"
              min="0"
              max={duration || 0}
              value={currentTime}
              onChange={handleSeek}
              className="slider w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* End Early Button */}
        <button
          onClick={handleEndEarly}
          className="btn-secondary w-full"
        >
          Terminer & Debrief
        </button>

        {/* Hidden Audio Element */}
        <audio ref={audioRef} preload="metadata">
          <source src={audioPath} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};
