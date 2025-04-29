import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { router } from 'expo-router';

interface CameraTriggerButtonProps {
  label: string;
  mode: 'identify' | 'health';
  color?: string;
  textColor?: string;
}

export const CameraTriggerButton = ({
  label,
  mode,
  color = '#2196F3',
  textColor = '#fff'
}: CameraTriggerButtonProps) => {
  const handlePress = () => {
    router.push({
      pathname: '/(tabs)/identify',
      params: { mode, from: router.canGoBack() ? 'back' : '(tabs)' }
    });
  };

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={handlePress}
    >
      <Text style={[styles.buttonText, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};

export const CameraActionButtons = () => {
  return (
    <View style={styles.container}>
      <CameraTriggerButton
        label="Identify Plant"
        mode="identify"
        color="#22c55e"
      />
      <CameraTriggerButton
        label="Check Plant Health"
        mode="health"
        color="#3b82f6"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    gap: 12,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});