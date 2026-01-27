# ChatGPT Challenge - Product Specification

**Version:** 1.0
**Last Updated:** 2026-01-26
**Status:** Initial Setup

---

## 1. Project Overview

### 1.1 Purpose
ChatGPT Challenge is a minimal ChatGPT web app clone that serves as the foundation for three tutorial articles demonstrating advanced chat features: folder attachment capabilities (local/Google Drive), automation systems (scheduled/on-demand prompts), and multi-threaded conversations (paragraph-level chat instances). This project is also designed as a code challenge for Product Managers to fork and extend with their own features.

### 1.2 Target Audience
- Product Managers wanting to experiment with chat features
- Developers learning chat application architecture
- Tutorial readers following the three planned articles
- Technical and non-technical users interested in AI chat prototypes
- PMs joining the code challenge to build additional features

### 1.3 Core Value Proposition
- Clean, understandable codebase that's easy to fork and modify
- Foundation that supports three advanced features for tutorial content
- Authentic ChatGPT experience with minimal complexity
- Secure credential management suitable for public repositories
- Extensible architecture encouraging community contributions

---

## 2. Technical Requirements

### 2.1 Technology Stack
- **Frontend Framework:** React with functional components and hooks
- **Backend:** Node.js with Express
- **AI API:** OpenAI API (GPT-4/3.5) with streaming support
- **Storage:** Browser localStorage (no authentication required)
- **Styling:** CSS modules or plain CSS matching provided UI designs
- **Build Tool:** Vite (for fast development)

### 2.2 Performance & Responsiveness
- Real-time streaming responses from OpenAI API
- Responsive layout supporting mobile, tablet, and desktop
- Instant chat switching with localStorage persistence
- Smooth animations and transitions

### 2.3 Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge - latest 2 versions)
- JavaScript enabled required
- localStorage enabled required

### 2.4 Accessibility
- Keyboard navigation support
- Semantic HTML elements
- ARIA labels where appropriate

---

## 3. Data Architecture

### 3.1 Primary Data Source
**Source:** OpenAI API
**Authentication:** API key stored in server-side `.env` file

**API Endpoints Used:**
- `/v1/chat/completions` - Chat completion with streaming

### 3.2 Local Storage Schema
```javascript
{
  'chatgpt-chats': [chatId1, chatId2, ...],  // Array of chat IDs (sorted by most recent)
  'chatgpt-chat-{id}': {                      // Individual chat data
    id: string (UUID),
    title: string (auto-generated from first message),
    messages: [
      {
        id: string,                          // Unique message ID
        parentId: string | null,             // Parent message for threading (null in base version)
        childrenIds: string[],               // Child messages for branching (empty in base version)
        role: 'user' | 'assistant',
        content: string,
        timestamp: Date
      }
    ],
    createdAt: Date,
    updatedAt: Date
  },
  'chatgpt-active-chat': chatId              // Currently active chat ID
}
```

**Design Note:** The `parentId` and `childrenIds` fields enable tree-structured conversations for the multi-threading feature (Article 4). In the base version, these are always `null` and `[]` respectively, representing a simple linear conversation. This forward-thinking design avoids data migration when implementing advanced features.

---

## 4. Page/Feature Specifications

### 4.1 Main Chat Interface

#### Layout
```
┌─────────────┬──────────────────────────────────────────┐
│   SIDEBAR   │            MAIN CHAT AREA               │
│             │                                          │
│ [New Chat]  │  Header: ChatGPT 5.2 ▼ [Share] [...]   │
│             │                                          │
│ 🔍 Search   │  ┌────────────────────────────────────┐ │
│             │  │                                    │ │
│ Chat List:  │  │    Message History                 │ │
│ • Chat 1    │  │    (user/assistant messages)       │ │
│ • Chat 2    │  │    (with edit/delete options)      │ │
│ • Chat 3    │  │                                    │ │
│             │  │                                    │ │
│ Projects ▶  │  └────────────────────────────────────┘ │
│             │                                          │
│             │  [+] Ask anything  [🎤] [🎵]            │
└─────────────┴──────────────────────────────────────────┘
```

