import * as React from 'react'
const { useState } = React

import './range-input.css'

export interface RangeInputProps {
  name: string
  min: number
  max: number
  step: number
  value?: number[]
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void
}

export const RangeInput: React.SFC<RangeInputProps> = ({
  name,
  value,
  min,
  max,
  step,
  onChange,
}) => {
  const [initMin, initMax] = value || [min, max]
  const [minValue, setMinValue] = useState(initMin)
  const [maxValue, setMaxValue] = useState(initMax)
  const onChangeMin = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(evt.target.value)
    if (value >= maxValue) return
    setMinValue(value)
  }
  const onChangeMax = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(evt.target.value)
    if (value <= minValue) return
    setMaxValue(value)
  }
  const getPosition = (value: number) => {
    return (value / max) * 100
  }
  return (
    <div className="range">
      <div className="range__track" />
      <div
        className="range__fill"
        style={{
          width: `${getPosition(maxValue) - getPosition(minValue)}%`,
          left: `${getPosition(minValue)}%`,
        }}
      />
      <input
        type="range"
        value={minValue}
        min={min}
        max={max}
        step={step.toString()}
        className="range__input"
        onChange={onChangeMin}
        id="range-min"
      />
      <label
        className="range__label"
        htmlFor="range-min"
        style={{ left: `calc(${getPosition(minValue)}% - 0.5rem)` }}
      />
      <input
        type="range"
        value={maxValue}
        min={min}
        max={max}
        step={step.toString()}
        className="range__input"
        onChange={onChangeMax}
        id="range-max"
      />
      <label
        className="range__label"
        htmlFor="range-max"
        style={{ left: `calc(${getPosition(maxValue)}% - 0.5rem)` }}
      />
      {/* <output>
        {minValue}, {maxValue}
      </output> */}
    </div>
  )
}
