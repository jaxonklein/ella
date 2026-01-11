'use client'

import Link from 'next/link'

export default function Home() {
  const apps = [
    {
      name: 'Canvas',
      emoji: '🎨',
      href: '/canvas',
      color: 'from-pink-500 to-rose-500',
      description: 'Draw with friends!'
    },
    {
      name: 'Texas Hold\'em',
      emoji: '🃏',
      href: '/poker',
      color: 'from-purple-500 to-indigo-500',
      description: 'Poker time!'
    },
    ...Array(7).fill(null).map((_, i) => ({
      name: 'Coming Soon',
      emoji: '🔮',
      href: '#',
      color: 'from-gray-400 to-gray-500',
      description: '???',
      locked: true
    }))
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-red-900 relative overflow-hidden">
      {/* Spooky background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-green-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-red-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Shop Sign */}
        <div className="text-center mb-12 relative">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 blur-xl opacity-50 animate-pulse"></div>
            <h1 className="relative text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 animate-pulse mb-4 font-serif transform -rotate-2">
              Ella's
            </h1>
          </div>
          <div className="relative inline-block">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-2 font-serif italic">
              Wonderful Shop
            </h2>
            <h2 className="text-3xl md:text-5xl font-bold text-red-500 font-serif italic transform rotate-1">
              of Horrors
            </h2>
          </div>
          <div className="mt-6 flex justify-center gap-4">
            <span className="text-4xl animate-bounce">👻</span>
            <span className="text-4xl animate-bounce delay-100">🎃</span>
            <span className="text-4xl animate-bounce delay-200">💀</span>
            <span className="text-4xl animate-bounce delay-300">🕷️</span>
          </div>
          <p className="mt-4 text-purple-300 text-lg font-medium italic">
            "Enter if you dare... fun awaits!"
          </p>
        </div>

        {/* 3x3 Grid */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-6">
            {apps.map((app, index) => (
              <Link
                key={index}
                href={app.href}
                className={`
                  group relative aspect-square rounded-2xl overflow-hidden
                  transform transition-all duration-300
                  ${app.locked
                    ? 'hover:scale-105 cursor-not-allowed opacity-60'
                    : 'hover:scale-110 hover:-rotate-3 cursor-pointer'}
                  shadow-2xl
                `}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${app.color} opacity-90`}></div>

                {/* Animated border glow */}
                {!app.locked && (
                  <div className="absolute inset-0 border-4 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
                )}

                {/* Lock overlay */}
                {app.locked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
                    <span className="text-6xl">🔒</span>
                  </div>
                )}

                {/* Content */}
                <div className="relative h-full flex flex-col items-center justify-center p-4 text-white">
                  <div className="text-6xl mb-3 transform group-hover:scale-125 transition-transform duration-300">
                    {app.emoji}
                  </div>
                  <h3 className="text-xl font-bold text-center mb-2 text-shadow">
                    {app.name}
                  </h3>
                  <p className="text-sm text-center opacity-90">
                    {app.description}
                  </p>
                </div>

                {/* Sparkle effect on hover */}
                {!app.locked && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-2xl animate-spin">✨</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <p className="text-purple-300 text-sm italic">
            More horrifying creations coming soon... 🧪
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .delay-100 {
          animation-delay: 100ms;
        }
        .delay-200 {
          animation-delay: 200ms;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
        .delay-1000 {
          animation-delay: 1000ms;
        }
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
      `}</style>
    </div>
  )
}
