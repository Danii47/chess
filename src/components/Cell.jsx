import getPieceImage from "../utils/getPieceImage"


export default function Cell({ rowIndex, cell, cellIndex, onDropHandler, winner }) {

  const dragStartHandler = (evt, cell) => {
    evt.dataTransfer.setData('cell', JSON.stringify(cell))
  }

  const draggingOverHandler = (evt) => {
    evt.preventDefault()
  }
  console.log("Cargo celda")
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
      <div id={8 * rowIndex + cellIndex} className={`chessCell ${cell.cellColor}`}>
        {
          cell.piece &&
            <img
              className={`chessPiece${(cell.piece && cell.piece.check) ? " checked" : ""}${winner ? " end" : ""}`}
              src={getPieceImage(cell.piece)} alt={`${cell.piece.type}`}
              onDragStart={(evt) => dragStartHandler(evt, cell)} />}
      </div>
    </div>
  )
}