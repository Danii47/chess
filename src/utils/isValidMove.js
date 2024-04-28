import comprobateMiddlePieces from './comprobateMiddlePieces'

export default function isValidMove(table, oldCell, newCell, turn) {
  if (oldCell.x === newCell.x && oldCell.y === newCell.y) return false
  if (oldCell.piece.color !== turn) return false
  if (newCell.piece && newCell.piece.color === oldCell.piece.color) return false

  switch (oldCell.piece.type) {
    case 'king':
      if (Math.abs(oldCell.x - newCell.x) <= 1 && Math.abs(oldCell.y - newCell.y) <= 1) return true
      
      break
    case 'pawn':
      if (oldCell.piece.color === 'white') {
        if (oldCell.y - 1 === newCell.y && ((oldCell.x === newCell.x && !newCell.piece) || (newCell.piece && Math.abs(oldCell.x - newCell.x) === 1))) return true
        if (oldCell.y === 6 && oldCell.y - 2 === newCell.y && oldCell.x === newCell.x && !newCell.piece) return true
      } else {
        if (oldCell.y + 1 === newCell.y && ((oldCell.x === newCell.x && !newCell.piece) || (newCell.piece && Math.abs(oldCell.x - newCell.x) === 1))) return true
        if (oldCell.y === 1 && oldCell.y + 2 === newCell.y && oldCell.x === newCell.x && !newCell.piece) return true
      }
      break
    case 'rook':
      if (oldCell.x === newCell.x && !comprobateMiddlePieces(table, oldCell, newCell, 'vertical')) return true
      if (oldCell.y === newCell.y && !comprobateMiddlePieces(table, oldCell, newCell, 'horizontal')) return true
      break

    case 'bishop':
      if (Math.abs(oldCell.x - newCell.x) === Math.abs(oldCell.y - newCell.y) && !comprobateMiddlePieces(table, oldCell, newCell, 'diagonal')) return true
      break

    case 'queen':
      if (oldCell.x === newCell.x && !comprobateMiddlePieces(table, oldCell, newCell, 'vertical')) return true
      if (oldCell.y === newCell.y && !comprobateMiddlePieces(table, oldCell, newCell, 'horizontal')) return true
      if (Math.abs(oldCell.x - newCell.x) === Math.abs(oldCell.y - newCell.y) && !comprobateMiddlePieces(table, oldCell, newCell, 'diagonal')) return true
      break
    case 'knight':
      if ((Math.abs(oldCell.x - newCell.x) === 2 && Math.abs(oldCell.y - newCell.y) === 1) || (Math.abs(oldCell.x - newCell.x) === 1 && Math.abs(oldCell.y - newCell.y) === 2)) return true
      break
  }

  return false
}