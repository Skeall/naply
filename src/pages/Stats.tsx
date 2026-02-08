import React from 'react';
import { useAppStore } from '../app/store';
import { calculateStats, getSessionsFromLastDays, calculateMovingAverage } from '../utils/scoring';
import { NAP_TYPE_INFO } from '../app/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Stats: React.FC = () => {
  const { sessions } = useAppStore();

  // Calculate stats
  const allStats = calculateStats(sessions);
  const recentSessions = getSessionsFromLastDays(sessions, 14);
  const recentStats = calculateStats(recentSessions);

  // Prepare chart data
  const chartData = sessions.slice(0, 50).reverse().map((session, index) => ({
    index: index + 1,
    date: new Date(session.createdAt).toLocaleDateString('fr-FR', { 
      month: 'short', 
      day: 'numeric' 
    }),
    roiScore: session.roiScore,
    movingAverage: calculateMovingAverage(
      sessions.slice(0, index + 1).reverse().map(s => s.roiScore),
      7
    )[index] || session.roiScore,
  }));

  // Badge calculation
  const totalSessions = allStats.totalSessions;
  const badges = [
    { threshold: 10, name: 'Débutant', icon: '🌱', unlocked: totalSessions >= 10 },
    { threshold: 25, name: 'Habitué', icon: '🌿', unlocked: totalSessions >= 25 },
    { threshold: 50, name: 'Expert', icon: '🌳', unlocked: totalSessions >= 50 },
    { threshold: 100, name: 'Maître', icon: '🌲', unlocked: totalSessions >= 100 },
  ];

  const getBestNapTypeDisplay = () => {
    if (recentStats.totalSessions < 5) {
      return 'Pas assez de données';
    }
    
    const bestType = recentStats.bestNapType;
    if (!bestType) return 'Pas assez de données';
    
    const napInfo = NAP_TYPE_INFO[bestType];
    return `${napInfo.name} - ${napInfo.description}`;
  };

  return (
    <div className="min-h-screen pb-20 px-4">
      <div className="max-w-md mx-auto pt-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Stats</h1>
          <p className="text-gray-400 text-sm">
            Analyse de vos performances
          </p>
        </div>

        {/* Recommendation */}
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
          <h2 className="text-lg font-semibold text-white mb-3">Recommandation</h2>
          <div className="text-center">
            <div className="text-sm text-gray-400 mb-2">Ton meilleur format actuellement:</div>
            <div className="text-xl font-bold text-blue-400">
              {getBestNapTypeDisplay()}
            </div>
            {recentStats.totalSessions < 5 && (
              <div className="text-xs text-gray-500 mt-2">
                (Minimum 5 sessions requises)
              </div>
            )}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-dark-card rounded-xl p-4 border border-dark-border text-center">
            <div className="text-2xl font-bold text-green-400">
              {allStats.totalMinutesRecovered}
            </div>
            <div className="text-xs text-gray-400">Minutes récupérées</div>
          </div>
          <div className="bg-dark-card rounded-xl p-4 border border-dark-border text-center">
            <div className="text-2xl font-bold text-blue-400">
              {allStats.totalSessions}
            </div>
            <div className="text-xs text-gray-400">Total sessions</div>
          </div>
        </div>

        {/* Comparison by Format */}
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
          <h2 className="text-lg font-semibold text-white mb-4">Comparatif par format</h2>
          <div className="space-y-3">
            {(['nap10', 'nap15', 'nap20', 'coffee20'] as const).map((type) => {
              const napInfo = NAP_TYPE_INFO[type];
              const avgRoi = recentStats.averageRoiByType[type];
              const avgGrogginess = recentStats.averageGrogginessByType[type];
              const count = recentStats.sessionsByType[type];
              
              return (
                <div key={type} className="border-b border-gray-700 pb-3 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-white">
                      {napInfo.name}
                    </span>
                    <span className="text-xs text-gray-400">
                      {count} session{count !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-gray-400">ROI:</span>
                      <span className={`ml-1 font-bold ${
                        avgRoi >= 3 ? 'text-green-400' :
                        avgRoi >= 1 ? 'text-blue-400' :
                        avgRoi >= -1 ? 'text-yellow-400' :
                        'text-red-400'
                      }`}>
                        {avgRoi.toFixed(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Grogginess:</span>
                      <span className="ml-1 text-orange-400">
                        {avgGrogginess.toFixed(1)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400">Énergie après:</span>
                      <span className="ml-1 text-green-400">
                        {count > 0 ? (sessions
                          .filter(s => s.napType === type)
                          .reduce((sum, s) => sum + s.energyAfter, 0) / count
                        ).toFixed(1) : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Evolution Chart */}
        {sessions.length > 0 && (
          <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
            <h2 className="text-lg font-semibold text-white mb-4">Évolution ROI</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#9CA3AF"
                  tick={{ fontSize: 10 }}
                  domain={[-5, 10]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: '#F3F4F6' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="roiScore" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6', r: 3 }}
                  name="ROI Score"
                />
                <Line 
                  type="monotone" 
                  dataKey="movingAverage" 
                  stroke="#10B981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Moyenne mobile (7)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Badges */}
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
          <h2 className="text-lg font-semibold text-white mb-4">Badges</h2>
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.threshold}
                className={`
                  p-3 rounded-xl border text-center transition-all
                  ${badge.unlocked 
                    ? 'border-yellow-500 bg-yellow-500 bg-opacity-10' 
                    : 'border-gray-600 bg-gray-800 opacity-50'
                  }
                `}
              >
                <div className="text-2xl mb-1">{badge.icon}</div>
                <div className={`text-sm font-medium ${
                  badge.unlocked ? 'text-yellow-400' : 'text-gray-400'
                }`}>
                  {badge.name}
                </div>
                <div className="text-xs text-gray-500">
                  {badge.threshold} sessions
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