#### Components
- **Sidebar**: New chat button, search input (UI only), chat list, projects section (collapsed)
- **Header**: Version dropdown (UI only), share button (UI only), menu
- **MessageList**: Scrollable message history with user/assistant styling
- **MessageInput**: Multiline textarea with "+" button, microphone, audio buttons

#### User Flows

**Creating a New Chat:**
1. User clicks "New chat" button
2. System generates new chat with unique ID
3. Empty chat view appears with "What's on your mind today?"
4. User types first message
5. System auto-generates chat title from first message (not editable in base version)
6. Chat appears in sidebar list

**Sending a Message:**
1. User types message in input field
2. User presses Enter (or Send button)
3. Message appears in chat history immediately
4. Loading indicator shows
5. Assistant response streams in word-by-word
6. Response completes and is saved to localStorage

**Switching Chats:**
1. User clicks a chat in the sidebar list
2. System loads chat data from localStorage
3. Message history displays
4. Input field ready for new messages
5. User can continue conversation by sending new messages

#### Edge Cases
- **No chats exist**: Show empty state with centered "What's on your mind today?"
- **API key missing**: Display error message with setup instructions
- **Network failure**: Show error, allow retry
- **Long messages**: Textarea auto-expands, messages wrap properly
- **localStorage full**: Warn user, suggest clearing old chats
- **Returning to old chats**: Full message history loads, user can add new messages

---

## 5. User Experience Specifications

### 5.1 Navigation
- Single-page application (no page refreshes)
- Sidebar always visible on desktop
- Collapsible sidebar on mobile (hamburger menu)
- Click chat in list to switch contexts

### 5.2 Visual Design Principles
- Clean, modern aesthetic matching ChatGPT design
- Light color scheme (white background, light grays)
- Clear visual hierarchy
- Generous whitespace
- Subtle shadows and borders

### 5.3 Interaction Patterns
- Hover effects on clickable elements
- Smooth transitions between states
- Loading states for async operations
- Enter to send message, Shift+Enter for new line
- Auto-scroll to bottom on new messages
- Click any past chat to load and continue conversation

### 5.4 Mobile Optimization
- Collapsible sidebar accessed via hamburger menu
- Touch-friendly tap targets (minimum 44x44px)
- Responsive typography
- Full-screen chat area on mobile

---

## 6. Future Features (Post-MVP)

### 6.1 Folder Attachment (Tutorial Article 1)
- [ ] Folder selection UI in sidebar
- [ ] Local folder browser integration
- [ ] Google Drive folder integration
- [ ] File content extraction and indexing
- [ ] Context augmentation for chat messages
- [ ] File preview components

### 6.2 Tasks/Automations (Tutorial Article 2)
- [ ] Task management UI
- [ ] Prompt editor for tasks
- [ ] Cron-style scheduler for recurring tasks
- [ ] On-demand trigger system
- [ ] Tool integration framework (web search, calendar access, etc.)
- [ ] Google Calendar integration for task context
- [ ] Web search capability for tasks
- [ ] Task execution history and logs
- [ ] Enable/disable individual tasks
- [ ] Task output notifications

**Example Use Cases:**
- "Check my calendar for important meetings this month"
- "Search for latest news on [topic] and summarize"
- "Review my calendar daily at 8am and send me a summary"

### 6.3 Multi-threaded Conversations (Tutorial Article 4)
- [ ] Thread spawning UI on message hover
- [ ] Logic to update parentId and childrenIds when spawning threads
- [ ] Thread visualization in sidebar (tree structure)
- [ ] Algorithm to traverse and render message tree
- [ ] Thread navigation (switch between branches)
- [ ] Thread merging and management
- [ ] Visual indicators for active threads

