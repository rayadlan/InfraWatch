import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { mockReports } from '../data/mockReports';
import {
  createFirebaseReport,
  firebaseEnabled,
  getFirebaseConfirmedReportIds,
  subscribeFirebaseReports,
  updateFirebaseStatus,
  voteFirebaseReport
} from '../services/firebase';
import { themes } from '../theme/themes';
import { AppUser, NewReportInput, Report, ReportStatus, ThemeKey } from '../types';

interface AppContextValue {
  reports: Report[];
  user: AppUser;
  theme: typeof themes.civic;
  themeKey: ThemeKey;
  setThemeKey: (key: ThemeKey) => void;
  createReport: (input: NewReportInput) => Promise<string>;
  voteReport: (id: string) => Promise<boolean>;
  hasConfirmedReport: (id: string) => boolean;
  updateStatus: (id: string, status: ReportStatus) => Promise<void>;
  getReport: (id: string) => Report | undefined;
  firebaseEnabled: boolean;
  loading: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

const STORAGE_REPORTS = '@infrawatch/reports';
const STORAGE_THEME = '@infrawatch/theme';
const STORAGE_CONFIRMATIONS = '@infrawatch/confirmations/demo-user';

const demoUser: AppUser = {
  id: 'demo-user',
  name: 'Rayi',
  points: 240,
  reportsCount: 2,
  verifiedCount: 14,
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [confirmedReportIds, setConfirmedReportIds] = useState<string[]>([]);
  const [themeKey, setThemeState] = useState<ThemeKey>('civic');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe = () => {};

    (async () => {
      const savedTheme = await AsyncStorage.getItem(STORAGE_THEME);
      if (savedTheme && savedTheme in themes) {
        setThemeState(savedTheme as ThemeKey);
      }

      if (firebaseEnabled) {
        // Ambil histori konfirmasi milik UID Firebase saat ini.
        try {
          const confirmed = await getFirebaseConfirmedReportIds();
          setConfirmedReportIds(confirmed);
        } catch {
          setConfirmedReportIds([]);
        }

        unsubscribe = subscribeFirebaseReports(
          items => {
            setReports(items);
            setLoading(false);
          },
          async () => {
            const local = await AsyncStorage.getItem(STORAGE_REPORTS);
            if (local) setReports(JSON.parse(local));
            setLoading(false);
          }
        );
      } else {
        const [localReports, localConfirmations] = await Promise.all([
          AsyncStorage.getItem(STORAGE_REPORTS),
          AsyncStorage.getItem(STORAGE_CONFIRMATIONS),
        ]);

        if (localReports) setReports(JSON.parse(localReports));
        if (localConfirmations) setConfirmedReportIds(JSON.parse(localConfirmations));
        setLoading(false);
      }
    })();

    return () => unsubscribe();
  }, []);

  const persistLocal = async (next: Report[]) => {
    setReports(next);
    await AsyncStorage.setItem(STORAGE_REPORTS, JSON.stringify(next));
  };

  const persistLocalConfirmations = async (next: string[]) => {
    setConfirmedReportIds(next);
    await AsyncStorage.setItem(STORAGE_CONFIRMATIONS, JSON.stringify(next));
  };

  const setThemeKey = (key: ThemeKey) => {
    setThemeState(key);
    AsyncStorage.setItem(STORAGE_THEME, key).catch(() => {});
  };

  const createReport = async (input: NewReportInput) => {
    if (firebaseEnabled) {
      return createFirebaseReport(input, demoUser.name);
    }

    const id = `RPT-${Date.now()}`;
    const now = new Date().toISOString();
    const report: Report = {
      id,
      ...input,
      votes: 0,
      status: 'Dilaporkan',
      reporterId: demoUser.id,
      reporterName: demoUser.name,
      createdAt: now,
      updatedAt: now,
    };
    await persistLocal([report, ...reports]);
    return id;
  };

  const voteReport = async (id: string): Promise<boolean> => {
    // Guard di context: UI mana pun yang memanggil fungsi ini tetap aman.
    if (confirmedReportIds.includes(id)) {
      return false;
    }

    if (firebaseEnabled) {
      const added = await voteFirebaseReport(id);

      // Walaupun server mengatakan sudah pernah vote (misalnya user menekan
      // dari perangkat lain), update state lokal agar tombol langsung terkunci.
      if (!confirmedReportIds.includes(id)) {
        setConfirmedReportIds(current => current.includes(id) ? current : [...current, id]);
      }

      return added;
    }

    // Mode demo: simpan histori konfirmasi secara persistent di AsyncStorage.
    const storedRaw = await AsyncStorage.getItem(STORAGE_CONFIRMATIONS);
    const stored: string[] = storedRaw ? JSON.parse(storedRaw) : [];

    if (stored.includes(id)) {
      setConfirmedReportIds(current => current.includes(id) ? current : [...current, id]);
      return false;
    }

    const nextConfirmations = [...stored, id];
    const nextReports = reports.map(r =>
      r.id === id ? { ...r, votes: r.votes + 1, updatedAt: new Date().toISOString() } : r
    );

    // Simpan kedua perubahan sebelum menganggap vote berhasil.
    await Promise.all([
      persistLocal(nextReports),
      persistLocalConfirmations(nextConfirmations),
    ]);

    return true;
  };

  const updateStatus = async (id: string, status: ReportStatus) => {
    if (firebaseEnabled) {
      await updateFirebaseStatus(id, status);
      return;
    }
    const next = reports.map(r =>
      r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
    );
    await persistLocal(next);
  };

  const value = useMemo<AppContextValue>(() => ({
    reports,
    user: demoUser,
    theme: themes[themeKey],
    themeKey,
    setThemeKey,
    createReport,
    voteReport,
    hasConfirmedReport: id => confirmedReportIds.includes(id),
    updateStatus,
    getReport: id => reports.find(r => r.id === id),
    firebaseEnabled,
    loading,
  }), [reports, confirmedReportIds, themeKey, loading]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp harus digunakan di dalam AppProvider');
  return value;
}
