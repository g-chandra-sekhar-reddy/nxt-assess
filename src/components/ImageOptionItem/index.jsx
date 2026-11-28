import './index.css'

const ImageOptionItem = ({optionDetails, isSelected, onSelectOption}) => {
  const {id, text, image_url: imageUrl} = optionDetails

  const onClickOption = () => {
    onSelectOption(id)
  }

  return (
    <li className="image-option-list-item">
      <button
        type="button"
        className={`image-option-button ${isSelected ? 'selected' : ''}`}
        onClick={onClickOption}
      >
        <img src={imageUrl} alt={text} className="option-image" />
      </button>
    </li>
  )
}

export default ImageOptionItem
