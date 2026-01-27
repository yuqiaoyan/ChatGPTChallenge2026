# ChatGPT Challenge

A minimal ChatGPT web app clone built with React and Express that demonstrates core chat functionality including message editing, deletion, and real-time streaming responses.

This project serves as the foundation for tutorial articles on advanced features and as a code challenge for Product Managers to fork and extend with their own creative features.

## Technology Stack

**Frontend:**
- React 18 with Vite
- CSS3 for styling
- Fetch API for server communication

**Backend:**
- Node.js & Express
- OpenAI API (GPT-4)
- Server-Sent Events (SSE) for streaming

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/[username]/ChatGPTChallenge.git
cd ChatGPTChallenge
```

### 2. Install Dependencies

**Install backend dependencies:**
```bash
cd server
npm install
```

**Install frontend dependencies:**
```bash
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server/` directory:

```bash
cd server
copy .env.example .env
```

Edit the `.env` file and add your OpenAI API key:

```
OPENAI_API_KEY=your_actual_api_key_here
PORT=3001
NODE_ENV=development
```

**Important:** Never commit your `.env` file. It's already in `.gitignore`.

### 4. Run the Application

**Start the backend server (from server/ directory):**
```bash
npm run dev
```
The server will start on http://localhost:3001

**Start the frontend (from client/ directory, in a new terminal):**
```bash
npm run dev
```
The frontend will start on http://localhost:5173

### 5. Open in Browser

Navigate to http://localhost:5173 and start chatting!

## Project Structure

```
ChatGPTChallenge/
├── client/                 # React frontend
│   ├── src/
│   │   ├── App.jsx        # Main app component
│   │   ├── App.css        # Styles
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express backend
│   ├── server.js          # Main server file with API routes
│   ├── .env.example       # Environment template
│   └── package.json
│
├── Project Memory/         # Technical documentation
│   ├── product-spec.md    # Product requirements
│   ├── technical-spec.md  # Technical design decisions
│   └── progress.md        # Development progress
│
├── Designs/               # UI mockups and design assets
├── CLAUDE.md              # Development guidelines
├── .gitignore
└── README.md
```

## Current Features

- Real-time chat with OpenAI GPT-4
- Streaming responses (word-by-word)
- Message history
- Edit previous messages
- Delete messages
- Regenerate responses
- Clean, minimal UI

## Development

This is a development repository. Advanced features (folder attachments, automations, multi-threaded conversations) will be added in future phases.

For detailed technical documentation and development guidelines, see the `Project Memory/` folder and `CLAUDE.md`.

## Documentation

- **Product Spec**: `Project Memory/product-spec.md` - Core requirements and goals
- **Technical Spec**: `Project Memory/technical-spec.md` - Key technical design decisions
- **Progress**: `Project Memory/progress.md` - Current status and known issues
- **Tutorial**: `tutorial.md` - Substack article for Product Managers

## Contributing

This project is designed as a learning resource and code challenge. Feel free to fork and extend it with your own features!

## License

MIT

## Related Resources

- [Building an AI PM Interview Site](https://bonnieyu.substack.com/p/building-an-ai-pm-interview-site) - Foundational article
- [OpenAI API Documentation](https://platform.openai.com/docs)
