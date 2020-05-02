import { Actions } from './actions'

export interface Value {
  [key: string]: number
}

export interface State {
  value: Value
  rect: { left: number; width: number }
}

export interface Action<T = any> {
  type: string
  payload?: T
}

export type Observer = (previouseState: State, nextState: State) => void

export class Store {
  private observers: Set<Observer> = new Set()

  constructor(private state: State) {}

  private reduce(state: State, action: Action) {
    switch (action.type) {
      case Actions.SET_VALUE:
        return {
          ...state,
          value: {
            ...state.value,
            [action.payload.name]: action.payload.value,
          },
        }
      case Actions.SET_RECT:
        return {
          ...state,
          rect: action.payload,
        }
      default:
        return state
    }
  }

  public dispatch = (action: Action) => {
    const nextState = this.reduce(this.state, action)
    this.observers.forEach((observer) => observer(nextState, this.state))
    this.state = nextState
  }

  public subscribe = (observer: Observer) => {
    this.observers = this.observers.add(observer)

    return () => {
      this.observers.delete(observer)
    }
  }

  public getState() {
    return this.state
  }
}
