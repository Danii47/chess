import startTable from "../utils/startTable"

export default function RestartGame({ setTable, setTurn, setIsInCheck, setWinner, setTime, setGameStarted }) {
  return (
    <div className="restartGameContainer">
      <button className="restartGame shadow" onClick={() => {
        setTable(startTable)
        setTurn('white')
        setIsInCheck(false)
        setWinner(null)
        setGameStarted(false)
        setTime({
          white: {
            seconds: 0,
            minutes: 120
          },
          black: {
            seconds: 0,
            minutes: 120
          }
        })

      }}>Reiniciar juego</button>
    </div>
  )
}