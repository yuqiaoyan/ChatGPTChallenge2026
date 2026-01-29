import ChatList from './ChatList'
import './Sidebar.css'

function Sidebar({ chats = [], activeChatId, onNewChat, onChatSelect }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <button className="sidebar-link" onClick={onNewChat}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14"/>
          </svg>
          <span>New chat</span>
        </button>

        <button className="sidebar-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <span>Search chats</span>
        </button>
      </div>

      <div className="sidebar-content">
        {chats.length > 0 && (
          <div className="sidebar-section">
            <div className="section-header">
              <span className="section-title">Recent</span>
            </div>
            <ChatList
              chats={chats}
              activeChatId={activeChatId}
              onChatSelect={onChatSelect}
            />
          </div>
        )}

        <div className="sidebar-section collapsed">
          <button className="section-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            <span className="section-title">Projects</span>
          </button>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
