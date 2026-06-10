import { useEffect, useState, useCallback, useRef, memo } from 'react'
import Row from './Row'
import Winner from './Winner'
import confetti from 'canvas-confetti'

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
import setBoardFunctions from '../utils/setBoardFunctions'
import { PIECES } from '../constants/pieces'
import { GAME_ACTIONS } from '../reducers/gameReducer'
import getPossibleMoves from '../utils/getPossibleMoves'

const pieceMovedAudio = new Audio(pieceMovedSound)
const checkMateAudio  = new Audio(checkMateSound)
const captureAudio    = new Audio(captureSound)
const checkAudio      = new Audio(checkSound)

// ─── Board serialisation for the Web Worker ───────────────────────────────────
const PIECE_CODE = { pawn: 1, knight: 2, bishop: 3, rook: 4, queen: 5, king: 6 }

function serializeForWorker(table) {
  const board    = new Int8Array(64)
  const hasMoved = new Uint8Array(64)
  table.flat().forEach(cell => {
    if (!cell.piece) return
    const code = PIECE_CODE[cell.piece.type]
    board[cell.id]    = cell.piece.color === 'white' ? code : -code
    hasMoved[cell.id] = cell.piece.hasMoved ? 1 : 0
  })
  return { board, hasMoved }
}

// ─── Component ────────────────────────────────────────────────────────────────

