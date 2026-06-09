import { memo, useEffect, useRef } from 'react'

const PIECE_INITIAL = { pawn: '', knight: 'N', bishop: 'B', rook: 'R', queen: 'Q', king: 'K' }

function toAN(x, y) {
  return String.fromCharCode('a'.charCodeAt(0) + x) + (8 - y)
}

function notation(entry) {
  if (!entry) return ''
  const { piece, to, captured, isCheck, isCheckmate } = entry
  const prefix  = PIECE_INITIAL[piece.type]
  const capture = captured ? 'x' : ''
  const square  = toAN(to.x, to.y)
  const suffix  = isCheckmate ? '#' : isCheck ? '+' : ''
  return prefix + capture + square + suffix
}

const MoveHistory = memo(function MoveHistory({ history }) {
  const endRef = useRef(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history.length])

  const pairs = []
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({ n: Math.floor(i / 2) + 1, white: history[i], black: history[i + 1] })
  }

  return (
    <div className="moveHistory">
      <div className="moveHistoryTitle">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
          <polyline points="14,2 14,8 20,8"/>
          <line x1="16" y1="13" x2="8" y2="13"/>
          <line x1="16" y1="17" x2="8" y2="17"/>
        </svg>
        Historial
      </div>
      <div className="moveHistoryList">
        {pairs.length === 0 && (
          <span className="moveHistoryEmpty">Sin movimientos</span>
        )}
        {pairs.map(({ n, white, black }, idx) => (
          <div key={n} className={`movePair${idx === pairs.length - 1 ? ' last' : ''}`}>
            <span className="moveNumber">{n}.</span>
            <span className="moveWhite">{notation(white)}</span>
            <span className="moveBlack">{notation(black)}</span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  )
})

export default MoveHistory
