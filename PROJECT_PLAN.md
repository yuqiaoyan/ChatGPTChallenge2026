# ChatGPT Clone - Implementation Plan & Todo List

## Project Overview
Building a minimal ChatGPT web app clone as the foundation for three tutorial articles:
1. **Article 1**: Folder attachment feature (local/Google Drive integration)
2. **Article 2**: Automation system (scheduled/on-demand prompts)
3. **Article 3**: Multi-threaded conversations (paragraph-level chat instances)

This document covers the **base ChatGPT clone** that will support these future features.

---

## Technology Stack
- **Frontend**: React with functional components and hooks
- **Backend**: Node.js with Express
- **Storage**: Browser localStorage (no authentication, single-user per browser)
- **AI API**: OpenAI API (GPT-4/3.5)
- **Styling**: CSS modules or styled-components (matching provided UI designs)

---

## Core Features (Minimal Viable Clone)

### 1. Chat Management
- Display list of recent chats in left sidebar
- Create new chat functionality
- Load/switch between existing chats
- Auto-generate chat titles from first message
- Store chat history in localStorage

### 2. Message Interface
- Send messages to OpenAI API
- Display user and assistant messages
- Real-time streaming responses (OpenAI streaming API)
- Message input with multiline support
- Responsive layout matching provided designs

### 3. UI Components (from designs)
- **Left Sidebar**:
  - "New chat" button
  - "Search chats" option (UI only, non-functional initially)
  - Chat list with timestamps
  - User projects section (collapsed by default)
- **Main Chat Area**:
  - Header with ChatGPT version dropdown (UI only)
  - Message history with alternating user/assistant styling
  - Input box with "+" button and placeholder "Ask anything"
  - Microphone and audio waveform buttons (UI only, non-functional)
  - Share button (UI only, non-functional)
- **Empty State**: "What's on your mind today?" centered message

### 4. Security & Credential Management
- Store OpenAI API key in `.env` file (never committed)
- Include `.env.example` with placeholder values
- Add comprehensive `.gitignore` for Node.js projects
- Document API key setup in README

---

## Project Structure
```
ChatGPTChallenge/
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx
│   │   │   ├── ChatList.jsx
│   │   │   ├── ChatArea.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageInput.jsx
│   │   │   └── Header.jsx
│   │   ├── hooks/
│   │   │   ├── useLocalStorage.js
│   │   │   └── useChat.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
├── server/                  # Express backend
│   ├── routes/
│   │   └── chat.js
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── server.js
│   └── package.json
├── Designs/                 # UI reference images
│   ├── ChatGPTDefaultUI.png
│   └── ChatGPTUI.png
├── .env.example
├── .gitignore
├── PROJECT_PLAN.md          # This file
└── README.md
```

---

## Implementation Todo List

### Phase 1: Project Setup ✅
- [ ] **1.1** Set up project structure with client and server folders
- [ ] **1.2** Initialize React app using Vite
- [ ] **1.3** Set up Express server with basic configuration
- [ ] **1.4** Create .env.example and .gitignore files
- [ ] **1.5** Install frontend dependencies (react, react-dom, axios)
- [ ] **1.6** Install backend dependencies (express, cors, dotenv, openai)

### Phase 2: Backend API 🔧
- [ ] **2.1** Create Express server entry point (server.js)
- [ ] **2.2** Implement /api/chat endpoint with OpenAI integration
- [ ] **2.3** Add streaming response support
- [ ] **2.4** Create error handling middleware
- [ ] **2.5** Test API endpoint functionality

### Phase 3: Frontend Core Components 🎨
- [ ] **3.1** Create Sidebar component
  - "New chat" button
  - Chat list rendering
  - Chat switching functionality
- [ ] **3.2** Create ChatArea component
  - Main container
  - Empty state display
- [ ] **3.3** Create MessageList component
  - Message rendering
  - User vs assistant styling
  - Auto-scroll to bottom
- [ ] **3.4** Create MessageInput component
  - Textarea with auto-resize
  - Enter to submit (Shift+Enter for newline)
  - Loading state during API calls
- [ ] **3.5** Create Header component
  - ChatGPT version dropdown (UI only)
  - Share button (UI only)

### Phase 4: State Management & Storage 💾
- [ ] **4.1** Create useLocalStorage hook
  - Save/load chat list
  - Save/load individual conversations
- [ ] **4.2** Create useChat hook
  - Manage current chat state
  - Handle message sending
  - Process streaming responses
- [ ] **4.3** Implement chat list management
  - Add new chat
  - Update chat titles
  - Sort by most recent

### Phase 5: API Integration 🔌
- [ ] **5.1** Create API service layer (services/api.js)
  - POST to backend endpoint
  - Handle streaming responses
  - Error handling
