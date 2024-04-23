import { useState } from 'react'
import './App.css'
import King_B from './assets/pieces/king_b.svg'
import Queen_B from './assets/pieces/queen_b.svg'
import Pawn_B from './assets/pieces/pawn_b.svg'
import Rook_B from './assets/pieces/rook_b.svg'
import Bishop_B from './assets/pieces/bishop_b.svg'
import Knight_B from './assets/pieces/knight_b.svg'



function App() {

  const showPiece = (piece) => {
    switch (piece.type) {
      case 'king':
        return <img className="chessPiece" src={King_B} alt="king" />
      case 'queen':
        return <img className="chessPiece" src={Queen_B} alt="queen" />
      case 'pawn':
        return <img className="chessPiece" src={Pawn_B} alt="pawn" />
      case 'rook':
        return <img className="chessPiece" src={Rook_B} alt="rook" />
      case 'bishop':
        return <img className="chessPiece" src={Bishop_B} alt="bishop" />
      case 'knight':
        return <img className="chessPiece" src={Knight_B} alt="knight" />
      default:
        return null 
    }
  }


  const startPieces = (x, y) => {
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

  const [table, setTable] = useState(() => {
    const table = []
    for (let i = 0; i < 8; i++) {
      const row = []
      for (let j = 0; j < 8; j++) {
        const piece = (i >= 2 && i <= 5) ? null : {
          type: startPieces(j, i),
          color: j < 2 ? 'black' : 'white'
        }
        row.push({ x: j, y: i, cellColor: (i + j) % 2 === 0 ? 'black' : 'white', piece: piece })
      }
      table.push(row)
    }
    return table
  })

  return (
    <div className="chessTable">
      {
        table.map((row, rowIndex) => {

          return (

            <div key={rowIndex} className="chessRow">
              {
                row.map((cell, cellIndex) => {
                  return (
                    <div key={8 * rowIndex + cellIndex}>
                      {
                        (cellIndex === 0) &&
                        <div className="chessRowLabel">{8 - rowIndex}</div>
                      }
                      {
                        (rowIndex === 7) &&
                        <div style={{ right: `${cellIndex * 100}px` }} className="chessColLabel">{String.fromCharCode("A".charCodeAt(0) + (7 - cellIndex))}</div>
                      }
                      <div className={`chessCell ${cell.cellColor}`}>
                        {cell.piece && showPiece(cell.piece)}
                      </div>
                    </div>
                  )
                })
              }
            </div>

          )

        })
      }
    </div>
  )
}

export default App
