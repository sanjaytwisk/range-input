import { createRange, Options, MockEvent } from './range'
import { createStore, State } from './store'
import { createSetValue } from './actions'
import { getElements } from './utils'
import { createFill } from './fill'

export interface RangeValue {
  getValue: () => number
  setValue: (nextValue: number) => void
  destroy: () => void
}

export interface RangeValueOptions extends Options {
  selector: string | HTMLElement
  onValueChange?: (evt: MockEvent<number>) => void
}

const initialState = {
  value: {},
  rect: {
    left: 0,
    width: 0,
  },
}

const selectValue = (state: State, name: string) => state.value[name]

export const rangeValue = (
  options: RangeValueOptions,
  initialValue?: number
): RangeValue => {
  const elements = getElements(options.selector)
  const store = createStore({
    ...initialState,
  })
  const rangeInstance = createRange(elements, options, store)
  const fillInstance = createFill(elements.fill, options)
  const unsubscribeFill = store.subscribe(fillInstance.update)
  const unsubscribeRange = store.subscribe(rangeInstance.update)
  const unsubscribeValueChange = store.subscribe((state, previousState) => {
    const value = selectValue(state, options.name)
    const previousValue = selectValue(previousState, options.name)
    if (!options.onValueChange || value === previousValue || !previousValue) {
      return
    }
    options.onValueChange({
      target: { name: options.name, value: value[options.name] },
    })
  })

  store.dispatch(createSetValue(initialValue || options.min, options.name))

  const setValue = (nextValue: number) => {
    rangeInstance.setValue(nextValue)
  }

  const getValue = () => store.getState().value[options.name]

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
