import { useState } from 'react'

import {Table} from './components/Table'
import startTable from './utils/startTable'
import Timer from './components/Timer'
import RestartGame from './components/RestartGame'

import './App.css'
import setBoardFunctions from './utils/setBoardFunctions'
import createTimeObject from './utils/createTimeObject'
import { COLORS } from './constants/pieces'


function App() {

  const [time, setTime] = useState(() => {

    const timeFromStorage = window.localStorage.getItem('time')
    if (timeFromStorage) return JSON.parse(timeFromStorage)

    return createTimeObject({ minutes: 120 })
  })

  const [table, setTable] = useState(() => {

    const boardFromStorage = window.localStorage.getItem('table')
    if (!boardFromStorage) return startTable()

    return setBoardFunctions(JSON.parse(boardFromStorage)) // setBoardFunctions is a function that adds the functions to the pieces cause JSON.parse removes them
  })

  const [turn, setTurn] = useState(() => {
    return window.localStorage.getItem('turn') ?? COLORS.WHITE
  })

  const [isInCheck, setIsInCheck] = useState(false)
  const [winner, setWinner] = useState(undefined)
  const [gameStarted, setGameStarted] = useState(false)
  const [IAOpponent, setIAOpponent] = useState(false)
  const [lastMove, setLastMove] = useState(null)


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
        setLastMove={setLastMove}
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
        lastMove={lastMove}
        setLastMove={setLastMove}
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
