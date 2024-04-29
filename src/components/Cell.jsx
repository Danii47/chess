import getPieceImage from '../utils/getPieceImage'

export default function Cell({ rowIndex, cell, cellIndex, onDropHandler, winner, table, cellSelected, setCellSelected, turn, isInCheck, gameStarted, setGameStarted, lastMove }) {

  const dragStartHandler = (evt, cell) => {
    if (cell.piece.color !== turn) return
    if (!gameStarted) setGameStarted(true)

    evt.dataTransfer.setData('cell', JSON.stringify(cell))
    setCellSelected(cell)
  }

  const draggingOverHandler = (evt) => {
    evt.preventDefault()
  }

  const showPossibleMovements = (cellClicked) => {

    if (cell.piece.color !== turn) return
    
    if (!gameStarted) setGameStarted(true)

    if (cellSelected && cellSelected.id === cellClicked.id) setCellSelected(null)
    else setCellSelected(cellClicked)
  }

  const handleMovePiece = (evt) => {
    if (!cellSelected) return

    onDropHandler(evt, cellSelected)
  }

  const isValidPossibleMove = (cell) => {
    if (!cellSelected) return false

    const possibleMoves = cellSelected.piece.getPossibleMoves(table, cellSelected, turn, isInCheck)
    
    return possibleMoves.some((cellToMove) => cellToMove.id === cell.id)
  }

  return (
    <div onDragOver={(evt) => draggingOverHandler(evt)} onDrop={(evt) => onDropHandler(evt)}>
      {
        (cellIndex === 0) &&
        <div className='chessRowLabel'>{8 - rowIndex}</div>
      }
      {
        (rowIndex === 7) &&
        <div style={{ right: `${cellIndex * 100}px` }} className='chessColLabel'>{String.fromCharCode('A'.charCodeAt(0) + (7 - cellIndex))}</div>
      }
      <div
        id={8 * rowIndex + cellIndex}
        className={`chessCell ${cell.cellColor} ${isValidPossibleMove(cell) && !cell.piece ? 'isValidMove' : ''} ${isValidPossibleMove(cell) && cell.piece ? 'eatable' : ''} ${cell.id === cellSelected?.id ? 'selected' : ''} ${lastMove?.from.id === cell.id || lastMove?.to.id === cell.id ? 'lastMove' : ''}`}
        onClick={(evt) => handleMovePiece(evt)}  
      >
        {
          cell.piece &&
          <img
            className={`chessPiece ${(cell.piece && cell.piece.check) ? 'checked' : ''} ${winner ? 'end' : ''}`}
            src={getPieceImage(cell.piece)} alt={`${cell.piece.type}`}
            onDragStart={(evt) => dragStartHandler(evt, cell)}
            onClick={() => showPossibleMovements(cell)}
          />
        }
      </div>
    </div>
  )
}