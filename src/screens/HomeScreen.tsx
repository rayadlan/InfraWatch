import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReportCard } from '../components/ReportCard';
import { useApp } from '../context/AppContext';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

export function HomeScreen({ navigation }: Props) {
  const { theme, reports, loading, firebaseEnabled } = useApp();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reports;
    return reports.filter(r =>
      [r.title, r.description, r.category, r.address, r.status]
        .join(' ')
        .toLowerCase()
        .includes(q)
    );
  }, [reports, search]);

  const criticalCount = reports.filter(r => r.severity === 'Kritis' && r.status !== 'Selesai').length;
  const activeCount = reports.filter(r => r.status !== 'Selesai').length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 18, paddingBottom: 110 }}
        renderItem={({ item }) => (
          <ReportCard
            report={item}
            onPress={() => navigation.navigate('ReportDetail', { reportId: item.id })}
          />
        )}
        ListHeaderComponent={
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ color: theme.colors.textMuted, fontSize: 13 }}>Selamat datang di</Text>
                <Text style={{ color: theme.colors.text, fontSize: 27, fontWeight: '900' }}>
                  InfraWatch
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: firebaseEnabled ? theme.colors.success : theme.colors.warning,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 999,
                }}
              >
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>
                  {firebaseEnabled ? 'LIVE' : 'DEMO'}
                </Text>
              </View>
            </View>

            <Text style={{ color: theme.colors.textMuted, marginTop: 5, lineHeight: 20 }}>
              Lihat bahaya di sekitar, konfirmasi laporan warga, dan bantu mempercepat penanganan.
            </Text>

            <Pressable
              onPress={() => navigation.navigate('CreateReport')}
              style={({ pressed }) => ({
                backgroundColor: theme.colors.primary,
                borderRadius: theme.radius.lg,
                padding: 18,
                marginTop: 20,
                flexDirection: 'row',
                alignItems: 'center',
                opacity: pressed ? 0.88 : 1,
              })}
            >
              <View
                style={{
                  width: 46,
                  height: 46,
                  borderRadius: 23,
                  backgroundColor: 'rgba(255,255,255,.18)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="camera" size={24} color="#fff" />
              </View>
              <View style={{ marginLeft: 14, flex: 1 }}>
                <Text style={{ color: '#fff', fontWeight: '900', fontSize: 17 }}>
                  Laporkan Infrastruktur Berbahaya
                </Text>
                <Text style={{ color: 'rgba(255,255,255,.82)', marginTop: 3, fontSize: 12 }}>
                  Foto + lokasi + kategori dalam satu alur
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color="#fff" />
            </Pressable>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                  borderRadius: theme.radius.md,
                  padding: 14,
                }}
              >
                <Text style={{ color: theme.colors.danger, fontSize: 24, fontWeight: '900' }}>
                  {criticalCount}
                </Text>
                <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>Bahaya kritis</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                  borderRadius: theme.radius.md,
                  padding: 14,
                }}
              >
                <Text style={{ color: theme.colors.primary, fontSize: 24, fontWeight: '900' }}>
                  {activeCount}
                </Text>
                <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>Laporan aktif</Text>
              </View>
              <View
                style={{
                  flex: 1,
                  backgroundColor: theme.colors.surface,
                  borderColor: theme.colors.border,
                  borderWidth: 1,
                  borderRadius: theme.radius.md,
                  padding: 14,
                }}
              >
                <Text style={{ color: theme.colors.success, fontSize: 24, fontWeight: '900' }}>
                  {reports.filter(r => r.status === 'Selesai').length}
                </Text>
                <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>Selesai</Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.colors.surface,
                borderWidth: 1,
                borderColor: theme.colors.border,
                borderRadius: theme.radius.md,
                marginTop: 20,
                paddingHorizontal: 14,
              }}
            >
              <Ionicons name="search" size={19} color={theme.colors.textMuted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Cari jalan, listrik, lokasi..."
                placeholderTextColor={theme.colors.textMuted}
                style={{
                  color: theme.colors.text,
                  paddingVertical: 13,
                  marginLeft: 8,
                  flex: 1,
                }}
              />
            </View>

            <View style={{ marginTop: 20, marginBottom: 12 }}>
              <Text style={{ color: theme.colors.text, fontSize: 19, fontWeight: '900' }}>
                Laporan terbaru
              </Text>
              <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 3 }}>
                {loading ? 'Memuat data...' : `${filtered.length} laporan ditemukan`}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={{ paddingVertical: 50, alignItems: 'center' }}>
            <Ionicons name="search-outline" size={42} color={theme.colors.textMuted} />
            <Text style={{ color: theme.colors.textMuted, marginTop: 10 }}>Laporan tidak ditemukan.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
