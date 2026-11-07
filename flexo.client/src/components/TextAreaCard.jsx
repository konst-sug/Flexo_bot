// components/TextareaCard.jsx
export default function TextareaCard({
  title,
  value,
  onChange,
  placeholder = '',
  rows = 10,
  cols = 80,
  minRows,
  maxRows,
  className = '',
  required = false,
  disabled = false,
  name,
}) {
  return (
    <section className={`card ${className}`}>
      <h2>{title}</h2>
      <textarea
        name={name}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        cols={cols}
        minLength={minRows ? undefined : undefined} // minLength не для строк, это про символы
        required={required}
        disabled={disabled}
        style={
          minRows || maxRows
            ? {
                minHeight: `${minRows * 1.5}rem`,
                maxHeight: `${maxRows * 1.5}rem`,
                resize: 'vertical',
              }
            : {}
        }
      />
    </section>
  );
}

