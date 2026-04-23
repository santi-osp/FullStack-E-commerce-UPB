import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'
import Button from '../components/atoms/Button.jsx'
import Input from '../components/atoms/Input.jsx'

export default function RegisterPage() {
  const register = useAuthStore((s) => s.register)
  const error = useAuthStore((s) => s.error)
  const clearError = useAuthStore((s) => s.clearError)
  const isLoading = useAuthStore((s) => s.isLoading)
  const navigate = useNavigate()

  const [form, setForm] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [localError, setLocalError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    setLocalError('')

    if (form.password !== form.confirmPassword) {
      setLocalError('Las contraseñas no coinciden.')
      return
    }
    if (form.password.length < 6) {
      setLocalError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    const ok = await register({
      displayName: form.displayName,
      email: form.email,
      password: form.password,
    })
    if (ok) navigate('/')
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="mb-6 text-center text-2xl font-bold text-white">Crear cuenta</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="displayName"
          label="Nombre completo"
          value={form.displayName}
          onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
          required
        />
        <Input
          id="email"
          label="Correo electrónico"
          type="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          required
          autoComplete="email"
        />
        <Input
          id="password"
          label="Contraseña"
          type="password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          required
          autoComplete="new-password"
        />
        <Input
          id="confirmPassword"
          label="Confirmar contraseña"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
          required
          autoComplete="new-password"
        />

        {(error || localError) && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
            {localError || error}
          </div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full" ariaLabel="Registrarse">
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="text-blue-400 hover:underline">
          Inicia sesión
        </Link>
      </p>
    </div>
  )
}
