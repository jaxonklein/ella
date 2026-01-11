# Ella's Collaborative Canvas 🎨

A real-time multiplayer drawing canvas where anyone can draw together!

## Features

- ✨ Real-time collaborative drawing
- 🎨 8 vibrant colors to choose from
- 📏 Adjustable brush sizes
- 💾 Canvas persists across sessions
- 📱 Mobile-friendly touch support
- 👥 See how many people are drawing live

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Pusher (for real-time features)

1. Create a free account at [pusher.com](https://pusher.com)
2. Create a new Channels app
3. Copy your credentials
4. Create `.env.local` in the project root:

```env
NEXT_PUBLIC_PUSHER_APP_KEY=your_pusher_app_key
NEXT_PUBLIC_PUSHER_CLUSTER=us2
PUSHER_APP_ID=your_app_id
PUSHER_SECRET=your_pusher_secret
```

### 3. Deploy to Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

## How It Works

- Drawing strokes are broadcast in real-time to all connected users
- Canvas state is saved to disk every 2 seconds
- Drawings persist until someone clicks "Clear"
- Works without Pusher, but no real-time collaboration

## Tech Stack

- Next.js 14
- React
- TypeScript
- Pusher (WebSocket alternative)
- HTML Canvas API
- Tailwind CSS
