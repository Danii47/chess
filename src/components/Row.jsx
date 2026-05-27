import { memo } from 'react'
import Cell from './Cell'

const Row = memo(function Row({
  row, rowIndex,
  selectedCellId, validMoveIds, lastMoveFromId, lastMoveToId,
  turn, winner, gameStarted, crowningPiece,
  onDragStart, onDrop, onCellClick, onCrownPiece
}) {
  return (
    <div className='chessRow'>
      {row.map((cell, cellIndex) => (
        <Cell
          key={8 * rowIndex + cellIndex}
          cell={cell}
          rowIndex={rowIndex}
          cellIndex={cellIndex}
          isSelected={cell.id === selectedCellId}
          isValidMoveTarget={validMoveIds.has(cell.id)}
          isLastMove={cell.id === lastMoveFromId || cell.id === lastMoveToId}
          turn={turn}
          winner={winner}
          gameStarted={gameStarted}
          crowningPiece={crowningPiece}
          onDragStart={onDragStart}
          onDrop={onDrop}
          onCellClick={onCellClick}
          onCrownPiece={onCrownPiece}
        />
      ))}
    </div>
  )
})

export default Row
