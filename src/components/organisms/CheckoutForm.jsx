import { useState } from 'react'
import { useCartStore } from '../../store/cartStore.js'
import { useAuthStore } from '../../store/authStore.js'
import { formatCurrency } from '../../utils/formatters.js'
import Button from '../atoms/Button.jsx'
import Input from '../atoms/Input.jsx'

export default function CheckoutForm() {
  const items = useCartStore((s) => s.items)
  const totalAmount = useCartStore((s) => s.totalAmount)
  const checkout = useCartStore((s) => s.checkout)
  const lastOrder = useCartStore((s) => s.lastOrder)
  const user = useAuthStore((s) => s.user)

  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    phone: '',
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Ingresa el nombre completo.'
    if (!form.address.trim()) e.address = 'Ingresa la dirección.'
    if (!form.city.trim()) e.city = 'Ingresa la ciudad.'
    if (!form.phone.trim()) e.phone = 'Ingresa el teléfono.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)
    const result = await checkout(form, user?.uid)
    setSubmitting(false)
  }

  if (lastOrder) {
    return (
      <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-6 text-center">
        <h3 className="mb-2 text-lg font-semibold text-green-400">¡Compra confirmada!</h3>
        <p className="mb-1 text-slate-300">
          Orden: <span className="font-mono font-medium text-white">{lastOrder.orderId}</span>
        </p>
        <p className="text-sm text-slate-400">
          {lastOrder.local
            ? 'Compra simulada localmente (Firebase no disponible).'
            : 'Tu orden ha sido guardada exitosamente.'}
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-2">
        <h2 className="text-lg font-semibold text-white">Datos de envío</h2>
        <Input
          id="fullName"
          label="Nombre completo"
          value={form.fullName}
          onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
          error={errors.fullName}
          required
        />
        <Input
          id="address"
          label="Dirección"
          value={form.address}
          onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
          error={errors.address}
          required
        />
        <Input
          id="city"
          label="Ciudad"
          value={form.city}
          onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
          error={errors.city}
          required
        />
        <Input
          id="phone"
          label="Teléfono"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          error={errors.phone}
          required
        />
        <Button type="submit" disabled={submitting} className="w-full" ariaLabel="Confirmar compra">
          {submitting ? 'Procesando...' : 'Confirmar compra'}
        </Button>
      </form>

      <aside className="rounded-xl border border-slate-700 bg-slate-800 p-4">
        <h3 className="mb-3 text-base font-semibold text-white">Resumen</h3>
        <ul className="mb-3 divide-y divide-slate-700">
          {items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2 text-sm">
              <span className="truncate text-slate-300">
                {item.title} x{item.quantity}
              </span>
              <span className="ml-2 text-slate-100">{formatCurrency(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between border-t border-slate-700 pt-3 text-base font-semibold text-white">
          <span>Total</span>
          <span>{formatCurrency(totalAmount)}</span>
        </div>
      </aside>
    </div>
  )
}
