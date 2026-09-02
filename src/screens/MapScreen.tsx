import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import MapView, { Callout, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';
import { Severity } from '../types';
import { severityColor } from '../utils/report';

const defaultRegion = {
  latitude: -6.2159,
  longitude: 106.6420,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export function MapScreen({ navigation }: any) {
  const { theme, reports } = useApp();
  const [filter, setFilter] = useState<Severity | 'Semua'>('Semua');

  const visible = useMemo(
    () => filter === 'Semua' ? reports : reports.filter(r => r.severity === filter),
    [reports, filter]
  );

  const filters: Array<Severity | 'Semua'> = ['Semua', 'Kritis', 'Tinggi', 'Sedang', 'Rendah'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10 }}>
        <Text style={{ color: theme.colors.text, fontSize: 25, fontWeight: '900' }}>
          Peta Bahaya
        </Text>
        <Text style={{ color: theme.colors.textMuted, marginTop: 3 }}>
          {visible.length} titik ditampilkan
        </Text>

        <View style={{ flexDirection: 'row', gap: 7, marginTop: 12, flexWrap: 'wrap' }}>
          {filters.map(item => {
            const active = item === filter;
            return (
              <Pressable
                key={item}
                onPress={() => setFilter(item)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: active ? theme.colors.primary : theme.colors.surface,
                  borderWidth: 1,
                  borderColor: active ? theme.colors.primary : theme.colors.border,
                }}
              >
                <Text style={{ color: active ? '#fff' : theme.colors.text, fontWeight: '700', fontSize: 12 }}>
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View
        style={{
          flex: 1,
          margin: 14,
          marginTop: 2,
          overflow: 'hidden',
          borderRadius: theme.radius.lg,
          borderWidth: 1,
          borderColor: theme.colors.border,
        }}
      >
        <MapView style={{ flex: 1 }} initialRegion={defaultRegion}>
          {visible.map(report => (
            <Marker
              key={report.id}
              coordinate={{ latitude: report.latitude, longitude: report.longitude }}
              pinColor={severityColor(report.severity, theme)}
            >
              <Callout onPress={() => navigation.navigate('ReportDetail', { reportId: report.id })}>
                <View style={{ width: 220 }}>
                  <Text style={{ fontWeight: '900', fontSize: 15 }}>{report.title}</Text>
                  <Text style={{ marginTop: 4 }}>{report.category} • {report.severity}</Text>
                  <Text style={{ marginTop: 5, opacity: 0.7 }}>{report.address}</Text>
                  <Text style={{ marginTop: 8, fontWeight: '800' }}>Buka detail →</Text>
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>

        <Pressable
          onPress={() => navigation.navigate('CreateReport')}
          style={{
            position: 'absolute',
            right: 16,
            bottom: 16,
            width: 58,
            height: 58,
            borderRadius: 29,
            backgroundColor: theme.colors.primary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="add" size={31} color="#fff" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
