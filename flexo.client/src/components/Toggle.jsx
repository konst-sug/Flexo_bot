// src/components/Toggle.jsx
export default function Toggle({ isActive, onToggle, label }) {
    return (
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        cursor: 'pointer',
        userSelect: 'none'
      }}>
        {label && <span>{label}</span>}
        <div style={{
          position: 'relative',
          width: '48px',
          height: '28px',
          borderRadius: '14px',
          background: isActive ? '#4a90d9' : '#e0e0e0',
          transition: 'background 0.3s'
        }}>
          <input
            type="checkbox"
            checked={isActive}
            onChange={() => onToggle(!isActive)}
            style={{
              position: 'absolute',
              opacity: 0,
              cursor: 'pointer'
            }}
          />
          <div style={{
            position: 'absolute',
            top: '4px',
            left: isActive ? '20px' : '4px',
            width: '20px',
            height: '20px',
            background: '#fff',
            borderRadius: '50%',
            transition: 'left 0.3s',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
          }} />
        </div>
      </label>
    );
  }
  