import { Link } from 'react-router-dom'
import Button from '../components/atoms/Button.jsx'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <h1 className="mb-2 text-6xl font-bold text-slate-700">404</h1>
        <p className="mb-6 text-lg text-slate-400">Página no encontrada</p>
        <Link to="/">
          <Button ariaLabel="Volver al inicio">Volver al inicio</Button>
        </Link>
      </div>
    </div>
  )
}
