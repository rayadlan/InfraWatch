import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ReportCard } from '../components/ReportCard';
import { useApp } from '../context/AppContext';

export function MyReportsScreen({ navigation }: any) {
  const { theme, reports, user } = useApp();
  const mine = reports.filter(r => r.reporterId === user.id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={mine}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 18, paddingBottom: 100 }}
        ListHeaderComponent={
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: theme.colors.text, fontSize: 25, fontWeight: '900' }}>
              Laporan Saya
            </Text>
            <Text style={{ color: theme.colors.textMuted, marginTop: 4 }}>
              Pantau perkembangan laporan yang kamu kirim.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <ReportCard
            report={item}
            onPress={() => navigation.navigate('ReportDetail', { reportId: item.id })}
          />
        )}
        ListEmptyComponent={
          <Text style={{ color: theme.colors.textMuted, textAlign: 'center', marginTop: 50 }}>
            Kamu belum membuat laporan.
          </Text>
        }
      />
    </SafeAreaView>
  );
}
