# Technical Specification

**Last Updated:** 2026-01-26

---

## Technology Stack

- **Frontend Framework:** React 18+ with functional components and hooks
- **Build Tool:** Vite (fast development server and build)
- **Backend Framework:** Express.js
- **Runtime:** Node.js 18+
- **AI Provider:** OpenAI API (GPT-4/3.5-turbo)
- **Storage:** Browser localStorage
- **Styling:** CSS modules or plain CSS
- **HTTP Client:** Axios (frontend to backend communication)
- **Package Manager:** npm
- **Development:** Hot module replacement via Vite

---

## Project Structure

```
ChatGPTChallenge/
├── client/                     # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatList.jsx
│   │   │   ├── ChatArea.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── Message.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── Header.jsx
│   │   ├── hooks/
│   │   │   ├── useLocalStorage.js
│   │   │   └── useChat.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/                     # Express backend
│   ├── routes/
│   │   └── chat.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── server.js
│   └── package.json
├── Designs/                    # UI reference images
│   ├── ChatGPTDefaultUI.png
│   └── ChatGPTUI.png
├── Project Memory/             # Project documentation
│   ├── product-spec.md
│   ├── technical-spec.md       # This file
│   └── progress.md
├── .env                        # Environment variables (not committed)
├── .env.example                # Environment template
├── .gitignore
└── README.md
```

---

## Data Architecture

### Backend API Endpoints

**Base URL:** `http://localhost:3001/api`

#### POST /api/chat
Sends message to OpenAI and streams response back.

**Request Body:**
```javascript
{
  messages: [
    { role: 'user', content: 'Hello' },
    { role: 'assistant', content: 'Hi there!' },
    { role: 'user', content: 'How are you?' }
  ]
}
```

**Response:**
- Server-Sent Events (SSE) stream
- Each chunk contains partial response text
- Final event signals completion

**Headers:**
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

### LocalStorage Schema

**Storage Keys:**
```javascript
const STORAGE_KEYS = {
  CHATS: 'chatgpt-chats',           // Array of chat IDs
  CHAT_PREFIX: 'chatgpt-chat-',     // Prefix for individual chats
  ACTIVE_CHAT: 'chatgpt-active-chat' // Currently active chat ID
}
```

**Chat Object Structure:**
```javascript
{
  id: string,              // UUID v4
  title: string,           // Auto-generated from first user message
  messages: [
    {
      id: string,          // Unique message ID
      parentId: string | null,  // Parent message ID for threading (null for root messages)
      childrenIds: string[],    // Array of child message IDs for branching
      role: 'user' | 'assistant',
      content: string,
      timestamp: number    // Unix timestamp
    }
  ],
  createdAt: number,       // Unix timestamp
  updatedAt: number        // Unix timestamp
}
```

**Note on Message Structure:**
- `parentId` and `childrenIds` enable tree-structured conversations for the multi-threading feature (Article 4)
- **In the base version**: All messages have `parentId: null` and `childrenIds: []`
- **In Article 4**: These fields enable branching conversations and thread spawning
- Including these fields from day one avoids data migration and demonstrates forward-thinking architecture

**Example localStorage content:**
```javascript
{
  'chatgpt-chats': ['uuid-1', 'uuid-2', 'uuid-3'],
  'chatgpt-chat-uuid-1': {
    id: 'uuid-1',
    title: 'React Hooks Discussion',
    messages: [
      {
        id: 'msg-1',
        parentId: null,           // Root message in base version
        childrenIds: [],          // Empty in base version
        role: 'user',
        content: 'What are React hooks?',
        timestamp: 1234567890
      },
      {
        id: 'msg-2',
        parentId: null,           // Treated as linear in base version
        childrenIds: [],
        role: 'assistant',
        content: 'React hooks are...',
        timestamp: 1234567891
      }
    ],
    createdAt: 1234567890,
    updatedAt: 1234567891
  },
  'chatgpt-chat-uuid-2': { /* chat object */ },
  'chatgpt-chat-uuid-3': { /* chat object */ },
  'chatgpt-active-chat': 'uuid-1'
}
```

