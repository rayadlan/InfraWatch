import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useApp } from '../context/AppContext';
import { HazardCategory, Severity } from '../types';
import { categories, severities } from '../utils/report';

export function CreateReportScreen({ navigation }: any) {
  const { theme, createReport } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<HazardCategory>('Jalan');
  const [severity, setSeverity] = useState<Severity>('Sedang');
  const [imageUri, setImageUri] = useState<string | undefined>();
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [address, setAddress] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState(false);

  async function takePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Izin kamera diperlukan', 'Aktifkan izin kamera untuk mengambil bukti foto.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.78,
      allowsEditing: false,
    });

    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  async function choosePhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Izin galeri diperlukan', 'Aktifkan izin galeri untuk memilih bukti foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.78,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  }

  async function getLocation() {
    try {
      setLocating(true);
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Izin lokasi diperlukan', 'Lokasi diperlukan agar pihak terkait mengetahui titik bahaya.');
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLatitude(current.coords.latitude);
      setLongitude(current.coords.longitude);

      const places = await Location.reverseGeocodeAsync({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });

      if (places[0]) {
        const p = places[0];
        const parts = [p.street, p.district, p.city, p.region].filter(Boolean);
        setAddress(parts.join(', '));
      } else {
        setAddress(`${current.coords.latitude.toFixed(6)}, ${current.coords.longitude.toFixed(6)}`);
      }
    } catch {
      Alert.alert('Lokasi gagal', 'Tidak dapat mengambil lokasi. Pastikan GPS aktif.');
    } finally {
      setLocating(false);
    }
  }

  async function submit() {
    if (!title.trim() || !description.trim()) {
      Alert.alert('Data belum lengkap', 'Isi judul dan deskripsi laporan.');
      return;
    }
    if (latitude === null || longitude === null) {
      Alert.alert('Lokasi belum ada', 'Tekan tombol Ambil lokasi saat ini.');
      return;
    }

    try {
      setSubmitting(true);
      const id = await createReport({
        title: title.trim(),
        description: description.trim(),
        category,
        severity,
        latitude,
        longitude,
        address: address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        imageUri,
      });

      navigation.replace('ReportDetail', { reportId: id });
    } catch (error: any) {
      Alert.alert('Gagal mengirim laporan', error?.message ?? 'Terjadi kesalahan.');
    } finally {
      setSubmitting(false);
    }
  }

  const FieldLabel = ({ children }: { children: React.ReactNode }) => (
    <Text style={{ color: theme.colors.text, fontWeight: '800', marginBottom: 8, marginTop: 18 }}>
      {children}
    </Text>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 60 }}>
        <View
          style={{
            backgroundColor: theme.colors.primarySoft,
            borderRadius: theme.radius.lg,
            padding: 16,
            borderWidth: 1,
            borderColor: `${theme.colors.primary}35`,
          }}
        >
          <Text style={{ color: theme.colors.primary, fontWeight: '900', fontSize: 16 }}>
            Buat laporan yang dapat ditindaklanjuti
          </Text>
          <Text style={{ color: theme.colors.textMuted, marginTop: 5, lineHeight: 20 }}>
            Sertakan foto, lokasi akurat, kategori dan tingkat risiko. Hindari mendekati objek yang berbahaya.
          </Text>
        </View>

        <FieldLabel>1. Bukti foto</FieldLabel>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={{ width: '100%', height: 230, borderRadius: theme.radius.lg }}
          />
        ) : (
          <View
            style={{
              height: 180,
              backgroundColor: theme.colors.surface2,
              borderRadius: theme.radius.lg,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: theme.colors.border,
              borderStyle: 'dashed',
            }}
          >
            <Ionicons name="camera-outline" size={42} color={theme.colors.textMuted} />
            <Text style={{ color: theme.colors.textMuted, marginTop: 8 }}>Belum ada foto</Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
          <Pressable
            onPress={takePhoto}
            style={{
              flex: 1,
              padding: 13,
              backgroundColor: theme.colors.primary,
              borderRadius: theme.radius.md,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '800' }}>Ambil Foto</Text>
          </Pressable>
          <Pressable
            onPress={choosePhoto}
            style={{
              flex: 1,
              padding: 13,
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              borderWidth: 1,
              borderRadius: theme.radius.md,
              alignItems: 'center',
            }}
          >
            <Text style={{ color: theme.colors.text, fontWeight: '800' }}>Pilih Galeri</Text>
          </Pressable>
        </View>

        <FieldLabel>2. Judul laporan</FieldLabel>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Contoh: Kabel listrik menjuntai"
          placeholderTextColor={theme.colors.textMuted}
          style={{
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderRadius: theme.radius.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
            paddingHorizontal: 14,
            paddingVertical: 13,
          }}
        />

        <FieldLabel>3. Kategori</FieldLabel>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {categories.map(item => {
            const selected = category === item;
            return (
              <Pressable
                key={item}
                onPress={() => setCategory(item)}
                style={{
                  paddingHorizontal: 13,
                  paddingVertical: 9,
                  borderRadius: 999,
                  backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
                  borderWidth: 1,
                  borderColor: selected ? theme.colors.primary : theme.colors.border,
                }}
              >
                <Text style={{ color: selected ? '#fff' : theme.colors.text, fontWeight: '700' }}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <FieldLabel>4. Tingkat risiko</FieldLabel>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {severities.map(item => {
            const selected = severity === item;
            return (
              <Pressable
                key={item}
                onPress={() => setSeverity(item)}
                style={{
                  paddingHorizontal: 13,
                  paddingVertical: 9,
                  borderRadius: 999,
                  backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
                  borderWidth: 1,
                  borderColor: selected ? theme.colors.primary : theme.colors.border,
                }}
              >
                <Text style={{ color: selected ? '#fff' : theme.colors.text, fontWeight: '700' }}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <FieldLabel>5. Deskripsi</FieldLabel>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          textAlignVertical="top"
          placeholder="Jelaskan kondisi, posisi, dan mengapa berbahaya..."
          placeholderTextColor={theme.colors.textMuted}
          style={{
            minHeight: 120,
            backgroundColor: theme.colors.surface,
            color: theme.colors.text,
            borderRadius: theme.radius.md,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: 14,
          }}
        />

        <FieldLabel>6. Lokasi</FieldLabel>
        <Pressable
          onPress={getLocation}
          disabled={locating}
          style={{
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: latitude ? theme.colors.success : theme.colors.border,
            borderRadius: theme.radius.md,
            padding: 14,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {locating ? (
            <ActivityIndicator color={theme.colors.primary} />
          ) : (
            <Ionicons
              name={latitude ? 'checkmark-circle' : 'locate'}
              size={22}
              color={latitude ? theme.colors.success : theme.colors.primary}
            />
          )}
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={{ color: theme.colors.text, fontWeight: '800' }}>
              {latitude ? 'Lokasi berhasil diambil' : 'Ambil lokasi saat ini'}
            </Text>
            <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 3 }}>
              {address || 'GPS akan digunakan hanya untuk titik laporan.'}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={submit}
          disabled={submitting}
          style={({ pressed }) => ({
            marginTop: 28,
            backgroundColor: theme.colors.primary,
            borderRadius: theme.radius.lg,
            padding: 17,
            alignItems: 'center',
            opacity: submitting || pressed ? 0.75 : 1,
          })}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontWeight: '900', fontSize: 16 }}>
              Kirim Laporan
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
