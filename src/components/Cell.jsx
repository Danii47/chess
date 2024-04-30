import preventDefaultEvent from '../utils/preventDefaultEvent'
import Piece from './Piece'

export default function Cell({ rowIndex, cell, cellIndex, onDropHandler, winner, table, cellSelected, setCellSelected, turn, isInCheck, gameStarted, setGameStarted, lastMove }) {

  const dragStartHandler = (evt, cell) => {
    if (cell.piece.color !== turn) return

    if (!gameStarted) setGameStarted(true)

    evt.dataTransfer.setData('cell', JSON.stringify(cell))
    setCellSelected(cell)
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
    <div onDragOver={preventDefaultEvent} onDrop={(evt) => onDropHandler(evt)}>
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
          cell.piece && <Piece
            piece={cell.piece}
            cell={cell}
            dragStartHandler={dragStartHandler}
            cellSelected={cellSelected}
            setCellSelected={setCellSelected}
            turn={turn}
            gameStarted={gameStarted}
            setGameStarted={setGameStarted}
            winner={winner}
          />
        }
      </div>
    </div>
  )
}