import React, { useEffect, useRef } from 'react'
import { withA11y } from '@storybook/addon-a11y'
import { Range } from './Range'
import { RangeDynamic } from './RangeDynamic'
import { Range as RangeVanilla, DynamicRange } from '@twisk/in-range'
import { useJS } from './useJS'

export default {
  title: 'Range',
  component: Range,
  decorators: [withA11y],
}

export const single = () => {
  const [value, setValue] = React.useState(5)
  const onChange = (evt: any) => {
    setValue(evt.target.value)
  }
  return (
    <Range
      name="single"
      step={1}
      min={5}
      max={15}
      value={value}
      onChange={onChange}
    >
      Select price
    </Range>
  )
}

export const multi = () => {
  const [value, setValue] = React.useState({})
  const onChange = (evt: any) => {
    setValue((previousValue) => ({
      ...previousValue,
      [evt.target.name]: evt.target.value,
    }))
  }
  return (
    <RangeDynamic
      name="multi"
      step={1}
      min={5}
      max={15}
      value={value}
      onChange={onChange}
    />
  )
}

export const vanilla = () => {
  useJS()
  const range = useRef<RangeVanilla>()
  const options = {
    selector: '[data-range]',
    name: 'vanilla',
    min: 0,
    max: 10,
    step: 1,
  }
  useEffect(() => {
    range.current = RangeVanilla.create(options, { value: 5 })

    return () => {
      range.current?.destroy()
    }
  }, [])
  return (
    <div data-range="" className="range">
      <div className="range-track" />
      <div className="range-fill" data-range-fill="" />
      <input
        type="range"
        min={options.min}
        max={options.max}
        step={options.step}
        className="range__input"
        id={options.name}
        name={options.name}
        data-range-input=""
      />
      <label
        data-range-thumb=""
        className="range__label"
        htmlFor={options.name}
        draggable={false}
      >
        Set amount
      </label>
    </div>
  )
}

export const vanillaMulti = () => {
  useJS()
  const range = useRef<DynamicRange>()
  const options = {
    selector: '[data-multi-range]',
    name: 'vanilla-multi',
    min: 0,
    max: 10,
    step: 1,
  }
  useEffect(() => {
    range.current = DynamicRange.create(options, { min: 5, max: 10 })

    return () => {
      range.current?.destroy()
    }
  }, [])
  return (
    <div className="multi-range" data-multi-range="">
      <div className="range-track" />
      <div className="range-fill" data-range-fill="" />
      <div data-range-min={options.name} className="range">
        <input
          type="range"
          min={options.min}
          max={options.max}
          step={options.step}
          className="range__input"
          id={`${options.name}[min]`}
          name={`${options.name}[min]`}
          data-range-input=""
        />
        <label
          data-range-thumb=""
          className="range__label"
          htmlFor={`${options.name}[min]`}
          draggable={false}
        >
          Set minimum amount
        </label>
      </div>
      <div data-range-max={options.name} className="range">
        <input
          type="range"
          min={options.min}
          max={options.max}
          step={options.step}
          className="range__input"
          id={`${options.name}[max]`}
          name={`${options.name}[max]`}
          data-range-input=""
        />
        <label
          data-range-thumb=""
          className="range__label"
          htmlFor={`${options.name}[max]`}
          draggable={false}
        >
          Set maximum amount
        </label>
      </div>
    </div>
  )
}
