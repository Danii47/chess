import isValidMove from './isValidMove'

export default function comprobateCheck(table, turn, changeCheck = false) {

  const kingCell = table.flat().find(cell => cell.piece && cell.piece.type === 'king' && cell.piece.color !== turn)

  const piecesCellsArray = table.flat().filter(cell => cell.piece && cell.piece.color === turn)

  for (let pieceCell of piecesCellsArray) {
    if (isValidMove(table, pieceCell, kingCell, turn)) {
    
      if (changeCheck) kingCell.piece.check = true
      return true
    }
  }

  if (changeCheck) kingCell.piece.check = false
  return false

}