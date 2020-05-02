import { Fill } from '../src/Fill'

const getState = (value: { [key: string]: number }) => {
  return {
    value,
    rect: { left: 0, width: 100 },
  }
}

describe('Fill', () => {
  let instance: Fill<HTMLDivElement>
  const initialStyle = 'width:20%;left:30%;'
  beforeEach(() => {
    const element = document.createElement('div')
    element.setAttribute('style', initialStyle)
    instance = new Fill(element, {
      min: 0,
      max: 10,
      step: 1,
    })
  })
  describe('update', () => {
    it('given two state obects containing a single value, it should update the element attributes if the values on the state objects differ', () => {
      const state = getState({ test: 0 })
      const prevState = getState({ test: 1 })
      instance.update(state, prevState)
      expect(instance['element'].getAttribute('style')).toEqual(
        'width:0%;left:0%;'
      )
    })
    it('given two state obects containing a min/max value, it should update the element style attribute if the values on the state objects differ', () => {
      const state = getState({ min: 0, max: 10 })
      const prevState = getState({ min: 1, max: 8 })
      instance.update(state, prevState)
      expect(instance['element'].getAttribute('style')).toEqual(
        'width:100%;left:0%;'
      )
    })
    it('given two state objects containing the same value, it should not update the element style attribute', () => {
      const state = getState({ test: 1 })
      const prevState = { ...state }
      instance.update(state, prevState)
      expect(instance['element'].getAttribute('style')).toEqual(initialStyle)
    })
  })
})
