import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { saveCart, loadCart, clearCart } from '../services/cartFirestoreService.js'
import { createOrder } from '../services/orderFirestoreService.js'
import { isFirebaseReady } from '../config/firebase.js'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalItems: 0,
      totalAmount: 0,
      isLoading: false,
      error: null,
      lastOrder: null,

      _computeTotals: (items) => {
        const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
        const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0)
        return { totalItems, totalAmount }
      },

      addItem: (product) => {
        const items = [...get().items]
        const existing = items.find((i) => i.id === product.id)
        if (existing) {
          existing.quantity += 1
        } else {
          items.push({ ...product, quantity: 1 })
        }
        const totals = get()._computeTotals(items)
        set({ items, ...totals })
      },

      increaseItem: (productId) => {
        const items = get().items.map((i) =>
          i.id === productId ? { ...i, quantity: i.quantity + 1 } : i
        )
        const totals = get()._computeTotals(items)
        set({ items, ...totals })
      },

      decreaseItem: (productId) => {
        const items = get().items
          .map((i) => (i.id === productId ? { ...i, quantity: i.quantity - 1 } : i))
          .filter((i) => i.quantity > 0)
        const totals = get()._computeTotals(items)
        set({ items, ...totals })
      },

      removeItem: (productId) => {
        const items = get().items.filter((i) => i.id !== productId)
        const totals = get()._computeTotals(items)
        set({ items, ...totals })
      },

      clearLocalCart: () => {
        set({ items: [], totalItems: 0, totalAmount: 0 })
      },

      loadRemoteCart: async (userId) => {
        if (!isFirebaseReady() || !userId) return
        set({ isLoading: true })
        try {
          const items = await loadCart(userId)
          const totals = get()._computeTotals(items)
          set({ items, ...totals, isLoading: false })
        } catch (error) {
          console.warn('[cartStore] Error cargando carrito remoto:', error)
          set({ isLoading: false })
        }
      },

      syncRemoteCart: async (userId) => {
        if (!isFirebaseReady() || !userId) return
        try {
          await saveCart(userId, get().items)
        } catch (error) {
          console.warn('[cartStore] Error sincronizando carrito remoto:', error)
        }
      },

      clearRemoteCart: async (userId) => {
        if (!isFirebaseReady() || !userId) return
        try {
          await clearCart(userId)
        } catch (error) {
          console.warn('[cartStore] Error limpiando carrito remoto:', error)
        }
      },

      checkout: async (shipping, userId) => {
        set({ isLoading: true, error: null, lastOrder: null })
        try {
          const { items, totalAmount } = get()
          if (items.length === 0) {
            set({ isLoading: false, error: 'El carrito está vacío.' })
            return null
          }
          const result = await createOrder({ userId, items, totalAmount, shipping })
          set({
            items: [],
            totalItems: 0,
            totalAmount: 0,
            lastOrder: result,
            isLoading: false,
          })
          if (isFirebaseReady() && userId) {
            await clearCart(userId)
          }
          return result
        } catch (error) {
          console.error('[cartStore] Error en checkout:', error)
          set({ isLoading: false, error: 'Error al procesar la compra.' })
          return null
        }
      },
    }),
    {
      name: 'ecommerce-cart-store',
      partialize: (state) => ({
        items: state.items,
        totalItems: state.totalItems,
        totalAmount: state.totalAmount,
      }),
    }
  )
)
