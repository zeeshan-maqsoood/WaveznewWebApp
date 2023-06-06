import React, { useRef, useEffect } from "react"
const updateInput = (ref, checked) => {
  const input = ref.current
  if (input) {
    input.checked = checked
    input.indeterminate = checked === null
  }
}

const ThreeStateCheckbox = ({ name, checked, onChange, disabled }) => {
  const inputRef = useRef(null)
  const checkedRef = useRef(checked)
  useEffect(() => {
    checkedRef.current = checked
    updateInput(inputRef, checked)
  }, [checked])
  const handleClick = () => {
    switch (checkedRef.current) {
      case true:
        checkedRef.current = false
        break
      case false:
        checkedRef.current = null
        break
      default:
        // null
        checkedRef.current = true
        break
    }
    updateInput(inputRef, checkedRef.current)
    if (onChange) {
      onChange(checkedRef.current)
    }
  }
  return (
    <div style={{padding: 5}}>
      <input
        style={{ width: 16, height: 16 }}
        ref={inputRef}
        checked={checkedRef.current}
        type='checkbox'
        name={name}
        onClick={handleClick}
      />
    </div>
  )
}

export default ThreeStateCheckbox
