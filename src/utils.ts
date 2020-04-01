import { MockEvent } from 'index'

interface Bounds {
  min: number
  max: number
  step: number
}

interface Options extends Bounds {
  name: string
  element: HTMLDivElement | null
  onValidate?: Validator
}

type Validator = (value?: number) => boolean

export const validateValue = (
  nextValue: number,
  { min, max, onValidate = () => true }: Options
) => {
  const isValid = nextValue <= max && nextValue >= min
  return isValid && onValidate(nextValue)
}

export const onTrackUpdate = (
  clientX: number,
  currentValue: number,
  options: Options,
  update: (evt: MockEvent<number>) => void
) => {
  const nextValue = getNextValue(clientX, options)
  if (
    nextValue &&
    nextValue !== currentValue &&
    Math.round(nextValue % options.step) === 0 &&
    validateValue(nextValue, options)
  ) {
    update({ target: { name: options.name, value: nextValue } })
  }
}

const getNextValue = (clientX: number, options: Options) => {
  if (!options.element) return
  const { left, width } = options.element.getBoundingClientRect()
  const dragPosition = clientX - left
  const nextValue = positionToValue(dragPosition, width, options)
  return nextValue
}

export const positionToValue = (
  position: number,
  width: number,
  { min, max, step }: Options
): number => {
  const steps = (max - min) / step
  const stepSizePixel = width / steps
  const roundTo = step < 1 ? 10 : 1
  return Math.round((position / stepSizePixel) * step * roundTo) / roundTo + min
}

export const valueToPosition = (value: number, { max, min }: Bounds) => {
  return ((value - min) / (max - min)) * 100
}

export const withJS = () => {
  if (!document.documentElement.hasAttribute('data-has-js')) {
    document.documentElement.setAttribute('data-has-js', '')
  }
}

export const detectInputDevice = () => {
  if (typeof window === 'undefined') return
  const handlers = {
    firstTab: (evt: KeyboardEvent) => {
      if (evt.keyCode === 9) {
        document.documentElement.setAttribute('data-input-keyboard', '')
        document.documentElement.removeAttribute('data-input-mouse')

        window.removeEventListener('keydown', handlers.firstTab)
        window.addEventListener('mousedown', handlers.mouseDown)
      }
    },
    mouseDown: () => {
      document.documentElement.setAttribute('data-input-mouse', '')
      document.documentElement.removeAttribute('data-input-keyboard')

      window.removeEventListener('mousedown', handlers.mouseDown)
      window.addEventListener('keydown', handlers.firstTab)
    },
  }

  window.addEventListener('keydown', handlers.firstTab)
}
