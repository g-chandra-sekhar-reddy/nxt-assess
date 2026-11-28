import './index.css'

const QuestionNumberItem = ({
  questionNumber,
  isActive,
  isAnswered,
  onSelectQuestion,
}) => {
  const onClickNumber = () => {
    onSelectQuestion(questionNumber - 1)
  }

  let itemClassName = 'question-number-item'
  if (isAnswered) {
    itemClassName += ' answered'
  }
  if (isActive) {
    itemClassName += ' active'
  }

  return (
    <li className="question-number-list-item">
      <button type="button" className={itemClassName} onClick={onClickNumber}>
        {questionNumber}
      </button>
    </li>
  )
}

export default QuestionNumberItem
