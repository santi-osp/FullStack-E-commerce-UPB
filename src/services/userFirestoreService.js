import { doc, setDoc, getDoc } from 'firebase/firestore'
import { getFirestoreDb, isFirebaseReady } from '../config/firebase.js'

export async function saveUserProfile(uid, data) {
  if (!isFirebaseReady() || !uid) return
  const db = getFirestoreDb()
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  const now = new Date().toISOString()
  const payload = {
    ...data,
    updatedAt: now,
  }
  if (!snap.exists()) {
    payload.createdAt = now
    payload.role = data.role || 'customer'
  }
  await setDoc(ref, payload, { merge: true })
}

export async function getUserProfile(uid) {
  if (!isFirebaseReady() || !uid) return null
  const db = getFirestoreDb()
  const ref = doc(db, 'users', uid)
  const snap = await getDoc(ref)
  return snap.exists() ? { uid, ...snap.data() } : null
}
