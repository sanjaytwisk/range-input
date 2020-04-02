export const getElement = <T extends Element>(
  root: HTMLDivElement,
  elementType: string
) => {
  const element = root.querySelector<T>(`[data-range-${elementType}]`)
  if (!element) {
    throw new Error(`Could not find element ${elementType}`)
  }
  return element
}

interface Bounds {
  min: number
  max: number
  step: number
}

interface Options extends Bounds {
  name: string
  onValidate?: Validator
}

export interface Rect {
  left: number
  width: number
}

export type Validator = (value?: number) => boolean

export const validateValue = (
  nextValue: number,
  { min, max, onValidate = () => true }: Options
) => {
  const isValid = nextValue <= max && nextValue >= min
  return isValid && onValidate(nextValue)
}

export const isValidValue = (
  nextValue: number,
  currentValue: number,
  options: Options
) =>
  typeof nextValue !== 'undefined' &&
  nextValue !== currentValue &&
  Math.round(nextValue % options.step) === 0 &&
  validateValue(nextValue, options)

export const getNextValue = (clientX: number, rect: Rect, bounds: Bounds) => {
  const { left, width } = rect
  const dragPosition = clientX - left
  const nextValue = positionToValue(dragPosition, width, bounds)
  return nextValue
}

export const positionToValue = (
  position: number,
  width: number,
  { min, max, step }: Bounds
): number => {
  const steps = (max - min) / step
  const stepSizePixel = width / steps
  const roundTo = step < 1 ? 10 : 1
  return Math.round((position / stepSizePixel) * step * roundTo) / roundTo + min
}

export const valueToPosition = (value: number, { max, min }: Bounds) => {
  return ((value - min) / (max - min)) * 100
}
