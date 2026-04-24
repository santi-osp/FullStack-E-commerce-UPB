const getEnv = (key, defaultValue = '') => {
  const value = import.meta.env[key]
  // Limpiamos espacios o saltos de línea que puedan venir de archivos .env o GitHub Secrets
  return typeof value === 'string' ? value.trim() : (value || defaultValue)
}

export const ENV = {
  FAKE_STORE_API_BASE_URL: getEnv('VITE_FAKE_STORE_API_BASE_URL', 'https://fakestoreapi.com'),
  FIREBASE_API_KEY: getEnv('VITE_FIREBASE_API_KEY'),
  FIREBASE_AUTH_DOMAIN: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  FIREBASE_PROJECT_ID: getEnv('VITE_FIREBASE_PROJECT_ID'),
  FIREBASE_STORAGE_BUCKET: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  FIREBASE_MESSAGING_SENDER_ID: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  FIREBASE_APP_ID: getEnv('VITE_FIREBASE_APP_ID'),
  FIREBASE_MEASUREMENT_ID: getEnv('VITE_FIREBASE_MEASUREMENT_ID'),
}

export function isFirebaseConfigValid() {
  return Boolean(
    ENV.FIREBASE_API_KEY &&
    ENV.FIREBASE_PROJECT_ID &&
    ENV.FIREBASE_APP_ID
  )
}
