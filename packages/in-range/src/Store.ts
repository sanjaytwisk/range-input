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
export interface Store {
  getState: () => State
  subscribe: (observer: Observer) => () => void
  dispatch: (action: Action) => void
}

export const reduce = (state: State, action: Action) => {
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

export const createStore = (initialState: State) => {
  let currentState = reduce(initialState, { type: 'EMPTY' })
  const observers = new Set<Observer>()

  const dispatch = (action: Action) => {
    const nextState = reduce(currentState, action)
    observers.forEach((observer) => observer(nextState, currentState))
    currentState = nextState
  }

  const subscribe = (observer: Observer) => {
    observers.add(observer)

    return () => {
      observers.delete(observer)
    }
  }

  const getState = () => currentState

  return {
    getState,
    subscribe,
    dispatch,
  }
}
