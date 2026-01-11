'use client'

import { useState } from 'react'
import Link from 'next/link'

type Card = {
  suit: '♠' | '♥' | '♦' | '♣'
  rank: string
  value: number
}

const suits: Array<'♠' | '♥' | '♦' | '♣'> = ['♠', '♥', '♦', '♣']
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']

function createDeck(): Card[] {
  const deck: Card[] = []
  for (let suit of suits) {
    for (let i = 0; i < ranks.length; i++) {
      deck.push({
        suit,
        rank: ranks[i],
        value: i + 2
      })
    }
  }
  return deck.sort(() => Math.random() - 0.5)
}

export default function Poker() {
  const [playerCards, setPlayerCards] = useState<Card[]>([])
  const [communityCards, setCommunityCards] = useState<Card[]>([])
  const [opponentCards, setOpponentCards] = useState<Card[]>([])
  const [chips, setChips] = useState(1000)
  const [pot, setPot] = useState(0)
  const [currentBet, setCurrentBet] = useState(0)
  const [gamePhase, setGamePhase] = useState<'start' | 'preflop' | 'flop' | 'turn' | 'river' | 'showdown'>('start')
  const [message, setMessage] = useState('Click Deal to start!')

  const dealCards = () => {
    const deck = createDeck()
    setPlayerCards([deck[0], deck[1]])
    setOpponentCards([deck[2], deck[3]])
    setCommunityCards([])
    setPot(20)
    setChips(chips - 10)
    setCurrentBet(10)
    setGamePhase('preflop')
    setMessage('Your turn! Check, Call, Raise, or Fold')
  }

  const dealFlop = () => {
    const deck = createDeck()
    setCommunityCards([deck[10], deck[11], deck[12]])
    setGamePhase('flop')
    setMessage('Flop dealt! What\'s your move?')
  }

  const dealTurn = () => {
    const deck = createDeck()
    setCommunityCards([...communityCards, deck[15]])
    setGamePhase('turn')
    setMessage('Turn card revealed!')
  }

  const dealRiver = () => {
    const deck = createDeck()
    setCommunityCards([...communityCards, deck[18]])
    setGamePhase('river')
    setMessage('River card! Final betting round')
  }

  const showdown = () => {
    setGamePhase('showdown')
    const win = Math.random() > 0.5
    if (win) {
      setChips(chips + pot)
      setMessage('🎉 You won! Nice hand!')
    } else {
      setMessage('💀 Opponent wins this round')
    }
    setPot(0)
  }

  const handleCall = () => {
    if (gamePhase === 'preflop') dealFlop()
    else if (gamePhase === 'flop') dealTurn()
    else if (gamePhase === 'turn') dealRiver()
    else if (gamePhase === 'river') showdown()
  }

  const handleRaise = () => {
    if (chips >= 20) {
      setChips(chips - 20)
      setPot(pot + 20)
      setMessage('You raised! Opponent calls...')
      setTimeout(handleCall, 1000)
    }
  }

  const handleFold = () => {
    setMessage('You folded. Opponent wins the pot.')
    setPot(0)
    setGamePhase('start')
    setPlayerCards([])
    setOpponentCards([])
    setCommunityCards([])
  }

  const CardComponent = ({ card, faceDown }: { card: Card; faceDown?: boolean }) => {
    const isRed = card.suit === '♥' || card.suit === '♦'

    if (faceDown) {
      return (
        <div className="w-16 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg border-2 border-blue-400">
          <div className="text-white text-3xl">🂠</div>
        </div>
      )
    }

    return (
      <div className="w-16 h-24 bg-white rounded-lg flex flex-col items-center justify-between p-2 shadow-lg border-2 border-gray-300">
        <div className={`text-2xl font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.rank}
        </div>
        <div className={`text-3xl ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.suit}
        </div>
        <div className={`text-2xl font-bold ${isRed ? 'text-red-600' : 'text-black'}`}>
          {card.rank}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-900 to-black p-8">
      {/* Home Button */}
      <Link
        href="/"
        className="fixed top-4 left-4 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700 transition-colors font-medium z-10 flex items-center gap-2"
      >
        🏠 Home
      </Link>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-yellow-400 mb-2 drop-shadow-lg">
          🃏 Texas Hold'em 🃏
        </h1>
        <p className="text-white text-xl">
          Chips: <span className="text-yellow-400 font-bold">${chips}</span>
          {' | '}
          Pot: <span className="text-green-400 font-bold">${pot}</span>
        </p>
      </div>

      {/* Game Area */}
      <div className="max-w-4xl mx-auto">
        {/* Opponent */}
        <div className="mb-12 text-center">
          <p className="text-white mb-4 text-lg font-semibold">Opponent</p>
          <div className="flex justify-center gap-2">
            {opponentCards.map((card, i) => (
              <CardComponent key={i} card={card} faceDown={gamePhase !== 'showdown'} />
            ))}
          </div>
        </div>

        {/* Community Cards */}
        <div className="mb-12 bg-green-700 rounded-xl p-6 min-h-[150px] flex items-center justify-center">
          <div className="flex gap-2">
            {communityCards.map((card, i) => (
              <CardComponent key={i} card={card} />
            ))}
            {communityCards.length === 0 && (
              <p className="text-white text-lg italic">Community cards will appear here</p>
            )}
          </div>
        </div>

        {/* Player */}
        <div className="mb-8 text-center">
          <div className="flex justify-center gap-2 mb-4">
            {playerCards.map((card, i) => (
              <CardComponent key={i} card={card} />
            ))}
          </div>
          <p className="text-white text-lg font-semibold">You</p>
        </div>

        {/* Message */}
        <div className="text-center mb-6">
          <p className="text-yellow-300 text-xl font-bold bg-black bg-opacity-50 rounded-full px-6 py-3 inline-block">
            {message}
          </p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 flex-wrap">
          {gamePhase === 'start' && (
            <button
              onClick={dealCards}
              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:scale-110 transition-transform"
            >
              Deal Cards 🎴
            </button>
          )}

          {gamePhase !== 'start' && gamePhase !== 'showdown' && (
            <>
              <button
                onClick={handleCall}
                className="bg-blue-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg hover:scale-105 transition-transform"
              >
                {gamePhase === 'preflop' ? 'Check ✓' : 'Call 📞'}
              </button>
              <button
                onClick={handleRaise}
                className="bg-yellow-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg hover:scale-105 transition-transform"
              >
                Raise 💰
              </button>
              <button
                onClick={handleFold}
                className="bg-red-600 text-white px-6 py-3 rounded-full text-lg font-bold shadow-lg hover:scale-105 transition-transform"
              >
                Fold 🚫
              </button>
            </>
          )}

          {gamePhase === 'showdown' && (
            <button
              onClick={() => {
                setGamePhase('start')
                setPlayerCards([])
                setOpponentCards([])
                setCommunityCards([])
                setMessage('Click Deal to start!')
              }}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 rounded-full text-xl font-bold shadow-lg hover:scale-110 transition-transform"
            >
              New Hand 🎲
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
