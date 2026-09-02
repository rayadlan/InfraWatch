import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Badge } from '../components/Badge';
import { useApp } from '../context/AppContext';
import { statusSteps, severityColor, statusColor } from '../utils/report';

export function ReportDetailScreen({ route }: any) {
  const { theme, getReport, voteReport, hasConfirmedReport, updateStatus } = useApp();
  const [confirming, setConfirming] = useState(false);
  const report = getReport(route.params.reportId);

  if (!report) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <Text style={{ color: theme.colors.text }}>Laporan tidak ditemukan.</Text>
      </View>
    );
  }

  const reportId = report.id;
  const reportStatus = report.status;
  const currentIndex = statusSteps.indexOf(reportStatus);
  const nextStatus = statusSteps[Math.min(currentIndex + 1, statusSteps.length - 1)];
  const alreadyConfirmed = hasConfirmedReport(reportId);

  async function confirmVote() {
    // Guard UI untuk mencegah double tap sebelum request pertama selesai.
    if (alreadyConfirmed || confirming) return;

    try {
      setConfirming(true);
      const added = await voteReport(reportId);

      if (added) {
        Alert.alert('Terima kasih', 'Konfirmasi kamu berhasil ditambahkan. Setiap user hanya dapat mengonfirmasi satu kali.');
      } else {
        Alert.alert('Sudah dikonfirmasi', 'Kamu sudah pernah mengonfirmasi laporan ini.');
      }
    } catch (error: any) {
      Alert.alert('Konfirmasi gagal', error?.message ?? 'Terjadi kesalahan saat mengirim konfirmasi.');
    } finally {
      setConfirming(false);
    }
  }

  async function simulateStatus() {
    if (reportStatus === 'Selesai') return;
    await updateStatus(reportId, nextStatus);
    Alert.alert('Mode demo', `Status diubah menjadi "${nextStatus}".`);
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }} contentContainerStyle={{ paddingBottom: 50 }}>
      {report.imageUri ? (
        <Image source={{ uri: report.imageUri }} style={{ width: '100%', height: 280 }} />
      ) : (
        <View style={{ height: 180, backgroundColor: theme.colors.surface2, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="image-outline" size={45} color={theme.colors.textMuted} />
          <Text style={{ color: theme.colors.textMuted, marginTop: 8 }}>Foto tidak tersedia</Text>
        </View>
      )}

      <View style={{ padding: 18 }}>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Badge label={report.category} color={theme.colors.primary} />
          <Badge label={report.severity} color={severityColor(report.severity, theme)} />
          <Badge label={report.status} color={statusColor(report.status, theme)} />
        </View>

        <Text style={{ color: theme.colors.text, fontSize: 25, fontWeight: '900', marginTop: 14 }}>
          {report.title}
        </Text>
        <Text style={{ color: theme.colors.textMuted, lineHeight: 22, marginTop: 8 }}>
          {report.description}
        </Text>

        <View
          style={{
            marginTop: 18,
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.lg,
            padding: 16,
          }}
        >
          <Text style={{ color: theme.colors.text, fontWeight: '900', marginBottom: 12 }}>
            Progres penanganan
          </Text>
          {statusSteps.map((step, index) => {
            const done = index <= currentIndex;
            return (
              <View key={step} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                <Ionicons
                  name={done ? 'checkmark-circle' : 'ellipse-outline'}
                  size={21}
                  color={done ? theme.colors.success : theme.colors.textMuted}
                />
                <Text
                  style={{
                    color: done ? theme.colors.text : theme.colors.textMuted,
                    fontWeight: done ? '800' : '500',
                    marginLeft: 9,
                  }}
                >
                  {step}
                </Text>
              </View>
            );
          })}
        </View>

        <View
          style={{
            height: 200,
            overflow: 'hidden',
            borderRadius: theme.radius.lg,
            marginTop: 16,
            borderWidth: 1,
            borderColor: theme.colors.border,
          }}
        >
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude: report.latitude,
              longitude: report.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false}
            zoomEnabled={false}
          >
            <Marker coordinate={{ latitude: report.latitude, longitude: report.longitude }} />
          </MapView>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12 }}>
          <Ionicons name="location" size={18} color={theme.colors.primary} />
          <Text style={{ color: theme.colors.textMuted, marginLeft: 6, flex: 1 }}>{report.address}</Text>
        </View>

        <View
          style={{
            marginTop: 18,
            padding: 16,
            backgroundColor: theme.colors.primarySoft,
            borderRadius: theme.radius.lg,
          }}
        >
          <Text style={{ color: theme.colors.primary, fontWeight: '900' }}>
            {report.votes} warga telah mengonfirmasi
          </Text>
          <Text style={{ color: theme.colors.textMuted, marginTop: 4, lineHeight: 20 }}>
            {alreadyConfirmed
              ? 'Kamu sudah mengonfirmasi laporan ini. Konfirmasi hanya dapat dilakukan satu kali per user.'
              : 'Konfirmasi membantu meningkatkan kepercayaan dan prioritas laporan.'}
          </Text>

          <Pressable
            onPress={confirmVote}
            disabled={alreadyConfirmed || confirming}
            accessibilityRole="button"
            accessibilityState={{ disabled: alreadyConfirmed || confirming }}
            style={({ pressed }) => ({
              backgroundColor: alreadyConfirmed ? theme.colors.success : theme.colors.primary,
              padding: 13,
              borderRadius: theme.radius.md,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 12,
              opacity: confirming ? 0.65 : pressed && !alreadyConfirmed ? 0.85 : 1,
              flexDirection: 'row',
              gap: 8,
            })}
          >
            <Ionicons
              name={alreadyConfirmed ? 'checkmark-circle' : 'eye'}
              size={20}
              color="#fff"
            />
            <Text style={{ color: '#fff', fontWeight: '900' }}>
              {confirming
                ? 'Mengirim Konfirmasi...'
                : alreadyConfirmed
                  ? 'Sudah Dikonfirmasi'
                  : 'Saya Juga Melihat Bahaya Ini'}
            </Text>
          </Pressable>
        </View>

        {report.status !== 'Selesai' && (
          <Pressable
            onPress={simulateStatus}
            style={{
              borderWidth: 1,
              borderColor: theme.colors.border,
              padding: 13,
              borderRadius: theme.radius.md,
              alignItems: 'center',
              marginTop: 12,
              backgroundColor: theme.colors.surface,
            }}
          >
            <Text style={{ color: theme.colors.text, fontWeight: '800' }}>
              Demo Admin: Ubah ke {nextStatus}
            </Text>
          </Pressable>
        )}

        <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 18 }}>
          Dilaporkan oleh {report.reporterName} • ID {report.id}
        </Text>
      </View>
    </ScrollView>
  );
}
