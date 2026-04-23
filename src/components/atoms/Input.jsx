export default function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  error,
  autoComplete,
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-300">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        className={`w-full rounded-lg border bg-slate-800 px-3 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 min-h-[44px] ${
          error ? 'border-red-500' : 'border-slate-600'
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
