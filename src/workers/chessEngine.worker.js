// ─── Chess Engine Web Worker ──────────────────────────────────────────────────
// Completely standalone — no React, no hooks, no module imports.
// Receives a serialized board and returns the best move for black.
//
// Board encoding (Int8Array, 64 squares, index = y*8 + x):
//   0  = empty
//  +1..+6 = white  pawn/knight/bishop/rook/queen/king
//  -1..-6 = black  pawn/knight/bishop/rook/queen/king
//
// Coordinate convention matches the React board:
//   y=0 → rank 8 (black back rank)   y=7 → rank 1 (white back rank)
//   x=0 → a-file                     x=7 → h-file

const PAWN = 1, KNIGHT = 2, BISHOP = 3, ROOK = 4, QUEEN = 5, KING = 6

// Piece base values — matches constants/pieces.js PIECES_POINTS
const PIECE_VALUES = [0, 10, 30, 30, 50, 90, 900]

// ─── Position tables ──────────────────────────────────────────────────────────
// Copied verbatim from constants/pieces.js.
// White tables are indexed [y][x]; black tables are row-reversed copies.
// Evaluation mirrors the React code: black = +, white = –.

const W_PAWN = [
  [ 0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
  [ 5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0,  5.0],
  [ 1.0,  1.0,  2.0,  3.0,  3.0,  2.0,  1.0,  1.0],
  [ 0.5,  0.5,  1.0,  2.5,  2.5,  1.0,  0.5,  0.5],
  [ 0.0,  0.0,  0.0,  2.0,  2.0,  0.0,  0.0,  0.0],
  [ 0.5, -0.5, -1.0,  0.0,  0.0, -1.0, -0.5,  0.5],
  [ 0.5,  1.0,  1.0, -2.0, -2.0,  1.0,  1.0,  0.5],
  [ 0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0]
]
const W_KNIGHT = [
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0],
  [-4.0, -2.0,  0.0,  0.0,  0.0,  0.0, -2.0, -4.0],
  [-3.0,  0.0,  1.0,  1.5,  1.5,  1.0,  0.0, -3.0],
  [-3.0,  0.5,  1.5,  2.0,  2.0,  1.5,  0.5, -3.0],
  [-3.0,  0.0,  1.5,  2.0,  2.0,  1.5,  0.0, -3.0],
  [-3.0,  0.5,  1.0,  1.5,  1.5,  1.0,  0.5, -3.0],
  [-4.0, -2.0,  0.0,  0.5,  0.5,  0.0, -2.0, -4.0],
  [-5.0, -4.0, -3.0, -3.0, -3.0, -3.0, -4.0, -5.0]
]
const W_BISHOP = [
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0],
  [-1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
  [-1.0,  0.0,  0.5,  1.0,  1.0,  0.5,  0.0, -1.0],
  [-1.0,  0.5,  0.5,  1.0,  1.0,  0.5,  0.5, -1.0],
  [-1.0,  0.0,  1.0,  1.0,  1.0,  1.0,  0.0, -1.0],
  [-1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0, -1.0],
  [-1.0,  0.5,  0.0,  0.0,  0.0,  0.0,  0.5, -1.0],
  [-2.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -2.0]
]
const W_ROOK = [
  [ 0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0],
  [ 0.5,  1.0,  1.0,  1.0,  1.0,  1.0,  1.0,  0.5],
  [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [-0.5,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -0.5],
  [ 0.0,  0.0,  0.0,  0.5,  0.5,  0.0,  0.0,  0.0]
]
const W_QUEEN = [
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0],
  [-1.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0, -1.0],
  [-1.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
  [-0.5,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
  [ 0.0,  0.0,  0.5,  0.5,  0.5,  0.5,  0.0, -0.5],
  [-1.0,  0.5,  0.5,  0.5,  0.5,  0.5,  0.0, -1.0],
  [-1.0,  0.0,  0.5,  0.0,  0.0,  0.0,  0.0, -1.0],
  [-2.0, -1.0, -1.0, -0.5, -0.5, -1.0, -1.0, -2.0]
]
const W_KING = [
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-3.0, -4.0, -4.0, -5.0, -5.0, -4.0, -4.0, -3.0],
  [-2.0, -3.0, -3.0, -4.0, -4.0, -3.0, -3.0, -2.0],
  [-1.0, -2.0, -2.0, -2.0, -2.0, -2.0, -2.0, -1.0],
  [ 2.0,  2.0,  0.0,  0.0,  0.0,  0.0,  2.0,  2.0],
  [ 2.0,  3.0,  1.0,  0.0,  0.0,  1.0,  3.0,  2.0]
]

// Row-reversed ("black's perspective") tables — mirrors reverseArray() in React
const B_PAWN   = [...W_PAWN].reverse()
const B_KNIGHT = [...W_KNIGHT].reverse()
const B_BISHOP = [...W_BISHOP].reverse()
const B_ROOK   = [...W_ROOK].reverse()
const B_QUEEN  = [...W_QUEEN].reverse()
const B_KING   = [...W_KING].reverse()

// Indexed by piece code (1..6); index 0 unused
const WHITE_POS = [null, W_PAWN, W_KNIGHT, W_BISHOP, W_ROOK, W_QUEEN, W_KING]
const BLACK_POS = [null, B_PAWN, B_KNIGHT, B_BISHOP, B_ROOK, B_QUEEN, B_KING]

// ─── Direction tables ─────────────────────────────────────────────────────────

const KNIGHT_OFFSETS = [[-2,-1],[-2,1],[-1,-2],[-1,2],[1,-2],[1,2],[2,-1],[2,1]]
const KING_OFFSETS   = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]]
const DIAG_DIRS      = [[-1,-1],[-1,1],[1,-1],[1,1]]
const STRAIGHT_DIRS  = [[-1,0],[1,0],[0,-1],[0,1]]
const ALL_DIRS       = [...DIAG_DIRS, ...STRAIGHT_DIRS]

