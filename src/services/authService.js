import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { getFirebaseAuth, getFirestoreDb, isFirebaseReady } from '../config/firebase.js'

function getAuthAndDb() {
  if (!isFirebaseReady()) {
    throw new Error('Firebase no está inicializado.')
  }
  return {
    auth: getFirebaseAuth(),
    db: getFirestoreDb(),
  }
}

export async function registerWithEmail({ displayName, email, password }) {
  const { auth, db } = getAuthAndDb()
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName })
  await syncUserProfile(credential.user, db)
  return credential.user
}

export async function loginWithEmail({ email, password }) {
  const { auth, db } = getAuthAndDb()
  const credential = await signInWithEmailAndPassword(auth, email, password)
  await syncUserProfile(credential.user, db)
  return credential.user
}

export async function loginWithGoogle() {
  const { auth, db } = getAuthAndDb()
  const provider = new GoogleAuthProvider()
  const credential = await signInWithPopup(auth, provider)
  await syncUserProfile(credential.user, db)
  return credential.user
}

export async function logoutUser() {
  const { auth } = getAuthAndDb()
  await signOut(auth)
}

export function subscribeAuthChanges(callback) {
  if (!isFirebaseReady()) {
    console.warn('[authService] Firebase no está listo, listener no disponible.')
    return () => {}
  }
  const { auth } = getAuthAndDb()
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      const { db } = getAuthAndDb()
      await syncUserProfile(user, db)
    }
    callback(user)
  })
}

async function syncUserProfile(user, db) {
  if (!user || !db) return
  try {
    const ref = doc(db, 'users', user.uid)
    const snap = await getDoc(ref)
    const now = new Date().toISOString()
    const payload = {
      displayName: user.displayName || '',
      email: user.email || '',
      phone: user.phoneNumber || '',
      role: 'customer',
      updatedAt: now,
    }
    if (!snap.exists()) {
      payload.createdAt = now
    }
    await setDoc(ref, payload, { merge: true })
  } catch (error) {
    console.error('[authService] Error al sincronizar perfil en Firestore:', error)
    // No lanzamos el error para no bloquear el acceso si la auth fue exitosa
    // pero Firestore tiene problemas de permisos
  }
}

export async function fetchUserProfile(uid) {
  if (!isFirebaseReady() || !uid) return null
  try {
    const { db } = getAuthAndDb()
    const ref = doc(db, 'users', uid)
    const snap = await getDoc(ref)
    return snap.exists() ? { uid, ...snap.data() } : null
  } catch (error) {
    console.warn('[authService] No se pudo obtener el perfil de Firestore:', error.message)
    return null
  }
}
