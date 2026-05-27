import { useEffect } from 'react'
import { updateTimeInStorage } from '../utils/storage'


export default function Timer({ winner, turn, gameStarted, time, setTime, IAOpponent, setIAOpponent, onTimeout }) {

  useEffect(() => {
    if (winner || !gameStarted) return

    const interval = setInterval(() => {
      const newSeconds = time[turn].seconds === 0 ? 59 : time[turn].seconds - 1
      const newMinutes = time[turn].seconds === 0 ? time[turn].minutes - 1 : time[turn].minutes

      const newTime = {
        ...time,
        [turn]: { seconds: newSeconds, minutes: newMinutes }
      }

      setTime(newTime)
      updateTimeInStorage(newTime)

      if (newSeconds === 0 && newMinutes === 0) onTimeout(turn)
    }, 1000)

    return () => clearInterval(interval)
  }, [winner, gameStarted, turn, time, setTime, onTimeout])

  return (
    <div className='timer'>
      <div>
        <div className={`player shadow${turn === 'black' ? ' active' : ''}`}>
          <div className='playerTime'>
            {`${time.black.minutes >= 10 ? time.black.minutes : `0${time.black.minutes}`}`}:
            {`${time.black.seconds >= 10 ? time.black.seconds : `0${time.black.seconds}`}`}
          </div>
        </div>
        <button
          type='button'
          className={`activateIA ${IAOpponent ? 'activated' : ''}`}
          onClick={() => setIAOpponent(!IAOpponent)}
        >
          {IAOpponent ? 'Desactivar' : 'Activar'} IA
        </button>
      </div>
      <div className={`player shadow${turn === 'white' ? ' active' : ''}`}>
        <div className='playerTime'>
          {`${time.white.minutes >= 10 ? time.white.minutes : `0${time.white.minutes}`}`}:
          {`${time.white.seconds >= 10 ? time.white.seconds : `0${time.white.seconds}`}`}
        </div>
      </div>
    </div>
  )
}
