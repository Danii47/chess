import startPieces from './startPieces'
import isValidMove from './isValidMove'
import { PIECES_POINTS, PIECES_POSITION_POINTS } from '../constants/pieces'

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

          return this.color === 'black' ? PIECES_POINTS[this.type] : -PIECES_POINTS[this.type]
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

      row.push({
        id: 8 * i + j,
        x: j,
        y: i,
        cellColor: (i + j) % 2 === 0 ? 'black' : 'white',
        piece: piece,
        extraPositionPoints() {
          return !this.piece ? 0 : PIECES_POSITION_POINTS[this.piece.type][this.piece.color][this.y][this.x]
        }
      })

    }

    table.push(row)
  }
  return table
}