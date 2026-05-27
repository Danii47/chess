import { memo } from 'react'
import getPieceImage from '../utils/getPieceImage'

const MATERIAL = { pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 0 }
// Sort order for display: pawns first, then minor, then major
const DISPLAY_ORDER = { pawn: 0, knight: 1, bishop: 2, rook: 3, queen: 4, king: 5 }

const CapturedPieces = memo(function CapturedPieces({ captured, opponentCaptured }) {
  const myScore  = captured.reduce((s, p) => s + MATERIAL[p.type], 0)
  const oppScore = opponentCaptured.reduce((s, p) => s + MATERIAL[p.type], 0)
  const advantage = myScore - oppScore

  const sorted = [...captured].sort(
    (a, b) => DISPLAY_ORDER[a.type] - DISPLAY_ORDER[b.type]
  )

  return (
    <div className="capturedPieces">
      <div className="capturedIcons">
        {sorted.map((piece, i) => (
          <img
            key={i}
            src={getPieceImage(piece)}
            alt={piece.type}
            className="capturedIcon"
          />
        ))}
      </div>
      {advantage > 0 && (
        <span className="materialAdvantage">+{advantage}</span>
      )}
    </div>
  )
})

export default CapturedPieces
