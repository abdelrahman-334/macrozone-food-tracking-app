// All meals are now stored per-user in Firestore: users/{uid}/meals/{mealId}
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  writeBatch,
} from 'firebase/firestore';
import { auth, db } from '@/config/firebase';

export type Meal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  createdAt: string;
};

const mealsRef = () => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('No authenticated user');
  return collection(db, 'users', uid, 'meals');
};

export const getMeals = async (): Promise<Meal[]> => {
  const q = query(mealsRef(), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Meal, 'id'>) }));
};

export const addMeal = async (meal: Omit<Meal, 'id' | 'createdAt'>): Promise<Meal> => {
  const createdAt = new Date().toISOString();
  const docRef = await addDoc(mealsRef(), { ...meal, createdAt });
  return { id: docRef.id, ...meal, createdAt };
};

export const deleteMeal = async (id: string): Promise<void> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('No authenticated user');
  await deleteDoc(doc(db, 'users', uid, 'meals', id));
};

export const clearAllMeals = async (): Promise<void> => {
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('No authenticated user');
  const snapshot = await getDocs(mealsRef());
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => batch.delete(doc(db, 'users', uid, 'meals', d.id)));
  await batch.commit();
};