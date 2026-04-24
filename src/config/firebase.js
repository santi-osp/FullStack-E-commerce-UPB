import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { isSupported, getAnalytics } from 'firebase/analytics'
import { ENV, isFirebaseConfigValid } from './env.js'

let firebaseApp = null
let firebaseAuth = null
let firestoreDb = null
let firebaseAnalytics = null
let firebaseReady = false

export function initFirebase() {
  if (!isFirebaseConfigValid()) {
    console.warn('[Firebase] Configuración incompleta. Firebase no se inicializará.')
    firebaseReady = false
    return
  }

  try {
    if (getApps().length === 0) {
      console.log('[Firebase] Inicializando nueva instancia...')
      firebaseApp = initializeApp({
        apiKey: ENV.FIREBASE_API_KEY,
        authDomain: ENV.FIREBASE_AUTH_DOMAIN,
        projectId: ENV.FIREBASE_PROJECT_ID,
        storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
        appId: ENV.FIREBASE_APP_ID,
        measurementId: ENV.FIREBASE_MEASUREMENT_ID,
      })
    } else {
      firebaseApp = getApp()
    }

    firebaseAuth = getAuth(firebaseApp)
    firestoreDb = getFirestore(firebaseApp)
    firebaseReady = true
    console.log('[Firebase] Inicializado correctamente.')

    isSupported().then((supported) => {
      if (supported) {
        firebaseAnalytics = getAnalytics(firebaseApp)
      }
    }).catch(() => {
      // analytics no soportado (ej. entornos sin DOM)
    })
  } catch (error) {
    console.error('[Firebase] Error al inicializar:', error)
    firebaseReady = false
  }
}

export function getFirebaseApp() {
  return firebaseApp
}

export function getFirebaseAuth() {
  return firebaseAuth
}

export function getFirestoreDb() {
  return firestoreDb
}

export function isFirebaseReady() {
  return firebaseReady
}

export function getFirebaseAnalytics() {
  return firebaseAnalytics
}

initFirebase()