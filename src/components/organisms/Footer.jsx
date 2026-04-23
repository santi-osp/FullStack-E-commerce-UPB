export default function Footer() {
  return (
    <footer className="border-t border-slate-700 bg-slate-900">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} UPB Store. Todos los derechos reservados.
          </p>
          <p className="text-xs text-slate-500">
            Desarrollado para el reto FullStack UPB
          </p>
        </div>
      </div>
    </footer>
  )
}
