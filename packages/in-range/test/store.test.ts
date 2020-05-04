import { createStore, reduce, Store } from '../src/store'

describe('reduce', () => {
  const initialState = {
    value: {},
    position: 0,
    isMouseDown: false,
    rect: { left: 0, width: 0 },
  }
  it('given a valid action, it should return the next state object', () => {
    const payload = { name: 'test', value: 5 }
    const result = reduce(initialState, {
      type: 'SET_VALUE',
      payload,
    })
    expect(result).toHaveProperty('value', { test: 5 })
  })

  it('given an unknown action, it should return the given state', () => {
    const result = reduce(initialState, { type: 'LOL' })
    expect(result).toEqual(initialState)
  })
})

describe('createStore', () => {
  let instance: Store
  const initialState = {
    value: {},
    position: 0,
    isMouseDown: false,
    rect: { left: 0, width: 0 },
  }
  beforeEach(() => {
    instance = createStore(initialState)
  })
  describe('getState', () => {
    it('it should return the current state object', () => {
      expect(instance.getState()).toEqual(initialState)
    })
  })

  describe('dispatch', () => {
    it('given a valid action, it should update the state', () => {
      const payload = { name: 'test', value: 5 }
      instance.dispatch({
        type: 'SET_VALUE',
        payload,
      })
      expect(instance.getState()).toHaveProperty('value', { test: 5 })
    })

    it('given a valid action, it should call all observers', () => {
      const observers = [jest.fn(), jest.fn(), jest.fn()]
      const subscriptions = observers.map(instance.subscribe)
      const payload = { name: 'name', value: 9 }
      instance.dispatch({
        type: 'SET_VALUE',
        payload,
      })
      observers.forEach((observer) => {
        expect(observer.mock.calls.length).toEqual(1)
        expect(observer.mock.calls[0][0]).toEqual({
          ...initialState,
          value: { name: 9 },
        })
        expect(observer.mock.calls[0][1]).toEqual(initialState)
      })
      subscriptions.forEach((unsubscribe) => unsubscribe())
    })

    it('given an unknown action, it should not update the state', () => {
      instance.dispatch({ type: 'Action' })
      expect(instance.getState()).toEqual(initialState)
    })
  })

  describe('subscribe', () => {
    it('given a valid observer function, it should store the observer', () => {
      const observer = jest.fn()
      instance.subscribe(observer)
      instance.dispatch({ type: 'EMPTY' })
      expect(observer.mock.calls.length).toEqual(1)
    })

    it('given a valid observer, it should return a function that removes the observers subscription', () => {
      const observer = jest.fn()
      const unsubscribe = instance.subscribe(observer)
      expect(typeof unsubscribe).toEqual('function')
      instance.dispatch({ type: 'Empty' })
      unsubscribe()
      instance.dispatch({ type: 'Empty' })
      expect(observer.mock.calls.length).toEqual(1)
    })
  })
})
