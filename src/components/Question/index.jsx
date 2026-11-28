import ButtonOptionItem from '../ButtonOptionItem'
import ImageOptionItem from '../ImageOptionItem'
import Select from '../Select'

import './index.css'

const Question = ({
  questionDetails,
  isLastQuestion,
  selectedOptionId,
  onSelectOption,
  onNextQuestion,
}) => {
  const {
    question_text: questionText,
    options_type: optionsType,
    options,
  } = questionDetails

  const normalizedType = (optionsType || '').replace('_', ' ').toUpperCase()

  const renderOptions = () => {
    switch (normalizedType) {
      case 'IMAGE':
        return (
          <ul className="image-options-list">
            {options.map(option => (
              <ImageOptionItem
                key={option.id}
                optionDetails={option}
                isSelected={selectedOptionId === option.id}
                onSelectOption={onSelectOption}
              />
            ))}
          </ul>
        )
      case 'SINGLE SELECT':
        return (
          <Select
            options={options}
            selectedOptionId={selectedOptionId}
            onSelectOption={onSelectOption}
          />
        )
      case 'DEFAULT':
      default:
        return (
          <ul className="default-options-list">
            {options.map(option => (
              <ButtonOptionItem
                key={option.id}
                optionDetails={option}
                isSelected={selectedOptionId === option.id}
                onSelectOption={onSelectOption}
              />
            ))}
          </ul>
        )
    }
  }

  return (
    <div className="question-card">
      <div className="question-content-wrapper">
        <p className="question-text">{questionText}</p>
        <hr className="question-divider" />
        <div className="question-options-container">{renderOptions()}</div>
      </div>
      {!isLastQuestion && (
        <div className="question-actions-container">
          <button
            type="button"
            className="next-question-btn"
            onClick={onNextQuestion}
          >
            Next Question
          </button>
        </div>
      )}
    </div>
  )
}

export default Question
