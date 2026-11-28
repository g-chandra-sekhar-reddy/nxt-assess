import {useContext} from 'react'
import {useNavigate} from 'react-router-dom'

import Header from '../Header'
import EvaluationContext from '../../context/EvaluationContext'

import './index.css'

const Results = ({history, onLogout}) => {
  const {score, timeTakenInSeconds, isTimeUp, resetEvaluation} =
    useContext(EvaluationContext)
  const navigate = useNavigate()

  const onClickReattempt = () => {
    resetEvaluation()
    navigate('/assessment', {replace: true})
  }

  const hours = Math.floor(timeTakenInSeconds / 3600)
  const minutes = Math.floor((timeTakenInSeconds % 3600) / 60)
  const seconds = timeTakenInSeconds % 60

  const formattedHours = String(hours).padStart(2, '0')
  const formattedMinutes = String(minutes).padStart(2, '0')
  const formattedSeconds = String(seconds).padStart(2, '0')

  const formattedTimeTaken = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`

  const renderSubmitView = () => (
    <div className="results-card">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-assess-submit-img.png"
        alt="submit"
        className="results-image"
      />
      <h1 className="results-heading">
        Congrats! You completed the assessment.
      </h1>
      <p className="results-time-taken">Time Taken</p>
      <p className="time-value">{formattedTimeTaken}</p>
      <p className="results-score-text">Your score</p>
      <p className="results-score-number">{score}</p>
      <button
        type="button"
        className="reattempt-button"
        onClick={onClickReattempt}
      >
        Reattempt
      </button>
    </div>
  )

  const renderTimeUpView = () => (
    <div className="results-card">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-assess-time-up-img.png"
        alt="time up"
        className="results-image"
      />
      <h1 className="results-heading">Time is up!</h1>
      <p className="results-time-up-description">
        You did not complete the assessment within the time
      </p>
      <p className="results-score-text">Your score</p>
      <p className="results-score-number">{score}</p>
      <button
        type="button"
        className="reattempt-button"
        onClick={onClickReattempt}
      >
        Reattempt
      </button>
    </div>
  )

  return (
    <>
      <Header history={history} onLogout={onLogout} />
      <div className="results-page-container">
        {isTimeUp ? renderTimeUpView() : renderSubmitView()}
      </div>
    </>
  )
}

export default Results
