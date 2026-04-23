import Button from '../atoms/Button.jsx'
import { useProductStore } from '../../store/productStore.js'

export default function PaginationControls() {
  const pagination = useProductStore((s) => s.pagination)
  const page = useProductStore((s) => s.page)
  const setPage = useProductStore((s) => s.setPage)
  const loadProducts = useProductStore((s) => s.loadProducts)

  const goTo = (p) => {
    setPage(p)
    setTimeout(() => loadProducts(), 0)
  }

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <Button
        variant="outline"
        onClick={() => goTo(page - 1)}
        disabled={!pagination.hasPreviousPage}
        ariaLabel="Página anterior"
      >
        Anterior
      </Button>
      <span className="text-sm text-slate-400">
        Página {page} de {pagination.totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => goTo(page + 1)}
        disabled={!pagination.hasNextPage}
        ariaLabel="Página siguiente"
      >
        Siguiente
      </Button>
    </div>
  )
}
