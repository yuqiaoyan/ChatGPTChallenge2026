import { useState, useRef, useEffect } from 'react'
import PlusMenu from './PlusMenu'
import './MessageInput.css'

const MAX_MESSAGE_LENGTH = 4000

function MessageInput({ onSendMessage, isLoading }) {
  const [value, setValue] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const textareaRef = useRef(null)
  const menuContainerRef = useRef(null)

  const canSend = value.trim().length > 0 && value.length <= MAX_MESSAGE_LENGTH

  useEffect(() => {
    if (!isLoading && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [isLoading])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuContainerRef.current && !menuContainerRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  const handleSubmit = () => {
    if (!canSend || isLoading) return

    onSendMessage(value)
    setValue('')

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleChange = (e) => {
    const newValue = e.target.value
    if (newValue.length <= MAX_MESSAGE_LENGTH) {
      setValue(newValue)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="message-input-container">
      <div className="message-input-wrapper">
        <div className="plus-button-container" ref={menuContainerRef}>
          <button className="input-btn" title="Attach" disabled={isLoading} onClick={toggleMenu}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
          <PlusMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        </div>

        <textarea
          ref={textareaRef}
          className="message-textarea"
          placeholder="Ask anything"
          rows="1"
          value={value}
          onChange={handleChange}
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

          <button
            className={`input-btn send-btn ${canSend ? 'active' : ''}`}
            title="Send message"
            disabled={!canSend || isLoading}
            onClick={handleSubmit}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
      <div className="input-footer">
        {value.length > 0 && (
          <span className={`char-count ${value.length >= MAX_MESSAGE_LENGTH ? 'limit-reached' : ''}`}>
            {value.length} / {MAX_MESSAGE_LENGTH}
          </span>
        )}
        <p className="input-disclaimer">ChatGPT can make mistakes. Check important info.</p>
      </div>
    </div>
  )
}

export default MessageInput
