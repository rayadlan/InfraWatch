import React from 'react';
import { Text, View } from 'react-native';
import { useApp } from '../context/AppContext';

export function Badge({
  label,
  color,
}: {
  label: string;
  color: string;
}) {
  const { theme } = useApp();

  return (
    <View
      style={{
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 999,
        backgroundColor: `${color}18`,
        borderWidth: 1,
        borderColor: `${color}45`,
      }}
    >
      <Text style={{ color, fontSize: 12, fontWeight: '700' }}>{label}</Text>
    </View>
  );
}
