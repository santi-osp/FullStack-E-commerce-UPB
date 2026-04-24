import { useState } from 'react'
import ProductCard from '../molecules/ProductCard.jsx'
import ProductDetailModal from '../molecules/ProductDetailModal.jsx'
import { useProductStore } from '../../store/productStore.js'

export default function ProductGallery() {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const products = useProductStore((s) => s.products)
  const isLoading = useProductStore((s) => s.isLoading)
  const error = useProductStore((s) => s.error)

  if (isLoading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-80 animate-pulse rounded-xl border border-slate-700 bg-slate-800"
          />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
        {error}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-8 text-center text-slate-400">
        No se encontraron productos. Intenta con otra búsqueda.
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onDetail={() => setSelectedProduct(product)}
          />
        ))}
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </>
  )
}
