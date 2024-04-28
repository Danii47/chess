import { useState } from 'react'

import Table from './components/Table'
import startTable from './utils/startTable'
import Timer from './components/Timer'
import RestartGame from './components/RestartGame'

import './App.css'

function App() {

  const [time, setTime] = useState({
    white: {
      seconds: 0,
      minutes: 120
    },
    black: {
      seconds: 0,
      minutes: 120
    }
  })

  const [table, setTable] = useState(startTable())
  const [turn, setTurn] = useState('white')
  const [isInCheck, setIsInCheck] = useState(false)
  const [winner, setWinner] = useState(undefined)
  const [gameStarted, setGameStarted] = useState(false)
  const [IAOpponent, setIAOpponent] = useState(false)


  return (
    <div className='gameContainer'>

      <RestartGame
        setTable={setTable}
        setTurn={setTurn}
        setIsInCheck={setIsInCheck}
        setWinner={setWinner}
        setTime={setTime}
        setGameStarted={setGameStarted}
        setIAOpponent={setIAOpponent}
      />

      <Table
        table={table}
        setTable={setTable}
        turn={turn}
        setTurn={setTurn}
        winner={winner}
        setWinner={setWinner}
        isInCheck={isInCheck}
        setIsInCheck={setIsInCheck}
        gameStarted={gameStarted}
        setGameStarted={setGameStarted}
        IAOpponent={IAOpponent}
      />

      <Timer
        winner={winner}
        setWinner={setWinner}
        turn={turn}
        time={time}
        setTime={setTime}
        gameStarted={gameStarted}
        IAOpponent={IAOpponent}
        setIAOpponent={setIAOpponent}
      />

    </div>
  )
}

export default App
