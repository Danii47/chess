import getPossibleMoves from './getPossibleMoves'
import { extraPositionPoints, points } from './points'

export default function setBoardFunctions(table) {
  table.flat().forEach(cell => {
    cell.extraPositionPoints = extraPositionPoints
    if (cell.piece) {
      cell.piece.points = points
      cell.piece.getPossibleMoves = getPossibleMoves
    }
  })

  return table
}