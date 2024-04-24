import getPieceImage from "../utils/getPieceImage"
import isValidMove from "../utils/isValidMove"

export default function Cell({ rowIndex, cell, cellIndex, onDropHandler, winner, table, cellSelected, setCellSelected, turn, gameStarted, setGameStarted }) {

  const dragStartHandler = (evt, cell) => {
    if (cell.piece.color !== turn) return
    if (!gameStarted) setGameStarted(true)

    evt.dataTransfer.setData('cell', JSON.stringify(cell))
    setCellSelected(cell)
  }

  const draggingOverHandler = (evt) => {
    evt.preventDefault()
  }

  const showPossibleMovements = (cellSelected) => {
    if (cell.piece.color !== turn) return
    if (!gameStarted) setGameStarted(true)

    setCellSelected(cellSelected)
  }

  const handleMovePiece = (evt) => {
    if (!cellSelected) return

    onDropHandler(evt, cellSelected)
  }

  return (
    <div onDragOver={(evt) => draggingOverHandler(evt)} onDrop={(evt) => onDropHandler(evt)}>
      {
        (cellIndex === 0) &&
        <div className="chessRowLabel">{8 - rowIndex}</div>
      }
      {
        (rowIndex === 7) &&
        <div style={{ right: `${cellIndex * 100}px` }} className="chessColLabel">{String.fromCharCode("A".charCodeAt(0) + (7 - cellIndex))}</div>
      }
      <div
        id={8 * rowIndex + cellIndex}
        className={`chessCell ${cell.cellColor} ${cellSelected && isValidMove(table, cellSelected, cell, cellSelected.piece.color) ? "isValidMove" : ""} ${cell.id === cellSelected?.id ? "selected" : ""}`}
        onClick={(evt) => handleMovePiece(evt)}  
      >
        {
          cell.piece &&
          <img
            className={`chessPiece${(cell.piece && cell.piece.check) ? " checked" : ""}${winner ? " end" : ""}`}
            src={getPieceImage(cell.piece)} alt={`${cell.piece.type}`}
            onDragStart={(evt) => dragStartHandler(evt, cell)}
            onClick={() => showPossibleMovements(cell)}
          />
        }
      </div>
    </div>
  )
}