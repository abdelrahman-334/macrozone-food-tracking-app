// One-time migration: reads meals from AsyncStorage and uploads to Firestore.
// Runs on first login. Safe to call multiple times — skips if already done.
import AsyncStorage from '@react-native-async-storage/async-storage';
import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

const MIGRATION_FLAG = 'firestore_migration_v1_done';
const LEGACY_MEALS_KEY = 'meals';

export async function migrateAsyncStorageToFirestore(): Promise<void> {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  const done = await AsyncStorage.getItem(MIGRATION_FLAG);
  if (done === 'true') return;

  // Skip if Firestore already has meals (e.g. re-install on new device)
  const existing = await getDocs(collection(db, 'users', uid, 'meals'));
  if (!existing.empty) {
    await AsyncStorage.setItem(MIGRATION_FLAG, 'true');
    return;
  }

  const raw = await AsyncStorage.getItem(LEGACY_MEALS_KEY);
  if (!raw) {
    await AsyncStorage.setItem(MIGRATION_FLAG, 'true');
    return;
  }

  let localMeals: any[] = [];
  try {
    localMeals = JSON.parse(raw);
  } catch {
    await AsyncStorage.setItem(MIGRATION_FLAG, 'true');
    return;
  }

  if (!Array.isArray(localMeals) || localMeals.length === 0) {
    await AsyncStorage.setItem(MIGRATION_FLAG, 'true');
    return;
  }

  const batch = writeBatch(db);
  for (const meal of localMeals) {
    const ref = doc(collection(db, 'users', uid, 'meals'));
    batch.set(ref, {
      name: meal.name ?? 'Unknown',
      calories: Number(meal.calories) || 0,
      protein: Number(meal.protein) || 0,
      carbs: Number(meal.carbs) || 0,
      fat: Number(meal.fat) || 0,
      createdAt: meal.createdAt ?? new Date().toISOString(),
    });
  }
  await batch.commit();
  await AsyncStorage.setItem(MIGRATION_FLAG, 'true');
  console.log(`[Migration] Migrated ${localMeals.length} meals to Firestore.`);
}