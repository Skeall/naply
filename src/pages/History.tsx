import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../app/store';
import { formatDuration } from '../utils/time';

export const History: React.FC = () => {
  const navigate = useNavigate();
  const { sessions, deleteSession } = useAppStore();

  // Group sessions by date
  const sessionsByDate = sessions.reduce((acc, session) => {
    const date = new Date(session.createdAt).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(session);
    return acc;
  }, {} as Record<string, typeof sessions>);

  const handleExportJSON = () => {
    const dataStr = JSON.stringify(sessions, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `naply-sessions-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Type', 'Durée', 'Énergie avant', 'Énergie après', 'ROI', 'Focus', 'Grogginess'];
    const csvContent = [
      headers.join(','),
      ...sessions.map(session => [
        new Date(session.createdAt).toLocaleDateString('fr-FR'),
        session.napType,
        formatDuration(session.audioDurationSec),
        session.energyBefore,
        session.energyAfter,
        session.roiScore?.toFixed(2) || '',
        session.focusAfter || '',
        session.grogginessAfter || ''
      ].join(','))
    ].join('\n');
    
    const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
    const exportFileDefaultName = `naply-sessions-${new Date().toISOString().split('T')[0]}.csv`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getNapIcon = (type: string) => {
    switch (type) {
      case 'nap10': return '⚡';
      case 'nap15': return '🌊';
      case 'nap20': return '☀️';
      case 'coffee20': return '☕';
      default: return '😴';
    }
  };

  const getNapName = (type: string) => {
    switch (type) {
      case 'nap10': return 'Reset 10';
      case 'nap15': return 'Recharge 15';
      case 'nap20': return 'Full 20';
      case 'coffee20': return 'Coffee 20';
      default: return 'Nap';
    }
  };

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-sm mx-auto px-6 pt-12 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="h1">Historique</h1>
          <p className="caption">Vos sessions de sieste</p>
        </div>

        {/* Export Buttons */}
        <div className="glass-card-raised p-4">
          <div className="flex gap-3">
            <button
              onClick={handleExportJSON}
              className="btn-cta flex-1 text-sm"
            >
              Exporter JSON
            </button>
            <button
              onClick={handleExportCSV}
              className="btn-cta flex-1 text-sm"
            >
              Exporter CSV
            </button>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-6">
          {Object.entries(sessionsByDate).map(([date, daySessions]) => (
            <div key={date} className="space-y-3">
              {/* Date Header */}
              <h2 className="h2">{date}</h2>
              
              {/* Sessions for this date */}
              <div className="space-y-3">
                {daySessions.map((session) => (
                  <div key={session.id} className="glass-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {/* Nap Icon */}
                        <div className="nap-icon">
                          {getNapIcon(session.napType)}
                        </div>
                        
                        {/* Session Info */}
                        <div>
                          <div className="nap-title">
                            {getNapName(session.napType)}
                          </div>
                          <div className="caption text-secondary">
                            {formatDuration(session.audioDurationSec)} • 
                            Énergie: {session.energyBefore} → {session.energyAfter}
                          </div>
                        </div>
                      </div>
                      
                      {/* ROI Score */}
                      <div className="text-right">
                        <div className="body text-primary font-medium">
                          {session.roiScore?.toFixed(1) || '0.0'}
                        </div>
                        <div className="caption text-secondary">ROI</div>
                      </div>
                    </div>
                    
                    {/* Additional Details */}
                    {(session.focusAfter !== undefined || session.grogginessAfter !== undefined) && (
                      <div className="mt-3 pt-3 border-t border-border flex gap-4 caption text-secondary">
                        {session.focusAfter !== undefined && (
                          <span>Focus: {session.focusAfter}/10</span>
                        )}
                        {session.grogginessAfter !== undefined && (
                          <span>Grogginess: {session.grogginessAfter}/10</span>
                        )}
                      </div>
                    )}
                    
                    {/* Delete Button */}
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => deleteSession(session.id)}
                        className="caption text-secondary hover:text-red-400 transition-colors duration-200"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {sessions.length === 0 && (
          <div className="glass-card-raised p-8 text-center">
            <div className="text-[48px] mb-4">😴</div>
            <h2 className="h2 mb-2">Aucune session</h2>
            <p className="body text-secondary mb-6">
              Commencez votre première sieste pour voir votre historique
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn-cta"
            >
              Commencer
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
