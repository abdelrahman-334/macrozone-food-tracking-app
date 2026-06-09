import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Switch, Text, View } from 'react-native';
import { colors } from '@/styles/global';

const isExpoGo = Constants.appOwnership === 'expo';

export default function ReminderToggle() {
  const [enabled, setEnabled] = useState(false);

  if (isExpoGo) return null;

  useEffect(() => {
    const load = async () => {
      const val = await AsyncStorage.getItem('remindersEnabled');
      setEnabled(val === 'true');
    };
    load();
  }, []);

  const toggle = async (value: boolean) => {
    try {
      const { cancelMealReminders, requestPermissions, scheduleMealReminders } =
        await import('@/utils/notifications');

      if (value) {
        const granted = await requestPermissions();
        if (!granted) return;
        await scheduleMealReminders();
      } else {
        await cancelMealReminders();
      }

      setEnabled(value);
      await AsyncStorage.setItem('remindersEnabled', value.toString());
    } catch (err) {
      Alert.alert('Error', 'Notifications are not available in this environment.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Meal Reminders</Text>
      <Switch
        value={enabled}
        onValueChange={toggle}
        trackColor={{ false: colors.surface, true: colors.primary }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
  },
  label: {
    color: colors.text,
    fontSize: 16,
  },
});