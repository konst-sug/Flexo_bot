export default function AnswerCard({ title = 'Ответ', text, isLoading }) {
  return (
    <section className="card answer-card">
      <h2>{title}</h2>
      {isLoading ? (
        <p className="answer-text muted">Обрабатываем…</p>
      ) : text ? (
        <p className="answer-text">{text}</p>
      ) : (
        <p className="answer-text muted">Здесь появится ответ ассистента</p>
      )}
    </section>
  );
}
