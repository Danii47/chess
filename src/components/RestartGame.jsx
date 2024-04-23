import startTable from "../utils/startTable"

export default function RestartGame({ setTable, setTurn, setIsInCheck, setWinner, setTime }) {
  return (
    <div className="restartGameContainer">
      <button className="restartGame shadow" onClick={() => {
        setTable(startTable)
        setTurn('white')
        setIsInCheck(false)
        setWinner(null)
        setTime({
          white: {
            seconds: 0,
            minutes: 2
          },
          black: {
            seconds: 0,
            minutes: 2
          }
        })

      }}>Reiniciar juego</button>
    </div>
  )
}