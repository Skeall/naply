// Types for the Nap Tracker app

export type NapType = "nap10" | "nap15" | "nap20" | "coffee20";

export type SleepLatencyBucket = "<2" | "2-5" | "5-10" | ">10" | "no_sleep";

export interface NapSession {
  id: string;
  createdAt: string; // ISO string
  napType: NapType;
  coffee: boolean;
  coffeeDoseMg?: number; // Optional in V1
  energyBefore: number; // 0-10
  energyAfter: number; // 0-10
  focusAfter: number; // 0-10
  grogginessAfter: number; // 0-10
  sleepLatencyBucket: SleepLatencyBucket;
  contextTags?: string[]; // 0-2 tags max
  audioDurationSec: number;
  audioListenedSec?: number; // Optional in V1
  roiScore: number; // Calculated and stored
}

export interface NapStats {
  totalSessions: number;
  totalMinutesRecovered: number;
  averageRoiByType: Record<NapType, number>;
  averageGrogginessByType: Record<NapType, number>;
  bestNapType: NapType | null;
  sessionsByType: Record<NapType, number>;
}

export interface AppSettings {
  theme: 'dark' | 'light';
  coffeeDoseMg: number; // Default coffee dose in mg
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number; // ms
}

// Audio file paths (constants)
export const AUDIO_PATHS = {
  nap10: '/audio/nap10.mp3',
  nap15: '/audio/nap15.mp3',
  nap20: '/audio/nap20.mp3',
  coffee20: '/audio/nap20.mp3', // Same as nap20
} as const;

// Nap type display info
export const NAP_TYPE_INFO = {
  nap10: { 
    name: 'Reset', 
    description: 'Rapide, pour un coup de boost', 
    duration: 10,
    key: 'nap10' as const
  },
  nap15: { 
    name: 'Recharge', 
    description: 'Équilibre optimal', 
    duration: 15,
    key: 'nap15' as const
  },
  nap20: { 
    name: 'Full', 
    description: 'Cycle complet de sommeil', 
    duration: 20,
    key: 'nap20' as const
  },
  coffee20: { 
    name: 'Coffee', 
    description: 'Café + sieste pour effet maximal', 
    duration: 20,
    key: 'coffee20' as const
  },
} as const;

// Context tags options
export const CONTEXT_TAGS = [
  'Travail',
  'Sport', 
  'Digestion',
  'Fatigue mentale',
] as const;

export type ContextTag = typeof CONTEXT_TAGS[number];
