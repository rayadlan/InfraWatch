export type HazardCategory =
  | 'Jalan'
  | 'Jembatan'
  | 'Listrik'
  | 'Kebakaran'
  | 'Drainase'
  | 'Pohon'
  | 'Bangunan'
  | 'Lainnya';

export type Severity = 'Rendah' | 'Sedang' | 'Tinggi' | 'Kritis';
export type ReportStatus = 'Dilaporkan' | 'Diverifikasi' | 'Diproses' | 'Selesai';

export interface Report {
  id: string;
  title: string;
  description: string;
  category: HazardCategory;
  severity: Severity;
  status: ReportStatus;
  latitude: number;
  longitude: number;
  address: string;
  imageUri?: string;
  votes: number;
  reporterId: string;
  reporterName: string;
  createdAt: string;
  updatedAt: string;
}

export interface NewReportInput {
  title: string;
  description: string;
  category: HazardCategory;
  severity: Severity;
  latitude: number;
  longitude: number;
  address: string;
  imageUri?: string;
}

export interface AppUser {
  id: string;
  name: string;
  points: number;
  reportsCount: number;
  verifiedCount: number;
}

export type ThemeKey = 'civic' | 'emergency' | 'eco';
