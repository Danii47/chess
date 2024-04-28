import startPieces from './startPieces'
import { points, extraPositionPoints } from './points'
import getPossibleMoves from './getPossibleMoves'

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
        points,
        getPossibleMoves
      }

      row.push({
        id: 8 * i + j,
        x: j,
        y: i,
        cellColor: (i + j) % 2 === 0 ? 'black' : 'white',
        piece: piece,
        extraPositionPoints
      })

    }

    table.push(row)
  }
  return table
}