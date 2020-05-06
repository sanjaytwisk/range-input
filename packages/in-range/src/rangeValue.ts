import { createRange } from './range'
import { createStore } from './store'
import { createSetValue } from './actions'
import { getElements } from './utils'
import { createFill } from './fill'

import { State, RangeValueOptions, RangeValue } from './types'

const initialState = {
  value: {},
  rect: {
    left: 0,
    width: 0,
  },
}

const selectValue = (state: State, name: string) => state.value[name]

const getName = (inputEl: HTMLInputElement) => {
  const { name } = inputEl
  if (!name) {
    throw new Error('Missing input element name attribute')
  }
  return name
}

export const rangeValue = (
  options: RangeValueOptions,
  initialValue?: number
): RangeValue => {
  const elements = getElements(options.selector)
  const name = getName(elements.input)
  const store = createStore({
    ...initialState,
  })
  const rangeInstance = createRange(elements, { ...options, name }, store)
  const fillInstance = createFill(elements.fill, options)
  const unsubscribeFill = store.subscribe(fillInstance.update)
  const unsubscribeRange = store.subscribe(rangeInstance.update)
  const unsubscribeValueChange = store.subscribe((state, previousState) => {
    const value = selectValue(state, name)
    const previousValue = selectValue(previousState, name)
    if (!options.onValueChange || value === previousValue || !previousValue) {
      return
    }
    options.onValueChange({
      target: { name, value: value[name] },
    })
  })

  store.dispatch(createSetValue(initialValue || options.min, name))

  const setValue = (nextValue: number) => {
    rangeInstance.setValue(nextValue)
  }

  const getValue = () => store.getState().value[name]

  const destroy = () => {
    rangeInstance.destroy()
    unsubscribeValueChange()
    unsubscribeRange()
    unsubscribeFill()
  }

  return {
    setValue,
    getValue,
    destroy,
  }
}
