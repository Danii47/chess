import Row from "./Row"
import Winner from "./Winner"
import { useState } from "react"

import isValidMove from '../utils/isValidMove'
import comprobateCheck from '../utils/comprobateCheck'
import comprobateCheckMate from '../utils/comprobateCheckMate'
import pieceMovedSound from '../assets/sounds/pieceMoved.mp3'

export default function Table({ table, setTable, turn, setTurn, winner, setWinner, isInCheck, setIsInCheck, gameStarted, setGameStarted }) {
  
  const [cellSelected, setCellSelected] = useState(null)

  const pieceMovedAudio = new Audio(pieceMovedSound)

  const onDropHandler = (evt, oldCellData = undefined) => {
    if (!oldCellData && !evt.dataTransfer.getData('cell')) return

    if (!gameStarted) setGameStarted(true)
    
    const oldCell = oldCellData || JSON.parse(evt.dataTransfer.getData('cell'))
    const tableCopy = JSON.parse(JSON.stringify(table))
    
    const newCellId = evt.target.id || evt.target.parentElement.id
    
    const newCell = tableCopy.flat().find((cell) => {
      return cell.id == newCellId
    })
    
    
    if (!isValidMove(tableCopy, oldCell, newCell, turn)) return
    setCellSelected(null)

    const [oldX, oldY] = [oldCell.x, oldCell.y]
    const [newX, newY] = [newCell.x, newCell.y]
    const pieceMoved = tableCopy[oldY][oldX].piece

    tableCopy[oldY][oldX].piece = null
    tableCopy[newY][newX].piece = pieceMoved

    if ((isInCheck && comprobateCheck(tableCopy, turn === 'white' ? 'black' : 'white', true)) || (!isInCheck && comprobateCheck(tableCopy, turn === 'white' ? 'black' : 'white', true))) return

    pieceMovedAudio.play()

    setIsInCheck(comprobateCheck(tableCopy, turn, true))

    if (comprobateCheckMate(tableCopy, turn)) setWinner(turn)


    setTable(tableCopy)
    setTurn(turn === 'white' ? 'black' : 'white')
  }

  return (
    
    <div className="chessTable shadow">
      {
        winner &&
          <Winner winner={winner}/>
      }
      
      {
        table.map((row, rowIndex) => {

          return <Row
              key={rowIndex}
              row={row}
              rowIndex={rowIndex}
              onDropHandler={onDropHandler}
              table={table}
              cellSelected={cellSelected}
              setCellSelected={setCellSelected}
              turn={turn}
              gameStarted={gameStarted}
              setGameStarted={setGameStarted}
            />

        })
      }
    </div>
  )
}