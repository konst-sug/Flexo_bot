export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md', // sm | md | lg
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className={`modal-content ${size}`}
        onClick={(e) => e.stopPropagation()} // чтобы клик по контенту не закрывал
      >
        <header className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}
