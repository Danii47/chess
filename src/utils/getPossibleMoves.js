import _ from 'lodash'
import isValidMove from './isValidMove'
import comprobateCheck from './comprobateCheck'

export default function getPossibleMoves(table, cellFrom, turn, isInCheck) {

  const possibleMoves = []

  table.flat().forEach(cellToMove => {
    if (!isValidMove(table, cellFrom, cellToMove, this.color, isInCheck)) return
      
    const tableCopy = _.cloneDeep(table)

    const oldCell = tableCopy.flat().find(cell => cell.id === cellFrom.id)
    const newCell = tableCopy.flat().find(cell => cell.id === cellToMove.id)
    
    oldCell.piece = null
    newCell.piece = cellFrom.piece
    
    if (comprobateCheck(tableCopy, turn === 'white' ? 'black' : 'white')) return

    possibleMoves.push(cellToMove)
    
  })

  return possibleMoves
}