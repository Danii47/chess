import startPieces from './startPieces'
import isValidMove from './isValidMove'

const PIECES_POINTS = {
  pawn: 10,
  knight: 30,
  bishop: 30,
  rook: 50,
  queen: 90,
  king: 900
}

export default function startTable() {
  const table = []

  for (let i = 0; i < 8; i++) {

    const row = []

    for (let j = 0; j < 8; j++) {

      const piece = (i >= 2 && i <= 5) ? null : {
        type: startPieces(j, i),
        color: i < 2 ? 'black' : 'white',
        check: false,
        hasMoved: false,
        points() {
          return this.color === "white" ? PIECES_POINTS[this.type] : -PIECES_POINTS[this.type]
        },
        getPossibleMoves(table, cell) {

          const possibleMoves = []

          table.flat().forEach(cellToMove => {
            if (isValidMove(table, cell, cellToMove, this.color)) {
              
              possibleMoves.push(cellToMove)
            }

          })

          return possibleMoves
        }
      }

      row.push({ id: 8 * i + j, x: j, y: i, cellColor: (i + j) % 2 === 0 ? 'black' : 'white', piece: piece })
    }

    table.push(row)
  }
  return table
}