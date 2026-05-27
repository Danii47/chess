import startTable from '../utils/startTable'
import setBoardFunctions from '../utils/setBoardFunctions'
import { COLORS } from '../constants/pieces'

export const GAME_ACTIONS = {
  MOVE_PIECE: 'MOVE_PIECE',
  FINISH_CROWNING: 'FINISH_CROWNING',
  SET_WINNER: 'SET_WINNER',
  RESTART_GAME: 'RESTART_GAME'
}

const blankState = () => ({
  table: startTable(),
  turn: COLORS.WHITE,
  isInCheck: false,
  winner: null,
  gameStarted: false,
  lastMove: null,
  crowningPiece: null,
  capturedPieces: { byWhite: [], byBlack: [] },
  moveHistory: []
})

// Derive which pieces are missing from the starting 16 for each side.
function deriveCapturedPieces(table) {
  const start = {
    white: { pawn: 8, rook: 2, knight: 2, bishop: 2, queen: 1, king: 1 },
    black: { pawn: 8, rook: 2, knight: 2, bishop: 2, queen: 1, king: 1 }
  }
  const cur = { white: {}, black: {} }
  table.flat().forEach(cell => {
    if (!cell.piece) return
    const { type, color } = cell.piece
    cur[color][type] = (cur[color][type] || 0) + 1
  })
  const byWhite = []   // black pieces captured by white
  const byBlack = []   // white pieces captured by black
  Object.entries(start.black).forEach(([type, count]) => {
    for (let i = 0; i < count - (cur.black[type] || 0); i++) byWhite.push({ type, color: 'black' })
  })
  Object.entries(start.white).forEach(([type, count]) => {
    for (let i = 0; i < count - (cur.white[type] || 0); i++) byBlack.push({ type, color: 'white' })
  })
  return { byWhite, byBlack }
}

export function createInitialGameState() {
  const tableFromStorage = window.localStorage.getItem('table')
  const turnFromStorage  = window.localStorage.getItem('turn')
  const table = tableFromStorage
    ? setBoardFunctions(JSON.parse(tableFromStorage))
    : startTable()
  return {
    ...blankState(),
    table,
    turn: turnFromStorage ?? COLORS.WHITE,
    capturedPieces: tableFromStorage
      ? deriveCapturedPieces(table)
      : { byWhite: [], byBlack: [] }
  }
}

export function gameReducer(state, action) {
  switch (action.type) {

    case GAME_ACTIONS.MOVE_PIECE: {
      let capturedPieces = state.capturedPieces
      if (action.capturedPiece) {
        const side = action.capturedPiece.color === 'black' ? 'byWhite' : 'byBlack'
        capturedPieces = {
          ...capturedPieces,
          [side]: [...capturedPieces[side], action.capturedPiece]
        }
      }
      const histEntry = action.movedPiece
        ? {
            piece: action.movedPiece,
            from: action.fromCoord,
            to: action.toCoord,
            captured: action.capturedPiece,
            isCheck: action.isInCheck && !action.winner,
            isCheckmate: Boolean(action.winner)
          }
        : null

      return {
        ...state,
        table: action.table,
        turn: action.nextTurn,
        isInCheck: action.isInCheck,
        winner: action.winner,
        gameStarted: action.crowningPiece != null ? false : true,
        lastMove: action.lastMove,
        crowningPiece: action.crowningPiece ?? null,
        capturedPieces,
        moveHistory: histEntry
          ? [...state.moveHistory, histEntry]
          : state.moveHistory
      }
    }

    case GAME_ACTIONS.FINISH_CROWNING:
      return {
        ...state,
        table: action.table,
        isInCheck: action.isInCheck,
        gameStarted: true,
        crowningPiece: null
      }

    case GAME_ACTIONS.SET_WINNER:
      return { ...state, winner: action.winner }

    case GAME_ACTIONS.RESTART_GAME:
      return blankState()

    default:
      return state
  }
}
