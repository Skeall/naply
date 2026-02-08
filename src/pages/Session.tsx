import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../app/store';
import { AUDIO_PATHS, NAP_TYPE_INFO } from '../app/types';
import { formatTime } from '../utils/time';

export const Session: React.FC = () => {
  const navigate = useNavigate();
  const { currentNapType } = useAppStore();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  if (!currentNapType) {
    console.debug('[session] no nap type, redirecting home');
    navigate('/');
    return null;
  }

  const napInfo = NAP_TYPE_INFO[currentNapType];
  const audioPath = AUDIO_PATHS[currentNapType];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Auto-play as soon as metadata is ready (UX: no second tap after energy-input)
    const handleLoadedMetadata = () => {
      console.debug('[session] loaded metadata', { duration: audio.duration, audioPath });
      setDuration(audio.duration);

      audio.play().catch(error => {
        console.error('[session] error auto-playing audio', error);
        setAudioError(true);
      });

      setIsPlaying(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      console.debug('[session] ended');
      setIsPlaying(false);
      navigate('/debrief');
    };

    const handleError = () => {
      console.error('[session] audio element error');
      setAudioError(true);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    audio.load();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioPath, navigate]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio || audioError) return;

    console.debug('[session] toggle play/pause', { isPlaying });

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    audio.play().then(() => {
      setIsPlaying(true);
    }).catch(error => {
      console.error('[session] error playing audio', error);
      setAudioError(true);
    });
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Number(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleEndEarly = () => {
    console.debug('[session] end early');

    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      setIsPlaying(false);
    }

    navigate('/debrief');
  };

  const remainingTime = Math.max(0, duration - currentTime);

  if (audioError) {
    return (
      <div className="min-h-screen px-6 flex items-center justify-center">
        <div className="max-w-sm w-full text-center space-y-8">
          <div className="text-[48px]">⚠️</div>
          <h1 className="h1">Audio manquant</h1>
          <p className="body text-secondary">
            Le fichier audio pour cette session n'est pas encore disponible.
          </p>
          <button onClick={() => navigate('/debrief')} className="btn-cta w-full">
            Continuer vers le debrief
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-bg-subtle to-primary/5 flex flex-col">
      {/* Header Minimal */}
      <div className="fixed top-0 left-0 right-0 z-40 px-6 pt-12">
        <div className="max-w-sm mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="w-10 h-10 flex items-center justify-center rounded-full glass-card text-secondary hover:text-primary transition-all duration-200"
            aria-label="Retour"
          >
            ←
          </button>
          <div className="flex items-center gap-3">
            <h1 className="h1">Reset</h1>
            <span className="caption bg-primary/10 text-primary px-2 py-1 rounded-full">
              {napInfo.duration} min
            </span>
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center justify-center space-y-10">
            {/* Nap Type */}
            <div className="text-center space-y-2">
              <h2 className="h2">{napInfo.name}</h2>
              <p className="caption text-secondary">{napInfo.description}</p>
            </div>

            {/* Play/Pause */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
                <button
                  onClick={handlePlayPause}
                  className="relative w-24 h-24 glass-card-raised rounded-full flex items-center justify-center text-primary text-[32px] transition-all duration-300 hover:scale-105 active:scale-95 shadow-2xl"
                  aria-label={isPlaying ? 'Mettre en pause' : 'Reprendre'}
                >
                  {isPlaying ? '⏸️' : '▶️'}
                </button>
              </div>
            </div>

            {/* Mantra */}
            <div className="text-center space-y-2">
              <p className="body text-primary">Respire. Laisse faire.</p>
              <p className="caption text-secondary">
                {isPlaying ? 'Session en cours...' : 'En pause'}
              </p>
            </div>

            {/* Progress */}
            <div className="w-full space-y-3">
              <div className="relative h-1 bg-surface-raised rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary to-primary-strong transition-all duration-300"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  style={{ padding: 0, margin: 0 }}
                  aria-label="Avancement"
                />
              </div>
              <div className="flex justify-between caption text-secondary">
                <span>{formatTime(currentTime)}</span>
                <span>-{formatTime(remainingTime)}</span>
              </div>
            </div>

            {/* End button (more visible) */}
            <div className="w-full pt-2">
              <button
                onClick={handleEndEarly}
                className="w-full py-3 rounded-2xl glass-card-raised border border-red-500/30 bg-gradient-to-r from-red-500/20 to-red-500/5 text-red-200 font-medium transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-xl"
              >
                Terminer la session
              </button>
              <p className="caption text-secondary text-center mt-3">
                Tu peux aussi mettre en pause si besoin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden Audio */}
      <audio ref={audioRef} preload="metadata">
        <source src={audioPath} type="audio/mpeg" />
      </audio>
    </div>
  );
};
