import * as React from 'react'
import { withA11y } from '@storybook/addon-a11y'
import { action } from '@storybook/addon-actions'
import { RangeInput } from './RangeInput'

export default {
  title: 'Range Input',
  component: RangeInput,
  decorators: [withA11y],
}

export const primary = () => (
  <RangeInput
    name="range"
    step={1}
    min={0}
    max={10}
    value={[0, 3]}
    onChange={action('change')}
  />
)

export const secondary = () => (
  <RangeInput
    name="range"
    step={4}
    min={0}
    max={16}
    value={[0, 4]}
    onChange={action('change')}
  />
)

export const tertiary = () => (
  <RangeInput
    name="range"
    step={0.1}
    min={0}
    max={10}
    value={[0, 2]}
    onChange={action('change')}
  />
)
