import * as React from 'react'
import { RangeInput } from './RangeInput'

export default {
  title: 'Range Input',
  component: RangeInput,
}

export const primary = () => (
  <RangeInput name="range" step={1} min={0} max={10} value={[0, 3]} />
)

export const secondary = () => (
  <RangeInput name="range" step={4} min={0} max={16} value={[0, 4]} />
)

export const tertiary = () => (
  <RangeInput name="range" step={0.1} min={0} max={10} value={[0, 2]} />
)
