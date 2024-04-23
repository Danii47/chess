import Row from "./Row"
import Winner from "./Winner"

export default function Table({ table, onDropHandler, winner }) {
  return (
    
    <div className="chessTable shadow">
      {
        winner &&
          <Winner winner={winner}/>
      }
      
      {
        table.map((row, rowIndex) => {

          return <Row
              key={rowIndex}
              row={row}
              rowIndex={rowIndex}
              onDropHandler={onDropHandler}
            />

        })
      }
    </div>
  )
}