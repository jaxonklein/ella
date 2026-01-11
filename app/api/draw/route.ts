import { NextRequest, NextResponse } from 'next/server'
import Pusher from 'pusher'

// Initialize Pusher only if credentials are available
let pusher: Pusher | null = null

if (process.env.PUSHER_APP_ID &&
    process.env.PUSHER_SECRET &&
    process.env.NEXT_PUBLIC_PUSHER_APP_KEY &&
    process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
  pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,
    useTLS: true
  })
}

export async function POST(request: NextRequest) {
  try {
    if (!pusher) {
      return NextResponse.json({
        success: false,
        error: 'Pusher not configured'
      }, { status: 500 })
    }

    const data = await request.json()

    await pusher.trigger('canvas', 'draw', data)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error broadcasting draw event:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to broadcast'
    }, { status: 500 })
  }
}
