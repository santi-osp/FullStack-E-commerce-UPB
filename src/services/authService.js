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
  const { auth } = getAuthAndDb()
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName })
  // No esperamos a Firestore aquí, dejamos que subscribeAuthChanges lo maneje
  return credential.user
}

export async function loginWithEmail({ email, password }) {
  const { auth } = getAuthAndDb()
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential.user
}

export async function loginWithGoogle() {
  const { auth } = getAuthAndDb()
  const provider = new GoogleAuthProvider()
  const credential = await signInWithPopup(auth, provider)
  return credential.user
}

export async function logoutUser() {
  const { auth } = getAuthAndDb()
  await signOut(auth)
}

/**
 * Suscribe a los cambios de autenticación.
 * La sincronización con Firestore se hace en segundo plano para no bloquear el login.
 */
export function subscribeAuthChanges(callback) {
  if (!isFirebaseReady()) {
    console.warn('[authService] Firebase no está listo, listener no disponible.')
    return () => {}
  }
  const { auth } = getAuthAndDb()
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      const { db } = getAuthAndDb()
      // Sincronización en segundo plano (fire & forget) para evitar latencia en el inicio
      syncUserProfile(user, db).catch(err => {
        console.warn('[authService] Error silencioso de sincronización:', err.message)
      })
    }
    callback(user)
  })
}

async function syncUserProfile(user, db) {
  if (!user || !db) return
  try {
    const ref = doc(db, 'users', user.uid)
    const now = new Date().toISOString()
    
    // Simplificamos: merge true se encarga de no borrar createdAt si ya existe
    // Evitamos un getDoc previo para reducir latencia y cuota de lectura
    await setDoc(ref, {
      displayName: user.displayName || '',
      email: user.email || '',
      phone: user.phoneNumber || '',
      updatedAt: now,
    }, { merge: true })
  } catch (error) {
    console.error('[authService] Error al sincronizar perfil en Firestore:', error)
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
