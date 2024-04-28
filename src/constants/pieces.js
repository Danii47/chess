import reverseArray from '../utils/reverseArray'

export const PIECES_POINTS = {
  pawn: 10,
  knight: 30,
  bishop: 30,
  rook: 50,
  queen: 90,
  king: 900
}

export const PIECES = {
  PAWN: 'pawn',
  KNIGHT: 'knight',
  BISHOP: 'bishop',
  ROOK: 'rook',
  QUEEN: 'queen',
  KING: 'king'
}

export const COLORS = {
  WHITE: 'white',
  BLACK: 'black'
}

const PAWN_W_POSITION_POINTS = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0, 5.0],
  [1.0, 1.0, 2.0, 3.0, 3.0, 2.0, 1.0, 1.0],
  [0.5, 0.5, 1.0, 2.5, 2.5, 1.0, 0.5, 0.5],
  [0.0, 0.0, 0.0, 2.0, 2.0, 0.0, 0.0, 0.0],
  [0.5, -0.5, -1.0, 0.0, 0.0, -1.0, -0.5, 0.5],
  [0.5, 1.0, 1.0, -2.0, -2.0, 1.0, 1.0, 0.5],
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]
]

const PAWN_B_POSITION_POINTS = reverseArray(PAWN_W_POSITION_POINTS)

const KNIGHT_W_POSITION_POINTS = [
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  [-4.0, -2.0, 0.0, 0.0, 0.0, 0.0, -2.0, -4.0],
  [-3.0, 0.0, 1.0, 1.5, 1.5, 1.0, 0.0, -3.0],
  [-3.0, 0.5, 1.5, 2.0, 2.0, 1.5, 0.5, -3.0],
  [-3.0, 0.0, 1.5, 2.0, 2.0, 1.5, 0.0, -3.0],
  [-3.0, 0.5, 1.0, 1.5, 1.5, 1.0, 0.5, -3.0],
  [-4.0, -2.0, 0.0, 0.5, 0.5, 0.0, -2.0, -4.0],
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
]

const KNIGHT_B_POSITION_POINTS = reverseArray(KNIGHT_W_POSITION_POINTS)

const BISHOP_W_POSITION_POINTS = [
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 1.0, 1.0, 0.5, 0.0, -1.0],
  [-1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 0.5, -1.0],
  [-1.0, 0.0, 1.0, 1.0, 1.0, 1.0, 0.0, -1.0],
  [-1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0],
  [-1.0, 0.5, 0.0, 0.0, 0.0, 0.0, 0.5, -1.0],
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
]

const BISHOP_B_POSITION_POINTS = reverseArray(BISHOP_W_POSITION_POINTS)

const ROOK_W_POSITION_POINTS = [
  [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  [0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [-0.5, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -0.5],
  [0.0, 0.0, 0.0, 0.5, 0.5, 0.0, 0.0, 0.0]
]

const ROOK_B_POSITION_POINTS = reverseArray(ROOK_W_POSITION_POINTS)

const QUEEN_W_POSITION_POINTS = [
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  [-1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-0.5, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [0.0, 0.0, 0.5, 0.5, 0.5, 0.5, 0.0, -0.5],
  [-1.0, 0.5, 0.5, 0.5, 0.5, 0.5, 0.0, -1.0],
  [-1.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, -1.0],
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
]

const QUEEN_B_POSITION_POINTS = reverseArray(QUEEN_W_POSITION_POINTS)

const KING_W_POSITION_POINTS = [
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
  [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
  [2.0, 2.0, 0.0, 0.0, 0.0, 0.0, 2.0, 2.0],
  [2.0, 3.0, 1.0, 0.0, 0.0, 1.0, 3.0, 2.0]
]

const KING_B_POSITION_POINTS = reverseArray(KING_W_POSITION_POINTS)

export const PIECES_POSITION_POINTS = {
  [PIECES.PAWN]: {
    [COLORS.WHITE]: PAWN_W_POSITION_POINTS,
    [COLORS.BLACK]: PAWN_B_POSITION_POINTS
  },
  [PIECES.KNIGHT]: {
    [COLORS.WHITE]: KNIGHT_W_POSITION_POINTS,
    [COLORS.BLACK]: KNIGHT_B_POSITION_POINTS
  },
  [PIECES.BISHOP]: {
    [COLORS.WHITE]: BISHOP_W_POSITION_POINTS,
    [COLORS.BLACK]: BISHOP_B_POSITION_POINTS
  },
  [PIECES.ROOK]: {
    [COLORS.WHITE]: ROOK_W_POSITION_POINTS,
    [COLORS.BLACK]: ROOK_B_POSITION_POINTS
  },
  [PIECES.QUEEN]: {
    [COLORS.WHITE]: QUEEN_W_POSITION_POINTS,
    [COLORS.BLACK]: QUEEN_B_POSITION_POINTS
  },
  [PIECES.KING]: {
    [COLORS.WHITE]: KING_W_POSITION_POINTS,
    [COLORS.BLACK]: KING_B_POSITION_POINTS
  }
}