'use client'

import { useRef, useEffect, useState } from 'react'

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#FF6B6B')
  const [brushSize, setBrushSize] = useState(5)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size to window size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctx.fillStyle = '#FFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Load saved canvas
    loadCanvas()

    return () => window.removeEventListener('resize', resizeCanvas)
  }, [])

  // Auto-save canvas every 2 seconds when drawing
  useEffect(() => {
    if (!isDrawing) return

    const saveTimer = setTimeout(() => {
      saveCanvas()
    }, 2000)

    return () => clearTimeout(saveTimer)
  }, [isDrawing])

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

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true)
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
  }

  const clearCanvas = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.fillStyle = '#FFF'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Clear saved canvas
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

      {/* Controls */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow-lg p-4 flex items-center gap-4 z-10">
        <div className="text-sm font-semibold text-gray-700">Ella's Canvas ✨</div>
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
