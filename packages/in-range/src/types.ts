export interface Bounds {
  min: number
  max: number
  step: number
}

export interface Options extends Bounds {
  onValidate?: Validator
}

export interface RangeOptions extends Options {
  name: string
}

export interface RangeValueOptions extends Options {
  selector: string | HTMLElement
  onValueChange?: (evt: MockEvent<number>) => void
}

export interface RangeMinMaxOptions extends Options {
  selector: string | HTMLElement
  onValueChange?: (evt: MockEvent<Value>) => void
}

export interface Range {
  setValue: SetFn
  update: (state: State, prevState: State) => void
  destroy: () => void
}

export interface RangeValue {
  getValue: () => number
  setValue: (nextValue: number) => void
  destroy: () => void
}

export interface RangeMinMax {
  getValue: () => ValueMinMax
  setValue: (nextValue: number, name: Name) => void
  destroy: () => void
}

export interface Fill {
  update: Observer
}

export interface Value {
  [key: string]: number
}

export interface ValueMinMax {
  min: number
  max: number
}

export interface State {
  value: Value
  rect: { left: number; width: number }
}

export interface Action<T = any> {
  type: string
  payload?: T
}

export enum Actions {
  SET_RECT = 'SET_RECT',
  SET_VALUE = 'SET_VALUE',
}

export type Observer = (previouseState: State, nextState: State) => void

export interface Store {
  getState: () => State
  subscribe: (observer: Observer) => () => void
  dispatch: (action: Action) => void
}

export type SetFn = (value: number) => void

export type Name = 'min' | 'max'

export interface Rect {
  left: number
  width: number
}

export interface Ref<T> {
  current: T
}

export type Validator = (value?: number) => boolean

export type MockEvent<T = string> = {
  target: {
    name: string
    value: T
  }
}
export interface Elements {
  root: HTMLElement
  input: HTMLInputElement
  thumb: HTMLLabelElement
}