export const Table = memo(function Table({ gameState, dispatch, IAOpponent, aiDepth, onAIThinkingChange, onRestart }) {
  const { table, turn, isInCheck, winner, gameStarted, lastMove, crowningPiece } = gameState

  const [uiState, setUiState] = useState({
    selectedCell: null,
    validMoveIds: new Set(),
    isAIThinking: false
  })

  const gameStateRef   = useRef(gameState)
  const uiStateRef     = useRef(uiState)
  const IAOpponentRef  = useRef(IAOpponent)
  const workerRef      = useRef(null)

  gameStateRef.current  = gameState
  uiStateRef.current    = uiState
  IAOpponentRef.current = IAOpponent

  useEffect(() => {
    onAIThinkingChange?.(uiState.isAIThinking)
  }, [uiState.isAIThinking, onAIThinkingChange])

  // ─── Core move execution (shared: human and AI) ─────────────────────────

  const executeMove = useCallback((tableCopy, fromCell, toCell) => {
    const { turn } = gameStateRef.current
    const nextTurn   = turn === 'white' ? 'black' : 'white'

    // Capture before mutation — changePiecesPosition nulls fromCell.piece
    const capturedPiece = toCell.piece
      ? { type: toCell.piece.type, color: toCell.piece.color }
      : null
    const movedPiece  = { type: fromCell.piece.type, color: fromCell.piece.color }
    const fromCoord   = { x: fromCell.x, y: fromCell.y }
    const toCoord     = { x: toCell.x,   y: toCell.y   }

    changePiecesPosition(tableCopy, fromCell, toCell)

    // Abort if moving player left their own king in check
    if (comprobateCheck(tableCopy, nextTurn, false)) return

    const check = comprobateCheck(tableCopy, turn, true)

    if (check && comprobateCheckMate(tableCopy, turn)) {
      checkMateAudio.play()
      confetti({ particleCount: 200, spread: 130, origin: { y: .6 } })
      dispatch({
        type: GAME_ACTIONS.MOVE_PIECE,
        table: tableCopy, nextTurn, isInCheck: check,
        winner: turn, lastMove: { from: fromCell, to: toCell }, crowningPiece: null,
        capturedPiece, movedPiece, fromCoord, toCoord
      })
      saveGameToStorage(tableCopy, nextTurn)
      return
    }

    if (capturedPiece) captureAudio.play()
    else if (check)    checkAudio.play()
    else               pieceMovedAudio.play()

    const isPawnPromotion = toCell.piece?.type === PIECES.PAWN
      && (toCell.y === 0 || toCell.y === 7)

    dispatch({
      type: GAME_ACTIONS.MOVE_PIECE,
      table: tableCopy, nextTurn, isInCheck: check,
      winner: null, lastMove: { from: fromCell, to: toCell },
      crowningPiece: isPawnPromotion ? toCell.id : null,
      capturedPiece, movedPiece, fromCoord, toCoord
    })
    saveGameToStorage(tableCopy, nextTurn)
  }, [dispatch])

  // ─── Web Worker lifecycle ───────────────────────────────────────────────

  useEffect(() => {
    workerRef.current = new Worker(
      new URL('../workers/chessEngine.worker.js', import.meta.url)
    )

    workerRef.current.onmessage = (e) => {
      const aiMove = e.data    // { from, to } | null
      setUiState(prev => ({ ...prev, isAIThinking: false }))

      if (!aiMove) return      // stalemate / no moves

      const { table, turn, winner, crowningPiece } = gameStateRef.current
      // Guard against stale responses (game reset, IA toggled off, etc.)
      if (winner || crowningPiece || turn === 'white' || !IAOpponentRef.current) return

      const tableCopy = JSON.parse(JSON.stringify(table))
      setBoardFunctions(tableCopy)

      const fromCell = tableCopy.flat().find(c => c.id === aiMove.from)
      const toCell   = tableCopy.flat().find(c => c.id === aiMove.to)
      if (!fromCell || !toCell) return

      // AI pawns auto-promote to queen (promotes piece type before executeMove
      // sees it, so isPawnPromotion check evaluates to false — no UI shown)
      if (fromCell.piece?.type === PIECES.PAWN) {
        const isPromotion = (fromCell.piece.color === 'black' && toCell.y === 7)
                         || (fromCell.piece.color === 'white' && toCell.y === 0)
        if (isPromotion) {
          fromCell.piece.type = PIECES.QUEEN
          fromCell.piece.getPossibleMoves = getPossibleMoves
        }
      }

      executeMove(tableCopy, fromCell, toCell)
    }

    workerRef.current.onerror = (err) => {
      console.error('Chess engine worker error:', err)
      setUiState(prev => ({ ...prev, isAIThinking: false }))
    }

    return () => { workerRef.current?.terminate(); workerRef.current = null }
  }, [executeMove])

  // ─── AI trigger ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (turn === 'white' || winner || !IAOpponent || crowningPiece) return
    if (!workerRef.current) return

    const { board, hasMoved } = serializeForWorker(table)

    setUiState(prev => ({ ...prev, isAIThinking: true }))

    // Transfer the typed array buffers so the worker gets zero-copy ownership
    workerRef.current.postMessage(
      { board, hasMoved, depth: aiDepth },
      [board.buffer, hasMoved.buffer]
    )
  }, [turn, IAOpponent, crowningPiece, winner, aiDepth])

  // ─── Human interaction handlers ─────────────────────────────────────────

  const handleDragStart = useCallback((cell) => {
    const { table, turn, isInCheck } = gameStateRef.current
    if (cell.piece?.color !== turn) return
    const validMoves = cell.piece.getPossibleMoves(table, cell, turn, isInCheck)
    setUiState(prev => ({
      ...prev,
      selectedCell: cell,
      validMoveIds: new Set(validMoves.map(c => c.id))
    }))
  }, [])

  const handleDrop = useCallback((evt) => {
    const { table, turn, isInCheck } = gameStateRef.current
    const cellDataStr = evt.dataTransfer?.getData?.('cell')
    if (!cellDataStr) return
    const fromData = JSON.parse(cellDataStr)

    const rawId = evt.target?.id || evt.target?.parentElement?.id
    if (!rawId) return
    const newCellId = Number(rawId)
    if (isNaN(newCellId)) return

    const tableCopy = JSON.parse(JSON.stringify(table))
    setBoardFunctions(tableCopy)
    const fromCell = tableCopy.flat().find(c => c.id === fromData.id)
    const toCell   = tableCopy.flat().find(c => c.id === newCellId)
    if (!fromCell || !toCell) return
    if (!isValidMove(tableCopy, fromCell, toCell, turn, isInCheck)) return

    setUiState(prev => ({ ...prev, selectedCell: null, validMoveIds: new Set() }))
    executeMove(tableCopy, fromCell, toCell)
  }, [executeMove])

  const handleCellClick = useCallback((clickedCell) => {
    const { table, turn, isInCheck } = gameStateRef.current
    const { selectedCell, validMoveIds } = uiStateRef.current

    if (selectedCell?.id === clickedCell.id) {
      setUiState(prev => ({ ...prev, selectedCell: null, validMoveIds: new Set() }))
      return
    }

    if (selectedCell && validMoveIds.has(clickedCell.id)) {
      const tableCopy = JSON.parse(JSON.stringify(table))
      setBoardFunctions(tableCopy)
      const fromCell = tableCopy.flat().find(c => c.id === selectedCell.id)
      const toCell   = tableCopy.flat().find(c => c.id === clickedCell.id)
      if (!fromCell || !toCell) return
      if (!isValidMove(tableCopy, fromCell, toCell, turn, isInCheck)) return
      setUiState(prev => ({ ...prev, selectedCell: null, validMoveIds: new Set() }))
      executeMove(tableCopy, fromCell, toCell)
      return
    }

    if (clickedCell.piece?.color === turn) {
      const validMoves = clickedCell.piece.getPossibleMoves(table, clickedCell, turn, isInCheck)
      setUiState(prev => ({
        ...prev,
        selectedCell: clickedCell,
        validMoveIds: new Set(validMoves.map(c => c.id))
      }))
      return
    }

    setUiState(prev => ({ ...prev, selectedCell: null, validMoveIds: new Set() }))
  }, [executeMove])

  const handleCrownPiece = useCallback((cell, pieceType) => {
    const { table, turn } = gameStateRef.current
    const tableCopy = JSON.parse(JSON.stringify(table))
    setBoardFunctions(tableCopy)
    const targetCell = tableCopy.flat().find(c => c.id === cell.id)
    targetCell.piece.type = pieceType
    targetCell.piece.getPossibleMoves = getPossibleMoves

    const check = comprobateCheck(tableCopy, turn === 'white' ? 'black' : 'white', true)
    if (check) checkAudio.play()

    dispatch({ type: GAME_ACTIONS.FINISH_CROWNING, table: tableCopy, isInCheck: check })
    saveGameToStorage(tableCopy, turn)
  }, [dispatch])

  // ─── Render ──────────────────────────────────────────────────────────────

  const lastMoveFromId = lastMove?.from.id ?? -1
  const lastMoveToId   = lastMove?.to.id   ?? -1
  const { selectedCell, validMoveIds, isAIThinking } = uiState

  return (
    <div className='chessTable shadow'>
      {winner && <Winner winner={winner} onRestart={onRestart} />}
      {table.map((row, rowIndex) => (
        <Row
          key={rowIndex}
          row={row}
          rowIndex={rowIndex}
          selectedCellId={selectedCell?.id ?? -1}
          validMoveIds={validMoveIds}
          lastMoveFromId={lastMoveFromId}
          lastMoveToId={lastMoveToId}
          turn={turn}
          winner={winner}
          gameStarted={gameStarted}
          crowningPiece={crowningPiece}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onCellClick={handleCellClick}
          onCrownPiece={handleCrownPiece}
        />
      ))}
    </div>
  )
})
