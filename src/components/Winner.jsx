import { resetGameStorage } from '../utils/storage'

export default function Winner({ winner, onRestart }) {
  const handleRestart = () => {
    resetGameStorage()
    onRestart?.()
  }

  return (
    <div className="winnerOverlay">
      <div className="winnerCard">
        <span className="winnerIcon">{winner === 'white' ? '♔' : '♚'}</span>
        <h2 className="winnerTitle">
          {winner === 'white' ? 'Blancas' : 'Negras'} ganan
        </h2>
        <p className="winnerSub">¡Jaque mate!</p>
        {onRestart && (
          <button className="winnerRestart" onClick={handleRestart}>
            Nueva partida
          </button>
        )}
      </div>
    </div>
  )
}
