import { createRange } from './range'
import { createStore } from './store'
import { createSetValue } from './actions'
import { DATA_NAME } from './constants'
import {
  getElement,
  getRootElement,
  getElements,
  isEqualValue,
  getOptions,
  withJS,
  detectInputDevice,
} from './utils'
import { createFill } from './fill'
import { RangeMinMaxOptions, ValueMinMax, RangeMinMax, Name } from './types'

const MIN = 'min'
const MAX = 'max'

const initialState = {
  value: {},
  rect: {
    left: 0,
    width: 0,
  },
}

export const rangeMinMax = (
  config: RangeMinMaxOptions,
  initialValue: Partial<ValueMinMax> = {}
): RangeMinMax => {
  withJS()
  detectInputDevice()
  const rootElement = getRootElement(config.selector)
  const options = getOptions(rootElement, config)
  const fill = rootElement.querySelector<HTMLElement>('[data-range-fill]')
  const selectors = {
    [MIN]: getElement(rootElement, `[${DATA_NAME}="${MIN}"]`),
    [MAX]: getElement(rootElement, `[${DATA_NAME}="${MAX}"]`),
  }
  const minElements = getElements(selectors.min)
  const maxElements = getElements(selectors.max)
  const store = createStore({
    ...initialState,
  })

  const createOnValidate = (name: Name) => (nextValue: number) => {
    const { min, max } = store.getState().value
    switch (name) {
      case MIN:
        return nextValue < max
      case MAX:
        return nextValue > min
      default:
        throw new Error('createOnValidate was called without a name identifier')
    }
  }

  const rangeInstances = {
    min: createRange(
      minElements,
      {
        ...options,
        name: MIN,
        onValidate: createOnValidate(MIN),
      },
      store
    ),
    max: createRange(
      maxElements,
      {
        ...options,
        name: MAX,
        onValidate: createOnValidate(MAX),
      },
      store
    ),
  }
  const fillInstance = createFill(fill, options)
  const unsubscribeFill = store.subscribe(fillInstance.update)

  const unsubscribeRange = Object.values(rangeInstances).map((instance) =>
    store.subscribe(instance.update)
  )

  store.dispatch(createSetValue(initialValue[MIN] || options.min, MIN))
  store.dispatch(createSetValue(initialValue[MAX] || options.max, MAX))

  const unsubscribeValueChange = store.subscribe((state, previousState) => {
    const value = state.value
    const previousValue = previousState.value

    if (
      !config.onValueChange ||
      isEqualValue(value, previousValue) ||
      !Object.keys(previousValue).length
    ) {
      return
    }
    config.onValueChange({
      target: { name: options.name, value },
    })
  })

  const setValue = (nextValue: number, name: Name) => {
    if (!name || ![MIN, MAX].includes(name)) return
    rangeInstances[name].setValue(nextValue)
  }

  const getValue = () => {
    const { min, max } = store.getState().value
    return { min, max }
  }

  const destroy = () => {
    Object.values(rangeInstances).forEach((instance) => instance.destroy())
    unsubscribeValueChange()
    unsubscribeRange.forEach((unsubscribe) => unsubscribe())
    unsubscribeFill()
  }

  return {
    setValue,
    getValue,
    destroy,
  }
}
