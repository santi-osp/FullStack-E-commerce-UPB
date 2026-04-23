import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore.js'
import { useCartStore } from '../../store/cartStore.js'
import Button from '../atoms/Button.jsx'

export default function Header() {
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const totalItems = useCartStore((s) => s.totalItems)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-700 bg-slate-900/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 text-lg font-bold text-white">
          <span className="inline-block h-8 w-8 rounded-lg bg-blue-600" aria-hidden="true" />
          UPB Store
        </Link>

        <nav className="hidden items-center gap-3 md:flex">
          <Link
            to="/"
            className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Productos
          </Link>
          <Link
            to="/cart"
            className="relative rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            Carrito
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <span className="max-w-[10rem] truncate text-sm text-slate-300">
                {user.displayName || user.email}
              </span>
              <Button variant="ghost" onClick={handleLogout} ariaLabel="Cerrar sesión">
                Salir
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" onClick={() => navigate('/login')} ariaLabel="Iniciar sesión">
                Ingresar
              </Button>
              <Button onClick={() => navigate('/register')} ariaLabel="Registrarse">
                Registro
              </Button>
            </div>
          )}
        </nav>

        <button
          className="rounded-lg p-2 text-slate-300 hover:bg-slate-800 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
        >
          <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-700 bg-slate-900 px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">
              Productos
            </Link>
            <Link to="/cart" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">
              Carrito {totalItems > 0 && `(${totalItems})`}
            </Link>
            {user ? (
              <>
                <span className="px-3 py-2 text-sm text-slate-400">{user.displayName || user.email}</span>
                <button
                  onClick={() => {
                    setMenuOpen(false)
                    handleLogout()
                  }}
                  className="rounded-lg px-3 py-2 text-left text-sm text-red-400 hover:bg-slate-800"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">
                  Ingresar
                </Link>
                <Link to="/register" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-slate-800">
                  Registro
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
