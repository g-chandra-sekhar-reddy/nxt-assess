import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

const Home = ({history, onLogout}) => {
  return (
    <>
      <Header history={history} onLogout={onLogout} />
      <div className="home-page-container">
        <div className="home-content">
          <div className="instructions-card">
            <h1 className="instructions-heading">Instructions</h1>
            <ol className="instructions-list">
              <li className="instruction-item">
                <span className="instruction-label">Total Questions: </span>
                <span className="instruction-value">10</span>
              </li>
              <li className="instruction-item">
                <span className="instruction-label">Types of Questions: </span>
                <span className="instruction-value">MCQs</span>
              </li>
              <li className="instruction-item">
                <span className="instruction-label">Duration: </span>
                <span className="instruction-value">10 Mins</span>
              </li>
              <li className="instruction-item">
                <span className="instruction-label">Marking Scheme: </span>
                <span className="instruction-value">
                  Every Correct response, get 1 mark
                </span>
              </li>
              <li className="instruction-item">
                <span className="instruction-value">
                  All the progress will be lost, if you reload during the
                  assessment
                </span>
              </li>
            </ol>
            <Link to="/assessment" className="start-assessment-link">
              <button type="button" className="start-assessment-button">
                Start Assessment
              </button>
            </Link>
          </div>
          <div className="home-image-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-assess-home-img.png"
              alt="assessment"
              className="home-assessment-image"
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default Home
