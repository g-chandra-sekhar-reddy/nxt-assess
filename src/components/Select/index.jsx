import './index.css'

const Select = ({options, selectedOptionId, onSelectOption}) => {
  const onChangeSelect = event => {
    onSelectOption(event.target.value)
  }

  return (
    <div className='single-select-container'>
      <div className='select-wrapper'>
        <select
          className='single-select-dropdown'
          value={selectedOptionId || (options.length > 0 ? options[0].id : '')}
          onChange={onChangeSelect}
        >
          {options.map(option => (
            <option key={option.id} value={option.id}>
              {option.text}
            </option>
          ))}
        </select>
      </div>

      <div className='single-select-callout'>
        <span className='callout-icon'>!</span>
        <p className='callout-text'>First option is selected by default</p>
      </div>
    </div>
  )
}

export default Select
