import ShoppingCart from '../components/organisms/ShoppingCart.jsx'

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-bold text-white">Tu Carrito</h1>
      <ShoppingCart />
    </div>
  )
}
