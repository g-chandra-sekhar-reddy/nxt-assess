import QuestionNumberItem from '../QuestionNumberItem'

import './index.css'

const QuestionPalette = ({
  totalQuestions,
  currentQuestionIndex,
  userAnswers,
  questionsList,
  onSelectQuestion,
}) => {
  return (
    <div className="question-palette-container">
      <h1 className="palette-heading">Questions ({totalQuestions})</h1>
      <ul className="palette-numbers-list">
        {questionsList.map((question, index) => {
          const questionNumber = index + 1
          const isActive = index === currentQuestionIndex
          const isAnswered = userAnswers[question.id] !== undefined

          return (
            <QuestionNumberItem
              key={question.id}
              questionNumber={questionNumber}
              isActive={isActive}
              isAnswered={isAnswered}
              onSelectQuestion={onSelectQuestion}
            />
          )
        })}
      </ul>
    </div>
  )
}

export default QuestionPalette
