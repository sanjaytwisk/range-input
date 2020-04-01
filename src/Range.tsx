import React, { useLayoutEffect, useRef, useCallback } from 'react'
import { valueToPosition, onTrackUpdate, validateValue } from './utils'

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
  value = min,
  defaultValue,
  onChange = () => null,
  onValidate,
  withFill = true,
  withTrack = true,
  children,
}) => {
  useJS()
  const rangeElement = useRef<HTMLDivElement>(null)
  const isMouseDown = useRef(false)
  const getOptions = () => ({
    name,
    min,
    max,
    step,
    element: rangeElement.current,
    onValidate,
  })

  const onMouseDown = () => {
    isMouseDown.current = true
  }

  const onMouseUp = () => {
    isMouseDown.current = false
  }

  const onMouseMove = useCallback(
    (evt: MouseEvent) => {
      if (isMouseDown.current) {
        onTrackUpdate(evt.clientX, value, getOptions(), onChange)
      }
    },
    [value]
  )

  const onClick = useCallback(
    (evt: React.MouseEvent<HTMLDivElement>) => {
      if (!isMouseDown.current) {
        onTrackUpdate(evt.clientX, value, getOptions(), onChange)
      }
    },
    [value]
  )

  const onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = parseFloat(evt.currentTarget.value)
    if (!validateValue(nextValue, getOptions()) || !onChange) return
    onChange({ target: { name, value: nextValue } })
  }

  useLayoutEffect(() => {
    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }
  }, [value])

  return (
    <div
      className={`range${withTrack ? ' range--clickable' : ''}`}
      ref={rangeElement}
      onClick={withTrack ? onClick : undefined}
    >
      {withTrack && <RangeTrack />}
      {withFill && (
        <RangeFill
          start={valueToPosition(min, getOptions())}
          end={valueToPosition(value || defaultValue || min, getOptions())}
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
          left: `calc(${valueToPosition(
            value || min,
            getOptions()
          )}% - 0.5rem)`,
        }}
        onMouseDown={onMouseDown}
        draggable={false}
      >
        {children}
      </label>
    </div>
  )
}
