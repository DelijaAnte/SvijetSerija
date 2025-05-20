import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const toggleFavorite = async (userEmail, type, id) => {
  const ref = doc(db, "favorites", userEmail);
  const snap = await getDoc(ref);
  const existing = snap.exists() ? snap.data() : {};
  const list = existing[type] || [];

  let updated;
  if (list.includes(id)) {
    updated = list.filter((x) => x !== id);
  } else {
    updated = [...list, id];
  }

  await setDoc(ref, { ...existing, [type]: updated });
};

export const getFavorites = async (userEmail, type) => {
  const ref = doc(db, "favorites", userEmail);
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
  return snap.data()[type] || [];
};
