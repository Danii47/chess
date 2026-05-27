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

  // Group into pairs: [white, black]
  const pairs = []
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({ n: Math.floor(i / 2) + 1, white: history[i], black: history[i + 1] })
  }

  return (
    <div className="moveHistory">
      <div className="moveHistoryTitle">Historial</div>
      <div className="moveHistoryList">
        {pairs.length === 0 && (
          <span className="moveHistoryEmpty">Sin movimientos</span>
        )}
        {pairs.map(({ n, white, black }) => (
          <div key={n} className="movePair">
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
