import { resetGameStorage } from '../utils/storage'

export default function RestartGame({ onRestart }) {
  const handleClick = () => {
    resetGameStorage()
    onRestart()
  }

  return (
    <button className="restartGame" onClick={handleClick}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
        <path d="M3 3v5h5"/>
      </svg>
      Nueva partida
    </button>
  )
}
