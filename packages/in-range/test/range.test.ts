import { createRange } from '../src/range'
import { createStore } from '../src/store'
import { Range, Actions } from '../src/types'

jest.mock('../src/store')

const getEventName = ([name]: [string]) => name

const createElements = () => ({
  root: document.createElement('div'),
  thumb: document.createElement('label'),
  input: document.createElement('input'),
})

const EVENTS = {
  ROOT: ['click'].sort(),
  THUMB: ['mousedown', 'touchend', 'touchstart', 'touchmove'].sort(),
  INPUT: ['change'].sort(),
}

describe('Range', () => {
  let instance: Range
  let elements: any
  const options = {
    name: 'test',
    min: 0,
    max: 10,
    step: 1,
  }
  const initialState = {
    value: { test: 0 },
    rect: { left: 0, width: 0 },
  }

  describe('constructor', () => {
    let store = createStore(initialState)
    beforeEach(() => {
      elements = createElements()
      elements.root.addEventListener = jest.fn()
      elements.thumb.addEventListener = jest.fn()
      elements.input.addEventListener = jest.fn()

      store = createStore(initialState)
      instance = createRange(elements, options, store)
    })
    it('given valid elements, options and store, it should add the correct event listeners to the elements', () => {
      const { root, thumb, input } = elements
      const rootEvents = root.addEventListener.mock.calls
        .map(getEventName)
        .sort()
      const thumbEvents = thumb.addEventListener.mock.calls
        .map(getEventName)
        .sort()
      const inputEvents = input.addEventListener.mock.calls
        .map(getEventName)
        .sort()
      expect(rootEvents).toEqual(EVENTS.ROOT)
      expect(inputEvents).toEqual(EVENTS.INPUT)
      expect(thumbEvents.sort()).toEqual(EVENTS.THUMB)
    })

    it('given valid elements, options and store, it should dispatch a setRect action', () => {
      const dispatchMock = store.dispatch as jest.Mock
      expect(dispatchMock.mock.calls.length).toEqual(1)
      expect(dispatchMock.mock.calls[0][0]).toEqual({
        type: Actions.SET_RECT,
        payload: { left: 0, width: 0 },
      })
    })
  })

  describe('update', () => {
    beforeEach(() => {
      elements = createElements()
      instance = createRange(elements, options, createStore(initialState))
    })
    it('given two valid state objects that contain different values, it should update the thumb and input elements', () => {
      const { input, thumb } = elements
      instance.update(
        { value: { test: 1 }, rect: { left: 0, width: 100 } },
        initialState
      )
      expect(input.value).toEqual('1')
      expect(thumb.getAttribute('style')).toEqual('--range-thumb-left:10%;')
    })

    it('given two valid state objects that contain the same values, it should do nothing', () => {
      const { input, thumb } = elements
      thumb.setAttribute = jest.fn()
      instance.update(
        { value: { test: 0 }, rect: { left: 0, width: 100 } },
        initialState
      )
      expect(input.value).toEqual('')
      expect(thumb.setAttribute.mock.calls.length).toEqual(0)
    })
  })

  describe('destroy', () => {
    beforeEach(() => {
      elements = createElements()
      elements.root.removeEventListener = jest.fn()
      elements.thumb.removeEventListener = jest.fn()
      elements.input.removeEventListener = jest.fn()
      instance = createRange(elements, options, createStore(initialState))
    })

    it('should call the correct removeEventListener on the elements', () => {
      const { root, thumb, input } = elements
      instance.destroy()
      const rootEvents = root.removeEventListener.mock.calls
        .map(getEventName)
        .sort()
      const thumbEvents = thumb.removeEventListener.mock.calls
        .map(getEventName)
        .sort()
      const inputEvents = input.removeEventListener.mock.calls
        .map(getEventName)
        .sort()
      expect(rootEvents).toEqual(EVENTS.ROOT)
      expect(inputEvents).toEqual(EVENTS.INPUT)
      expect(thumbEvents.sort()).toEqual(EVENTS.THUMB)
    })
  })
})
