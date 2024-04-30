import { useEffect, useState } from 'react'
import Row from './Row'
import Winner from './Winner'
import confetti from 'canvas-confetti'
import _ from 'lodash'

import isValidMove from '../utils/isValidMove'
import comprobateCheck from '../utils/comprobateCheck'
import comprobateCheckMate from '../utils/comprobateCheckMate'
import pieceMovedSound from '../assets/sounds/pieceMoved.mp3'
import checkMateSound from '../assets/sounds/checkMate.webm'
import captureSound from '../assets/sounds/capture.mp3'
import checkSound from '../assets/sounds/check.mp3'
import getRandomValue from '../utils/getRandomValue'
import changePiecesPosition from '../utils/changePiecesPosition'
import { saveGameToStorage } from '../utils/storage'

export default function Table({ table, setTable, turn, setTurn, winner, setWinner, isInCheck, setIsInCheck, gameStarted, setGameStarted, IAOpponent, lastMove, setLastMove}) {

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


    if (!isValidMove(tableCopy, oldCell, newCell, turn, isInCheck)) return


    setCellSelected(null)

    const newCellPiece = Boolean(newCell.piece)

    changePiecesPosition(tableCopy, oldCell, newCell)


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

    setLastMove({ from: oldCell, to: newCell })

    const nextTurn = turn === 'white' ? 'black' : 'white'

    setTable(tableCopy)
    setTurn(nextTurn)

    saveGameToStorage(tableCopy, nextTurn)
  }

  useEffect(() => {

    if (turn === 'white' || winner || !IAOpponent) return

    setTimeout(() => {

      const tableCopy = _.cloneDeep(table)
      let t0 = performance.now()

      const test = minimaxWithAlphaBetaPruning(tableCopy, 3, -Infinity, Infinity, true, 'black', isInCheck)
      let t1 = performance.now()
      
      console.log('Execution time of minimaxWithAlphaBetaPruning: ' + (t1 - t0) + 'ms')

      console.log(test)

      t0 = performance.now()
      const allPossibleMoves = getAllPossibleMoves(tableCopy, 'black', isInCheck, 3)
      t1 = performance.now()

      console.log('Execution time of allPossibleMoves: ' + (t1 - t0) + 'ms')
      console.log(allPossibleMoves)


      t0 = performance.now()

      const bestPossibleMoves = getBestPossibleMoves(allPossibleMoves)

      t1 = performance.now()

      console.log('Execution time of getBestPossibleMoves: ' + (t1 - t0) + 'ms')
      console.log(bestPossibleMoves)


      const getRandomPossibleMove = getRandomValue(bestPossibleMoves)

      const newCellPiece = Boolean(getRandomPossibleMove.to.piece)

      changePiecesPosition(tableCopy, getRandomPossibleMove.from, getRandomPossibleMove.to)

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

      setLastMove({ from: getRandomPossibleMove.from, to: getRandomPossibleMove.to })

      const nextTurn = turn === 'white' ? 'black' : 'white'

      setTable(tableCopy)
      setTurn(nextTurn)

      saveGameToStorage(tableCopy, nextTurn)

    }, 1000 * (Math.random() * 5));


    // eslint-disable-next-line
  }, [turn, IAOpponent])

  function minimaxWithAlphaBetaPruning(table, depth, alpha, beta, maximizingPlayer, color, isInCheck) {
    if (depth === 0) {
      return { score: evaluateBoard(table), move: null };
    }
  
    if (maximizingPlayer) {
      let maxEval = -Infinity;
      let bestMove = null;
      const allPossibleMoves = getAllPossibleMoves(table, color, isInCheck, depth);
      for (const move of allPossibleMoves) {
        const result = minimaxWithAlphaBetaPruning(move.table, depth - 1, alpha, beta, false, color === 'black' ? 'white' : 'black', false);
        if (result.score > maxEval) {
          maxEval = result.score;
          bestMove = move;
        }
        alpha = Math.max(alpha, result.score);
        if (beta <= alpha) {
          break;
        }
      }
      return { score: maxEval, move: bestMove };
    } else {
      let minEval = Infinity;
      let bestMove = null;
      const allPossibleMoves = getAllPossibleMoves(table, color, isInCheck, depth);
      for (const move of allPossibleMoves) {
        const result = minimaxWithAlphaBetaPruning(move.table, depth - 1, alpha, beta, true, color === 'black' ? 'white' : 'black', false);
        if (result.score < minEval) {
          minEval = result.score;
          bestMove = move;
        }
        beta = Math.min(beta, result.score);
        if (beta <= alpha) {
          break;
        }
      }
      return { score: minEval, move: bestMove };
    }
  }

  const getBestPossibleMoves = (allPossibleMoves) => {

    // It could have been created with recursion but since I want to set the depth to 3, I leave it as follows

    allPossibleMoves.forEach((IAMovesDepth1) => {

      IAMovesDepth1.nextMoves.forEach((OpponentMovesDepth2) => {

        const depth3MaxValue = Math.max(...OpponentMovesDepth2.nextMoves.map(IAMovesDepth3 => IAMovesDepth3.points))
        OpponentMovesDepth2.maxPointsDeeper = depth3MaxValue
      })

      const depth2MinValue = Math.min(...IAMovesDepth1.nextMoves.map(OpponentMovesDepth2 => OpponentMovesDepth2.maxPointsDeeper))
      IAMovesDepth1.minPointsDeeper = depth2MinValue
    })

    const movesFiltered = allPossibleMoves.filter(IAMovesDepth1 => IAMovesDepth1.minPointsDeeper === Math.max(...allPossibleMoves.map((IADepth1 => IADepth1.minPointsDeeper))))

    return movesFiltered
  }



  const getAllPossibleMoves = (table, color, isInCheck, depth) => {

    if (depth === 0) return null

    const allPosibleMoves = []


    table.flat().forEach(cell => {
      if (cell.piece && cell.piece.color === color) {
        const possibleMoves = cell.piece.getPossibleMoves(table, cell, turn, isInCheck)

        for (const cellToMove of possibleMoves) {

          const tableCopy = _.cloneDeep(table)


          changePiecesPosition(tableCopy, cell, cellToMove)

          allPosibleMoves.push({
            from: cell,
            to: cellToMove,
            points: evaluateBoard(table),
            table: tableCopy,
            nextMoves: getAllPossibleMoves(
              tableCopy,
              color === 'black' ? 'white' : 'black',
              false,
              depth - 1
            ),
          })

        }
      }
    })
    return allPosibleMoves
  }

  const evaluateBoard = (board) => {
    let totalEvaluation = 0
    board.flat().forEach((cell) => {
      if (cell.piece) totalEvaluation += (cell.piece.points() + cell.extraPositionPoints())
    })
    return totalEvaluation
  };


  return (

    <div className='chessTable shadow'>
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
            lastMove={lastMove}
            isInCheck={isInCheck}
          />

        })
      }
    </div>
  )
}