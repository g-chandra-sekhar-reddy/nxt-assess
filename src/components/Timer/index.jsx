import './index.css'

const Timer = ({timeRemaining}) => {
  const hours = Math.floor(timeRemaining / 3600)
  const minutes = Math.floor((timeRemaining % 3600) / 60)
  const seconds = timeRemaining % 60

  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(seconds).padStart(2, '0')

  const timeString = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`

  return (
    <div className="timer-header-container">
      <p className="timer-title">Time Left</p>
      <p className="timer-countdown">{timeString}</p>
    </div>
  )
}

export default Timer
