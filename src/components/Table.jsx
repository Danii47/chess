import { useEffect, useState } from "react"
import Row from "./Row"
import Winner from "./Winner"
import confetti from 'canvas-confetti'
import _ from 'lodash'

import isValidMove from '../utils/isValidMove'
import comprobateCheck from '../utils/comprobateCheck'
import comprobateCheckMate from '../utils/comprobateCheckMate'
import pieceMovedSound from '../assets/sounds/pieceMoved.mp3'
import checkMateSound from '../assets/sounds/checkMate.webm'
import captureSound from '../assets/sounds/capture.mp3'
import checkSound from '../assets/sounds/check.mp3'
import getRandomValue from "../utils/getRandomValue"

export default function Table({ table, setTable, turn, setTurn, winner, setWinner, isInCheck, setIsInCheck, gameStarted, setGameStarted }) {

  const [cellSelected, setCellSelected] = useState(null)

  const pieceMovedAudio = new Audio(pieceMovedSound)
  const checkMateAudio = new Audio(checkMateSound)
  const captureAudio = new Audio(captureSound)
  const checkAudio = new Audio(checkSound)

  const onDropHandler = (evt, oldCellData = undefined) => {
    if (!oldCellData && !evt.dataTransfer.getData('cell')) return

    if (!gameStarted) setGameStarted(true)

    const oldCell = oldCellData || JSON.parse(evt.dataTransfer.getData('cell'))
    const tableCopy = _.cloneDeep(table)

    const newCellId = evt.target.id || evt.target.parentElement.id

    const newCell = tableCopy.flat().find((cell) => {
      return cell.id == newCellId
    })


    if (!isValidMove(tableCopy, oldCell, newCell, turn)) return
    setCellSelected(null)

    const [oldX, oldY] = [oldCell.x, oldCell.y]
    const [newX, newY] = [newCell.x, newCell.y]
    const pieceMoved = tableCopy[oldY][oldX].piece

    const newCellPiece = newCell.piece

    tableCopy[oldY][oldX].piece = null
    tableCopy[newY][newX].piece = pieceMoved

    if ((isInCheck && comprobateCheck(tableCopy, turn === 'white' ? 'black' : 'white', true)) || (!isInCheck && comprobateCheck(tableCopy, turn === 'white' ? 'black' : 'white', true))) return

    const check = comprobateCheck(tableCopy, turn, true)

    setIsInCheck(check)

    if (comprobateCheckMate(tableCopy, turn)) {
      setWinner(turn)
      checkMateAudio.play()


      confetti({
        particleCount: 200,
        spread: 130,
        origin: { y: .6 }
      })



    } else if (newCellPiece) {
      captureAudio.play()
    } else if (check) {
      checkAudio.play()
    } else {
      pieceMovedAudio.play()
    }


    setTable(tableCopy)
    setTurn(turn === 'white' ? 'black' : 'white')
  }

  useEffect(() => {

    if (turn === "white" || winner) return

    setTimeout(() => {

      const tableCopy = _.cloneDeep(table)


      // Dibujar el tablero en la terminal
      console.log(tableCopy.map(row => row.map(cell => cell.piece ? cell.piece.type[0] : " ")))

      let allPossibleMoves = getAllPossibleMoves(tableCopy, "black", isInCheck)

      allPossibleMoves = addBestOponentMovesPoints(allPossibleMoves, "white", isInCheck)

      console.log({allPossibleMoves})

      allPossibleMoves = allPossibleMoves
        .filter(move => move.opponentPoints === Math.max(...allPossibleMoves.map(move => move.opponentPoints)))
        

      const bestPossibleMoves = allPossibleMoves
        .filter(move => move.points === Math.max(...allPossibleMoves.map(move => move.points)))


      console.log({bestPossibleMoves})

    


      const getRandomPossibleMove = getRandomValue(bestPossibleMoves)

      const [fromY, fromX] = [getRandomPossibleMove.from.y, getRandomPossibleMove.from.x]
      const [toY, toX] = [getRandomPossibleMove.to.y, getRandomPossibleMove.to.x]
      const pieceMoved = tableCopy[fromY][fromX].piece
      
      const newCellPiece = _.cloneDeep(tableCopy[toY][toX].piece)

      tableCopy[fromY][fromX].piece = null
      tableCopy[toY][toX].piece = pieceMoved

      comprobateCheck(tableCopy, turn === 'white' ? 'black' : 'white', true)

      const check = comprobateCheck(tableCopy, turn, true)


      setIsInCheck(check)

      if (comprobateCheckMate(tableCopy, turn)) {
        setWinner(turn)
        checkMateAudio.play()


        confetti({
          particleCount: 200,
          spread: 130,
          origin: { y: .6 }
        })



      } else if (newCellPiece) {
        captureAudio.play()
      } else if (check) {
        checkAudio.play()
      } else {
        pieceMovedAudio.play()
      }
      console.log("Actualizo el tablero")
      setTable(tableCopy)
      setTurn('white')
    }, 1000);


    // eslint-disable-next-line
  }, [turn])



  const addBestOponentMovesPoints = (bestPossibleMoves, color, isInCheck) => {
      

  
      return bestPossibleMoves.map(move => {
  
        const tableCopy = _.cloneDeep(move.table)
  
        const allPossibleMoves = getAllPossibleMoves(tableCopy, color, isInCheck)
  
        return { ...move, opponentPoints: Math.min(...allPossibleMoves.map(move => move.points)) }
  
      })
  

  
    }


  const getAllPossibleMoves = (table, color, isInCheck) => {

    const allPosibleMoves = []
    table.flat().forEach(cell => {
      if (cell.piece && cell.piece.color === color) {
        const possibleMoves = cell.piece.getPossibleMoves(table, cell)
        
        possibleMoves.forEach(cellToMove => {
          
          const tableCopy = _.cloneDeep(table)

          const movePoints = cellToMove.piece ? cellToMove.piece.points() : 0

          tableCopy[cell.y][cell.x].piece = null
          tableCopy[cellToMove.y][cellToMove.x].piece = cell.piece
          

          if ((isInCheck && comprobateCheck(tableCopy, color === "black" ? "white" : "black", false)) || (!isInCheck && comprobateCheck(tableCopy, color === "black" ? "white" : "black", false))) return

          allPosibleMoves.push({ from: cell, to: cellToMove, points: movePoints, table: tableCopy })

        })
      }
    })

    return allPosibleMoves

  }

  return (

    <div className="chessTable shadow">
      {
        winner &&
        <Winner winner={winner} />
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