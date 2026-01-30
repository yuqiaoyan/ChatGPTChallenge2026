import { useEffect } from 'react'
import './ErrorToast.css'

function ErrorToast({ error, onClose, onRetry }) {
  useEffect(() => {
    if (error && !error.retryable) {
      const timer = setTimeout(() => {
        onClose()
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error, onClose])

  if (!error) return null

  return (
    <div className="error-toast">
      <div className="error-content">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <div className="error-text">
          <div className="error-title">{error.title}</div>
          <div className="error-message">{error.message}</div>
        </div>
        <div className="error-actions">
          {error.retryable && (
            <button className="retry-btn" onClick={onRetry}>
              Retry
            </button>
          )}
          <button className="close-btn" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorToast
