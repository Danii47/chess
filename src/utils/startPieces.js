export default function startPieces(x, y) {
  if (y === 0 || y === 7) {
    if (x === 0 || x === 7) {
      return 'rook'
    } else if (x === 1 || x === 6) {
      return 'knight'
    } else if (x === 2 || x === 5) {
      return 'bishop'
    } else if (x === 3) {
      return 'queen'
    } else {
      return 'king'
    }
  } else if (y === 1 || y === 6) {
    return 'pawn'
  }
}