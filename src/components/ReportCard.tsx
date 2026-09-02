import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { Report } from '../types';
import { relativeTime, severityColor, statusColor } from '../utils/report';
import { Badge } from './Badge';

export function ReportCard({
  report,
  onPress,
}: {
  report: Report;
  onPress: () => void;
}) {
  const { theme } = useApp();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: theme.colors.surface,
        borderRadius: theme.radius.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
        marginBottom: 14,
        overflow: 'hidden',
        opacity: pressed ? 0.88 : 1,
      })}
    >
      {report.imageUri ? (
        <Image source={{ uri: report.imageUri }} style={{ width: '100%', height: 170 }} />
      ) : (
        <View
          style={{
            height: 110,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.colors.surface2,
          }}
        >
          <Ionicons name="image-outline" size={34} color={theme.colors.textMuted} />
          <Text style={{ marginTop: 6, color: theme.colors.textMuted, fontSize: 12 }}>
            Foto belum tersedia
          </Text>
        </View>
      )}

      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <Badge label={report.severity} color={severityColor(report.severity, theme)} />
          <Badge label={report.status} color={statusColor(report.status, theme)} />
        </View>

        <Text
          style={{
            color: theme.colors.text,
            fontWeight: '800',
            fontSize: 17,
            marginTop: 12,
          }}
        >
          {report.title}
        </Text>

        <Text
          numberOfLines={2}
          style={{
            color: theme.colors.textMuted,
            marginTop: 6,
            lineHeight: 20,
          }}
        >
          {report.description}
        </Text>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 14,
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <Ionicons name="location-outline" size={15} color={theme.colors.textMuted} />
            <Text
              numberOfLines={1}
              style={{ color: theme.colors.textMuted, marginLeft: 4, flex: 1, fontSize: 12 }}
            >
              {report.address}
            </Text>
          </View>
          <Text style={{ color: theme.colors.textMuted, fontSize: 12 }}>
            {relativeTime(report.createdAt)}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 9 }}>
          <Ionicons name="people-outline" size={15} color={theme.colors.primary} />
          <Text style={{ color: theme.colors.primary, fontWeight: '700', marginLeft: 5, fontSize: 12 }}>
            {report.votes} warga mengonfirmasi
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
