import { useEffect } from 'react'
import { useAuthStore } from '../store/authStore.js'
import { useCartStore } from '../store/cartStore.js'

export function useAppBootstrap() {
  const initializeAuth = useAuthStore((s) => s.initializeAuth)
  const user = useAuthStore((s) => s.user)
  const loadRemoteCart = useCartStore((s) => s.loadRemoteCart)
  const syncRemoteCart = useCartStore((s) => s.syncRemoteCart)

  useEffect(() => {
    const unsubscribe = initializeAuth()
    return () => {
      if (typeof unsubscribe === 'function') unsubscribe()
    }
  }, [initializeAuth])

  useEffect(() => {
    if (user?.uid) {
      loadRemoteCart(user.uid)
    }
  }, [user?.uid, loadRemoteCart])

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (user?.uid) {
        syncRemoteCart(user.uid)
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [user?.uid, syncRemoteCart])
}
