import { createRange, Options, MockEvent } from './range'
import { Store, Value } from './Store'
import { createSetValue } from './actions'
import {
  getElement,
  getRootElement,
  getElements,
  isEqualValue,
  createFill,
} from './utils'

const MIN = 'min'
const MAX = 'max'

type Name = 'min' | 'max'

interface ValueMinMax {
  min: number
  max: number
}

export interface RangeValue {
  getValue: () => ValueMinMax
  setValue: (nextValue: number, name: Name) => void
  destroy: () => void
}

export interface RangeOptions extends Options {
  selector: string | HTMLElement
  onValueChange?: (evt: MockEvent<Value>) => void
}

const initialState = {
  value: {},
  rect: {
    left: 0,
    width: 0,
  },
}

export const rangeValue = (
  options: RangeOptions,
  initialValue: Partial<ValueMinMax> = {}
): RangeValue => {
  const rootElement = getRootElement(options.selector)
  const fill = rootElement.querySelector<HTMLElement>('[data-range-fill]')
  const selectors = {
    [MIN]: getElement(rootElement, `[data-range="${MIN}"]`),
    [MAX]: getElement(rootElement, `[data-range="${MAX}"]`),
  }
  const store = new Store({
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
      getElements(selectors.min),
      {
        ...options,
        name: MIN,
        onValidate: createOnValidate(MIN),
      },
      store
    ),
    max: createRange(
      getElements(selectors.max),
      {
        ...options,
        name: MAX,
        onValidate: createOnValidate(MAX),
      },
      store
    ),
  }

  const unsubscribeFill = createFill(fill, store, options)

  const unsubscribeRange = Object.values(rangeInstances).map((instance) =>
    store.subscribe(instance.update)
  )

  const unsubscribeValueChange = store.subscribe((state, previousState) => {
    const value = state.value
    const previousValue = previousState.value

    if (
      !options.onValueChange ||
      isEqualValue(value, previousValue) ||
      !Object.keys(previousValue).length
    ) {
      return
    }
    options.onValueChange({
      target: { name: options.name, value },
    })
  })

  store.dispatch(createSetValue(initialValue[MIN] || options.min, MIN))
  store.dispatch(createSetValue(initialValue[MAX] || options.max, MAX))

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
