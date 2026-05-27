export default function Winner({ winner }) {
  return (
    <div className="winnerOverlay">
      <div className="winnerCard shadow">
        <span className="winnerIcon">{winner === 'white' ? '♔' : '♚'}</span>
        <h2 className="winnerTitle">
          {winner === 'white' ? 'Blancas' : 'Negras'} ganan
        </h2>
        <p className="winnerSub">¡Jaque mate!</p>
      </div>
    </div>
  )
}
