import * as React from 'react'
const { useState, useEffect, useRef } = React

import './range-input.css'

export interface RangeInputProps {
  name: string
  min: number
  max: number
  step: number
  value?: number[]
  onChange?: (change: { name: string; value: [number, number] }) => void
}

const getPosition = (value: number, max: number) => {
  return (value / max) * 100
}

export const RangeInput: React.FunctionComponent<RangeInputProps> = ({
  name,
  value,
  min,
  max,
  step,
  onChange,
}) => {
  const nameMin = `${name}[min]`
  const nameMax = `${name}[max]`

  const [initMin, initMax] = value || [min, max]
  const [localValue, setLocalValue] = useState({
    [nameMin]: initMin,
    [nameMax]: initMax,
  })

  useEffect(() => {
    if (onChange) {
      onChange({
        name,
        value: [localValue[nameMin], localValue[nameMax]],
      })
    }
  }, [localValue])

  const minValue = localValue[nameMin]
  const maxValue = localValue[nameMax]

  const onChangeHandler = (evt: { name: string; value: number }) => {
    setLocalValue({ ...localValue, [evt.name]: evt.value })
  }

  const validateMin = (value: number) => value < maxValue
  const validateMax = (value: number) => value > minValue

  return (
    <fieldset className="range">
      <div className="range__track" />
      <div
        className="range__fill"
        style={{
          width: `${getPosition(maxValue, max) - getPosition(minValue, max)}%`,
          left: `${getPosition(minValue, max)}%`,
        }}
      />
      <RangeThumb
        value={localValue[nameMin]}
        min={min}
        max={max}
        step={step}
        onChange={onChangeHandler}
        onValidate={validateMin}
        name={nameMin}
      >
        Maximum value
      </RangeThumb>
      <RangeThumb
        value={localValue[nameMax]}
        min={min}
        max={max}
        step={step}
        onChange={onChangeHandler}
        onValidate={validateMax}
        name={nameMax}
      >
        Maximum value
      </RangeThumb>
      <output className="range__output">
        <span>{localValue[nameMin]}</span>
        <span>{localValue[nameMax]}</span>
      </output>
    </fieldset>
  )
}

interface RangeThumbProps {
  name: string
  min: number
  max: number
  step: number
  value: number
  onChange: (evt: { name: string; value: number }) => void
  onValidate?: (value: number) => boolean
}

const RangeThumb: React.FunctionComponent<RangeThumbProps> = ({
  name,
  min,
  max,
  step,
  value,
  onChange,
  onValidate = () => true,
  children,
}) => {
  const rangeElement = useRef<HTMLDivElement>(null)
  const isMouseDown = useRef(false)
  const onMouseDown = () => {
    isMouseDown.current = true
  }
  const onMouseUp = () => {
    isMouseDown.current = false
  }
  const validateValue = (nextValue: number) => {
    return nextValue <= max && nextValue >= min && onValidate(nextValue)
  }
  const onMouseMove = (evt: React.MouseEvent<HTMLLabelElement>) => {
    if (isMouseDown.current && rangeElement.current) {
      const rangeElementClient = rangeElement.current.getBoundingClientRect()
      const dragPosition = evt.clientX - rangeElementClient.left
      const nextValue = getValueByPosition(
        dragPosition,
        rangeElementClient.width
      )
      const currentValue = value
      if (
        nextValue !== currentValue &&
        Math.round(nextValue % step) === 0 &&
        validateValue(nextValue)
      ) {
        onChange({ name, value: nextValue })
      }
    }
  }
  const onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = parseFloat(evt.currentTarget.value)
    if (!validateValue(nextValue)) return
    onChange({ name, value: nextValue })
  }
  const getValueByPosition = (position: number, width: number): number => {
    const stepSizePixel = width / (max / step)
    const roundTo = step < 1 ? 10 : 1
    return Math.round((position / stepSizePixel) * step * roundTo) / roundTo
  }
  return (
    <div className="range-input" ref={rangeElement}>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        className="range__input"
        onChange={onInputChange}
        id={name}
        name={name}
      />
      <label
        className="range__label"
        htmlFor={name}
        style={{
          left: `calc(${getPosition(value, max)}% - 0.5rem)`,
        }}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove}
        draggable={false}
      >
        {children}
      </label>
    </div>
  )
}
