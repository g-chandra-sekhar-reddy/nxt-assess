import Timer from '../Timer'
import QuestionPalette from '../QuestionPalette'

import './index.css'

const AssessmentConfiguration = ({
  timeRemaining,
  totalQuestions,
  answeredCount,
  unansweredCount,
  currentQuestionIndex,
  userAnswers,
  questionsList,
  onSelectQuestion,
  onSubmitAssessment,
}) => {
  return (
    <div className="assessment-configuration-card">
      <Timer timeRemaining={timeRemaining} />

      <div className="config-body">
        <div className="status-counters-container">
          <div className="status-counter-item">
            <p className="status-circle answered">{answeredCount}</p>
            <p className="status-label">Answered Questions</p>
          </div>
          <div className="status-counter-item">
            <p className="status-circle unanswered">{unansweredCount}</p>
            <p className="status-label">Unanswered Questions</p>
          </div>
        </div>

        <hr className="config-divider" />

        <QuestionPalette
          totalQuestions={totalQuestions}
          currentQuestionIndex={currentQuestionIndex}
          userAnswers={userAnswers}
          questionsList={questionsList}
          onSelectQuestion={onSelectQuestion}
        />

        <div className="submit-test-container">
          <button
            type="button"
            className="submit-assessment-btn"
            onClick={onSubmitAssessment}
          >
            Submit Assessment
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssessmentConfiguration
