import { useEffect, useRef } from 'react'
import Message from './Message'
import './MessageList.css'

function MessageList({ messages = [], isLoading = false }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const lastMessage = messages[messages.length - 1]
  const showLoadingDot = isLoading && (!lastMessage || lastMessage.role !== 'assistant' || !lastMessage.content)

  const isLastAssistantMessageStreaming = (messageId) => {
    return isLoading && lastMessage && lastMessage.id === messageId && lastMessage.role === 'assistant'
  }

  return (
    <div className="message-list">
      <div className="message-list-content">
        {messages.length > 0 ? (
          <>
            {messages.map(message => (
              <Message
                key={message.id}
                role={message.role}
                content={message.content}
                timestamp={message.timestamp}
                isStreaming={isLastAssistantMessageStreaming(message.id)}
              />
            ))}
            {showLoadingDot && (
              <div className="loading-message">
                <div className="loading-dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        ) : (
          <div className="empty-state">
            <h2>What's on your mind today?</h2>
            <p>Start a conversation to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageList
