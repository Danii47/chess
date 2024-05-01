import Cell from './Cell'

export default function Row({ row, rowIndex, onDropHandler, winner, table, cellSelected, setCellSelected, turn, isInCheck, setIsInCheck, gameStarted, setGameStarted, lastMove, crowningPiece, setCrowningPiece }) {
  return (
    <div className='chessRow'>
      {
        row.map((cell, cellIndex) => {
          return <Cell 
              key={8 * rowIndex + cellIndex}
              rowIndex={rowIndex}
              cell={cell}
              cellIndex={cellIndex}
              onDropHandler={onDropHandler}
              winner={winner}
              table={table}
              cellSelected={cellSelected}
              setCellSelected={setCellSelected}
              turn={turn}
              gameStarted={gameStarted}
              setGameStarted={setGameStarted}
              lastMove={lastMove}
              isInCheck={isInCheck}
              setIsInCheck={setIsInCheck}
              crowningPiece={crowningPiece}
              setCrowningPiece={setCrowningPiece}
            />
        })
      }
    </div>
  )
}