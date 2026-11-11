import useTypewriter from "../hooks/useTypewriter";
import IconButton from "./IconButton";
import Copyicon from '../assets/icons/mdi-icons/mdi--content-copy.svg'
import ExxportAllicon from '../assets/icons/mdi-icons/mdi--content-save-all-outline.svg'
import Exporticon from '../assets/icons/mdi-icons/mdi--content-save-outline.svg'

// добавлен prop role, всё остальное без изменений
export default function AnswerCard({ title = 'Ответ', text, isLoading, role = 'assistant' }) {
  const shownText = useTypewriter(role === 'assistant' ? text : text); // печатает только ответ — см. примечание ниже
  const isUser = role === 'user';

  return (
    // к классу добавили модификатор, остальная разметка та же
    <section className={`card answer-card ${isUser ? 'answer-card--user' : 'answer-card--assistant'}`}>
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
        <p className="answer-text">{shownText}</p>
      ) : (
        <p className="answer-text muted">Здесь появится ответ ассистента</p>
      )}
    </section>
  );
}

