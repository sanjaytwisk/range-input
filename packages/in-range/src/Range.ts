import { valueToPosition, getNextValue, isValidValue, Validator } from './utils'
import { Elements } from './Elements'

export type MockEvent<T = string> = {
  target: {
    name: string
    value: T
  }
}

export interface Init {
  value?: number
}

export interface Options {
  selector: string
  name: string
  min: number
  max: number
  step: number
  onValidate?: Validator
  onValueChange?: (evt: MockEvent<number>) => void
}

export interface RangeState {
  value: number
  position: number
}

export class Range {
  private elements: Elements
  private state: RangeState

  public static create(options: Options, init: Init = {}) {
    return new Range(options, init)
  }

  constructor(private options: Options, init: Init = {}) {
    this.elements = Elements.create(options.selector, this)
    this.update(init.value || options.min, this.options)
  }

  private getNextState = (nextValue: number, options: Options): RangeState => ({
    value: nextValue,
    position: valueToPosition(nextValue, options),
  })

  private setState = (nextState: RangeState) => {
    this.state = nextState
  }

  private update(value: number, options: Options) {
    const nextState = this.getNextState(value, options)
    this.elements.update(nextState)
    this.setState(nextState)
    if (this.options.onValueChange) {
      this.options.onValueChange({ target: { name: options.name, value } })
    }
  }

  public setValue(nextValue: number) {
    if (isValidValue(nextValue, this.state.value, this.options)) {
      this.update(nextValue, this.options)
    } else {
      this.elements.update(this.state)
    }
  }

  public setPosition(nextPosition: number) {
    const nextValue = getNextValue(
      nextPosition,
      this.elements.rect,
      this.options
    )
    if (isValidValue(nextValue, this.state.value, this.options)) {
      this.setValue(nextValue)
    }
  }

  public destroy() {
    this.elements.destroy()
  }

  public get value() {
    return this.state.value
  }
}