// ─── Evaluation ───────────────────────────────────────────────────────────────
// Matches the React evaluateBoard exactly:
//   black piece contributes  +pieceValue + posBonus
//   white piece contributes  -pieceValue + posBonus
// Higher score = better for black (black is the maximiser).

function evaluate(board) {
  let score = 0
  for (let i = 0; i < 64; i++) {
    const p = board[i]
    if (p === 0) continue
    const abs = p > 0 ? p : -p
    const y = i >> 3, x = i & 7
    const pv  = PIECE_VALUES[abs]
    const pos = (p > 0 ? WHITE_POS : BLACK_POS)[abs][y][x]
    score += p > 0 ? (-pv + pos) : (pv + pos)
  }
  return score
}

// ─── Attack detection ─────────────────────────────────────────────────────────

function isAttackedBy(board, idx, byWhite) {
  const ty = idx >> 3, tx = idx & 7

  // Pawn
  if (byWhite) {
    // White pawn at row ty+1 attacks row ty diagonally
    if (ty + 1 < 8) {
      if (tx > 0 && board[(ty+1)*8+(tx-1)] === PAWN)  return true
      if (tx < 7 && board[(ty+1)*8+(tx+1)] === PAWN)  return true
    }
  } else {
    // Black pawn at row ty-1 attacks row ty diagonally
    if (ty - 1 >= 0) {
      if (tx > 0 && board[(ty-1)*8+(tx-1)] === -PAWN) return true
      if (tx < 7 && board[(ty-1)*8+(tx+1)] === -PAWN) return true
    }
  }

  // Knight
  const kn = byWhite ? KNIGHT : -KNIGHT
  for (const [dy, dx] of KNIGHT_OFFSETS) {
    const ny = ty+dy, nx = tx+dx
    if (ny >= 0 && ny < 8 && nx >= 0 && nx < 8 && board[ny*8+nx] === kn) return true
  }

  // King (for mutual king proximity)
  const kg = byWhite ? KING : -KING
  for (const [dy, dx] of KING_OFFSETS) {
    const ny = ty+dy, nx = tx+dx
    if (ny >= 0 && ny < 8 && nx >= 0 && nx < 8 && board[ny*8+nx] === kg) return true
  }

  // Sliding pieces
  const rq = byWhite ? [ROOK, QUEEN] : [-ROOK, -QUEEN]
  const bq = byWhite ? [BISHOP, QUEEN] : [-BISHOP, -QUEEN]

  for (const [dy, dx] of STRAIGHT_DIRS) {
    let ny = ty+dy, nx = tx+dx
    while (ny >= 0 && ny < 8 && nx >= 0 && nx < 8) {
      const p = board[ny*8+nx]
      if (p !== 0) { if (p === rq[0] || p === rq[1]) return true; break }
      ny += dy; nx += dx
    }
  }
  for (const [dy, dx] of DIAG_DIRS) {
    let ny = ty+dy, nx = tx+dx
    while (ny >= 0 && ny < 8 && nx >= 0 && nx < 8) {
      const p = board[ny*8+nx]
      if (p !== 0) { if (p === bq[0] || p === bq[1]) return true; break }
      ny += dy; nx += dx
    }
  }

  return false
}

