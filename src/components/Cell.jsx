import { memo } from 'react'
import preventDefaultEvent from '../utils/preventDefaultEvent'
import Piece from './Piece'

const Cell = memo(function Cell({
  cell, rowIndex, cellIndex,
  isSelected, isValidMoveTarget, isLastMove,
  turn, winner, gameStarted, crowningPiece,
  onDragStart, onDrop, onCellClick, onCrownPiece
}) {
  const dragStartHandler = (evt) => {
    evt.dataTransfer.setData('cell', JSON.stringify(cell))
    onDragStart(cell)
  }

  const cellClass = [
    'chessCell',
    cell.cellColor,
    isSelected        ? 'selected'    : '',
    isValidMoveTarget && !cell.piece  ? 'isValidMove' : '',
    isValidMoveTarget &&  cell.piece  ? 'eatable'     : '',
    isLastMove        ? 'lastMove'    : ''
  ].filter(Boolean).join(' ')

  return (
    <div onDragOver={preventDefaultEvent} onDrop={onDrop}>
      <div
        id={8 * rowIndex + cellIndex}
        className={cellClass}
        onClick={() => onCellClick(cell)}
      >
        {/* Rank label on leftmost column, file label on bottom row */}
        {cellIndex === 0 && (
          <span className="cellLabel rankLabel">{8 - rowIndex}</span>
        )}
        {rowIndex === 7 && (
          <span className="cellLabel fileLabel">
            {String.fromCharCode('a'.charCodeAt(0) + cellIndex)}
          </span>
        )}

        {cell.piece && (
          <Piece
            piece={cell.piece}
            cell={cell}
            dragStartHandler={dragStartHandler}
            turn={turn}
            winner={winner}
            crowningPiece={crowningPiece}
            onCellClick={onCellClick}
            onCrownPiece={onCrownPiece}
          />
        )}
      </div>
    </div>
  )
}, (prev, next) => {
  const prevPiece = prev.cell.piece
  const nextPiece = next.cell.piece
  const pieceSame =
    (prevPiece === null) === (nextPiece === null) &&
    prevPiece?.type    === nextPiece?.type        &&
    prevPiece?.color   === nextPiece?.color       &&
    prevPiece?.hasMoved === nextPiece?.hasMoved   &&
    prevPiece?.check   === nextPiece?.check

  return (
    pieceSame &&
    prev.isSelected        === next.isSelected        &&
    prev.isValidMoveTarget === next.isValidMoveTarget &&
    prev.isLastMove        === next.isLastMove        &&
    prev.turn              === next.turn              &&
    prev.winner            === next.winner            &&
    prev.crowningPiece     === next.crowningPiece     &&
    prev.gameStarted       === next.gameStarted
  )
})

export default Cell
