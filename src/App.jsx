import { useReducer, useState, useCallback, useEffect } from 'react'

import { Table }          from './components/Table'
import CapturedPieces     from './components/CapturedPieces'
import MoveHistory        from './components/MoveHistory'
import RestartGame        from './components/RestartGame'

import './App.css'
import { gameReducer, createInitialGameState, GAME_ACTIONS } from './reducers/gameReducer'
import createTimeObject        from './utils/createTimeObject'
import { updateTimeInStorage } from './utils/storage'

// ─── helpers ─────────────────────────────────────────────────────────────────

const MATERIAL = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 }

function materialScore(pieces) {
  return pieces.reduce((s, p) => s + MATERIAL[p.type], 0)
}

function pad(n) {
  return n >= 10 ? String(n) : `0${n}`
}

// ─── App ──────────────────────────────────────────────────────────────────────

function App() {
  const [gameState, dispatch] = useReducer(gameReducer, null, createInitialGameState)
  const { turn, winner, gameStarted, capturedPieces, moveHistory } = gameState

  const [time, setTime] = useState(() => {
    const stored = window.localStorage.getItem('time')
    return stored ? JSON.parse(stored) : createTimeObject({ minutes: 120 })
  })

  const [IAOpponent, setIAOpponent] = useState(false)

  // ─── Countdown timer ───────────────────────────────────────────────────────

  const handleTimeout = useCallback((loser) => {
    dispatch({ type: GAME_ACTIONS.SET_WINNER, winner: loser === 'white' ? 'black' : 'white' })
  }, [])

  useEffect(() => {
    if (winner || !gameStarted) return
    const interval = setInterval(() => {
      setTime(prev => {
        const cur = prev[turn]
        if (cur.minutes === 0 && cur.seconds === 0) {
          handleTimeout(turn)
          return prev
        }
        const newSeconds = cur.seconds === 0 ? 59 : cur.seconds - 1
        const newMinutes = cur.seconds === 0 ? cur.minutes - 1 : cur.minutes
        const next = { ...prev, [turn]: { seconds: newSeconds, minutes: newMinutes } }
        updateTimeInStorage(next)
        return next
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [winner, gameStarted, turn, handleTimeout])

  // ─── Derived material advantage ───────────────────────────────────────────

  const byBlackScore = materialScore(capturedPieces.byBlack)   // black captured these (white pieces)
  const byWhiteScore = materialScore(capturedPieces.byWhite)   // white captured these (black pieces)
  const blackAdvantage = byBlackScore - byWhiteScore
  const whiteAdvantage = byWhiteScore - byBlackScore

  // ─── Restart ──────────────────────────────────────────────────────────────

  const handleRestart = useCallback(() => {
    dispatch({ type: GAME_ACTIONS.RESTART_GAME })
    setTime(createTimeObject({ minutes: 120 }))
  }, [])

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="app">

      {/* ── Board column ─────────────────────────── */}
      <div className="boardColumn">

        {/* Black player bar */}
        <div className={`playerBar top ${turn === 'black' && !winner ? 'active' : ''}`}>
          <span className="playerChip black">●</span>
          <span className="playerName">Negras</span>
          <CapturedPieces
            captured={capturedPieces.byBlack}
            opponentCaptured={capturedPieces.byWhite}
          />
          <div className="timerDisplay">
            {pad(time.black.minutes)}:{pad(time.black.seconds)}
          </div>
        </div>

        {/* The board */}
        <Table
          gameState={gameState}
          dispatch={dispatch}
          IAOpponent={IAOpponent}
        />

        {/* White player bar */}
        <div className={`playerBar bottom ${turn === 'white' && !winner ? 'active' : ''}`}>
          <span className="playerChip white">○</span>
          <span className="playerName">Blancas</span>
          <CapturedPieces
            captured={capturedPieces.byWhite}
            opponentCaptured={capturedPieces.byBlack}
          />
          <div className="timerDisplay">
            {pad(time.white.minutes)}:{pad(time.white.seconds)}
          </div>
        </div>

      </div>

      {/* ── Side panel ───────────────────────────── */}
      <div className="sidePanel">
        <div className="controls">
          <RestartGame onRestart={handleRestart} />
          <button
            className={`aiToggle ${IAOpponent ? 'activated' : ''}`}
            onClick={() => setIAOpponent(v => !v)}
          >
            {IAOpponent ? 'Desactivar IA' : 'Activar IA'}
          </button>
        </div>
        <MoveHistory history={moveHistory} />
      </div>

    </div>
  )
}

export default App
