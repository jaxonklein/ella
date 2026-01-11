# Ella's Collaborative Canvas 🎨

A real-time multiplayer drawing canvas where anyone can draw together!

## Features

- ✨ Real-time collaborative drawing (no signups required!)
- 🎨 8 vibrant colors to choose from
- 📏 Adjustable brush sizes (1-20px)
- 💾 Canvas persists across sessions
- 📱 Mobile-friendly touch support
- 👥 See how many people are drawing live

## How It Works

- Drawing strokes are shared via HTTP polling (every 300ms)
- Canvas state saves automatically every 2 seconds
- Drawings persist until someone clicks "Clear"
- Works entirely self-contained - no external services needed!

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Run locally

```bash
npm run dev
```

Open http://localhost:3000 in multiple browser tabs to test multiplayer!

### 3. Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Deploy!

No environment variables needed - it just works out of the box.

## Tech Stack

- Next.js 14 (App Router)
- React with TypeScript
- HTTP Polling for real-time sync
- In-memory storage for stroke synchronization
- File system for canvas persistence
- HTML Canvas API
- Tailwind CSS

## Limitations

- Strokes are kept in memory for 10 seconds
- User count is approximate (based on recent activity)
- On serverless platforms like Vercel, each instance has its own memory
  - This means users might see slight delays if they're on different instances
  - For most use cases (family/friends drawing together), this is totally fine!

For higher-scale deployments, consider adding a shared database or Redis for stroke synchronization.
