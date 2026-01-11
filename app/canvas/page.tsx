'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#FF6B6B')
  const [brushSize, setBrushSize] = useState(5)
  const [onlineUsers, setOnlineUsers] = useState(1)
  const userIdRef = useRef<string>('')
  const lastTimestampRef = useRef<number>(0)
  const activeUsersRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    userIdRef.current = Math.random().toString(36).substring(7)

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      // Save current drawing before resize
      const tempCanvas = document.createElement('canvas')
      tempCanvas.width = canvas.width
      tempCanvas.height = canvas.height
      const tempCtx = tempCanvas.getContext('2d')
      if (tempCtx) {
        tempCtx.drawImage(canvas, 0, 0)
      }

      // Resize
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight

      // Fill white background
      ctx.fillStyle = '#FFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Restore drawing
      if (tempCtx) {
        ctx.drawImage(tempCanvas, 0, 0)
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    loadCanvas()

    const pollInterval = setInterval(pollForStrokes, 300)
    const cleanupInterval = setInterval(() => {
      const now = Date.now()
      activeUsersRef.current.forEach(userId => {})
    }, 5000)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      clearInterval(pollInterval)
      clearInterval(cleanupInterval)
    }
  }, [])

  // Auto-save every time user stops drawing
  useEffect(() => {
    if (!isDrawing) {
      saveCanvas()
    }
  }, [isDrawing])

  // Also auto-save every 10 seconds
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      saveCanvas()
    }, 10000)
    return () => clearInterval(autoSaveInterval)
  }, [])

  const pollForStrokes = async () => {
    try {
      const response = await fetch(`/api/draw?since=${lastTimestampRef.current}`)
      const data = await response.json()

      if (data.strokes && data.strokes.length > 0) {
        const userIds = new Set<string>()
        data.strokes.forEach((stroke: any) => {
          if (stroke.userId) userIds.add(stroke.userId)
        })
        userIds.forEach(id => activeUsersRef.current.add(id))
        setOnlineUsers(activeUsersRef.current.size)

        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        data.strokes.forEach((stroke: any) => {
          if (stroke.userId === userIdRef.current) return

          ctx.strokeStyle = stroke.color
          ctx.lineWidth = stroke.brushSize
          ctx.lineCap = 'round'

          if (stroke.type === 'start') {
            ctx.beginPath()
            ctx.moveTo(stroke.x, stroke.y)
          } else if (stroke.type === 'draw') {
            ctx.lineTo(stroke.x, stroke.y)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(stroke.x, stroke.y)
          }
        })
      }

      lastTimestampRef.current = data.timestamp
    } catch (error) {
      console.error('Failed to poll for strokes:', error)
    }
  }

  const loadCanvas = async () => {
    try {
      const response = await fetch('/api/canvas')
      const data = await response.json()

      if (data.imageData) {
        const canvas = canvasRef.current
        if (!canvas) return
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        const img = new Image()
        img.onload = () => {
          ctx.drawImage(img, 0, 0)
        }
        img.src = data.imageData
      }
    } catch (error) {
      console.error('Failed to load canvas:', error)
    }
  }

  const saveCanvas = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const imageData = canvas.toDataURL('image/png')
      await fetch('/api/canvas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData })
      })
    } catch (error) {
      console.error('Failed to save canvas:', error)
    }
  }

  const broadcastDraw = async (x: number, y: number, type: 'start' | 'draw') => {
    try {
      await fetch('/api/draw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userIdRef.current,
          x,
          y,
          color,
          brushSize,
          type
        })
      })
    } catch (error) {
      console.error('Failed to broadcast:', error)
    }
  }

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true)
    activeUsersRef.current.add(userIdRef.current)

    const canvas = canvasRef.current
    if (!canvas) return

    let x, y
    if ('touches' in e) {
      const rect = canvas.getBoundingClientRect()
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.nativeEvent.offsetX
      y = e.nativeEvent.offsetY
    }

    broadcastDraw(x, y, 'start')
    draw(e)
  }

  const stopDrawing = () => {
    setIsDrawing(false)
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.beginPath()
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing && e.type !== 'touchstart' && e.type !== 'mousedown') return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let x, y
    if ('touches' in e) {
      const rect = canvas.getBoundingClientRect()
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.nativeEvent.offsetX
      y = e.nativeEvent.offsetY
    }

    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    ctx.strokeStyle = color

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)

    if (isDrawing || e.type === 'touchstart' || e.type === 'mousedown') {
      broadcastDraw(x, y, 'draw')
    }
  }

  const clearCanvas = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#FFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    try {
      await fetch('/api/canvas', { method: 'DELETE' })
    } catch (error) {
      console.error('Failed to clear saved canvas:', error)
    }
  }

  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2']

  return (
    <div className="fixed inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="touch-none"
      />

      {/* Home Button */}
      <Link
        href="/"
        className="fixed top-4 left-4 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors font-medium z-10 flex items-center gap-2"
      >
        🏠 Home
      </Link>

      {/* Controls */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-4 flex items-center gap-4 z-10">
        <div className="text-sm font-semibold text-gray-700">Ella's Canvas ✨</div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-600">{onlineUsers} drawing</span>
        </div>
      </div>

      {/* Color Palette */}
      <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-3 flex gap-2 z-10">
        {colors.map((c) => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`w-10 h-10 rounded-full transition-transform ${
              color === c ? 'scale-125 ring-4 ring-gray-400' : 'hover:scale-110'
            }`}
            style={{ backgroundColor: c }}
          />
        ))}
      </div>

      {/* Brush Size */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 flex items-center gap-3 z-10">
        <span className="text-sm font-medium text-gray-700">Size:</span>
        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-32"
        />
        <div
          className="rounded-full bg-current"
          style={{
            width: `${brushSize}px`,
            height: `${brushSize}px`,
            backgroundColor: color
          }}
        />
      </div>

      {/* Clear Button */}
      <button
        onClick={clearCanvas}
        className="fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-red-600 transition-colors font-medium z-10"
      >
        Clear 🗑️
      </button>
    </div>
  )
}
