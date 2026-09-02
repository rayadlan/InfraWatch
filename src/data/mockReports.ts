import { Report } from '../types';

export const mockReports: Report[] = [
  {
    id: 'RPT-001',
    title: 'Kabel listrik menjuntai rendah',
    description: 'Kabel terlihat turun dekat trotoar dan berpotensi tersentuh pengendara.',
    category: 'Listrik',
    severity: 'Kritis',
    status: 'Diverifikasi',
    latitude: -6.2236,
    longitude: 106.6498,
    address: 'Alam Sutera, Tangerang',
    votes: 18,
    reporterId: 'demo-user',
    reporterName: 'Rayi',
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 'RPT-002',
    title: 'Jalan berlubang cukup dalam',
    description: 'Lubang berada di jalur kiri dan berbahaya untuk pengendara motor saat malam.',
    category: 'Jalan',
    severity: 'Tinggi',
    status: 'Diproses',
    latitude: -6.2147,
    longitude: 106.6371,
    address: 'Pinang, Tangerang',
    votes: 31,
    reporterId: 'user-2',
    reporterName: 'Warga Tangerang',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 50).toISOString()
  },
  {
    id: 'RPT-003',
    title: 'Drainase tersumbat',
    description: 'Air meluap setelah hujan dan menutupi sebagian jalan.',
    category: 'Drainase',
    severity: 'Sedang',
    status: 'Dilaporkan',
    latitude: -6.2016,
    longitude: 106.6324,
    address: 'Cipondoh, Tangerang',
    votes: 7,
    reporterId: 'user-3',
    reporterName: 'Anonim',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 9).toISOString()
  },
  {
    id: 'RPT-004',
    title: 'Pohon miring ke arah jalan',
    description: 'Akar pohon terlihat terangkat dan posisi batang semakin miring.',
    category: 'Pohon',
    severity: 'Tinggi',
    status: 'Selesai',
    latitude: -6.2322,
    longitude: 106.6128,
    address: 'Karang Tengah, Tangerang',
    votes: 12,
    reporterId: 'demo-user',
    reporterName: 'Rayi',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString()
  }
];
