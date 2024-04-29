import getPieceImage from '../utils/getPieceImage';


export default function Piece({ piece, cell, dragStartHandler, cellSelected, setCellSelected, turn, gameStarted, setGameStarted, winner }) {

  const showPossibleMovements = (cellClicked) => {

    if (cell.piece.color !== turn) return

    if (!gameStarted) setGameStarted(true)

    if (cellSelected && cellSelected.id === cellClicked.id) setCellSelected(null)
    else setCellSelected(cellClicked)
  }

  return (
    <img
      className={`chessPiece ${(piece.check) ? 'checked' : ''} ${winner ? 'end' : ''}`}
      src={getPieceImage(piece)} alt={`${piece.type}`}
      onDragStart={(evt) => dragStartHandler(evt, cell)}
      onClick={() => showPossibleMovements(cell)}
    />
  )
}