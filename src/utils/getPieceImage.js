import King_B from '../assets/pieces/king_b.svg'
import Queen_B from '../assets/pieces/queen_b.svg'
import Rook_B from '../assets/pieces/rook_b.svg'
import Bishop_B from '../assets/pieces/bishop_b.svg'
import Knight_B from '../assets/pieces/knight_b.svg'
import Pawn_B from '../assets/pieces/pawn_b.svg'

import King_W from '../assets/pieces/king_w.svg'
import Queen_W from '../assets/pieces/queen_w.svg'
import Rook_W from '../assets/pieces/rook_w.svg'
import Bishop_W from '../assets/pieces/bishop_w.svg'
import Knight_W from '../assets/pieces/knight_w.svg'
import Pawn_W from '../assets/pieces/pawn_w.svg'

export default function getPieceImage(piece) {
  switch (piece.type) {
    case 'king':
      return piece.color === "black" ? King_B : King_W
    case 'queen':
      return piece.color === "black" ? Queen_B : Queen_W
    case 'pawn':
      return piece.color === "black" ? Pawn_B : Pawn_W
    case 'rook':
      return piece.color === "black" ? Rook_B : Rook_W
    case 'bishop':
      return piece.color === "black" ? Bishop_B : Bishop_W
    case 'knight':
      return piece.color === "black" ? Knight_B : Knight_W
    default:
      return null
  }
}