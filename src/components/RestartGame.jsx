import { resetGameStorage } from '../utils/storage'

export default function RestartGame({ onRestart }) {
  const handleClick = () => {
    resetGameStorage()
    onRestart()
  }

  return (
    <button className="restartGame" onClick={handleClick}>
      Nueva partida
    </button>
  )
}
