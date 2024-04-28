export default function changePiecesPosition(table, oldCell, newCell) {

  const [oldX, oldY] = [oldCell.x, oldCell.y]
  const [newX, newY] = [newCell.x, newCell.y]

  const pieceMoved = table[oldY][oldX].piece

  table[oldY][oldX].piece = null
  table[newY][newX].piece = pieceMoved
  table[newY][newX].piece.hasMoved = true

  if (pieceMoved.type === 'king' && Math.abs(oldX - newX) === 2) {
    if (newX === 6) {
      table[newY][5].piece = table[newY][7].piece
      table[newY][7].piece = null
    } else {
      table[newY][3].piece = table[newY][0].piece
      table[newY][0].piece = null
    }
  }
}