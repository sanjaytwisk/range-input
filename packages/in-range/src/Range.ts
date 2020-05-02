import { isValidValue, getNextValue, valueToPosition, Validator } from './utils'
import { Store, State } from './Store'
import { createSetRect, createSetValue } from './actions'

export type MockEvent<T = string> = {
  target: {
    name: string
    value: T
  }
}
interface Elements {
  root: HTMLElement
  input: HTMLInputElement
  thumb: HTMLLabelElement
}

export interface Options {
  name: string
  min: number
  max: number
  step: number
  onValidate?: Validator
}

export class Range {
  private isMouseDown = false

  private timeout = 0

  constructor(
    private elements: Elements,
    private options: Options,
    private store: Store
  ) {
    this.addEventListeners()
    this.setRect()
  }

  private addEventListeners() {
    const { thumb, root, input } = this.elements
    root.addEventListener('click', this.onClick)
    input.addEventListener('change', this.onInputChange)
    thumb.addEventListener('mousedown', this.onMouseDown)
    thumb.addEventListener('touchstart', this.onMouseDown)
    thumb.addEventListener('touchend', this.onMouseUp)
    thumb.addEventListener('touchmove', this.onTouchMove)
    document.addEventListener('mouseup', this.onMouseUp)
    document.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('resize', this.onResize)
  }

  private removeEventListeners() {
    const { thumb, root, input } = this.elements
    root.removeEventListener('click', this.onClick)
    input.removeEventListener('change', this.onInputChange)
    thumb.removeEventListener('mousedown', this.onMouseDown)
    thumb.removeEventListener('touchstart', this.onMouseDown)
    thumb.removeEventListener('touchend', this.onMouseUp)
    thumb.removeEventListener('touchmove', this.onTouchMove)
    document.removeEventListener('mouseup', this.onMouseUp)
    document.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('resize', this.onResize)
  }

  private onMouseDown = () => {
    this.isMouseDown = true
  }

  private onMouseUp = () => {
    this.isMouseDown = false
  }

  private onClick = (evt: MouseEvent) => {
    const { clientX } = evt
    this.setPosition(clientX)
  }

  private onMouseMove = (evt: MouseEvent) => {
    const { clientX } = evt
    if (this.isMouseDown) {
      this.setPosition(clientX)
    }
  }

  private onTouchMove = (evt: TouchEvent) => {
    const { clientX } = evt.targetTouches[0]
    if (this.isMouseDown) {
      this.setPosition(clientX)
    }
  }

  private onInputChange = (evt: Event) => {
    const target = evt.target as HTMLInputElement
    if (!target) return
    this.setValue(parseFloat(target.value))
  }

  private onResize = () => {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = window.setTimeout(this.setRect, 400)
  }

  private setRect = () =>
    this.store.dispatch(
      createSetRect(this.elements.root.getBoundingClientRect())
    )

  private setPosition(nextPosition: number) {
    const { value, rect } = this.store.getState()
    const nextValue = getNextValue(nextPosition, rect, this.options)
    if (isValidValue(nextValue, value[this.options.name], this.options)) {
      this.setValue(nextValue)
    }
  }

  public update = ({ value }: State, previousState: State) => {
    if (value[this.options.name] === previousState.value[this.options.name]) {
      return
    }
    const position = valueToPosition(value[this.options.name], this.options)
    this.elements.input.value = value[this.options.name].toString()
    this.elements.thumb.setAttribute(
      'style',
      `--range-thumb-left:${position}%;`
    )
  }

  public setValue = (nextValue: number) => {
    const currentValue = this.store.getState().value[this.options.name]
    if (isValidValue(nextValue, currentValue, this.options)) {
      this.store.dispatch(createSetValue(nextValue, this.options.name))
    }
  }

  public destroy() {
    this.removeEventListeners()
  }
}

export const createRange = (
  elements: Elements,
  options: Options,
  store: Store
) => new Range(elements, options, store)
