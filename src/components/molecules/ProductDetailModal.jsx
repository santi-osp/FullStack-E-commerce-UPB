import { useEffect } from 'react'
import Button from '../atoms/Button.jsx'
import Badge from '../atoms/Badge.jsx'
import { formatCurrency } from '../../utils/formatters.js'
import { useCartStore } from '../../store/cartStore.js'

export default function ProductDetailModal({ product, onClose }) {
  const addItem = useCartStore((s) => s.addItem)

  // Cerrar con Escape
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    // Prevenir scroll en el body cuando el modal está abierto
    document.body.style.overflow = 'hidden'
    
    return () => {
      window.removeEventListener('keydown', handleEsc)
      document.body.style.overflow = 'unset'
    }
  }, [onClose])

  if (!product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 rounded-full bg-slate-900/50 p-2 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors"
          aria-label="Cerrar detalles"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Imagen */}
          <div className="md:w-1/2 bg-slate-900">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="h-full w-full object-contain aspect-square md:aspect-auto"
            />
          </div>

          {/* Contenido */}
          <div className="flex flex-col p-6 md:w-1/2">
            <div className="mb-4">
              <Badge variant="info" className="mb-2 inline-block">
                {product.categoryName}
              </Badge>
              <h2 className="text-2xl font-bold text-white leading-tight">{product.title}</h2>
            </div>

            <div className="mb-6">
              <span className="text-3xl font-extrabold text-blue-400">
                {formatCurrency(product.price)}
              </span>
              <p className="mt-2 text-xs text-slate-500">
                Disponibilidad: <span className={product.stock > 0 ? 'text-green-500' : 'text-red-500'}>
                  {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
                </span>
              </p>
            </div>

            <div className="mb-8 overflow-y-auto">
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">Descripción</h3>
              <p className="text-sm leading-relaxed text-slate-300">
                {product.description}
              </p>
            </div>

            <div className="mt-auto flex flex-col gap-3">
              <Button
                onClick={() => {
                  addItem(product)
                  onClose()
                }}
                variant="primary"
                className="w-full py-4 text-lg"
                disabled={product.stock <= 0}
              >
                {product.stock > 0 ? 'Añadir al carrito' : 'Sin stock'}
              </Button>
              <button
                onClick={onClose}
                className="text-sm text-slate-400 hover:text-white transition-colors py-2"
              >
                Volver a la galería
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
