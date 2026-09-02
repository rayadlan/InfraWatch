import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeSwitcher } from '../components/ThemeSwitcher';
import { useApp } from '../context/AppContext';

export function ProfileScreen() {
  const { theme, user, firebaseEnabled } = useApp();

  const Stat = ({ value, label }: { value: string | number; label: string }) => (
    <View
      style={{
        flex: 1,
        backgroundColor: theme.colors.surface,
        padding: 14,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
      }}
    >
      <Text style={{ color: theme.colors.primary, fontSize: 22, fontWeight: '900' }}>{value}</Text>
      <Text style={{ color: theme.colors.textMuted, fontSize: 11, marginTop: 3 }}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 18, paddingBottom: 100 }}>
        <Text style={{ color: theme.colors.text, fontSize: 25, fontWeight: '900' }}>Profil</Text>

        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderWidth: 1,
            borderColor: theme.colors.border,
            borderRadius: theme.radius.lg,
            padding: 18,
            marginTop: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 58,
              height: 58,
              borderRadius: 29,
              backgroundColor: theme.colors.primary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: '900' }}>
              {user.name.charAt(0)}
            </Text>
          </View>
          <View style={{ marginLeft: 14, flex: 1 }}>
            <Text style={{ color: theme.colors.text, fontSize: 19, fontWeight: '900' }}>{user.name}</Text>
            <Text style={{ color: theme.colors.textMuted, marginTop: 3 }}>
              Citizen Reporter • {firebaseEnabled ? 'Firebase aktif' : 'Mode demo lokal'}
            </Text>
          </View>
          <Ionicons name="shield-checkmark" size={27} color={theme.colors.success} />
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
          <Stat value={user.points} label="Poin kontribusi" />
          <Stat value={user.reportsCount} label="Laporan" />
          <Stat value={user.verifiedCount} label="Konfirmasi" />
        </View>

        <Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 18, marginTop: 26, marginBottom: 10 }}>
          Pilihan tampilan
        </Text>
        <Text style={{ color: theme.colors.textMuted, marginBottom: 14, lineHeight: 20 }}>
          Tiga opsi UI sudah terpasang. Pilih di bawah dan seluruh aplikasi langsung berubah.
        </Text>

        <ThemeSwitcher />

        <View
          style={{
            backgroundColor: theme.colors.surface,
            borderRadius: theme.radius.lg,
            borderWidth: 1,
            borderColor: theme.colors.border,
            padding: 16,
            marginTop: 22,
          }}
        >
          <Text style={{ color: theme.colors.text, fontWeight: '900' }}>Tentang prototype</Text>
          <Text style={{ color: theme.colors.textMuted, lineHeight: 20, marginTop: 7 }}>
            InfraWatch adalah prototype crowdsourcing untuk mendokumentasikan infrastruktur berbahaya,
            memetakan titik risiko, melakukan verifikasi komunitas, dan memantau progres penanganan.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
