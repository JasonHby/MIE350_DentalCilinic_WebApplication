import { statusClass } from '../lib/format'

export function StatusBadge({ status }) {
  return <span className={`status-badge status-${statusClass(status)}`}>{status || 'Unknown'}</span>
}

export function EmptyState({ title, body, action }) {
  return (
    <div className="empty-state">
      <h3>{title}</h3>
      {body ? <p>{body}</p> : null}
      {action}
    </div>
  )
}

export function Modal({ title, onClose, children, wide = false }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className={`modal-card${wide ? ' modal-card-wide' : ''}`}
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h3>{title}</h3>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close">
            x
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export function ToastStack({ toasts, dismissToast }) {
  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span>{toast.message}</span>
          <button type="button" className="icon-button" onClick={() => dismissToast(toast.id)} aria-label="Dismiss">
            x
          </button>
        </div>
      ))}
    </div>
  )
}
