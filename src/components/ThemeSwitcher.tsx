import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useApp } from '../context/AppContext';
import { themes } from '../theme/themes';
import { ThemeKey } from '../types';

const keys: ThemeKey[] = ['civic', 'emergency', 'eco'];

export function ThemeSwitcher() {
  const { theme, themeKey, setThemeKey } = useApp();

  return (
    <View style={{ gap: 10 }}>
      {keys.map(key => {
        const item = themes[key];
        const selected = key === themeKey;
        return (
          <Pressable
            key={key}
            onPress={() => setThemeKey(key)}
            style={{
              padding: 14,
              borderRadius: theme.radius.md,
              borderWidth: selected ? 2 : 1,
              borderColor: selected ? theme.colors.primary : theme.colors.border,
              backgroundColor: selected ? theme.colors.primarySoft : theme.colors.surface,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: item.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons
                name={key === 'emergency' ? 'warning' : key === 'eco' ? 'leaf' : 'shield-checkmark'}
                size={20}
                color="#fff"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: theme.colors.text, fontWeight: '800' }}>{item.label}</Text>
              <Text style={{ color: theme.colors.textMuted, fontSize: 12, marginTop: 3 }}>
                {item.description}
              </Text>
            </View>
            {selected && <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />}
          </Pressable>
        );
      })}
    </View>
  );
}
