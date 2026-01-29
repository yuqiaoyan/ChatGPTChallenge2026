import './ChatList.css'

function ChatList({ chats = [], activeChatId, onChatSelect }) {
  return (
    <div className="chat-list">
      {chats.map(chat => (
        <div
          key={chat.id}
          className={`chat-item ${activeChatId === chat.id ? 'active' : ''}`}
          onClick={() => onChatSelect(chat.id)}
        >
          <span className="chat-title">{chat.title}</span>
        </div>
      ))}
    </div>
  )
}

export default ChatList
