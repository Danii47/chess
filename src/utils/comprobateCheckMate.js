import comprobateCheck from "./comprobateCheck"
import isValidMove from "./isValidMove"

export default function comprobateCheckMate(table, turn) {
  const piecesCellsArray = table.flat().filter(cell => cell.piece && cell.piece.color !== turn)

  for (let pieceCell of piecesCellsArray) {
    for (let row of table) {
      for (let cell of row) {
        if (isValidMove(table, pieceCell, cell, turn === 'white' ? 'black' : 'white')) {

          const [oldX, oldY] = [pieceCell.x, pieceCell.y]
          const [newX, newY] = [cell.x, cell.y]

          const pieceMoved = table[oldY][oldX].piece

          const tableCopy = JSON.parse(JSON.stringify(table))

          tableCopy[oldY][oldX].piece = null
          tableCopy[newY][newX].piece = pieceMoved

          if (!comprobateCheck(tableCopy, turn)) return false

        }
      }
    }
  }
  return true
}