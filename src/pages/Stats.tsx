import React from 'react';
import { useAppStore } from '../app/store';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Stats: React.FC = () => {
  const { sessions } = useAppStore();

  // Calculate stats
  const totalSessions = sessions.length;
  const totalMinutes = sessions.reduce((acc, session) => acc + session.audioDurationSec / 60, 0);
  const avgROI = sessions.length > 0 
    ? sessions.reduce((acc, session) => acc + (session.roiScore || 0), 0) / sessions.length 
    : 0;

  // Best nap type
  const napTypeStats = sessions.reduce((acc, session) => {
    if (!acc[session.napType]) {
      acc[session.napType] = { count: 0, totalROI: 0 };
    }
    acc[session.napType].count++;
    acc[session.napType].totalROI += session.roiScore || 0;
    return acc;
  }, {} as Record<string, { count: number; totalROI: number }>);

  const bestNapType = Object.entries(napTypeStats)
    .map(([type, stats]) => ({
      type,
      count: stats.count,
      avgROI: stats.totalROI / stats.count
    }))
    .sort((a, b) => b.avgROI - a.avgROI)[0];

  // Last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toLocaleDateString('fr-FR', { weekday: 'short' });
    
    const daySessions = sessions.filter(session => {
      const sessionDate = new Date(session.createdAt).toDateString();
      return sessionDate === date.toDateString();
    });
    
    return {
      day: dateStr,
      sessions: daySessions.length
    };
  });

  // ROI distribution
  const roiDistribution = [
    { range: '< -2', count: sessions.filter(s => (s.roiScore || 0) < -2).length },
    { range: '-2 à 0', count: sessions.filter(s => (s.roiScore || 0) >= -2 && (s.roiScore || 0) < 0).length },
    { range: '0 à 2', count: sessions.filter(s => (s.roiScore || 0) >= 0 && (s.roiScore || 0) < 2).length },
    { range: '2 à 4', count: sessions.filter(s => (s.roiScore || 0) >= 2 && (s.roiScore || 0) < 4).length },
    { range: '> 4', count: sessions.filter(s => (s.roiScore || 0) >= 4).length },
  ].filter(item => item.count > 0);

  return (
    <div className="min-h-screen pb-32">
      <div className="max-w-sm mx-auto px-6 pt-12 space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="h1">Stats</h1>
          <p className="caption">Vos performances de sieste</p>
        </div>

        {/* Main Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          <div className="stats-card">
            <div className="stats-value">{totalSessions}</div>
            <div className="stats-label">Total siestes</div>
          </div>
          <div className="stats-card">
            <div className="stats-value">{Math.round(totalMinutes)}</div>
            <div className="stats-label">Minutes totales</div>
          </div>
          <div className="stats-card">
            <div className="stats-value">{avgROI.toFixed(1)}</div>
            <div className="stats-label">ROI moyen</div>
          </div>
          <div className="stats-card">
            <div className="stats-value">
              {bestNapType ? getNapName(bestNapType.type) : '-'}
            </div>
            <div className="stats-label">Meilleur format</div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="glass-card-raised p-6">
          <h2 className="h2 mb-4">Recommandations</h2>
          <div className="space-y-3">
            {avgROI < 0 && (
              <div className="flex items-start gap-3">
                <span className="text-[20px]">💡</span>
                <div>
                  <div className="nap-title">Essayez le format Reset 10</div>
                  <div className="caption text-secondary">Votre ROI moyen est négatif, un format plus court pourrait aider</div>
                </div>
              </div>
            )}
            {totalMinutes < 60 && totalSessions > 0 && (
              <div className="flex items-start gap-3">
                <span className="text-[20px]">📈</span>
                <div>
                  <div className="nap-title">Augmentez la fréquence</div>
                  <div className="caption text-secondary">Essayez de faire plus de siestes courtes pour maximiser les bénéfices</div>
                </div>
              </div>
            )}
            {avgROI > 2 && (
              <div className="flex items-start gap-3">
                <span className="text-[20px]">🎯</span>
                <div>
                  <div className="nap-title">Excellent travail !</div>
                  <div className="caption text-secondary">Continuez avec votre format actuel, il fonctionne parfaitement</div>
                </div>
              </div>
            )}
            {!totalSessions && (
              <div className="flex items-start gap-3">
                <span className="text-[20px]">🚀</span>
                <div>
                  <div className="nap-title">Commencez votre première sieste</div>
                  <div className="caption text-secondary">Essayez le format Reset 10 pour découvrir votre rythme optimal</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Last 7 Days Chart */}
        {totalSessions > 0 && (
          <div className="glass-card-raised p-6">
            <h2 className="h2 mb-4">7 derniers jours</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <YAxis 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--surface-raised)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)'
                  }}
                />
                <Bar dataKey="sessions" fill="var(--primary)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* ROI Distribution */}
        {totalSessions > 0 && (
          <div className="glass-card-raised p-6">
            <h2 className="h2 mb-4">Distribution ROI</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={roiDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis 
                  dataKey="range" 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <YAxis 
                  tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                  axisLine={{ stroke: 'var(--border)' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--surface-raised)',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                    color: 'var(--text-primary)'
                  }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Best Format */}
        {bestNapType && (
          <div className="glass-card-raised p-6">
            <h2 className="h2 mb-4">Votre meilleur format</h2>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="nap-icon">
                  {getNapIcon(bestNapType.type)}
                </div>
                <div>
                  <div className="nap-title">
                    {getNapName(bestNapType.type)}
                  </div>
                  <div className="caption text-secondary">
                    ROI moyen: {bestNapType.avgROI.toFixed(1)} • {bestNapType.count} siestes
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper functions
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
