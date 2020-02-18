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
  const isMouseDown = useRef(false)
  const rangeElement = useRef<HTMLFieldSetElement>(null)
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
  const onChangeMin = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(evt.target.value)
    if (value >= maxValue) return
    setLocalValue({ ...localValue, [nameMin]: value })
  }
  const validateValue = (
    thumb: typeof nameMin | typeof nameMax,
    nextValue: number
  ) => {
    if (thumb === nameMin && (nextValue >= maxValue || nextValue < min)) {
      return false
    }
    if (thumb === nameMax && (nextValue <= minValue || nextValue > max)) {
      return false
    }
    return true
  }

  const onChangeMax = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(evt.target.value)
    if (value <= minValue) return
    setLocalValue({ ...localValue, [nameMax]: value })
  }

  const getPosition = (value: number) => {
    return (value / max) * 100
  }

  const onMouseDown = () => {
    isMouseDown.current = true
  }
  const onMouseUp = () => {
    isMouseDown.current = false
  }
  const onMouseMove = (thumb: typeof nameMin | typeof nameMax) => (
    evt: React.MouseEvent<HTMLLabelElement>
  ) => {
    if (isMouseDown.current && rangeElement.current) {
      const rangeElementClient = rangeElement.current.getBoundingClientRect()
      const dragPosition = evt.clientX - rangeElementClient.left
      const nextValue = getValueByPosition(
        dragPosition,
        rangeElementClient.width
      )
      const currentValue = localValue[thumb]
      if (
        nextValue !== currentValue &&
        Math.round(nextValue % step) === 0 &&
        validateValue(thumb, nextValue)
      ) {
        setLocalValue({ ...localValue, [thumb]: nextValue })
      }
    }
  }
  const getValueByPosition = (position: number, width: number): number => {
    const stepSizePixel = width / (max / step)
    const roundTo = step < 1 ? 10 : 1
    return Math.round((position / stepSizePixel) * step * roundTo) / roundTo
  }

  return (
    <fieldset className="range" ref={rangeElement}>
      <div className="range__track" />
      <div
        className="range__fill"
        style={{
          width: `${getPosition(maxValue) - getPosition(minValue)}%`,
          left: `${getPosition(minValue)}%`,
        }}
      />
      <RangeThumb
        value={localValue[nameMin]}
        min={min}
        max={max}
        step={step}
        onChange={onChangeMin}
        name={nameMin}
        position={getPosition(localValue[nameMin])}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove(nameMin)}
      >
        Maximum value
      </RangeThumb>
      <RangeThumb
        value={localValue[nameMax]}
        min={min}
        max={max}
        step={step}
        onChange={onChangeMax}
        name={nameMax}
        position={getPosition(localValue[nameMax])}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onMouseMove={onMouseMove(nameMax)}
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
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void
  position: number
  onMouseUp: () => void
  onMouseDown: () => void
  onMouseLeave: () => void
  onMouseMove: (evt: React.MouseEvent<HTMLLabelElement>) => void
}

const RangeThumb: React.FunctionComponent<RangeThumbProps> = ({
  name,
  min,
  max,
  step,
  value,
  onChange,
  children,
  onMouseDown,
  onMouseUp,
  onMouseMove,
  position,
}) => (
  <>
    <input
      type="range"
      value={value}
      min={min}
      max={max}
      step={step.toString()}
      className="range__input"
      onChange={onChange}
      id={name}
      name={name}
    />
    <label
      className="range__label"
      htmlFor={name}
      style={{ left: `calc(${position}% - 0.5rem)` }}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onMouseMove={onMouseMove}
      draggable={false}
    >
      {children}
    </label>
  </>
)
