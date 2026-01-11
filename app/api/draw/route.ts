import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for recent drawing strokes
// In production, this will be per-instance, but that's okay for simple collaboration
const recentStrokes: any[] = []
const MAX_STROKES = 1000 // Keep last 1000 strokes in memory
const STROKE_EXPIRY = 10000 // Keep strokes for 10 seconds

// Clean up old strokes periodically
setInterval(() => {
  const now = Date.now()
  while (recentStrokes.length > 0 && now - recentStrokes[0].timestamp > STROKE_EXPIRY) {
    recentStrokes.shift()
  }
}, 5000)

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Add timestamp
    const stroke = {
      ...data,
      timestamp: Date.now()
    }

    recentStrokes.push(stroke)

    // Keep array size manageable
    if (recentStrokes.length > MAX_STROKES) {
      recentStrokes.shift()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error storing stroke:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to store stroke'
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const since = parseInt(searchParams.get('since') || '0')

    // Return strokes newer than the requested timestamp
    const newStrokes = recentStrokes.filter(stroke => stroke.timestamp > since)

    return NextResponse.json({
      strokes: newStrokes,
      timestamp: Date.now()
    })
  } catch (error) {
    console.error('Error fetching strokes:', error)
    return NextResponse.json({
      strokes: [],
      timestamp: Date.now()
    }, { status: 500 })
  }
}
