import { create } from 'zustand';
import { NapSession, AppSettings, ToastMessage, NapType } from './types';
import { getSessions, addSession, deleteSession, getSettings, saveSettings } from '../utils/storage';
import { calculateRoiScore } from '../utils/scoring';

interface AppState {
  // Current session state
  currentEnergyBefore: number;
  currentNapType: NapType | null;
  isSessionActive: boolean;
  
  // Data
  sessions: NapSession[];
  settings: AppSettings;
  
  // UI state
  toasts: ToastMessage[];
  
  // Actions
  setCurrentEnergyBefore: (energy: number) => void;
  setCurrentNapType: (type: NapType | null) => void;
  startSession: (type: NapType, energyBefore: number) => void;
  completeSession: (sessionData: Omit<NapSession, 'id' | 'createdAt' | 'roiScore'>) => void;
  deleteSession: (sessionId: string) => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
  addToast: (message: string, type?: ToastMessage['type']) => void;
  removeToast: (toastId: string) => void;
  refreshSessions: () => void;
}

export const useAppStore = create<AppState>()((set, get) => ({
  // Initial state
  currentEnergyBefore: 5,
  currentNapType: null,
  isSessionActive: false,
  sessions: [],
  settings: {
    theme: 'dark',
    coffeeDoseMg: 100,
  },
  toasts: [],

  // Actions
  setCurrentEnergyBefore: (energy: number) => {
    set({ currentEnergyBefore: energy });
  },

  setCurrentNapType: (type: NapType | null) => {
    set({ currentNapType: type });
  },

  startSession: (type: NapType, energyBefore: number) => {
    set({
      currentNapType: type,
      currentEnergyBefore: energyBefore,
      isSessionActive: true,
    });
  },

  completeSession: (sessionData) => {
    const roiScore = calculateRoiScore(
      sessionData.energyBefore,
      sessionData.energyAfter,
      sessionData.focusAfter,
      sessionData.grogginessAfter
    );

    const newSession: NapSession = {
      ...sessionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      roiScore,
    };

    // Add to storage
    addSession(newSession);

    // Update local state
    set((state) => ({
      sessions: [newSession, ...state.sessions],
      isSessionActive: false,
      currentNapType: null,
    }));

    // Show success toast
    get().addToast('Session enregistrée', 'success');
  },

  deleteSession: (sessionId: string) => {
    deleteSession(sessionId);
    set((state) => ({
      sessions: state.sessions.filter(s => s.id !== sessionId),
    }));
    get().addToast('Session supprimée', 'info');
  },

  updateSettings: (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...get().settings, ...newSettings };
    saveSettings(updatedSettings);
    set({ settings: updatedSettings });
  },

  addToast: (message: string, type: ToastMessage['type'] = 'info') => {
    const toast: ToastMessage = {
      id: Date.now().toString(),
      message,
      type,
      duration: 3000,
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-remove after duration
    setTimeout(() => {
      get().removeToast(toast.id);
    }, toast.duration);
  },

  removeToast: (toastId: string) => {
    set((state) => ({
      toasts: state.toasts.filter(t => t.id !== toastId),
    }));
  },

  refreshSessions: () => {
    const sessions = getSessions();
    set({ sessions });
  },
}));

// Initialize store with data from localStorage
export const initializeStore = () => {
  const sessions = getSessions();
  const settings = getSettings();
  useAppStore.setState({
    sessions,
    settings,
  });
};
