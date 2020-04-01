import React, { useEffect, useRef } from 'react'
import { getPosition } from './utils'

import './range.css'
import { MockEvent } from './'
import { RangeFill } from './RangeFill'
import { RangeTrack } from './RangeTrack'
import { useJS } from './useJS'

export interface RangeProps {
  name: string
  min: number
  max: number
  step: number
  value?: number
  defaultValue?: number
  onChange?: (evt: MockEvent<number>) => void
  onValidate?: (value: number) => boolean
  withFill?: boolean
  withTrack?: boolean
}

export const Range: React.FunctionComponent<RangeProps> = ({
  name,
  min,
  max,
  step,
  value,
  defaultValue,
  onChange,
  onValidate = () => true,
  withFill = true,
  withTrack = true,
  children,
}) => {
  useJS()
  const rangeElement = useRef<HTMLDivElement>(null)
  const valueRef = useRef(value)
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
  const onMouseMove = (evt: MouseEvent) => {
    if (isMouseDown.current) {
      onTrackUpdate(evt.clientX)
    }
  }

  const onClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDown.current) {
      onTrackUpdate(evt.clientX)
    }
  }

  const onTrackUpdate = (clientX: number) => {
    if (rangeElement.current) {
      const { left, width } = rangeElement.current.getBoundingClientRect()
      const dragPosition = clientX - left
      const nextValue = getValueByPosition(dragPosition, width)
      const currentValue = valueRef.current
      if (
        nextValue !== currentValue &&
        Math.round(nextValue % step) === 0 &&
        validateValue(nextValue) &&
        onChange
      ) {
        onChange({ target: { name, value: nextValue } })
      }
    }
  }
  const onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = parseFloat(evt.currentTarget.value)
    if (!validateValue(nextValue) || !onChange) return
    onChange({ target: { name, value: nextValue } })
  }
  const getValueByPosition = (position: number, width: number): number => {
    const steps = (max - min) / step
    const stepSizePixel = width / steps
    const roundTo = step < 1 ? 10 : 1
    return (
      Math.round((position / stepSizePixel) * step * roundTo) / roundTo + min
    )
  }

  useEffect(() => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [])

  useEffect(() => {
    valueRef.current = value
  }, [value])

  return (
    <div
      className="range"
      ref={rangeElement}
      onClick={withTrack ? onClick : undefined}
    >
      {withTrack && <RangeTrack />}
      {withFill && (
        <RangeFill
          start={getPosition(min, max, min)}
          end={getPosition(value || defaultValue || min, max, min)}
        />
      )}
      <input
        type="range"
        value={value}
        defaultValue={defaultValue}
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
          left: `calc(${getPosition(value || min, max, min)}% - 0.5rem)`,
        }}
        onMouseDown={onMouseDown}
        draggable={false}
      >
        {children}
      </label>
    </div>
  )
}
