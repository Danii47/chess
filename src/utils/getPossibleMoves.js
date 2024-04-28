import isValidMove from './isValidMove'

export default function getPossibleMoves(table, cell) {

  const possibleMoves = []

  table.flat().forEach(cellToMove => {
    if (isValidMove(table, cell, cellToMove, this.color)) {
      possibleMoves.push(cellToMove)
    }
  })

  return possibleMoves
}