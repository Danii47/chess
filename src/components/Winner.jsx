export default function Winner({ winner }) {
  return (
    <div className="winnerContainer">
      <div className="winner shadow">
        <h1>¡Las {winner === 'white' ? 'blancas' : 'negras'} han ganado!</h1>
      </div>

    </div>
  )
}