**Note:** Message data structure already supports threading via `parentId` and `childrenIds` fields included in base version.

### 6.4 Community Challenge Features
Ideas for PMs to build as part of the code challenge:
- [ ] Message editing and deletion capabilities
- [ ] Conversation export (JSON/Markdown/PDF)
- [ ] Dark mode toggle
- [ ] Editable chat titles
- [ ] Chat search functionality
- [ ] Message reactions
- [ ] Code syntax highlighting
- [ ] Image generation support
- [ ] Voice input (functional microphone button)
- [ ] Chat sharing with public URLs
- [ ] Chat folders/organization
- [ ] Tags and labels for chats
- [ ] Prompt templates library

---

## 7. Technical Considerations

### 7.1 Security
- API keys stored server-side only (never exposed to frontend)
- `.env` file never committed to git
- `.env.example` provides template for other users
- Input sanitization for user messages
- CORS properly configured

### 7.2 State Management
- Custom React hooks (useChat, useLocalStorage)
- No Redux or Context API needed (too complex for prototype)
- LocalStorage as single source of truth
- React component state for UI interactions

### 7.3 Performance Optimization
- Streaming API responses for real-time feel
- Virtual scrolling for very long chat histories (future)
- Lazy loading of old messages (future)
- Debounced search (when search becomes functional)

### 7.4 Extensibility for Future Features
- Chat data structure supports metadata fields for extensions
- Message objects can include thread references and custom properties
- Sidebar structure allows adding new sections
- API layer abstracted for easy modification
- Component architecture supports plugin-style additions
- Clear separation of concerns for easy feature additions

---

## 8. Success Metrics

### For Base Version
- **Setup Time:** Other PMs can clone and run in < 10 minutes
- **Code Clarity:** Readable without extensive comments
- **Functionality:** All core features (chat creation, message sending, streaming, chat continuation) work as expected
- **Security:** No credentials accidentally committed
- **Foundation:** Supports all three planned tutorial features

### For Code Challenge
- **Extensibility:** Architecture allows adding new features without major refactoring
- **Scalability:** Code structure supports growth in features and complexity
- **Community Adoption:** PMs successfully fork and build their own features
- **Documentation Quality:** Clear enough for non-technical PMs to understand
- **Feature Compatibility:** New features don't break existing functionality

---

## 9. Open Questions

### Resolved
- ✅ Message editing: NO, removed to keep UX simple and clear
- ✅ Message deletion: NO, removed to keep UX simple and clear
- ✅ Continue old conversations: YES, users can add new messages to any past chat
- ✅ Conversation export: NO, saved for community challenge
- ✅ Editable chat titles: NO, saved for community challenge
- ✅ Dark mode: NO, saved for community challenge

### Still To Decide
- [ ] Maximum number of chats to retain in localStorage before suggesting cleanup?
- [ ] Should we include rate limiting or usage tracking?
- [ ] Do we want analytics/telemetry for understanding usage patterns?
- [ ] Should there be a "system message" capability for custom instructions?

---

## 10. Resources & References

### External Links
- OpenAI API Documentation: https://platform.openai.com/docs
- React Documentation: https://react.dev
- Express.js Documentation: https://expressjs.com

### Design Assets
- Designs/ChatGPTDefaultUI.png: Empty state design reference
- Designs/ChatGPTUI.png: Active conversation design reference

---

## 11. Appendix

### A. Environment Variables Required
```
OPENAI_API_KEY=your_openai_api_key_here
PORT=3001  # Backend server port (optional, defaults to 3001)
```

### B. Pre-Launch Checklist
- [ ] All core features implemented (chat creation, message sending, streaming)
- [ ] Chat continuation functionality (load old chats, add new messages)
- [ ] Manual testing completed
- [ ] .env security verified
- [ ] README.md written with setup instructions
- [ ] Example .env file created
- [ ] Git repository initialized
- [ ] .gitignore configured properly
- [ ] Architecture documented for extensibility

---

**End of Specification**
