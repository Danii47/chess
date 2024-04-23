import { useState } from 'react'
import './App.css'

import Table from './components/Table'

import isValidMove from './utils/isValidMove'
import startTable from './utils/startTable'
import comprobateCheck from './utils/comprobateCheck'
import comprobateCheckMate from './utils/comprobateCheckMate'

import pieceMovedSound from './assets/sounds/pieceMoved.mp3'
import Timer from './components/Timer'

import RestartGame from './components/RestartGame'

function App() {

  const [time, setTime] = useState({ 
    white: {
      seconds: 0,
      minutes: 2
    },
    black: {
      seconds: 0,
      minutes: 2
    }
  })
  const [table, setTable] = useState(startTable())
  const [turn, setTurn] = useState('white')
  const [isInCheck, setIsInCheck] = useState(false)
  const [winner, setWinner] = useState(undefined)
  
  const pieceMovedAudio = new Audio(pieceMovedSound)

  const onDropHandler = (evt) => {
    if (!evt.dataTransfer.getData('cell')) return

    const oldCell = JSON.parse(evt.dataTransfer.getData('cell'))
    const tableCopy = JSON.parse(JSON.stringify(table))


    const newCellId = evt.target.id || evt.target.parentElement.id

    const newCell = tableCopy.flat().find((cell) => {
      return cell.id == newCellId
    })


    if (!isValidMove(tableCopy, oldCell, newCell, turn)) return

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
    <div className='gameContainer'>
        
      <RestartGame
        setTable={setTable}
        setTurn={setTurn}
        setIsInCheck={setIsInCheck}
        setWinner={setWinner}
      />

      <Table
        table={table}
        onDropHandler={onDropHandler}
        winner={winner}
      />

      <Timer
        winner={winner}
        setWinner={setWinner}
        turn={turn}
        time={time}
        setTime={setTime}
      />
      
    </div>
  )
}

export default App
