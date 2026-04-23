import axios from 'axios'
import { ENV } from '../config/env.js'
import { MOCK_PRODUCTS } from '../mockdata/products.js'
import { MOCK_CATEGORIES } from '../mockdata/categories.js'
import { slugify } from '../utils/formatters.js'

const BASE_URL = ENV.FAKE_STORE_API_BASE_URL || 'https://fakestoreapi.com'

let cache = null
let cacheTimestamp = 0
const CACHE_TTL = 2 * 60 * 1000 // 2 minutos

function normalizeProduct(raw, categoriesMap = {}) {
  const categoryId = raw.category
    ? slugify(typeof raw.category === 'string' ? raw.category : raw.category?.name || '')
    : raw.categoryId || 'general'

  return {
    id: String(raw.id),
    title: String(raw.title || 'Sin título'),
    description: String(raw.description || ''),
    price: Number(raw.price) || 0,
    imageUrl: raw.image || raw.imageUrl || `https://via.placeholder.com/600x400?text=${encodeURIComponent(String(raw.title || 'Producto'))}`,
    categoryId,
    categoryName: categoriesMap[categoryId] || raw.category || 'General',
    stock: Number(raw.stock ?? raw.rating?.count ?? 20),
    isActive: raw.isActive !== false,
  }
}

function normalizeCategory(raw) {
  const name = typeof raw === 'string' ? raw : raw.name || raw.title || 'General'
  return {
    id: slugify(name),
    name,
  }
}

async function fetchFakeStoreCatalog() {
  const now = Date.now()
  if (cache && now - cacheTimestamp < CACHE_TTL) {
    return cache
  }

  try {
    const [productsRes, categoriesRes] = await Promise.allSettled([
      axios.get(`${BASE_URL}/products`, { timeout: 8000 }),
      axios.get(`${BASE_URL}/products/categories`, { timeout: 8000 }),
    ])

    let categories = []
    if (categoriesRes.status === 'fulfilled' && Array.isArray(categoriesRes.value.data)) {
      categories = categoriesRes.value.data.map(normalizeCategory)
    }

    const categoriesMap = {}
    categories.forEach((c) => {
      categoriesMap[c.id] = c.name
    })

    let products = []
    if (productsRes.status === 'fulfilled' && Array.isArray(productsRes.value.data)) {
      products = productsRes.value.data.map((p) => normalizeProduct(p, categoriesMap))
    }

    if (products.length === 0 || categories.length === 0) {
      throw new Error('Respuesta vacía de la API')
    }

    cache = { products, categories }
    cacheTimestamp = now
    return cache
  } catch (error) {
    console.warn('[productService] API falló, usando mockdata:', error?.message || error)
    cache = {
      products: MOCK_PRODUCTS,
      categories: MOCK_CATEGORIES,
    }
    cacheTimestamp = now
    return cache
  }
}

export async function fetchProducts({ page = 1, limit = 8, search = '', categoryId = '' } = {}) {
  const catalog = await fetchFakeStoreCatalog()
  let list = [...catalog.products]

  if (search) {
    const q = search.toLowerCase()
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    )
  }

  if (categoryId) {
    list = list.filter((p) => p.categoryId === categoryId)
  }

  const totalItems = list.length
  const totalPages = Math.max(1, Math.ceil(totalItems / limit))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * limit
  const paginated = list.slice(start, start + limit)

  return {
    products: paginated,
    pagination: {
      page: safePage,
      limit,
      totalItems,
      totalPages,
      hasPreviousPage: safePage > 1,
      hasNextPage: safePage < totalPages,
    },
  }
}

export async function fetchCategories() {
  const catalog = await fetchFakeStoreCatalog()
  return catalog.categories
}
