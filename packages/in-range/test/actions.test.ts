import { createSetRect, createSetValue } from '../src/actions'

describe('actions', () => {
  describe('createSetRect', () => {
    it('given a valid value, it should return a action with a paload containing left and width keys', () => {
      expect(
        createSetRect({
          top: 0,
          left: 10,
          bottom: 10,
          right: 20,
          width: 100,
          height: 100,
          x: 0,
          y: 0,
          toJSON: jest.fn(),
        })
      ).toHaveProperty('payload', { left: 10, width: 100 })
    })
  })

  describe('createSetValue', () => {
    it('given a valid value and name, it should return a action with a payload containing the value and name', () => {
      expect(createSetValue(10, 'min')).toHaveProperty('payload', {
        name: 'min',
        value: 10,
      })
    })
  })
})
