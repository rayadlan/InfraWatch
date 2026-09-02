# InfraWatch — React Native / Expo

Prototype aplikasi crowdsourcing pelaporan infrastruktur berbahaya atau rusak.

## Fitur

- Beranda dan daftar laporan
- Search laporan
- Buat laporan baru
- Ambil foto kamera / pilih galeri
- GPS dan reverse geocoding
- Kategori bahaya
- Severity: Rendah / Sedang / Tinggi / Kritis
- Peta semua laporan + marker
- Filter peta berdasarkan severity
- Crowd verification / voting
- Status: Dilaporkan → Diverifikasi → Diproses → Selesai
- Laporan Saya
- Profil dan gamifikasi sederhana
- Firebase optional
- Mode demo lokal menggunakan AsyncStorage
- 3 opsi tampilan: Civic Blue, Emergency Dark, Safe Green

## Kenapa Expo SDK 54?

Project starter sengaja memakai SDK 54 agar paling mudah dites melalui Expo Go pada perangkat fisik
di masa transisi SDK 57. Setelah workflow stabil, project dapat di-upgrade menggunakan panduan Expo.

## Persiapan Windows

1. Install Node.js 20.19+.
2. Install VS Code.
3. Install Expo Go di Android/iPhone.
4. Extract project.
5. Buka terminal di folder project.

## Install

```bash
npm install
npx expo install --fix
```

Perintah `expo install --fix` penting karena Expo akan menyesuaikan versi package native dengan SDK.

## Jalankan

```bash
npx expo start
```

Scan QR menggunakan Expo Go. Jika jaringan kampus/Wi-Fi memblokir koneksi lokal:

```bash
npx expo start --tunnel
```

## Mode Demo

Tanpa Firebase, aplikasi langsung bekerja memakai mock data + AsyncStorage.

Kamu dapat:
- membuat laporan,
- mengambil foto,
- mengambil lokasi,
- voting,
- mengubah status dengan tombol demo admin,
- mengganti tema UI.

## Mengaktifkan Firebase

1. Buat Firebase Project.
2. Aktifkan Authentication > Anonymous.
3. Buat Cloud Firestore.
4. Buat Cloud Storage.
5. Register Web App di Firebase Project.
6. Copy `.env.example` menjadi `.env`.
7. Isi variabel Firebase:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=...
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
```

8. Restart Expo:

```bash
npx expo start -c
```

9. Deploy rules bila Firebase CLI sudah dipasang:

```bash
firebase deploy --only firestore:rules,storage
```

> Catatan: Cloud Storage Firebase pada project baru dapat membutuhkan billing Blaze.
> Untuk prototype gratis, kamu bisa tetap memakai mode lokal atau mengganti storage dengan provider lain.

## Struktur

```text
InfraWatch_ReactNative/
├─ App.tsx
├─ app.json
├─ package.json
├─ firestore.rules
├─ storage.rules
└─ src/
   ├─ components/
   │  ├─ Badge.tsx
   │  ├─ ReportCard.tsx
   │  └─ ThemeSwitcher.tsx
   ├─ context/
   │  └─ AppContext.tsx
   ├─ data/
   │  └─ mockReports.ts
   ├─ navigation/
   │  └─ AppNavigator.tsx
   ├─ screens/
   │  ├─ HomeScreen.tsx
   │  ├─ MapScreen.tsx
   │  ├─ CreateReportScreen.tsx
   │  ├─ ReportDetailScreen.tsx
   │  ├─ MyReportsScreen.tsx
   │  └─ ProfileScreen.tsx
   ├─ services/
   │  └─ firebase.ts
   ├─ theme/
   │  └─ themes.ts
   ├─ types/
   │  └─ index.ts
   └─ utils/
      └─ report.ts
```

## Opsi UI

### 1. Civic Blue
Gaya layanan publik modern. Rapi, netral, profesional. Cocok sebagai default untuk portfolio Apple Developer Academy.

### 2. Emergency Dark
Dark-mode command center dengan aksen merah. Cocok bila ingin menonjolkan aspek emergency response dan safety.

### 3. Safe Green
Lebih friendly dan community-oriented. Cocok bila positioning aplikasi menekankan gotong royong warga.

Semua tema berada di:

```text
src/theme/themes.ts
```

Jadi warna, radius, surface, dan karakter UI dapat dimodifikasi tanpa mengubah setiap screen.

## Langkah pengembangan berikutnya

Untuk production/portfolio lebih kuat:
- login Google/Apple/email,
- deduplikasi laporan berdasarkan radius + image similarity,
- AI category suggestion,
- push notification,
- dashboard khusus pemerintah,
- role admin/agency,
- audit trail status,
- komentar,
- attachment video,
- heatmap,
- nearby hazard alert,
- deep link,
- offline queue,
- moderation,
- privacy blur untuk wajah/plat kendaraan.

## Proteksi konfirmasi satu kali per user

Fitur crowd verification sudah dibuat **idempotent**:

- satu user hanya dapat mengonfirmasi satu laporan satu kali,
- tombol langsung terkunci selama request berlangsung untuk mencegah double tap,
- setelah berhasil, tombol berubah menjadi `Sudah Dikonfirmasi`,
- mode demo menyimpan histori konfirmasi di AsyncStorage,
- mode Firebase menyimpan histori di `users/{uid}/confirmations/{reportId}`,
- penambahan confirmation document + kenaikan counter `votes` dilakukan dalam satu Firestore Transaction,
- anonymous Firebase Auth memakai AsyncStorage persistence agar UID tidak berubah setiap aplikasi dibuka ulang.

Dengan struktur document ID = `reportId`, percobaan konfirmasi kedua dari UID yang sama akan menemukan dokumen yang sama dan tidak menambah counter lagi.

## Catatan keamanan

Prototype saat ini mengizinkan user terautentikasi meng-update dokumen laporan untuk memudahkan demo.
Pada production, voting dan perubahan status harus dipindahkan ke server/Cloud Functions dengan role/claim
yang sesuai supaya field laporan tidak dapat dimanipulasi client.
