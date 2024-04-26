import startPieces from './startPieces'
import isValidMove from './isValidMove'

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
        getPossibleMoves: function (table, cell) {

          const possibleMoves = []

          for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
              if (isValidMove(table, cell, table[i][j], cell.color)) {
                possibleMoves.push(table[i][j])
              }
            }
          }

          return possibleMoves
        }
      }

      row.push({ id: 8 * i + j, x: j, y: i, cellColor: (i + j) % 2 === 0 ? 'black' : 'white', piece: piece })
    }

    table.push(row)
  }
  return table
}