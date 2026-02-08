import React, { useState } from 'react';
import { useAppStore } from '../app/store';
import { NapSession } from '../app/types';
import { formatDateTime, getRelativeDate } from '../utils/time';
import { NAP_TYPE_INFO } from '../app/types';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { exportSessionsAsJSON, exportSessionsAsCSV } from '../utils/storage';

export const History: React.FC = () => {
  const { sessions, deleteSession } = useAppStore();
  const [deleteConfirm, setDeleteConfirm] = useState<{ isOpen: boolean; sessionId: string | null }>({
    isOpen: false,
    sessionId: null,
  });

  const handleDeleteClick = (sessionId: string) => {
    setDeleteConfirm({ isOpen: true, sessionId });
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirm.sessionId) {
      deleteSession(deleteConfirm.sessionId);
    }
    setDeleteConfirm({ isOpen: false, sessionId: null });
  };

  const handleExportJSON = () => {
    const data = exportSessionsAsJSON();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nap-tracker-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const data = exportSessionsAsCSV();
    if (!data) return;
    
    const blob = new Blob([data], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nap-tracker-export-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const groupSessionsByDate = (sessions: NapSession[]) => {
    const grouped = sessions.reduce((acc, session) => {
      const date = getRelativeDate(session.createdAt);
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(session);
      return acc;
    }, {} as Record<string, NapSession[]>);

    return grouped;
  };

  const groupedSessions = groupSessionsByDate(sessions);

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-md mx-auto pt-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Historique</h1>
          <p className="text-gray-400 text-sm">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''} enregistrée{sessions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Export Buttons */}
        {sessions.length > 0 && (
          <div className="flex gap-2">
            <button
              onClick={handleExportJSON}
              className="btn-secondary flex-1 text-sm py-2"
            >
              Export JSON
            </button>
            <button
              onClick={handleExportCSV}
              className="btn-secondary flex-1 text-sm py-2"
            >
              Export CSV
            </button>
          </div>
        )}

        {/* Sessions List */}
        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📊</div>
            <p className="text-gray-400">Aucune session enregistrée</p>
            <p className="text-gray-500 text-sm mt-2">
              Lancez votre première sieste pour voir l'historique ici
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedSessions).map(([date, dateSessions]) => (
              <div key={date}>
                <h3 className="text-lg font-semibold text-white mb-3 sticky top-0 bg-dark bg-opacity-90 py-2">
                  {date}
                </h3>
                <div className="space-y-3">
                  {dateSessions.map((session) => {
                    const napInfo = NAP_TYPE_INFO[session.napType];
                    return (
                      <div
                        key={session.id}
                        className="bg-dark-card rounded-xl p-4 border border-dark-border"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-white">
                                {napInfo.name}
                              </span>
                              {session.coffee && (
                                <span className="text-xs bg-yellow-600 text-yellow-100 px-2 py-1 rounded-full">
                                  ☕ Coffee
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-400">
                              {formatDateTime(session.createdAt)}
                            </div>
                          </div>
                          <button
                            onClick={() => handleDeleteClick(session.id)}
                            className="text-red-400 hover:text-red-300 text-sm p-1"
                          >
                            🗑️
                          </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Énergie:</span>
                            <span className="ml-2 text-white">
                              {session.energyBefore} → {session.energyAfter}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">ROI:</span>
                            <span className={`ml-2 font-bold ${
                              session.roiScore >= 3 ? 'text-green-400' :
                              session.roiScore >= 1 ? 'text-blue-400' :
                              session.roiScore >= -1 ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {session.roiScore.toFixed(1)}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-400">Focus:</span>
                            <span className="ml-2 text-white">{session.focusAfter}/10</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Grogginess:</span>
                            <span className="ml-2 text-white">{session.grogginessAfter}/10</span>
                          </div>
                        </div>

                        {session.contextTags && session.contextTags.length > 0 && (
                          <div className="mt-2 flex gap-1 flex-wrap">
                            {session.contextTags.map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteConfirm.isOpen}
          title="Supprimer la session"
          message="Êtes-vous sûr de vouloir supprimer cette session ? Cette action ne peut pas être annulée."
          confirmText="Supprimer"
          cancelText="Annuler"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteConfirm({ isOpen: false, sessionId: null })}
          type="danger"
        />
      </div>
    </div>
  );
};