- [ ] **5.2** Connect MessageInput to API
  - Send messages
  - Display loading state
  - Stream responses
- [ ] **5.3** Update localStorage after each message exchange

### Phase 6: Styling & Responsive Design 💅
- [ ] **6.1** Match provided UI designs
  - Color scheme
  - Typography
  - Spacing and layout
- [ ] **6.2** Implement responsive behavior
  - Collapsible sidebar on mobile
  - Flexible message area
- [ ] **6.3** Add non-functional UI elements
  - Microphone button
  - Audio waveform button
  - Search chats input

### Phase 7: Testing & Polish ✅
- [ ] **7.1** Test chat creation and switching
- [ ] **7.2** Test message sending and receiving
- [ ] **7.3** Test localStorage persistence
- [ ] **7.4** Test long conversations and scrolling
- [ ] **7.5** Test error scenarios
- [ ] **7.6** Verify .env security
- [ ] **7.7** Create comprehensive README

---

## Critical Files to Create

### Frontend Files
1. **client/src/App.jsx** - Main React app component
2. **client/src/components/Sidebar.jsx** - Left sidebar with chat list
3. **client/src/components/ChatList.jsx** - Chat list rendering
4. **client/src/components/ChatArea.jsx** - Main chat interface
5. **client/src/components/MessageList.jsx** - Message rendering
6. **client/src/components/MessageInput.jsx** - Input component
7. **client/src/components/Header.jsx** - Top header bar
8. **client/src/hooks/useLocalStorage.js** - LocalStorage management
9. **client/src/hooks/useChat.js** - Chat state management
10. **client/src/services/api.js** - Backend API calls
11. **client/src/App.css** - Main styling

### Backend Files
1. **server/server.js** - Express server setup
2. **server/routes/chat.js** - Chat API endpoint with OpenAI
3. **server/middleware/errorHandler.js** - Error handling

### Configuration Files
1. **.env.example** - Template for environment variables
2. **.gitignore** - Exclude node_modules, .env, build files
3. **README.md** - Setup and usage instructions

---

## Future Feature Considerations

### For Article 1: Folder Attachment Feature
- Add folder selection UI in sidebar
- Backend endpoint for file reading (local and Google Drive)
- Message context augmentation with folder contents
- File picker component

### For Article 2: Automations Feature
- Add automation management UI
- Cron job scheduler on backend
- Automation trigger system (scheduled/on-demand)
- Automation list and editor

### For Article 3: Multi-threaded Conversations
- Modify message data structure to support threads
- Add thread spawning UI on message hover
- Update chat storage to handle nested conversations
- Thread visualization in sidebar

---

## Verification & Testing Checklist

### Manual Testing
- [ ] Start fresh (clear localStorage)
- [ ] Create new chat - should show empty state
- [ ] Send first message - should create chat title
- [ ] Send follow-up messages - should maintain context
- [ ] Create second chat - should appear in sidebar
- [ ] Switch between chats - should load correct conversation
- [ ] Refresh page - chats should persist
- [ ] Test long messages - should handle multiline input
- [ ] Test rapid messages - should queue properly
- [ ] Test error scenario - verify error handling

### API Key Security Check
- [ ] Verify .env file is in .gitignore
- [ ] Search codebase for hardcoded API keys (should find none)
- [ ] Confirm .env.example has placeholder only
- [ ] Test that app fails gracefully without API key

### Windows Compatibility
- [ ] All npm scripts use cross-platform commands
- [ ] File paths use path.join() or cross-env
- [ ] Concurrent dev servers work on Windows terminal
- [ ] Installation instructions work on Windows

---

## Success Criteria
✅ Clean, functional ChatGPT clone matching provided UI designs
✅ Persistent chat history across page refreshes
✅ Real-time streaming responses from OpenAI
✅ No credentials exposed in git repository
✅ Easy for other PMs to clone and run with their own API keys
✅ Foundation ready for three planned feature additions

---

## Getting Started (After Implementation)

### Prerequisites
- Node.js 18+ installed
- OpenAI API key

### Setup Steps
1. Clone the repository
2. Copy `.env.example` to `.env` and add your OpenAI API key
3. Install dependencies:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
4. Start both servers:
   ```bash
   # Terminal 1 - Backend
   cd server && npm start

   # Terminal 2 - Frontend
   cd client && npm run dev
   ```
5. Open browser to `http://localhost:5173` (or the Vite default port)

---

## Notes
- This is a prototype for tutorial purposes
- Focus on simplicity and clarity for other PMs to understand
- Code should be well-commented where helpful
- Keep dependencies minimal
- Prioritize functionality over advanced features

---

**Last Updated**: 2026-01-26
**Status**: Ready to implement
