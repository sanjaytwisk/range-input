import React from 'react'
import { withA11y } from '@storybook/addon-a11y'
import { RangeValue } from './RangeValue'
import { RangeMinMax } from './RangeMinMax'

export default {
  title: 'Range',
  component: Range,
  decorators: [withA11y],
}

export const singleValue = () => {
  const [value, setValue] = React.useState(5)
  const onChange = (evt: any) => {
    setValue(evt.target.value)
  }
  return (
    <RangeValue
      name="single"
      step={1}
      min={5}
      max={15}
      value={value}
      onChange={onChange}
    >
      Select price
    </RangeValue>
  )
}

export const minMax = () => {
  const [value, setValue] = React.useState({})
  const onChange = (evt: any) => {
    setValue((previousValue) => ({
      ...previousValue,
      [evt.target.name]: evt.target.value,
    }))
  }
  return (
    <RangeMinMax
      name="multi"
      step={1}
      min={5}
      max={15}
      value={value}
      onChange={onChange}
    />
  )
}
