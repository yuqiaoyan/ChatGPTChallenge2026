import Header from './Header'
import MessageList from './MessageList'
import MessageInput from './MessageInput'
import './ChatArea.css'

function ChatArea({ activeChat, isLoading, onSendMessage }) {
  return (
    <main className="chat-area">
      <Header />
      <MessageList messages={activeChat?.messages || []} isLoading={isLoading} />
      <MessageInput isLoading={isLoading} onSendMessage={onSendMessage} />
    </main>
  )
}

export default ChatArea
