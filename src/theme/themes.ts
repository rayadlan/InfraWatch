import { ThemeKey } from '../types';

export interface AppTheme {
  key: ThemeKey;
  label: string;
  description: string;
  isDark: boolean;
  colors: {
    primary: string;
    primarySoft: string;
    secondary: string;
    background: string;
    surface: string;
    surface2: string;
    text: string;
    textMuted: string;
    border: string;
    danger: string;
    warning: string;
    success: string;
    info: string;
    white: string;
    black: string;
  };
  radius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

export const themes: Record<ThemeKey, AppTheme> = {
  civic: {
    key: 'civic',
    label: 'Civic Blue',
    description: 'Profesional, bersih, cocok untuk layanan publik.',
    isDark: false,
    colors: {
      primary: '#1667E8',
      primarySoft: '#EAF2FF',
      secondary: '#1E3A5F',
      background: '#F5F7FB',
      surface: '#FFFFFF',
      surface2: '#EDF2F8',
      text: '#172033',
      textMuted: '#667085',
      border: '#E4E7EC',
      danger: '#D92D20',
      warning: '#F79009',
      success: '#039855',
      info: '#2E90FA',
      white: '#FFFFFF',
      black: '#101828'
    },
    radius: { sm: 10, md: 16, lg: 22, xl: 30 }
  },
  emergency: {
    key: 'emergency',
    label: 'Emergency Dark',
    description: 'Kontras tinggi, terasa seperti command center keselamatan.',
    isDark: true,
    colors: {
      primary: '#FF5A52',
      primarySoft: '#3A1F22',
      secondary: '#F5B942',
      background: '#111315',
      surface: '#1A1D21',
      surface2: '#24282D',
      text: '#F7F8FA',
      textMuted: '#AAB2BD',
      border: '#343A40',
      danger: '#FF5A52',
      warning: '#F5B942',
      success: '#4DD599',
      info: '#60A5FA',
      white: '#FFFFFF',
      black: '#0B0D0F'
    },
    radius: { sm: 8, md: 12, lg: 16, xl: 22 }
  },
  eco: {
    key: 'eco',
    label: 'Safe Green',
    description: 'Lebih ramah dan community-oriented.',
    isDark: false,
    colors: {
      primary: '#087F5B',
      primarySoft: '#E6F7F0',
      secondary: '#2B5B4B',
      background: '#F5FAF7',
      surface: '#FFFFFF',
      surface2: '#EBF4EF',
      text: '#16352A',
      textMuted: '#66756F',
      border: '#D9E7E0',
      danger: '#C92A2A',
      warning: '#E67700',
      success: '#2B8A3E',
      info: '#1971C2',
      white: '#FFFFFF',
      black: '#102A20'
    },
    radius: { sm: 14, md: 20, lg: 28, xl: 36 }
  }
};
