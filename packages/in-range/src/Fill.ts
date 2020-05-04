import { Bounds, isEqualValue, valueToPosition } from './utils'
import { State, Value, Observer } from './store'

export interface Fill {
  update: Observer
}

const valuesToStartEnd = (value: Value, bounds: Bounds) => {
  const { min, max } = value
  const [singleValue] = Object.values(value)
  if (typeof min !== 'undefined' && typeof max !== 'undefined') {
    return {
      start: valueToPosition(min, bounds),
      end: valueToPosition(max, bounds),
    }
  }
  if (singleValue) {
    return {
      start: 0,
      end: valueToPosition(singleValue, bounds),
    }
  }
  return {
    start: 0,
    end: 0,
  }
}

export const createFill = <T extends HTMLElement>(
  element: T | null,
  bounds: Bounds
) => {
  if (!element) {
    return {
      update: () => null,
    }
  }
  const update = ({ value }: State, { value: previousValue }: State) => {
    if (isEqualValue(value, previousValue)) {
      return
    }
    const { start, end } = valuesToStartEnd(value, bounds)
    element.setAttribute('style', `width:${end - start}%;left:${start}%;`)
  }

  return {
    update,
  }
}
