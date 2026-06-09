import { useReducer, useState, useCallback, useEffect } from 'react'

import { Table }          from './components/Table'
import CapturedPieces     from './components/CapturedPieces'
import MoveHistory        from './components/MoveHistory'
import RestartGame        from './components/RestartGame'

import './App.css'
import { gameReducer, createInitialGameState, GAME_ACTIONS } from './reducers/gameReducer'
import createTimeObject        from './utils/createTimeObject'
import { updateTimeInStorage } from './utils/storage'

const MATERIAL = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 }

function materialScore(pieces) {
  return pieces.reduce((s, p) => s + MATERIAL[p.type], 0)
}

function pad(n) {
  return n >= 10 ? String(n) : `0${n}`
}

function App() {
  const [gameState, dispatch] = useReducer(gameReducer, null, createInitialGameState)
  const { turn, winner, gameStarted, capturedPieces, moveHistory, isInCheck } = gameState

  const [time, setTime] = useState(() => {
    const stored = window.localStorage.getItem('time')
    return stored ? JSON.parse(stored) : createTimeObject({ minutes: 120 })
  })

  const [IAOpponent, setIAOpponent]   = useState(false)
  const [isAIThinking, setIsAIThinking] = useState(false)

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

  // ─── Material advantage ────────────────────────────────────────────────────

  const byBlackScore  = materialScore(capturedPieces.byBlack)
  const byWhiteScore  = materialScore(capturedPieces.byWhite)
  const blackAdvantage = byBlackScore - byWhiteScore
  const whiteAdvantage = byWhiteScore - byBlackScore

  // ─── Restart ──────────────────────────────────────────────────────────────

  const handleRestart = useCallback(() => {
    dispatch({ type: GAME_ACTIONS.RESTART_GAME })
    setTime(createTimeObject({ minutes: 120 }))
  }, [])

  // ─── Game status text ──────────────────────────────────────────────────────

  function getStatusText() {
    if (winner)      return winner === 'white' ? '♔ Blancas ganan' : '♚ Negras ganan'
    if (isAIThinking) return 'IA pensando…'
    if (isInCheck)   return '¡Jaque!'
    return `Turno de ${turn === 'white' ? 'Blancas' : 'Negras'}`
  }

  const statusClass = [
    'gameStatus',
    isAIThinking         ? 'thinking' : '',
    isInCheck && !winner ? 'check'    : '',
    winner               ? 'end'      : '',
  ].filter(Boolean).join(' ')

  const blackActive = turn === 'black' && !winner
  const whiteActive = turn === 'white' && !winner

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="app">

      {/* ── Left panel — PlayerCards ─────────────────────── */}
      <aside className="leftPanel">

        {/* Black player card (opponent / top) */}
        <div className={`playerCard${blackActive ? ' active' : ''}`}>
          <div className="playerCardHeader">
            <span className="playerAvatar dark">♚</span>
            <div className="playerCardMeta">
              <span className="playerCardName">Negras</span>
              <span className="playerCardRole">{IAOpponent ? 'IA' : 'Jugador 2'}</span>
            </div>
            {blackAdvantage > 0 && (
              <span className="advantageBadge">+{blackAdvantage}</span>
            )}
          </div>
          <CapturedPieces
            captured={capturedPieces.byBlack}
            opponentCaptured={capturedPieces.byWhite}
            size="lg"
          />
        </div>

        {/* White player card (you / bottom) */}
        <div className={`playerCard${whiteActive ? ' active' : ''}`}>
          <div className="playerCardHeader">
            <span className="playerAvatar light">♔</span>
            <div className="playerCardMeta">
              <span className="playerCardName">Blancas</span>
              <span className="playerCardRole">Tú</span>
            </div>
            {whiteAdvantage > 0 && (
              <span className="advantageBadge">+{whiteAdvantage}</span>
            )}
          </div>
          <CapturedPieces
            captured={capturedPieces.byWhite}
            opponentCaptured={capturedPieces.byBlack}
            size="lg"
          />
        </div>

      </aside>

      {/* ── Board column ─────────────────────────────────── */}
      <div className="boardColumn">

        {/* Status banner */}
        <div className={statusClass}>{getStatusText()}</div>

        {/* Black player bar — compact (timer + name) */}
        <div className={`playerBar top${blackActive ? ' active' : ''}`}>
          <span className="playerChip">♚</span>
          <span className="playerName">Negras</span>
          <div className="timerDisplay">
            {pad(time.black.minutes)}:{pad(time.black.seconds)}
          </div>
        </div>

        <Table
          gameState={gameState}
          dispatch={dispatch}
          IAOpponent={IAOpponent}
          onAIThinkingChange={setIsAIThinking}
          onRestart={handleRestart}
        />

        {/* White player bar — compact (timer + name) */}
        <div className={`playerBar bottom${whiteActive ? ' active' : ''}`}>
          <span className="playerChip">♔</span>
          <span className="playerName">Blancas</span>
          <div className="timerDisplay">
            {pad(time.white.minutes)}:{pad(time.white.seconds)}
          </div>
        </div>

      </div>

      {/* ── Side panel (right) ───────────────────────────── */}
      <aside className="sidePanel">
        <div className="controls">
          <RestartGame onRestart={handleRestart} />
          <button
            className={`aiToggle${IAOpponent ? ' activated' : ''}`}
            onClick={() => setIAOpponent(v => !v)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/>
              <circle cx="12" cy="5" r="2"/>
              <path d="M12 7v4"/>
              <circle cx="8.5" cy="16" r="1" fill="currentColor" stroke="none"/>
              <circle cx="15.5" cy="16" r="1" fill="currentColor" stroke="none"/>
            </svg>
            {IAOpponent ? 'Desactivar IA' : 'Activar IA'}
          </button>
        </div>
        <MoveHistory history={moveHistory} />
      </aside>

    </div>
  )
}

export default App
