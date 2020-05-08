import { rangeValue, rangeMinMax, withJS, detectInputDevice } from './src'
import './src/css/in-range.css'

const onLoad = () => {
  withJS()
  detectInputDevice()
  const onValueChange = ({ target }) => console.log(target)
  const singleValueEl = document.querySelector<HTMLDivElement>(
    '[data-in-range="value"]'
  )
  const rangeValueEl = document.querySelector<HTMLDivElement>(
    '[data-in-range="minmax"]'
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
      onValueChange,
    },
    2
  )

  const rangeValueInstance = rangeMinMax({
    selector: rangeValueEl,
    onValueChange,
  })
}

window.addEventListener('DOMContentLoaded', onLoad)
