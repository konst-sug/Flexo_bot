// SideModal.jsx
export default function SideModal({
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
          className={`side-panel ${size}`}
          onClick={(e) => e.stopPropagation()} // клик по контенту не закрывает
        >
          <header className="modal-header">
            <h3>{title}</h3>
            <button type="button" className="modal-close" onClick={onClose}>
              ×
            </button>
          </header>
  
          <div className="modal-body">{children}</div>
        </div>
      </div>
    );
  }
  