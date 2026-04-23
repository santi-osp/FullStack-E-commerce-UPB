import { useProductStore } from '../../store/productStore.js'

export default function SearchBar() {
  const search = useProductStore((s) => s.search)
  const selectedCategory = useProductStore((s) => s.selectedCategory)
  const categories = useProductStore((s) => s.categories)
  const setSearch = useProductStore((s) => s.setSearch)
  const setSelectedCategory = useProductStore((s) => s.setSelectedCategory)
  const loadProducts = useProductStore((s) => s.loadProducts)

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setTimeout(() => loadProducts(), 150)
  }

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value)
    setTimeout(() => loadProducts(), 0)
  }

  return (
    <div className="flex w-full flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <label htmlFor="search" className="sr-only">
          Buscar productos
        </label>
        <input
          id="search"
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Buscar productos..."
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[44px]"
        />
      </div>
      <div className="sm:w-56">
        <label htmlFor="category" className="sr-only">
          Filtrar por categoría
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full rounded-lg border border-slate-600 bg-slate-800 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[44px]"
        >
          <option value="">Todas las categorías</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}
