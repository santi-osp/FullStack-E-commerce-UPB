import { useNavigate } from 'react-router-dom'
import { useCartStore } from '../../store/cartStore.js'
import { useAuthStore } from '../../store/authStore.js'
import { formatCurrency } from '../../utils/formatters.js'
import Button from '../atoms/Button.jsx'

export default function ShoppingCart() {
  const items = useCartStore((s) => s.items)
  const totalItems = useCartStore((s) => s.totalItems)
  const totalAmount = useCartStore((s) => s.totalAmount)
  const increaseItem = useCartStore((s) => s.increaseItem)
  const decreaseItem = useCartStore((s) => s.decreaseItem)
  const removeItem = useCartStore((s) => s.removeItem)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-800 p-8 text-center">
        <p className="mb-4 text-slate-400">Tu carrito está vacío.</p>
        <Button onClick={() => navigate('/')} ariaLabel="Ver productos">
          Ver productos
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800">
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Carrito</h2>
          <span className="text-sm text-slate-400">
            {totalItems} {totalItems === 1 ? 'item' : 'items'}
          </span>
        </div>
      </div>

      <ul className="divide-y divide-slate-700">
        {items.map((item) => (
          <li key={item.id} className="flex items-center gap-3 p-4">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-16 w-16 rounded-lg object-cover bg-slate-900"
            />
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white">{item.title}</p>
              <p className="text-sm text-slate-400">{formatCurrency(item.price)} c/u</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => decreaseItem(item.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700"
                aria-label={`Disminuir cantidad de ${item.title}`}
              >
                −
              </button>
              <span className="w-6 text-center text-sm text-white">{item.quantity}</span>
              <button
                onClick={() => increaseItem(item.id)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700"
                aria-label={`Aumentar cantidad de ${item.title}`}
              >
                +
              </button>
            </div>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-white">
                {formatCurrency(item.price * item.quantity)}
              </p>
            </div>
            <button
              onClick={() => removeItem(item.id)}
              className="ml-2 rounded-lg p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-400"
              aria-label={`Eliminar ${item.title} del carrito`}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      <div className="border-t border-slate-700 p-4">
        <div className="mb-4 flex items-center justify-between text-base font-semibold text-white">
          <span>Total</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>

        {isAuthenticated() ? (
          <Button
            onClick={() => navigate('/checkout')}
            className="w-full"
            ariaLabel="Proceder al checkout"
          >
            Proceder al checkout
          </Button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-slate-400">
              Inicia sesión para continuar con la compra.
            </p>
            <Button onClick={() => navigate('/login')} className="w-full" ariaLabel="Iniciar sesión">
              Iniciar sesión
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
