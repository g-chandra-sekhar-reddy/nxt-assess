import './index.css'

const ButtonOptionItem = ({optionDetails, isSelected, onSelectOption}) => {
  const {id, text} = optionDetails

  const onClickOption = () => {
    onSelectOption(id)
  }

  return (
    <li className="button-option-list-item">
      <button
        type="button"
        className={`button-option-item ${isSelected ? 'selected' : ''}`}
        onClick={onClickOption}
      >
        {text}
      </button>
    </li>
  )
}

export default ButtonOptionItem
