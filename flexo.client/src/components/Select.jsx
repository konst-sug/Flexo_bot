export default function Select({
  label,
  value,
  onChange,
  options,
  placeholder = 'Выберите…',
  disabled = false,
  className = '',
}) {
  return (
    <label className={`select-wrapper ${className}`}>
      {label && <span className="select-label">{label}</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="select-input"
      >
        {!value && (
          <option value="" disabled hidden>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value ?? opt}>
            {opt.label ?? opt}
          </option>
        ))}
      </select>
    </label>
  );
}
