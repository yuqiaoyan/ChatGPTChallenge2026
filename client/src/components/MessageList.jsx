import { useEffect, useRef } from 'react'
import Message from './Message'
import './MessageList.css'

function MessageList({ messages = [] }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
              />
            ))}
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
