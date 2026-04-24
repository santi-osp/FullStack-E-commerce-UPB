import Button from '../atoms/Button.jsx'
import { formatCurrency } from '../../utils/formatters.js'
import { useCartStore } from '../../store/cartStore.js'

export default function ProductCard({ product, onDetail }) {
  const addItem = useCartStore((s) => s.addItem)

  return (
    <div className="group flex flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-800 shadow-sm transition hover:border-slate-600 hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
        <img
          src={product.imageUrl}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-xs font-medium text-blue-400">{product.categoryName}</span>
          <span className="text-xs text-slate-500">Stock: {product.stock}</span>
        </div>
        <h3 className="mb-1 text-base font-semibold text-slate-100 line-clamp-1">{product.title}</h3>
        <p className="mb-3 text-sm text-slate-400 line-clamp-2">{product.description}</p>
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-white">{formatCurrency(product.price)}</span>
            <Button
              onClick={() => addItem(product)}
              variant="primary"
              ariaLabel={`Agregar ${product.title} al carrito`}
            >
              Agregar
            </Button>
          </div>
          <Button
            onClick={onDetail}
            variant="outline"
            className="w-full text-xs py-1.5"
            ariaLabel={`Ver detalles de ${product.title}`}
          >
            Ver detalles
          </Button>
        </div>
      </div>
    </div>
  )
}
