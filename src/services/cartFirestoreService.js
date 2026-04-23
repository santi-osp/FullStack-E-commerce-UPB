import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore'
import { getFirestoreDb, isFirebaseReady } from '../config/firebase.js'

function getDb() {
  if (!isFirebaseReady()) throw new Error('Firebase no está inicializado.')
  return getFirestoreDb()
}

export async function saveCart(userId, items) {
  const db = getDb()
  const ref = doc(db, 'carts', userId)
  await setDoc(ref, { items, updatedAt: new Date().toISOString() })
}

export async function loadCart(userId) {
  const db = getDb()
  const ref = doc(db, 'carts', userId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return []
  return snap.data().items || []
}

export async function clearCart(userId) {
  const db = getDb()
  const ref = doc(db, 'carts', userId)
  await deleteDoc(ref)
}
