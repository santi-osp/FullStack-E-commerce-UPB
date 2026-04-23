import { create } from 'zustand'
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logoutUser,
  subscribeAuthChanges,
  fetchUserProfile,
} from '../services/authService.js'
import { mapFirebaseAuthError } from '../utils/firebaseAuthError.js'

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  isLoading: false,
  initialized: false,
  error: null,

  initializeAuth: () => {
    set({ isLoading: true })
    const unsubscribe = subscribeAuthChanges(async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await fetchUserProfile(firebaseUser.uid)
        set({
          user: {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
          },
          profile,
          initialized: true,
          isLoading: false,
          error: null,
        })
      } else {
        set({ user: null, profile: null, initialized: true, isLoading: false, error: null })
      }
    })
    // Fallback si Firebase no está disponible
    setTimeout(() => {
      if (!get().initialized) {
        set({ initialized: true, isLoading: false })
      }
    }, 2000)
    return unsubscribe
  },

  register: async ({ displayName, email, password }) => {
    set({ isLoading: true, error: null })
    try {
      const user = await registerWithEmail({ displayName, email, password })
      const profile = await fetchUserProfile(user.uid)
      set({
        user: { uid: user.uid, email: user.email, displayName: user.displayName },
        profile,
        isLoading: false,
      })
      return true
    } catch (error) {
      set({ error: mapFirebaseAuthError(error), isLoading: false })
      return false
    }
  },

  login: async ({ email, password }) => {
    set({ isLoading: true, error: null })
    try {
      const user = await loginWithEmail({ email, password })
      const profile = await fetchUserProfile(user.uid)
      set({
        user: { uid: user.uid, email: user.email, displayName: user.displayName },
        profile,
        isLoading: false,
      })
      return true
    } catch (error) {
      set({ error: mapFirebaseAuthError(error), isLoading: false })
      return false
    }
  },

  loginGoogle: async () => {
    set({ isLoading: true, error: null })
    try {
      const user = await loginWithGoogle()
      const profile = await fetchUserProfile(user.uid)
      set({
        user: { uid: user.uid, email: user.email, displayName: user.displayName },
        profile,
        isLoading: false,
      })
      return true
    } catch (error) {
      set({ error: mapFirebaseAuthError(error, 'Error al iniciar sesión con Google.'), isLoading: false })
      return false
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await logoutUser()
      set({ user: null, profile: null, isLoading: false, error: null })
    } catch (error) {
      set({ error: mapFirebaseAuthError(error, 'Error al cerrar sesión.'), isLoading: false })
    }
  },

  clearError: () => set({ error: null }),
  isAuthenticated: () => Boolean(get().user),
}))
