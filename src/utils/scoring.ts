import { NapSession, NapType, NapStats } from '../app/types';

/**
 * Calculate ROI score for a nap session
 * Formula: (energyAfter - energyBefore) + (focusAfter / 2) - (grogginessAfter / 1.5)
 */
export const calculateRoiScore = (
  energyBefore: number,
  energyAfter: number,
  focusAfter: number,
  grogginessAfter: number
): number => {
  const score = (energyAfter - energyBefore) + (focusAfter / 2) - (grogginessAfter / 1.5);
  return Math.round(score * 10) / 10; // Round to 1 decimal place
};

/**
 * Get interpretation text for ROI score
 */
export const getRoiInterpretation = (score: number): string => {
  if (score >= 3) return 'Excellent reset';
  if (score >= 1) return 'Bon';
  if (score >= -1) return 'Moyen';
  return 'À ajuster';
};

/**
 * Calculate statistics from sessions
 */
export const calculateStats = (sessions: NapSession[]): NapStats => {
  const totalSessions = sessions.length;
  const totalMinutesRecovered = Math.round(
    sessions.reduce((acc, session) => acc + session.audioDurationSec, 0) / 60
  );

  // Initialize stats for each nap type
  const napTypes: NapType[] = ['nap10', 'nap15', 'nap20', 'coffee20'];
  const statsByType = napTypes.reduce((acc, type) => {
    acc[type] = {
      sessions: [] as NapSession[],
      totalRoi: 0,
      totalGrogginess: 0,
      count: 0,
    };
    return acc;
  }, {} as Record<NapType, { sessions: NapSession[]; totalRoi: number; totalGrogginess: number; count: number }>);

  // Group sessions by type and calculate totals
  sessions.forEach(session => {
    statsByType[session.napType].sessions.push(session);
    statsByType[session.napType].totalRoi += session.roiScore;
    statsByType[session.napType].totalGrogginess += session.grogginessAfter;
    statsByType[session.napType].count++;
  });

  // Calculate averages
  const averageRoiByType = napTypes.reduce((acc, type) => {
    const stats = statsByType[type];
    acc[type] = stats.count > 0 ? Math.round((stats.totalRoi / stats.count) * 10) / 10 : 0;
    return acc;
  }, {} as Record<NapType, number>);

  const averageGrogginessByType = napTypes.reduce((acc, type) => {
    const stats = statsByType[type];
    acc[type] = stats.count > 0 ? Math.round((stats.totalGrogginess / stats.count) * 10) / 10 : 0;
    return acc;
  }, {} as Record<NapType, number>);

  const sessionsByType = napTypes.reduce((acc, type) => {
    acc[type] = statsByType[type].count;
    return acc;
  }, {} as Record<NapType, number>);

  // Find best nap type (highest average ROI, lowest grogginess as tiebreaker)
  let bestNapType: NapType | null = null;
  let bestRoi = -Infinity;
  let bestGrogginess = Infinity;

  napTypes.forEach(type => {
    const roi = averageRoiByType[type];
    const grogginess = averageGrogginessByType[type];
    const count = sessionsByType[type];

    if (count > 0) {
      if (roi > bestRoi || (roi === bestRoi && grogginess < bestGrogginess)) {
        bestRoi = roi;
        bestGrogginess = grogginess;
        bestNapType = type;
      }
    }
  });

  return {
    totalSessions,
    totalMinutesRecovered,
    averageRoiByType,
    averageGrogginessByType,
    bestNapType,
    sessionsByType,
  };
};

/**
 * Get sessions from last N days
 */
export const getSessionsFromLastDays = (sessions: NapSession[], days: number): NapSession[] => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  cutoffDate.setHours(0, 0, 0, 0);

  return sessions.filter(session => {
    const sessionDate = new Date(session.createdAt);
    return sessionDate >= cutoffDate;
  });
};

/**
 * Get today's sessions
 */
export const getTodaySessions = (sessions: NapSession[]): NapSession[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return sessions.filter(session => {
    const sessionDate = new Date(session.createdAt);
    return sessionDate >= today && sessionDate < tomorrow;
  });
};

/**
 * Calculate moving average for ROI scores
 */
export const calculateMovingAverage = (scores: number[], windowSize: number): number[] => {
  const result: number[] = [];
  
  for (let i = 0; i < scores.length; i++) {
    const start = Math.max(0, i - windowSize + 1);
    const window = scores.slice(start, i + 1);
    const average = window.reduce((sum, score) => sum + score, 0) / window.length;
    result.push(Math.round(average * 10) / 10);
  }
  
  return result;
};
