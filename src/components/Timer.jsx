import { useEffect } from 'react';

export default function Timer({ winner, setWinner, turn, time, setTime, gameStarted, IAOpponent, setIAOpponent }) {



  useEffect(() => {

    if (winner || !gameStarted) return

    const interval = setInterval(() => {

      const newSeconds = time[turn].seconds === 0 ? 59 : time[turn].seconds - 1
      const newMinutes = time[turn].seconds === 0 ? time[turn].minutes - 1 : time[turn].minutes

      setTime({
        ...time,
        [turn]: {
          seconds: newSeconds,
          minutes: newMinutes
        }
      })

      if (newSeconds === 0 && newMinutes === 0) setWinner(turn === 'white' ? 'black' : 'white')


    }, 1000);

    return () => clearInterval(interval);

  }, [winner, setWinner, turn, time, setTime, gameStarted])

  const handleActivateIA = () => {
    setIAOpponent(!IAOpponent)
  }

  return (
    <div className='timer'>
      <div>
        <div className={`player shadow${turn === 'black' ? ' active' : ''}`}>
          <div className='playerTime'>{`${time.black.minutes >= 10 ? time.black.minutes : `0${time.black.minutes}`}`}:{`${time.black.seconds >= 10 ? time.black.seconds : `0${time.black.seconds}`}`}</div>
        </div>
        <button type='checkbox' className={`activateIA ${IAOpponent ? 'activated' : ''}`} onClick={handleActivateIA}>{IAOpponent ? 'Desactivar' : 'Activar'} IA</button>
      </div>
      <div className={`player shadow${turn === 'white' ? ' active' : ''}`}>
        <div className='playerTime'>{`${time.white.minutes >= 10 ? time.white.minutes : `0${time.white.minutes}`}`}:{`${time.white.seconds >= 10 ? time.white.seconds : `0${time.white.seconds}`}`}</div>
      </div>

    </div>
  )
}