import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  Auth,
  getAuth,
  // @ts-expect-error Firebase's package-level types omit this React Native export.
  getReactNativePersistence,
  initializeAuth,
  signInAnonymously
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { NewReportInput, Report } from '../types';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

export const firebaseEnabled = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

const app = firebaseEnabled
  ? (getApps().length ? getApp() : initializeApp(firebaseConfig))
  : null;

// React Native membutuhkan persistence eksplisit agar UID anonymous tetap sama
// setelah aplikasi ditutup/dibuka kembali. Dengan UID yang stabil, pembatasan
// "1 user = 1 konfirmasi per laporan" tetap konsisten.
let authInstance: Auth | null = null;
if (app) {
  try {
    authInstance = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    // Jika Auth sudah pernah diinisialisasi (mis. Fast Refresh), gunakan instance yang ada.
    authInstance = getAuth(app);
  }
}

export const auth = authInstance;
export const db = app ? getFirestore(app) : null;
export const storage = app ? getStorage(app) : null;

export async function ensureAnonymousAuth() {
  if (!auth) return null;
  if (auth.currentUser) return auth.currentUser;
  const result = await signInAnonymously(auth);
  return result.user;
}

async function uploadReportImage(uri: string, reportId: string) {
  if (!storage) return uri;

  const response = await fetch(uri);
  const blob = await response.blob();
  const imageRef = ref(storage, `reports/${reportId}/${Date.now()}.jpg`);
  await uploadBytes(imageRef, blob, { contentType: 'image/jpeg' });
  return getDownloadURL(imageRef);
}

export async function createFirebaseReport(
  input: NewReportInput,
  reporterName: string
) {
  if (!db) throw new Error('Firebase belum dikonfigurasi.');

  const user = await ensureAnonymousAuth();
  if (!user) throw new Error('Gagal membuat sesi pengguna.');

  const docRef = await addDoc(collection(db, 'reports'), {
    ...input,
    imageUri: '',
    votes: 0,
    reporterId: user.uid,
    reporterName,
    status: 'Dilaporkan',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  let imageUri = '';
  if (input.imageUri) {
    imageUri = await uploadReportImage(input.imageUri, docRef.id);
    await updateDoc(docRef, { imageUri });
  }

  return docRef.id;
}

export function subscribeFirebaseReports(
  callback: (items: Report[]) => void,
  onError: (error: Error) => void
) {
  if (!db) return () => {};

  const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
  return onSnapshot(
    q,
    snapshot => {
      const reports = snapshot.docs.map(snap => {
        const data = snap.data() as any;
        return {
          id: snap.id,
          ...data,
          createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate?.()?.toISOString?.() ?? new Date().toISOString(),
        } as Report;
      });
      callback(reports);
    },
    err => onError(err)
  );
}

/**
 * Mengambil daftar reportId yang sudah dikonfirmasi user yang sedang login.
 * Struktur Firestore:
 * users/{uid}/confirmations/{reportId}
 */
export async function getFirebaseConfirmedReportIds(): Promise<string[]> {
  if (!db) return [];

  const user = await ensureAnonymousAuth();
  if (!user) return [];

  const snapshot = await getDocs(collection(db, 'users', user.uid, 'confirmations'));
  return snapshot.docs.map(item => item.id);
}

/**
 * Menambahkan konfirmasi secara ATOMIC dan IDEMPOTENT.
 *
 * Return:
 * - true  -> konfirmasi baru berhasil dibuat dan votes bertambah 1
 * - false -> user sudah pernah mengonfirmasi laporan ini, votes tidak berubah
 *
 * Transaction mencegah double tap / request paralel menghasilkan vote ganda.
 */
export async function voteFirebaseReport(reportId: string): Promise<boolean> {
  if (!db) throw new Error('Firebase belum dikonfigurasi.');

  const user = await ensureAnonymousAuth();
  if (!user) throw new Error('Gagal mendapatkan user aktif.');

  const reportRef = doc(db, 'reports', reportId);
  const confirmationRef = doc(db, 'users', user.uid, 'confirmations', reportId);

  return runTransaction(db, async transaction => {
    const confirmationSnapshot = await transaction.get(confirmationRef);

    if (confirmationSnapshot.exists()) {
      return false;
    }

    const reportSnapshot = await transaction.get(reportRef);
    if (!reportSnapshot.exists()) {
      throw new Error('Laporan tidak ditemukan.');
    }

    const currentVotes = Number(reportSnapshot.data().votes ?? 0);

    transaction.set(confirmationRef, {
      reportId,
      userId: user.uid,
      confirmedAt: serverTimestamp(),
    });

    transaction.update(reportRef, {
      votes: currentVotes + 1,
      updatedAt: serverTimestamp(),
    });

    return true;
  });
}

export async function updateFirebaseStatus(
  reportId: string,
  status: Report['status']
) {
  if (!db) return;
  await updateDoc(doc(db, 'reports', reportId), {
    status,
    updatedAt: serverTimestamp(),
  });
}
