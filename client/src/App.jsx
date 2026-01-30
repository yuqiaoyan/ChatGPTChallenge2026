import { useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import ChatArea from './components/ChatArea'
import ErrorToast from './components/ErrorToast'
import useChat from './hooks/useChat'
import './App.css'

function App() {
  const {
    chatIds,
    chats,
    activeChat,
    activeChatId,
    isLoading,
    error,
    setError,
    createChat,
    switchChat,
    sendMessage,
    retryLastMessage
  } = useChat()

  const initializedRef = useRef(false)

  useEffect(() => {
    if (!initializedRef.current && chatIds.length === 0) {
      initializedRef.current = true
      createChat()
    }
  }, [chatIds, createChat])

  const handleNewChat = () => {
    createChat()
  }

  const handleChatSelect = (chatId) => {
    switchChat(chatId)
  }

  return (
    <div className="app">
      <ErrorToast
        error={error}
        onClose={() => setError(null)}
        onRetry={retryLastMessage}
      />
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onChatSelect={handleChatSelect}
      />
      <ChatArea
        activeChat={activeChat}
        isLoading={isLoading}
        onSendMessage={sendMessage}
      />
    </div>
  )
}

export default App