function isKingInCheck(board, isBlack) {
  const target = isBlack ? -KING : KING
  for (let i = 0; i < 64; i++) {
    if (board[i] === target) return isAttackedBy(board, i, isBlack)
  }
  return false
}

// ─── Move application ─────────────────────────────────────────────────────────
// Returns new [board, hasMoved] without mutating the originals.

function applyMove(board, hasMoved, from, to) {
  const nb  = new Int8Array(board)
  const nhm = new Uint8Array(hasMoved)
  const piece = board[from]
  const abs   = piece > 0 ? piece : -piece

  nb[to]  = piece
  nb[from] = 0
  nhm[from] = 1
  nhm[to]   = 1

  // Castling: rook also jumps
  if (abs === KING && Math.abs(to - from) === 2) {
    const rankStart = from - (from & 7)           // y*8
    if (to > from) {                              // king-side
      nb[rankStart + 5] = board[rankStart + 7]
      nb[rankStart + 7] = 0
      nhm[rankStart + 5] = 1
    } else {                                      // queen-side
      nb[rankStart + 3] = board[rankStart + 0]
      nb[rankStart + 0] = 0
      nhm[rankStart + 3] = 1
    }
  }

  return [nb, nhm]
}

// ─── Pseudo-move generation ───────────────────────────────────────────────────
// Does NOT filter self-check — that is done in generateLegalMoves.

function pushPawnMoves(board, from, fy, fx, moves, isBlack) {
  if (isBlack) {
    // Black pawn moves DOWN (y increases)
    if (fy + 1 > 7) return
    const one = from + 8
    if (board[one] === 0) {
      moves.push([from, one])
      if (fy === 1 && board[from + 16] === 0) moves.push([from, from + 16])
    }
    if (fx > 0 && board[one - 1] > 0) moves.push([from, one - 1])
    if (fx < 7 && board[one + 1] > 0) moves.push([from, one + 1])
  } else {
    // White pawn moves UP (y decreases)
    if (fy - 1 < 0) return
    const one = from - 8
    if (board[one] === 0) {
      moves.push([from, one])
      if (fy === 6 && board[from - 16] === 0) moves.push([from, from - 16])
    }
    if (fx > 0 && board[one - 1] < 0) moves.push([from, one - 1])
    if (fx < 7 && board[one + 1] < 0) moves.push([from, one + 1])
  }
}

function pushKnightMoves(board, from, fy, fx, moves, isBlack) {
  for (const [dy, dx] of KNIGHT_OFFSETS) {
    const ny = fy + dy, nx = fx + dx
    if (ny < 0 || ny > 7 || nx < 0 || nx > 7) continue
    const target = board[ny * 8 + nx]
    if (isBlack ? target < 0 : target > 0) continue   // own piece
    moves.push([from, ny * 8 + nx])
  }
}

function pushSlidingMoves(board, from, fy, fx, dirs, moves, isBlack) {
  for (const [dy, dx] of dirs) {
    let ny = fy + dy, nx = fx + dx
    while (ny >= 0 && ny <= 7 && nx >= 0 && nx <= 7) {
      const to = ny * 8 + nx
      const target = board[to]
      if (target !== 0) {
        if (isBlack ? target > 0 : target < 0) moves.push([from, to])  // capture
        break
      }
      moves.push([from, to])
      ny += dy; nx += dx
    }
  }
}

function pushKingMoves(board, hasMoved, from, fy, fx, moves, isBlack) {
  for (const [dy, dx] of KING_OFFSETS) {
    const ny = fy + dy, nx = fx + dx
    if (ny < 0 || ny > 7 || nx < 0 || nx > 7) continue
    const target = board[ny * 8 + nx]
    if (isBlack ? target < 0 : target > 0) continue
    moves.push([from, ny * 8 + nx])
  }

  // Castling — only when king is still on original e-file square
  if (!hasMoved[from] && fx === 4 && !isKingInCheck(board, isBlack)) {
    const rankStart = from - 4                    // = fy * 8
    const rookCode = isBlack ? -ROOK : ROOK

    // King-side: squares f and g (x=5,6) must be empty, rook at h (x=7)
    if (!hasMoved[rankStart + 7] && board[rankStart + 7] === rookCode &&
        board[rankStart + 5] === 0 && board[rankStart + 6] === 0) {
      moves.push([from, from + 2])
    }
    // Queen-side: squares b,c,d (x=1,2,3) must be empty, rook at a (x=0)
    if (!hasMoved[rankStart] && board[rankStart] === rookCode &&
        board[rankStart + 1] === 0 && board[rankStart + 2] === 0 && board[rankStart + 3] === 0) {
      moves.push([from, from - 2])
    }
  }
}

