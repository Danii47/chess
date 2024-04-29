import isValidMove from './isValidMove'

export default function getPossibleMoves(table, cell, isInCheck) {

  const possibleMoves = []

  table.flat().forEach(cellToMove => {
    if (isValidMove(table, cell, cellToMove, this.color, isInCheck)) {
      possibleMoves.push(cellToMove)
    }
  })

  return possibleMoves
}