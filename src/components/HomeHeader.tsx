import { useAuth } from '@/context/AuthContext';
import { colors } from '@/styles/global';
import { Ionicons } from '@expo/vector-icons';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function HomeHeader() {
  const { user, logOut } = useAuth();

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => logOut() },
    ]);
  };

  return (
    <View style={styles.wrapper}>
      <View>
        <Text style={styles.date}>{currentDate}</Text>
        {user?.displayName && (
          <Text style={styles.greeting}>Hey, {user.displayName} 👋</Text>
        )}
      </View>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
        <Ionicons name="log-out-outline" size={22} color={colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  date: { fontSize: 14, color: colors.textSecondary, marginTop: 4 },
  greeting: { fontSize: 13, color: colors.textSecondary, marginTop: 2 },
  logoutBtn: { padding: 4 },
});