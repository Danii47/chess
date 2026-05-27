import { useSpring, animated } from 'react-spring'
import { PIECES } from '../constants/pieces'
import getPieceImage from '../utils/getPieceImage'

const CROWNABLE_PIECES = [
  PIECES.QUEEN,
  PIECES.ROOK,
  PIECES.BISHOP,
  PIECES.KNIGHT
]

export default function Piece({ piece, cell, dragStartHandler, turn, winner, crowningPiece, onCellClick, onCrownPiece }) {
  // Pop-in spring: plays once on mount (i.e. each time a piece arrives at a cell).
  const spring = useSpring({
    from: { transform: 'scale(0.65)', opacity: 0 },
    to:   { transform: 'scale(1)',    opacity: 1 },
    config: { tension: 420, friction: 28 }
  })

  return (
    <>
      {crowningPiece === cell.id && (
        <div className='crownedContainer shadow'>
          {CROWNABLE_PIECES.map((crownablePiece, index) => (
            <div key={index} className='crownablePiece'>
              <img
                id={crownablePiece}
                src={getPieceImage({ type: crownablePiece, color: cell.piece.color })}
                alt={crownablePiece}
                className='crownablePieceImage'
                onClick={(e) => {
                  e.stopPropagation()
                  onCrownPiece(cell, crownablePiece)
                }}
              />
            </div>
          ))}
        </div>
      )}
      <animated.img
        style={spring}
        className={`chessPiece ${piece.check ? 'checked' : ''} ${winner ? 'end' : ''}`}
        src={getPieceImage(piece)}
        alt={piece.type}
        onDragStart={dragStartHandler}
        onClick={(e) => {
          e.stopPropagation()
          onCellClick(cell)
        }}
      />
    </>
  )
}
