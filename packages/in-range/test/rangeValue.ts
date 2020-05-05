import { RangeValue, rangeValue } from '../lib'
import { createElements } from './helpers/helpers'

describe('rangeValue', () => {
  let instance: RangeValue
  let onValueChange = jest.fn()
  let onValidate = jest.fn()
  const initialValue = 5
  const options = {
    name: 'test',
    min: 0,
    max: 10,
    step: 1,
  }
  beforeEach(() => {
    onValueChange = jest.fn()
    onValidate = jest.fn(() => true)
    const selector = createElements()

    instance = rangeValue(
      { ...options, selector, onValueChange, onValidate },
      initialValue
    )
  })

  describe('getValue', () => {
    it('given a initial value, it should return the initial value', () => {
      expect(instance.getValue()).toEqual(initialValue)
    })

    it('given no initial value, it should return the min value', () => {
      instance = rangeValue({
        ...options,
        selector: createElements(),
      })
      expect(instance.getValue()).toEqual(options.min)
    })
  })

  describe('setValue', () => {
    it('given a valid value, it should set the value state', () => {
      instance.setValue(10)
      expect(instance.getValue()).toEqual(10)
    })

    it('given an invalid value, it should not update the state', () => {
      instance.setValue(100)
      expect(instance.getValue()).toEqual(initialValue)
    })

    it('given a valid value and onChange callback, it should call the callback with the new value', () => {
      instance.setValue(4)
      expect(onValueChange.mock.calls.length).toEqual(1)
    })

    it('given any value and a valid onValidate callback, it should invoke the callback once', () => {
      instance.setValue(1000)
      instance.setValue(2)
      instance.setValue(-5)
      expect(onValidate.mock.calls.length).toEqual(3)
    })

    it('given the value is not a number, it should not throw', () => {
      expect(() => instance.setValue('test' as any)).not.toThrow()
      expect(() => instance.setValue(undefined as any)).not.toThrow()
      expect(() => instance.setValue(null as any)).not.toThrow()
      expect(() => instance.setValue(true as any)).not.toThrow()
    })

    it('given the value is not a number, it should not update the state', () => {
      instance.setValue('test' as any)
      instance.setValue(undefined as any)
      instance.setValue(null as any)
      instance.setValue(true as any)
      expect(instance.getValue()).toEqual(initialValue)
    })
  })

  describe('destroy', () => {
    it('should not throw', () => {
      expect(() => instance.destroy()).not.toThrow()
    })
  })
})
