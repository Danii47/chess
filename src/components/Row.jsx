import Cell from './Cell'

export default function Row({ row, rowIndex, onDropHandler, winner }) {
  return (
    <div key={rowIndex} className="chessRow">
      {
        row.map((cell, cellIndex) => {
          return <Cell 
              key={8 * rowIndex + cellIndex}
              rowIndex={rowIndex}
              cell={cell}
              cellIndex={cellIndex}
              onDropHandler={onDropHandler}
              winner={winner}
            />
        })
      }
    </div>
  )
}