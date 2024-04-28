import { PIECES } from '../constants/pieces'

export default function startPieces(x, y) {
  if (y === 0 || y === 7) {
    if (x === 0 || x === 7) {
      return PIECES.ROOK
    } else if (x === 1 || x === 6) {
      return PIECES.KNIGHT
    } else if (x === 2 || x === 5) {
      return PIECES.BISHOP
    } else if (x === 3) {
      return PIECES.QUEEN
    } else {
      return PIECES.KING
    }
  } else if (y === 1 || y === 6) {
    return PIECES.PAWN
  }
}