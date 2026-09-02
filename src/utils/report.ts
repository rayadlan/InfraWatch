import { AppTheme } from '../theme/themes';
import { HazardCategory, ReportStatus, Severity } from '../types';

export const categories: HazardCategory[] = [
  'Jalan', 'Jembatan', 'Listrik', 'Kebakaran',
  'Drainase', 'Pohon', 'Bangunan', 'Lainnya'
];

export const severities: Severity[] = ['Rendah', 'Sedang', 'Tinggi', 'Kritis'];

export const statusSteps: ReportStatus[] = [
  'Dilaporkan', 'Diverifikasi', 'Diproses', 'Selesai'
];

export function severityColor(severity: Severity, theme: AppTheme) {
  if (severity === 'Kritis') return theme.colors.danger;
  if (severity === 'Tinggi') return theme.colors.warning;
  if (severity === 'Sedang') return theme.colors.info;
  return theme.colors.success;
}

export function statusColor(status: ReportStatus, theme: AppTheme) {
  if (status === 'Selesai') return theme.colors.success;
  if (status === 'Diproses') return theme.colors.info;
  if (status === 'Diverifikasi') return theme.colors.warning;
  return theme.colors.textMuted;
}

export function relativeTime(iso: string) {
  const diff = Math.max(0, Date.now() - new Date(iso).getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari lalu`;
}
