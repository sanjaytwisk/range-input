import {
  valueToPosition,
  Rect,
  getNextValue,
  isValidValue,
  Validator,
} from './utils'
import { Elements } from './Elements'
import { MockEvent } from 'index'

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
  private rect: Rect

  public static create(options: Options, init: Init = {}) {
    return new Range(options, init)
  }

  constructor(private options: Options, init: Init = {}) {
    this.elements = Elements.create(options.selector, this)
    this.rect = this.elements.getRect()
    this.update(init.value || options.min, this.options)
  }

  private getState = (nextValue: number, options: Options): RangeState => {
    const value = nextValue
    const position = valueToPosition(value, options)
    return { value, position }
  }

  private update(value: number, options: Options) {
    this.state = this.getState(value, options)
    this.elements.update(this.state)
    if (this.options.onValueChange) {
      this.options.onValueChange({ target: { name: options.name, value } })
    }
  }

  public setValue(nextValue: number) {
    if (isValidValue(nextValue, this.state.value, this.options)) {
      this.update(nextValue, this.options)
    }
  }

  public setPosition(nextPosition: number) {
    const nextValue = getNextValue(nextPosition, this.rect, this.options)
    if (isValidValue(nextValue, this.state.value, this.options)) {
      this.setValue(nextValue)
    }
  }

  public get value() {
    return this.state.value
  }
}
