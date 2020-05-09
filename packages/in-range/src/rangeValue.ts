import { createRange } from './range'
import { createStore } from './store'
import { createSetValue } from './actions'
import { getElements, getOptions, withJS, detectInputDevice } from './utils'
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

export const rangeValue = (
  config: RangeValueOptions,
  initialValue?: number
): RangeValue => {
  withJS()
  detectInputDevice()
  const elements = getElements(config.selector)
  const options = getOptions(elements.root, config)
  const { name } = options
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
    if (
      !config.onValueChange ||
      value === previousValue ||
      typeof previousValue === 'undefined'
    ) {
      return
    }
    config.onValueChange({
      target: { name, value },
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
