import { singleValue, rangeValue, withJS, detectInputDevice } from './src'
import './src/css/all.css'

const onLoad = () => {
  withJS()
  detectInputDevice()
  const singleValueEl = document.querySelector<HTMLDivElement>('[data-range]')
  const rangeValueEl = document.querySelector<HTMLDivElement>(
    '[data-multi-range]'
  )

  if (!singleValueEl) {
    throw new Error('could not find single value element')
  }

  if (!rangeValueEl) {
    throw new Error('could not find range value element')
  }

  const singelValueInstance = singleValue(
    {
      name: singleValueEl.dataset.range,
      selector: singleValueEl,
      min: 0,
      max: 10,
      step: 1,
    },
    2
  )

  const rangeValueInstance = rangeValue({
    name: rangeValueEl.dataset.multiRange,
    selector: rangeValueEl,
    min: 0,
    max: 10,
    step: 1,
  })
}

window.addEventListener('DOMContentLoaded', onLoad)
