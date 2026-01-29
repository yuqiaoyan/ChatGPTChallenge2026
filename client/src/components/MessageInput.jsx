import { useState, useRef, useEffect } from 'react'
import './MessageInput.css'

function MessageInput({ onSendMessage, isLoading }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isLoading])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  const handleSubmit = () => {
    if (!value.trim() || isLoading) return

    onSendMessage(value)
    setValue('')

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="message-input-container">
      <div className="message-input-wrapper">
        <button className="input-btn" title="Attach" disabled={isLoading}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        <textarea
          ref={textareaRef}
          className="message-textarea"
          placeholder="Ask anything"
          rows="1"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />

        <div className="input-actions">
          <button className="input-btn" title="Microphone" disabled={isLoading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </button>

          <button className="input-btn" title="Audio" disabled={isLoading}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default MessageInput
