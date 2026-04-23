import { create } from 'zustand'
import { fetchProducts, fetchCategories } from '../services/productService.js'

export const useProductStore = create((set, get) => ({
  products: [],
  categories: [],
  search: '',
  selectedCategory: '',
  page: 1,
  pagination: { page: 1, limit: 8, totalItems: 0, totalPages: 1, hasPreviousPage: false, hasNextPage: false },
  isLoading: false,
  error: null,

  setSearch: (search) => set({ search, page: 1 }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory, page: 1 }),
  setPage: (page) => set({ page }),

  loadProducts: async () => {
    const { page, search, selectedCategory } = get()
    set({ isLoading: true, error: null })
    try {
      const result = await fetchProducts({
        page,
        limit: 8,
        search,
        categoryId: selectedCategory,
      })
      set({
        products: result.products,
        pagination: result.pagination,
        isLoading: false,
      })
    } catch (error) {
      console.error('[productStore] Error cargando productos:', error)
      set({ error: 'Error al cargar productos.', isLoading: false })
    }
  },

  loadCategories: async () => {
    try {
      const categories = await fetchCategories()
      set({ categories })
    } catch (error) {
      console.error('[productStore] Error cargando categorías:', error)
    }
  },
}))
