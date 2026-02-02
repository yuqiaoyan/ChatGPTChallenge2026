# ChatGPT Challenge

A minimal ChatGPT web app clone built with React and Express that demonstrates core chat functionality with real-time streaming responses.

This project serves as a foundation for learning chat application architecture and as a code challenge for Product Managers to fork and extend with their own creative features.

**Disclaimer:** This project is not affiliated with or sponsored by OpenAI.

## Technology Stack

**Frontend:**
- React 19.2 with Vite
- CSS3 for styling
- Fetch API for server communication

**Backend:**
- Node.js & Express
- OpenAI API (GPT-3.5-turbo)
- Server-Sent Events (SSE) for streaming

## Prerequisites

- Node.js 18 or higher
- npm or yarn
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yuqiaoyan/ChatGPTChallenge.git
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
│   │   ├── components/    # UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   ├── utils/         # Helper functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Express backend
│   ├── server.js          # Main server file with API routes
│   ├── .env.example       # Environment template
│   └── package.json
│
├── CLAUDE.md              # Development guidelines
├── LICENSE
├── .gitignore
└── README.md
```

## Current Features

- Real-time chat with OpenAI GPT-3.5-turbo
- Streaming responses (word-by-word)
- Multiple chat conversations
- Persistent message history (localStorage)
- Auto-generated chat titles
- Clean, minimal UI matching ChatGPT design
- Comprehensive error handling

## Code Challenge for Product Managers

This project is designed as a code challenge! Fork this repo and build your own features.

## Development

For detailed development guidelines, see `CLAUDE.md`.

## License

MIT

## Related Resources

- [Building an AI PM Interview Site](https://bonnieyu.substack.com/p/building-an-ai-pm-interview-site) - Foundational article
- [OpenAI API Documentation](https://platform.openai.com/docs)
