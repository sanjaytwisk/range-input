import { Fill, createFill } from '../src/fill'

const getState = (value: { [key: string]: number }) => {
  return {
    value,
    rect: { left: 0, width: 100 },
  }
}

describe('fill', () => {
  let instance: Fill
  const initialStyle = 'width:20%;left:30%;'
  let element: HTMLDivElement
  beforeEach(() => {
    element = document.createElement('div')
    element.setAttribute('style', initialStyle)
    instance = createFill(element, {
      min: 0,
      max: 10,
      step: 1,
    })
  })
  describe('createFill', () => {
    it('given the provided element valid or invalid, it should return a empty update function', () => {
      const values = [null, element]
      values.forEach((value) => {
        const localInstance = createFill(null, { min: 0, max: 10, step: 1 })
        expect(typeof localInstance.update).toEqual('function')
      })
    })
  })
  describe('update', () => {
    it('given two state obects containing a single value, it should update the element attributes if the values on the state objects differ', () => {
      const state = getState({ test: 0 })
      const prevState = getState({ test: 1 })
      instance.update(state, prevState)
      expect(element.getAttribute('style')).toEqual('width:0%;left:0%;')
    })
    it('given two state obects containing a min/max value, it should update the element style attribute if the values on the state objects differ', () => {
      const state = getState({ min: 0, max: 10 })
      const prevState = getState({ min: 1, max: 8 })
      instance.update(state, prevState)
      expect(element.getAttribute('style')).toEqual('width:100%;left:0%;')
    })
    it('given two state objects containing the same value, it should not update the element style attribute', () => {
      const state = getState({ test: 1 })
      const prevState = { ...state }
      instance.update(state, prevState)
      expect(element.getAttribute('style')).toEqual(initialStyle)
    })
  })
})
