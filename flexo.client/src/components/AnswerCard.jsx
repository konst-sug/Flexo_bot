import IconButton from "./IconButton";
import Copyicon from '../assets/icons/mdi-icons/mdi--content-copy.svg'
import ExxportAllicon from '../assets/icons/mdi-icons/mdi--content-save-all-outline.svg'
import Exporticon from '../assets/icons/mdi-icons/mdi--content-save-outline.svg'

export default function AnswerCard({ title = 'Ответ', text, isLoading }) {
  return (
    <section className="card answer-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
       
      <h2>{title}</h2>
      <div style={{ display: 'flex', gap: '4px' }}>
                <IconButton
                  icon={<img src={Copyicon}/>}
                  onClick={() => setMode('question')}
                  title="Копировать"
                  className="icon-button-small"
                />
                <IconButton
                  icon={<img src={Exporticon}/>}
                  onClick={() => setMode('multitext')}
                  title="Экспорт"
                  className="icon-button-small"
                />
                <IconButton
                  icon={<img src={ExxportAllicon}/>}
                  onClick={() => setMode('prompt')}
                  title="Экспорт чата"
                  className="icon-button-small"
                />
              </div></div>
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
