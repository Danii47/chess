import startTable from "../utils/startTable"

export default function RestartGame({ setTable, setTurn, setIsInCheck, setWinner }) {
  return (
    <div className="restartGameContainer">
      <button className="restartGame shadow" onClick={() => {
        setTable(startTable)
        setTurn('white')
        setIsInCheck(false)
        setWinner(null)

      }}>Reiniciar juego</button>
    </div>
  )
}