import { useState } from 'react'
import './App.css'

import Table from './components/Table'

import startTable from './utils/startTable'



import Timer from './components/Timer'

import RestartGame from './components/RestartGame'

function App() {

  const [time, setTime] = useState({ 
    white: {
      seconds: 0,
      minutes: 3
    },
    black: {
      seconds: 0,
      minutes: 3
    }
  })
  
  const [table, setTable] = useState(startTable())
  const [turn, setTurn] = useState('white')
  const [isInCheck, setIsInCheck] = useState(false)
  const [winner, setWinner] = useState(undefined)
  const [gameStarted, setGameStarted] = useState(false)
  
 

  
  
  return (
    <div className='gameContainer'>
        
      <RestartGame
        setTable={setTable}
        setTurn={setTurn}
        setIsInCheck={setIsInCheck}
        setWinner={setWinner}
        setTime={setTime}
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
      />

      <Timer
        winner={winner}
        setWinner={setWinner}
        turn={turn}
        time={time}
        setTime={setTime}
        gameStarted={gameStarted}
      />
      
    </div>
  )
}

export default App
