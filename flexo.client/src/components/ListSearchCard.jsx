export default function ListSearchCard({ title, items, emptyText = 'Ничего не найдено', renderItem }) {
  const [query, setQuery] = useState('');

  const filtered = items.filter((it) =>
    it.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <section className="card">
      <h2>{title}</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>
          Запрос
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Введите часть названия"
          />
        </label>
      </form>
      <ul className="list">
        {filtered.length === 0 && <li>{emptyText}</li>}
        {filtered.map((it, i) => (
          <li key={i}>{renderItem ? renderItem(it) : it}</li>
        ))}
      </ul>
    </section>
  );
}