---

## Design System

### Color Theme

CSS Variables:
```css
:root {
  --background: #ffffff;
  --background-secondary: #f7f7f8;
  --foreground: #000000;
  --foreground-muted: #6e6e80;
  --border: #e5e5e5;
  --border-hover: #c5c5d2;
  --primary: #10a37f;
  --primary-hover: #0e8f6f;
  --danger: #ef4444;
  --danger-hover: #dc2626;
  --user-message-bg: #f4f4f4;
  --assistant-message-bg: #ffffff;
  --sidebar-bg: #f7f7f8;
  --hover-bg: #ececf1;
}
```

### Typography

- **Font Stack:** -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif
- **Base Size:** 16px
- **Scale:**
  - Small: 0.875rem (14px)
  - Base: 1rem (16px)
  - Large: 1.125rem (18px)
  - Heading: 1.5rem (24px)

### Component Patterns

**Buttons:**
- Primary: Green background (#10a37f), white text, rounded corners
- Secondary: Gray background, dark text
- Hover: Slightly darker shade
- Disabled: Reduced opacity (0.6)

**Input Fields:**
- Border: 1px solid var(--border)
- Rounded corners: 8px
- Padding: 12px
- Focus: Border color changes to primary

**Chat Messages:**
- User messages: Right-aligned, light gray background
- Assistant messages: Left-aligned, white background
- Padding: 16px
- Border radius: 12px
- Max width: 70% of container

---

## Core Behaviors

### Chat Management

**Creating New Chat:**
1. Generate UUID v4 for chat ID
2. Create empty chat object with metadata
3. Add chat ID to 'chatgpt-chats' array at beginning
4. Set as active chat
5. Save to localStorage
6. Update UI to show empty chat

**Loading Chat:**
1. Read chat ID from parameter or localStorage
2. Retrieve chat object using CHAT_PREFIX + id
3. Parse and validate data structure
4. Render messages in MessageList component
5. Set as active chat

**Auto-generating Chat Titles:**
1. After first user message is sent
2. Take first 50 characters of user message
3. Truncate at word boundary
4. Add "..." if truncated
5. Update chat title in localStorage
6. Refresh sidebar to show updated title

### Message Operations

**Sending Message:**
1. Create message object with `parentId: null` and `childrenIds: []`
2. Add user message to local state immediately (optimistic update)
3. Save to localStorage
4. Send conversation history to backend /api/chat endpoint
5. Stream assistant response (also with `parentId: null`, `childrenIds: []`)
6. Update UI word-by-word as chunks arrive
7. Save complete assistant response to localStorage
8. Update chat's updatedAt timestamp

**Note:** In the base version, the tree fields are always set to default values. Article 4 will use these to create branching conversations.

**Continuing Old Chats:**
1. User clicks chat in sidebar
2. Load full message history from localStorage
3. Display all messages in MessageList
4. Enable input field for new messages
5. New messages append to existing conversation
6. Full conversation context sent to OpenAI API

### Response Streaming

**Implementation:**
1. Frontend opens SSE connection to backend
2. Backend calls OpenAI API with stream: true
3. Backend forwards each chunk to frontend via SSE
4. Frontend appends chunks to growing message
5. On stream end, mark message as complete
6. Save to localStorage

---

## API Integration

### OpenAI API Configuration

**Endpoint:** https://api.openai.com/v1/chat/completions

**Request Format:**
```javascript
{
  model: "gpt-4" or "gpt-3.5-turbo",
  messages: [...conversationHistory],
  stream: true,
  temperature: 0.7,
  max_tokens: 2048
}
```

**Authentication:**
```
Authorization: Bearer ${OPENAI_API_KEY}
```

**Error Handling:**
- 401: Invalid API key
- 429: Rate limit exceeded
- 500: OpenAI service error
- Network errors: Retry with exponential backoff

---

## Custom Hooks

### useLocalStorage
Manages localStorage operations with React state sync.

**API:**
```javascript
const [value, setValue, removeValue] = useLocalStorage(key, initialValue)
```

**Features:**
- Automatic JSON serialization/deserialization
- React state sync
- Error handling for localStorage failures
- Support for complex objects

### useChat
Manages chat state and operations.

**API:**
```javascript
const {
  chats,              // Array of all chats
  activeChat,         // Currently active chat object
  createChat,         // Function to create new chat
  loadChat,           // Function to load existing chat
  sendMessage,        // Function to send message
  isLoading           // Boolean loading state
} = useChat()
```

**State Management:**
- Maintains list of all chats
- Tracks active chat
- Handles message sending
- Manages loading states
- Syncs with localStorage

---

## Component Architecture

### Hierarchy

```
App
├── Sidebar
│   ├── NewChatButton
│   ├── SearchInput (UI only)
│   └── ChatList
│       └── ChatItem (multiple)
└── ChatArea
    ├── Header
    │   ├── VersionDropdown (UI only)
    │   └── ShareButton (UI only)
    ├── MessageList
    │   └── Message (multiple)
    │       └── MessageContent
    └── MessageInput
        ├── PlusButton (UI only)
        ├── Textarea
        ├── MicrophoneButton (UI only)
        └── AudioButton (UI only)
```

### Component Responsibilities

**App:**
- Route management (if using router)
- Global state provider
- Layout structure

**Sidebar:**
- Display chat list
- Handle chat selection
- Trigger new chat creation

**ChatArea:**
- Display active chat
- Render messages
- Handle message input

**MessageList:**
- Render all messages in conversation
- Auto-scroll to bottom
- Handle empty states

**Message:**
- Display single message
- Distinguish between user and assistant styling
- Support rendering markdown/code blocks

**MessageInput:**
- Multi-line text input
- Send on Enter, newline on Shift+Enter
- Character count (optional)
- Loading state during API calls

---

## Security Considerations

### API Key Protection
- Store OPENAI_API_KEY in server-side .env file only
- Never expose API key to frontend
- All OpenAI requests go through backend proxy
- .env file in .gitignore

### Input Validation
- Sanitize user input before storing
- Validate message format before API calls
- Limit message length (e.g., 4000 characters)

### CORS Configuration
- Allow only specific frontend origin in production
- Development: Allow localhost:5173 (Vite default)

### localStorage Security
- Data stored locally, not transmitted
- No sensitive information in localStorage
- User responsible for their own data

---

## Error Handling

### API Errors
```javascript
{
  '401': 'Invalid API key. Please check your .env configuration.',
  '429': 'Rate limit exceeded. Please try again later.',
  '500': 'OpenAI service error. Please try again.',
  'NETWORK_ERROR': 'Network connection failed. Check your internet.',
  'STREAM_ERROR': 'Response streaming failed. Message may be incomplete.'
}
```

### localStorage Errors
- QuotaExceededError: Warn user to clear old chats
- Parse errors: Reset corrupted data
- Fallback to empty state if data invalid

---

## Testing Strategy

### Manual Testing Checklist
- [ ] Create new chat
- [ ] Send messages and receive responses
- [ ] Switch between multiple chats
- [ ] Load old chat and add new messages
- [ ] Refresh page (persistence check)
- [ ] Handle API errors gracefully
- [ ] Test on mobile viewport
- [ ] Test keyboard navigation
- [ ] Test very long conversations (scrolling)
- [ ] Test multiline message input (Shift+Enter)

### Future Automated Testing
- Unit tests for hooks (useChat, useLocalStorage)
- Component tests with React Testing Library
- E2E tests with Playwright
- API endpoint tests

---

## Deployment Configuration

### Development

**Backend:**
```bash
cd server
npm install
npm run dev  # Uses nodemon for hot reload
```

**Frontend:**
```bash
cd client
npm install
npm run dev  # Vite dev server on port 5173
```

### Production Build

**Frontend:**
```bash
cd client
npm run build  # Outputs to dist/
```

**Backend:**
```bash
cd server
npm start  # Production mode
```

### Environment Variables

**Development (.env):**
```
OPENAI_API_KEY=sk-...
PORT=3001
NODE_ENV=development
```

**Production:**
- Set environment variables in deployment platform
- Never commit .env file
- Use .env.example as template

---

## Performance Considerations

### Optimization Strategies
- Debounce localStorage writes (batch updates)
- Lazy load old messages for very long chats
- Virtual scrolling for 100+ messages
- Memoize components with React.memo
- Code splitting for future feature modules

### Bundle Size
- Keep dependencies minimal
- Tree-shake unused code
- Analyze bundle with vite-bundle-visualizer

---

## Browser Compatibility

**Minimum Requirements:**
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Required APIs:**
- localStorage
- Fetch API
- EventSource (SSE)
- ES6+ features

---

## Future Technical Enhancements

### Folder Attachment (Article 1)
- File system access API or electron wrapper
- Google Drive API integration
- File indexing and search
- Context window management for large files

### Tasks/Automations (Article 2)
- Node-cron for scheduling recurring tasks
- Background job queue for task execution
- Task state persistence and history
- Webhook support for event-based triggers
- **Tool Integration Framework:**
  - OpenAI Function Calling for tool selection
  - Google Calendar API integration (OAuth 2.0)
  - Web search API integration (e.g., Serper, Bing Search API)
  - Extensible tool registry pattern
  - Tool authentication/credential management
- **Task Architecture:**
  - Task definition schema (prompt, schedule, enabled tools)
  - Tool result handling and formatting
  - Error handling for tool failures
  - Task execution logs with tool call details

### Multi-threaded Conversations (Article 4)
- Message tree structure already in place (parentId, childrenIds)
- Thread spawning logic (update parentId and childrenIds)
- Thread UI components and visualization
- Thread navigation and merging logic
- Algorithm to traverse message tree and render branches

---

## Tool Integration Architecture (For Tasks Feature)

### Overview
The Tasks feature will support external tool integration, allowing ChatGPT to access APIs and services during task execution.

### Tool Framework Design

**Tool Registry:**
```javascript
const TOOLS = {
  google_calendar: {
    name: 'google_calendar',
    description: 'Access Google Calendar events',
    auth: 'oauth2',
    methods: ['list_events', 'create_event', 'update_event']
  },
  web_search: {
    name: 'web_search',
    description: 'Search the web for information',
    auth: 'api_key',
    methods: ['search']
  }
}
```

**OpenAI Function Calling Integration:**
```javascript
// Task execution with tools enabled
{
  model: "gpt-4",
  messages: [...],
  tools: [
    {
      type: "function",
      function: {
        name: "google_calendar_list_events",
        description: "List calendar events for a date range",
        parameters: { /* JSON schema */ }
      }
    }
  ]
}
```

**Tool Execution Flow:**
1. User creates task with enabled tools
2. Task triggers (scheduled or on-demand)
3. OpenAI API called with function definitions
4. Model decides which tools to call
5. Backend executes tool calls (calendar API, search API, etc.)
6. Tool results returned to OpenAI
7. Model synthesizes final response
8. Response saved to task history

**Security Considerations:**
- OAuth tokens stored server-side only
- Per-user credential isolation
- Tool permission system (user approves tool access)
- Rate limiting for API calls
- Audit logging for all tool executions

**Future Tool Additions:**
- Email integration (Gmail API)
- File system access
- Database queries
- Custom webhooks
- Weather API
- Stock market data
- News feeds

---

**End of Technical Specification**
