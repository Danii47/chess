import { PIECES } from '../constants/pieces';
import comprobateCheck from '../utils/comprobateCheck';
import getPieceImage from '../utils/getPieceImage';
import getPossibleMoves from '../utils/getPossibleMoves';
import checkSound from '../assets/sounds/check.mp3';
const CROWNABLE_PIECES = [
  PIECES.QUEEN,
  PIECES.ROOK,
  PIECES.BISHOP,
  PIECES.KNIGHT
]

export default function Piece({ piece, cell, dragStartHandler, cellSelected, setCellSelected, turn, gameStarted, setGameStarted, winner, crowningPiece, setCrowningPiece, table, setIsInCheck }) {

  
  const showPossibleMovements = (cellClicked) => {
    
    if (cell.piece.color !== turn) return
    
    if (!gameStarted) setGameStarted(true)
    
    if (cellSelected && cellSelected.id === cellClicked.id) setCellSelected(null)
    else setCellSelected(cellClicked)
}

const handlePieceCrownedSelected = (event) => {
  setCrowningPiece(false)
  const newPieceType = event.target.id
  
  cell.piece.type = newPieceType
  cell.piece.getPossibleMoves = getPossibleMoves
  
  setGameStarted(true)
  
  const check = comprobateCheck(table, turn === 'white' ? 'black' : 'white', true)
  
    if (check) {
      const checkAudio = new Audio(checkSound)
      checkAudio.play()
    }

    setIsInCheck(check)
  }

  return (
    <>
      {
        crowningPiece === cell.id &&
          <div className='crownedContainer shadow'>
            {
              CROWNABLE_PIECES.map((crownablePiece, index) => {

                
                const pieceImage = getPieceImage({ type: crownablePiece, color: cell.piece.color })
                
                return (
                  <div key={index} className='crownablePiece'>
                    <img id={crownablePiece} src={pieceImage} alt={crownablePiece.type} onClick={(event) => handlePieceCrownedSelected(event)} className='crownablePieceImage' />
                  </div>
                )
              })
            }
          </div>
      }
      <img
        className={`chessPiece ${(piece.check) ? 'checked' : ''} ${winner ? 'end' : ''}`}
        src={getPieceImage(piece)} alt={`${piece.type}`}
        onDragStart={(evt) => dragStartHandler(evt, cell)}
        onClick={() => showPossibleMovements(cell)}
      />
    </>
  )
}