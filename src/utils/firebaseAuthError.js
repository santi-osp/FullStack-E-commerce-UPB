const errorMap = {
  'auth/invalid-credential': 'Correo o contraseña incorrectos.',
  'auth/email-already-in-use': 'El correo ya está registrado.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/invalid-email': 'Correo electrónico no válido.',
  'auth/user-not-found': 'Usuario no encontrado.',
  'auth/network-request-failed': 'Error de red. Verifica tu conexión.',
  'auth/popup-closed-by-user': 'Inicio de sesión cancelado.',
  'auth/wrong-password': 'Correo o contraseña incorrectos.',
  'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
  'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
  'auth/requires-recent-login': 'Por seguridad, vuelve a iniciar sesión.',
}

export function mapFirebaseAuthError(error, defaultMessage = 'Ha ocurrido un error inesperado.') {
  if (!error) return defaultMessage
  const code = error.code || error.message || ''
  return errorMap[code] || defaultMessage
}