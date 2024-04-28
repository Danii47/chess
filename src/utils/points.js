import { PIECES_POINTS, PIECES_POSITION_POINTS } from '../constants/pieces'

export function points() {

  return this.color === 'black' ? PIECES_POINTS[this.type] : -PIECES_POINTS[this.type]
}

export function extraPositionPoints() {
  return !this.piece ? 0 : PIECES_POSITION_POINTS[this.piece.type][this.piece.color][this.y][this.x]
}