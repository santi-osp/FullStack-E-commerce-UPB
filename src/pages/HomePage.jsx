import { useEffect } from 'react'
import SearchBar from '../components/molecules/SearchBar.jsx'
import ProductGallery from '../components/organisms/ProductGallery.jsx'
import PaginationControls from '../components/molecules/PaginationControls.jsx'
import { useProductStore } from '../store/productStore.js'

export default function HomePage() {
  const loadProducts = useProductStore((s) => s.loadProducts)
  const loadCategories = useProductStore((s) => s.loadCategories)
  const pagination = useProductStore((s) => s.pagination)
  const isLoading = useProductStore((s) => s.isLoading)

  useEffect(() => {
    loadCategories()
    loadProducts()
  }, [loadCategories, loadProducts])

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="mb-6">
        <h1 className="mb-2 text-2xl font-bold text-white">Galería de Productos</h1>
        <p className="mb-4 text-sm text-slate-400">
          Explora nuestro catálogo y encuentra lo que necesitas.
        </p>
        <SearchBar />
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-slate-400">
        <span>
          {isLoading ? 'Cargando...' : `${pagination.totalItems} productos`}
        </span>
        <span>Página {pagination.page} de {pagination.totalPages}</span>
      </div>

      <ProductGallery />
      <PaginationControls />
    </div>
  )
}
