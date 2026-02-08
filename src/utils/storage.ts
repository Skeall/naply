import { NapSession, AppSettings } from '../app/types';

// Storage keys
const SESSIONS_KEY = 'napTracker.sessions';
const SETTINGS_KEY = 'napTracker.settings';

// Default settings
export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  coffeeDoseMg: 100, // 100mg caffeine default
};

/**
 * Safely get data from localStorage with error handling
 */
export const getFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    return JSON.parse(item);
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return defaultValue;
  }
};

/**
 * Safely set data to localStorage with error handling
 */
export const setToStorage = <T>(key: string, value: T): boolean => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error);
    return false;
  }
};

/**
 * Get all nap sessions from storage
 */
export const getSessions = (): NapSession[] => {
  return getFromStorage<NapSession[]>(SESSIONS_KEY, []);
};

/**
 * Save sessions to storage
 */
export const saveSessions = (sessions: NapSession[]): boolean => {
  return setToStorage(SESSIONS_KEY, sessions);
};

/**
 * Add a new session to storage
 */
export const addSession = (session: NapSession): boolean => {
  const sessions = getSessions();
  sessions.unshift(session); // Add to beginning (most recent first)
  return saveSessions(sessions);
};

/**
 * Delete a session by ID
 */
export const deleteSession = (sessionId: string): boolean => {
  const sessions = getSessions();
  const filteredSessions = sessions.filter(s => s.id !== sessionId);
  return saveSessions(filteredSessions);
};

/**
 * Get app settings from storage
 */
export const getSettings = (): AppSettings => {
  return getFromStorage<AppSettings>(SETTINGS_KEY, DEFAULT_SETTINGS);
};

/**
 * Save app settings to storage
 */
export const saveSettings = (settings: AppSettings): boolean => {
  return setToStorage(SETTINGS_KEY, settings);
};

/**
 * Clear all app data (sessions and settings)
 */
export const clearAllData = (): boolean => {
  try {
    window.localStorage.removeItem(SESSIONS_KEY);
    window.localStorage.removeItem(SETTINGS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing all data:', error);
    return false;
  }
};

/**
 * Export sessions as JSON string
 */
export const exportSessionsAsJSON = (): string => {
  const sessions = getSessions();
  return JSON.stringify(sessions, null, 2);
};

/**
 * Export sessions as CSV string
 */
export const exportSessionsAsCSV = (): string => {
  const sessions = getSessions();
  
  if (sessions.length === 0) {
    return '';
  }

  const headers = [
    'Date',
    'Type',
    'Coffee',
    'Energy Before',
    'Energy After', 
    'Focus After',
    'Grogginess',
    'Sleep Latency',
    'ROI Score',
    'Audio Duration (min)'
  ];

  const rows = sessions.map(session => [
    new Date(session.createdAt).toLocaleDateString('fr-FR'),
    session.napType,
    session.coffee ? 'Yes' : 'No',
    session.energyBefore.toString(),
    session.energyAfter.toString(),
    session.focusAfter.toString(),
    session.grogginessAfter.toString(),
    session.sleepLatencyBucket,
    session.roiScore.toFixed(1),
    (session.audioDurationSec / 60).toFixed(1)
  ]);

  return [headers, ...rows].map(row => row.join(',')).join('\n');
};
