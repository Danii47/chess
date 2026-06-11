import { resetGameStorage } from '../utils/storage'

export default function Winner({ winner, onRestart }) {
  const handleRestart = () => {
    resetGameStorage()
    onRestart?.()
  }

  const isDraw = winner === 'draw'

  return (
    <div className="winnerOverlay">
      <div className="winnerCard">
        <span className="winnerIcon">{isDraw ? '½' : winner === 'white' ? '♔' : '♚'}</span>
        <h2 className="winnerTitle">
          {isDraw ? 'Tablas' : `${winner === 'white' ? 'Blancas' : 'Negras'} ganan`}
        </h2>
        <p className="winnerSub">{isDraw ? 'Rey ahogado' : '¡Jaque mate!'}</p>
        {onRestart && (
          <button className="winnerRestart" onClick={handleRestart}>
            Nueva partida
          </button>
        )}
      </div>
    </div>
  )
}
