export interface InvitationData {
  partner1: string;
  partner2: string;
  date: string;
  location: string;
  venueName: string;
  storyPoints: string;
  storyNarrative: string;
  themeColor: string;
  theme: 'cyberpunk' | 'ethereal' | 'minimalist';
  maxGuests: number;
  stats: {
    daysTogether?: number;
    milesTraveled?: number;
    coffeesShared?: number;
  };
  schedule: ScheduleItem[];
}

export interface ScheduleItem {
  time: string;
  event: string;
  description?: string;
  icon?: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export enum AppMode {
  BUILDER = 'BUILDER',
  PREVIEW = 'PREVIEW',
}