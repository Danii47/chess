import Cell from './Cell'

export default function Row({ row, rowIndex, onDropHandler, winner, table, cellSelected, setCellSelected, turn, gameStarted, setGameStarted }) {
  return (
    <div className="chessRow">
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
            />
        })
      }
    </div>
  )
}