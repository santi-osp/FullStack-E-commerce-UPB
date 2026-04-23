export default function Badge({ children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-blue-600/20 px-2.5 py-0.5 text-xs font-medium text-blue-300 ${className}`}
    >
      {children}
    </span>
  )
}
