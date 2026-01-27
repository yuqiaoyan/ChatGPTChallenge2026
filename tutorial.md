# Building a ChatGPT Clone with Advanced Features
## A Product Manager's Guide to Building Extensible Chat Applications

This tutorial walks you through building a ChatGPT clone from scratch, then extending it with three powerful features: folder attachments, automated tasks with tool access, and multi-threaded conversations.

**Prerequisites:** This assumes you're already familiar with Claude Code basics. If you're new to Claude Code, start with [Building an AI PM Interview Site with Claude Code](https://bonnieyu.substack.com/p/building-an-ai-pm-interview-site) to learn the fundamentals of setup, Project Memory, and basic workflows.

## Why Build a ChatGPT Clone?

You might be wondering: why build your own ChatGPT when it already exists?

Here's why this project is different:

**1. Understanding Through Building**
You don't truly understand how something works until you've built it yourself. Understanding chat architecture, message streaming, state management, and real-time updates will make you a better PM when evaluating competitors or proposing new features.

**2. Building Features ChatGPT Doesn't Have (Yet)**
Want to attach a folder so ChatGPT has context on all your project files? Want automated tasks that check your Google Calendar? Want to spawn multiple conversation threads from different paragraphs in your document?

These aren't ChatGPT features today. But you can build them. And that's exactly what we're doing.

**3. A Code Challenge for PMs**
This project is designed to be forked and extended. The base clone is intentionally simple and well-documented. Once you understand the foundation, you can build your own creative features. Think of it as a code challenge for the PM community.

## What We're Building Across Four Articles

**Article 1 (This One): Base ChatGPT Clone**
- Clean chat interface matching ChatGPT's design
- Real-time streaming responses from OpenAI API
- Message editing and deletion capabilities
- Persistent chat history using localStorage
- Multiple conversation management

**Article 2: Folder Attachments**
- Attach local folders or Google Drive folders to chats
- AI has access to folder contents for context
- Use case: "Explain the auth flow in my codebase"

**Article 3: Automated Tasks with Tool Access**
- Create tasks that run on schedule or on-demand
- Tasks can call tools: Google Calendar, web search, email
- Use case: "Check my calendar daily at 8am and summarize my meetings"

**Article 4: Multi-threaded Conversations**
- Spawn conversation threads from specific paragraphs
- Multiple parallel chats about different sections
- Use case: Polish paragraph 2 while researching paragraph 5

This article focuses on building the base clone. The advanced features come in follow-up articles.

## The Initial Planning Session

Following the workflow from [my previous tutorial](https://bonnieyu.substack.com/p/building-an-ai-pm-interview-site), I started by working with Claude to create Project Memory for this project.

I asked Claude:

> "I want to prototype a few new features on top of a ChatGPT clone and write tutorial articles about it. The first feature is folder attachment, the second is automated tasks with tool access (like calendar and web search), and the third is multi-threaded conversations. Let's start with a spec for a simple ChatGPT clone that can support these features. We'll build the base clone first, then add features one by one."

Claude asked clarifying questions about:
- **Technology stack:** React + Express or Next.js or Vue? → We chose React + Express for clarity
- **Data storage:** Database or localStorage? → We chose localStorage to keep it simple for a prototype
- **AI provider:** OpenAI, Anthropic, or mock responses? → We chose OpenAI API for authentic ChatGPT experience
- **Authentication:** Full auth or single-user? → Single-user with no auth to minimize complexity

After answering these questions, Claude generated comprehensive Project Memory documentation:
- [product-spec.md](Project Memory/product-spec.md) - All features, UI specs, and success criteria
- [technical-spec.md](Project Memory/technical-spec.md) - Architecture, data models, component hierarchy
- [progress.md](Project Memory/progress.md) - Current status and implementation phases
- [CLAUDE.md](CLAUDE.md) - Instructions for Claude Code on how to work in this repo

## Key Architectural Decisions

Here are the critical decisions we documented in the technical spec:

### Keeping It Simple: No Message Editing or Deletion

We made a deliberate choice to exclude message editing and deletion from the base version.

Why? To keep the UX clean and the codebase simple. When you send a message, it stays in the conversation history. Just like a real conversation, you can't unsay something—you just continue the dialogue.

This actually makes the app more intuitive: if you want to start fresh, create a new chat. If you want to continue an old conversation, just click it and keep talking.

Message editing and deletion are now listed as community challenge features. They're perfect additions for PMs who want to practice building more complex state management.

### How Conversation Context Works

One of the most important design decisions is how we handle conversation context with the OpenAI API.

**Our Approach: Full History Every Time**

When you send a message, we send the *entire conversation history* to OpenAI, not just your latest message. Here's what that looks like:

```javascript
// Every API call includes the full conversation
{
  messages: [
    { role: 'user', content: 'What is React?' },
    { role: 'assistant', content: 'React is a JavaScript library...' },
    { role: 'user', content: 'How do hooks work?' },
    { role: 'assistant', content: 'Hooks let you use state...' },
    { role: 'user', content: 'Can you explain useState?' }  // New message
  ]
}
```

**Why This Matters:**

This approach has pros and cons that are worth understanding as a PM:

✅ **Pros:**
- Simple to implement and understand
- Perfect context—ChatGPT remembers everything from the conversation
- Works seamlessly when you return to old chats
- No complex context management logic needed

⚠️ **Cons:**
- Token limits: GPT-4 has a context window (8K-128K tokens depending on version)
- Cost: You pay for all input tokens on every request
- Performance: Very long conversations send lots of data
- Eventually fails: A 100-message conversation will hit token limits

**For the Base Version:**

We're keeping it simple. Send the full history. This works great for the vast majority of conversations and keeps the codebase clean for learning purposes.

**Community Challenge Idea: Smart Context Management**

This is a perfect feature for the community challenge:
- Implement token counting (estimate tokens before sending)
- Truncate old messages when approaching limits
- Add a "summarize and continue" feature (use ChatGPT to summarize old context, then start fresh with summary)
- Show users how many tokens they're using
- Implement conversation forking ("start new chat from this message")

Understanding token limits and context windows is crucial for building production AI apps. But for a learning project? Full history is the right choice.

### Designing for Future Features: Message Tree Structure

Here's an architectural decision that demonstrates thinking ahead: **our message data structure supports threading from day one**, even though we won't implement threading until Article 4.

**The Message Schema:**

```javascript
{
  id: 'msg-123',
  parentId: null,        // Parent message ID (null in base version)
  childrenIds: [],       // Child message IDs (empty in base version)
  role: 'user',
  content: 'What is React?',
  timestamp: 1234567890
}
```

**Why include parentId and childrenIds now?**

Article 4 will add multi-threaded conversations—the ability to spawn a new conversation thread from any message. Imagine you're discussing React hooks, and you want to branch off to explore Vue instead, while keeping the original React conversation intact.

This requires a **tree structure**, not a flat list. A flat list like this:

```javascript
messages: [
  { id: 1, content: 'Tell me about React' },
  { id: 2, content: 'React is...' },
  { id: 3, content: 'What about hooks?' }
]
```

Cannot represent branching. But with parentId and childrenIds:

```javascript
messages: [
  { id: 1, parentId: null, childrenIds: [2, 3], content: 'Tell me about React' },
  { id: 2, parentId: 1, childrenIds: [4], content: 'React is...' },  // Main thread
  { id: 3, parentId: 1, childrenIds: [], content: 'Actually, tell me about Vue' }  // Branch!
]
```

**This was a collaborative decision.** An engineer reviewing our specs pointed out: "If you want branching conversations later, you need tree structure from the start, or you'll need data migration." He was absolutely right.

**Two Options We Considered:**

1. **Keep it simple now, migrate later** - Use a flat structure, then convert all chats when we build threading
2. **Add tree structure now** - Include the fields from day one, set them to defaults in base version

We chose Option 2. Here's why:

✅ **No migration needed** - Article 4 just uses existing fields
✅ **Zero cost** - localStorage doesn't care about unused fields
✅ **Educational value** - Demonstrates forward-thinking architecture for PMs
✅ **Implementation is still simple** - Base version just writes `parentId: null, childrenIds: []`

**In practice, this looks like:**

```javascript
// Creating a message in base version
const newMessage = {
  id: generateId(),
  parentId: null,     // Always null for now
  childrenIds: [],    // Always empty for now
  role: 'user',
  content: userInput,
  timestamp: Date.now()
}
```

The base implementation ignores these fields. The threading feature in Article 4 uses them. Clean, simple, no refactoring.

**PM Lesson: The Cost of Migrations**

In real products, data migrations are expensive:
- Risk of data loss or corruption
- Complex migration scripts
- User-facing downtime or loading states
- Testing nightmare (old format + new format + migration logic)

Adding two fields upfront costs nothing. Migrating thousands of users' chat histories later? That's a project.

This is the kind of architectural foresight that separates senior engineers from junior ones. And as a PM, understanding these tradeoffs helps you make better product decisions.

### Extensibility for Future Features

Even though we're starting with a basic clone, we made architectural decisions with future features in mind:

**For Folder Attachments (Article 2):**
- Chat objects have room for metadata: `attachedFolder: { type, path, files[] }`
- Message context can be augmented with file contents
- Component structure allows sidebar folder picker

**For Automated Tasks (Article 3):**
- Backend architecture supports cron scheduling
- API layer designed for tool integration (Google Calendar, web search)
- Task data structure planned: `{ prompt, schedule, enabledTools, history }`

**For Multi-threaded Conversations (Article 4):**
- Message tree structure already in place (parentId, childrenIds fields)
- Thread spawning just needs to update these existing fields
- UI components designed for thread visualization on hover
- Algorithm to traverse message tree and render branches

This is a key lesson: plan for extensibility early. It's much easier than refactoring later. The message tree structure is a perfect example—including those fields now costs nothing but saves us from a complex migration in Article 4.

### Security Baked In from Day One

We made security non-negotiable:
- OpenAI API key stored server-side only (never exposed to frontend)
- `.env` file in `.gitignore` with `.env.example` template provided
- CORS properly configured
- Input sanitization and message length limits

This makes the project safe to share publicly on GitHub as a learning resource.

## What Makes the Automated Tasks Feature Powerful

Let me highlight one of the advanced features we're building in Article 3, because it's genuinely powerful.

The Automated Tasks feature (we might call it "Tasks" in the UI) allows you to create recurring or on-demand prompts that have access to external tools.

**Example use cases:**
- "Check my Google Calendar for important meetings this month"
- "Search the web for latest news on [topic] and summarize it for me"
- "Every morning at 8am, review my calendar and send me a summary"

This works using **OpenAI Function Calling**. When a task runs:
1. Your prompt is sent to OpenAI with available tool definitions (calendar, search, etc.)
2. OpenAI decides which tools it needs to call
3. Our backend executes those tool calls (fetches calendar events, runs web search)
4. Tool results go back to OpenAI
5. OpenAI synthesizes a final response with the information

The technical spec includes a full tool registry design:

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

This is extensible. You could add:
- Gmail integration (read and send emails)
- Weather API (check forecast)
- Stock market data (track portfolio)
- Database queries (pull analytics)
- Custom webhooks (trigger your own services)

This is what makes building your own chat interface interesting. You can create capabilities that don't exist in ChatGPT.

## Swapping LLM Providers: Designed for Flexibility

One question you might have: "Can I easily test different AI models—GPT-4, GPT-3.5, Claude, or even GPT-5 when it launches?"

**The answer is yes, and here's why we designed it that way.**

### How the Architecture Supports Multiple Providers

Our backend follows a simple pattern that makes swapping providers straightforward:

```javascript
// Backend API endpoint (conceptual)
POST /api/chat
- Receives: Array of messages
- Returns: Streaming response

// This abstraction works for any LLM provider
```

All LLM providers (OpenAI, Anthropic, Cohere, etc.) follow a similar pattern:
1. Accept an array of conversation messages
2. Return a text response (streaming or complete)
3. Use similar message formats: `{ role, content }`

### Switching Between OpenAI Models

The easiest swap: trying different OpenAI models. In your backend config, you can change:

```javascript
// Use GPT-4
model: "gpt-4"

// Use GPT-3.5 (faster, cheaper)
model: "gpt-3.5-turbo"

// Use GPT-4 Turbo (when available)
model: "gpt-4-turbo"
```

That's it. One line change. Everything else stays the same.

### Testing Claude (Anthropic)

Anthropic's Claude API is very similar to OpenAI's. To add Claude support:

1. **Add Anthropic API key to `.env`**
2. **Install Anthropic SDK**: `npm install @anthropic-ai/sdk`
3. **Update backend to support provider selection**
4. **Minor adjustments for Claude's message format**

The message structure is nearly identical. Main differences:
- Model names: `claude-3-opus-20240229` vs `gpt-4`
- Streaming implementation details
- Some parameter names differ slightly

### Adding Provider Selection to the UI

A great community challenge feature: Let users choose their AI provider from the UI.

**Implementation ideas:**
- Add dropdown in header: "Model: GPT-4 ▼"
- Options: GPT-3.5, GPT-4, Claude Opus, Claude Sonnet
- Store preference in localStorage
- Send provider choice to backend with each request

**Backend handles routing:**
```javascript
if (provider === 'openai') {
  // Use OpenAI SDK
} else if (provider === 'anthropic') {
  // Use Anthropic SDK
}
```

### Why This Matters for PMs

Understanding LLM provider flexibility is crucial because:

1. **Cost optimization**: GPT-3.5 is much cheaper than GPT-4 for simple queries
2. **Performance testing**: Different models excel at different tasks
3. **Vendor flexibility**: Don't get locked into one provider
4. **Future-proofing**: When GPT-5 launches, you just update the model name

**Pro tip**: In production apps, you might route different types of requests to different models. Simple questions → GPT-3.5 (cheap, fast). Complex reasoning → GPT-4 (expensive, powerful).

### Community Challenge Ideas

- **Model comparison tool**: Send the same prompt to multiple models, compare responses
- **Cost tracker**: Show estimated cost per conversation based on token usage
- **Smart model selection**: Auto-select model based on conversation complexity
- **Custom model endpoints**: Support local LLMs like Llama or open-source models

The architecture we're building makes all of this possible because we've separated concerns: frontend doesn't care which LLM is used, it just sends messages and receives responses.

## Current Project Status

As of this writing, here's where we are:

**Completed:**
- ✅ Initial planning session with Claude
- ✅ Project Memory documentation (product spec, technical spec, progress tracking)
- ✅ Architectural decisions for base clone and three advanced features
- ✅ CLAUDE.md setup with Project Memory integration
- ✅ Technology stack selection and security design

**Next Steps:**
- Set up React app with Vite
- Set up Express server
- Install dependencies (OpenAI SDK, CORS, etc.)
- Create `.env.example` and `.gitignore`
- Build backend API with streaming support
- Implement React components (Sidebar, ChatArea, MessageList, MessageInput)
- Create custom hooks (useChat, useLocalStorage)
- Style to match ChatGPT's UI
- Test and deploy

The implementation phase begins next, where we'll build the base clone following the plan in Project Memory.

## Why This Approach Works for Complex Projects

The AI PM Interview site tutorial covered the basics of Project Memory and Claude workflows. This project takes it further because we're planning for extensibility from day one.

A few lessons from this planning phase:

**1. Think in Phases, Build in Increments**
We're not building all four features at once. We're building a solid foundation (base clone), then adding one feature at a time. Each feature gets its own tutorial article. This makes the project manageable and teachable.

**2. Document Architectural Decisions**
The technical spec captures not just what we're building, but *why* we made certain choices. Why localStorage instead of a database? Why include message editing in the base version? Future you (or other contributors) will thank you for documenting these decisions.

**3. Design Data Models for the Future**
Even though we haven't built folder attachments yet, we already know the chat object will have an `attachedFolder` field. Even though we haven't built tasks yet, we know the tool registry pattern we'll use. This forward-thinking prevents painful refactoring later.

**4. Security Isn't Optional**
Because this is a learning project meant to be shared, we built in security from the start. API keys server-side only. Environment variables never committed. This is how you build projects responsibly.

## The Code Challenge Component

This project has a dual purpose:

**Purpose 1: Tutorial Series**
Teach PMs how to build a chat application with advanced features step-by-step.

**Purpose 2: Code Challenge**
Provide a well-architected codebase that other PMs can fork and extend with their own creative features.

Once the base clone is built, here are feature ideas for the community:
- Dark mode toggle
- Conversation export (JSON/Markdown/PDF)
- Editable chat titles
- Chat folders and organization
- Code syntax highlighting in messages
- Message reactions
- Voice input (make the microphone button actually work)
- Prompt templates library
- Chat sharing with public URLs

The product spec even includes a section on "Community Challenge Features" for this exact purpose.

## What's Next

The next part of this tutorial will cover implementation. We'll:

1. **Set up the projects** - Initialize React and Express apps, install dependencies
2. **Build the backend** - Create Express API with OpenAI streaming integration
3. **Build the frontend** - Implement React components following our planned hierarchy
4. **Add core features** - Message editing, deletion, chat management
5. **Style the UI** - Match ChatGPT's clean, modern design
6. **Test and polish** - Manual testing checklist, error handling
7. **Deploy** - Get it live so you can share with others

After that, Article 2 will cover building the folder attachment feature, Article 3 will add automated tasks with tool integration, and Article 4 will implement multi-threaded conversations.

## Wrapping Up

This planning phase might feel slow compared to just asking Claude to "build me a ChatGPT clone." But here's the thing: planning upfront is what makes complex projects successful.

We now have:
- A clear product vision across four articles
- Technical architecture designed for extensibility
- Security considerations baked in from day one
- Documentation that persists across Claude Code sessions
- A foundation that other PMs can learn from and build on

This is how you build projects that last, scale, and teach effectively.

Let's implement it.

---

**Project Status:** Phase 1 - Planning Complete ✅
**Next Article:** Building the Base Clone (Implementation)
**GitHub Repository:** [Coming soon - will add link after implementation]

---

*This is the first article in a four-part series on building advanced chat applications. For Claude Code basics and setup, start with [Building an AI PM Interview Site with Claude Code](https://bonnieyu.substack.com/p/building-an-ai-pm-interview-site).*
