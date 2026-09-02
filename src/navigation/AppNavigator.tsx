import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useApp } from '../context/AppContext';
import { CreateReportScreen } from '../screens/CreateReportScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { MapScreen } from '../screens/MapScreen';
import { MyReportsScreen } from '../screens/MyReportsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { ReportDetailScreen } from '../screens/ReportDetailScreen';

export type RootStackParamList = {
  Tabs: undefined;
  CreateReport: undefined;
  ReportDetail: { reportId: string };
};

export type TabParamList = {
  Beranda: undefined;
  Peta: undefined;
  LaporanSaya: undefined;
  Profil: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

function Tabs() {
  const { theme } = useApp();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
          height: 72,
          paddingTop: 7,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Beranda: 'home',
            Peta: 'map',
            LaporanSaya: 'document-text',
            Profil: 'person',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Beranda" component={HomeScreen} />
      <Tab.Screen name="Peta" component={MapScreen} />
      <Tab.Screen name="LaporanSaya" component={MyReportsScreen} options={{ title: 'Laporan Saya' }} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { theme } = useApp();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '800' },
        contentStyle: { backgroundColor: theme.colors.background },
      }}
    >
      <Stack.Screen name="Tabs" component={Tabs} options={{ headerShown: false }} />
      <Stack.Screen name="CreateReport" component={CreateReportScreen} options={{ title: 'Buat Laporan' }} />
      <Stack.Screen name="ReportDetail" component={ReportDetailScreen} options={{ title: 'Detail Laporan' }} />
    </Stack.Navigator>
  );
}
