import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

const CANVAS_FILE = path.join(process.cwd(), 'data', 'canvas.json')

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data')
  if (!existsSync(dataDir)) {
    await mkdir(dataDir, { recursive: true })
  }
}

export async function GET() {
  try {
    await ensureDataDir()

    if (existsSync(CANVAS_FILE)) {
      const data = await readFile(CANVAS_FILE, 'utf-8')
      return NextResponse.json(JSON.parse(data))
    }

    return NextResponse.json({ imageData: null })
  } catch (error) {
    console.error('Error loading canvas:', error)
    return NextResponse.json({ imageData: null })
  }
}

export async function POST(request: NextRequest) {
  try {
    await ensureDataDir()

    const { imageData } = await request.json()
    await writeFile(CANVAS_FILE, JSON.stringify({ imageData }))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving canvas:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}

export async function DELETE() {
  try {
    await ensureDataDir()

    if (existsSync(CANVAS_FILE)) {
      await writeFile(CANVAS_FILE, JSON.stringify({ imageData: null }))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error clearing canvas:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
