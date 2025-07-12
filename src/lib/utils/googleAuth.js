import { ref, set } from "firebase/database";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider, db } from "../services/firebase";

export async function loginWithGoogle() {
  const result = await signInWithPopup(auth, googleProvider);
  const user = result.user;

  await set(ref(db, `users/${user.uid}`), {
    email: user.email,
    name: user.displayName,
    createdAt: Date.now(),
  });

  return user;
}