function generatePseudoMoves(board, hasMoved, isBlack) {
  const moves = []
  for (let from = 0; from < 64; from++) {
    const p = board[from]
    if (p === 0 || (isBlack ? p > 0 : p < 0)) continue
    const abs = p > 0 ? p : -p
    const fy = from >> 3, fx = from & 7

    switch (abs) {
      case PAWN:   pushPawnMoves(board, from, fy, fx, moves, isBlack);                      break
      case KNIGHT: pushKnightMoves(board, from, fy, fx, moves, isBlack);                    break
      case BISHOP: pushSlidingMoves(board, from, fy, fx, DIAG_DIRS, moves, isBlack);        break
      case ROOK:   pushSlidingMoves(board, from, fy, fx, STRAIGHT_DIRS, moves, isBlack);    break
      case QUEEN:  pushSlidingMoves(board, from, fy, fx, ALL_DIRS, moves, isBlack);         break
      case KING:   pushKingMoves(board, hasMoved, from, fy, fx, moves, isBlack);            break
    }
  }
  return moves
}

// Filters pseudo-moves to legal moves (must not leave own king in check).
function generateLegalMoves(board, hasMoved, isBlack) {
  const pseudo = generatePseudoMoves(board, hasMoved, isBlack)
  const legal  = []
  for (const mv of pseudo) {
    const [nb] = applyMove(board, hasMoved, mv[0], mv[1])
    if (!isKingInCheck(nb, isBlack)) legal.push(mv)
  }
  return legal
}

// ─── Move ordering ────────────────────────────────────────────────────────────
// Captures first (MVV-LVA: most valuable victim / least valuable attacker).
// Non-captures score 0 and appear last.

function scoreMoveForOrdering(board, mv) {
  const victim = board[mv[1]]
  if (victim === 0) return 0
  const attacker = board[mv[0]]
  return 10 * PIECE_VALUES[victim > 0 ? victim : -victim]
           -  PIECE_VALUES[attacker > 0 ? attacker : -attacker]
}

function orderMoves(moves, board) {
  moves.sort((a, b) => scoreMoveForOrdering(board, b) - scoreMoveForOrdering(board, a))
}

// ─── Alpha-Beta Pruning ───────────────────────────────────────────────────────
// isMaximizing = true  → it is black's turn (black maximises the score)
// isMaximizing = false → it is white's turn (white minimises the score)

const CHECKMATE_SCORE = 100000

function alphaBeta(board, hasMoved, depth, alpha, beta, isMaximizing) {
  if (depth === 0) return evaluate(board)

  const legal = generateLegalMoves(board, hasMoved, isMaximizing)

  if (legal.length === 0) {
    // Checkmate or stalemate
    return isKingInCheck(board, isMaximizing)
      ? (isMaximizing ? -CHECKMATE_SCORE : CHECKMATE_SCORE)
      : 0
  }

  orderMoves(legal, board)

  if (isMaximizing) {
    let best = -Infinity
    for (const mv of legal) {
      const [nb, nhm] = applyMove(board, hasMoved, mv[0], mv[1])
      const score = alphaBeta(nb, nhm, depth - 1, alpha, beta, false)
      if (score > best) best = score
      if (score > alpha) alpha = score
      if (beta <= alpha) break                    // β-cutoff
    }
    return best
  } else {
    let best = Infinity
    for (const mv of legal) {
      const [nb, nhm] = applyMove(board, hasMoved, mv[0], mv[1])
      const score = alphaBeta(nb, nhm, depth - 1, alpha, beta, true)
      if (score < best) best = score
      if (score < beta) beta = score
      if (beta <= alpha) break                    // α-cutoff
    }
    return best
  }
}

// ─── Root search ──────────────────────────────────────────────────────────────
// Returns the best [from, to] move for black at the given depth.

function findBestMove(board, hasMoved, depth) {
  const legal = generateLegalMoves(board, hasMoved, true)  // black's moves
  if (legal.length === 0) return null

  orderMoves(legal, board)

  let bestMove = legal[0]
  let alpha = -Infinity

  for (const mv of legal) {
    const [nb, nhm] = applyMove(board, hasMoved, mv[0], mv[1])
    const score = alphaBeta(nb, nhm, depth - 1, alpha, Infinity, false)
    if (score > alpha) {
      alpha = score
      bestMove = mv
    }
  }

  return { from: bestMove[0], to: bestMove[1] }
}

// ─── Message handler ──────────────────────────────────────────────────────────

self.onmessage = function (e) {
  const { board, hasMoved, depth = 4 } = e.data
  const result = findBestMove(board, hasMoved, depth)
  self.postMessage(result)
}
