import { rangeValue, rangeMinMax, withJS, detectInputDevice } from './src'
import './src/css/in-range.css'

const onLoad = () => {
  withJS()
  detectInputDevice()
  const singleValueEl = document.querySelector<HTMLDivElement>('[data-range]')
  const rangeValueEl = document.querySelector<HTMLDivElement>(
    '[data-range-minmax]'
  )

  if (!singleValueEl) {
    throw new Error('could not find single value element')
  }

  if (!rangeValueEl) {
    throw new Error('could not find range value element')
  }

  const singelValueInstance = rangeValue(
    {
      selector: singleValueEl,
      min: 0,
      max: 10,
      step: 1,
    },
    2
  )

  const rangeValueInstance = rangeMinMax({
    selector: rangeValueEl,
    min: 0,
    max: 10,
    step: 1,
  })
}

window.addEventListener('DOMContentLoaded', onLoad)
