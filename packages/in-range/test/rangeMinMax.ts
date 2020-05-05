import { rangeMinMax, RangeMinMaxOptions, RangeMinMax } from '../lib'
import { createRangeElement } from './helpers/helpers'

describe('rangeMinMax', () => {
  const initialValue = { min: 3, max: 9 }
  let instance: RangeMinMax
  let options: RangeMinMaxOptions = {
    selector: createRangeElement(),
    name: 'test',
    min: 0,
    max: 10,
    step: 1,
  }

  beforeEach(() => {
    options = {
      ...options,
      selector: createRangeElement(),
    }
    instance = rangeMinMax(options, initialValue)
  })

  describe('getValue', () => {
    it('given no initial value was set, it should return the min and max values', () => {
      instance = rangeMinMax(options)
      expect(instance.getValue()).toEqual({
        min: options.min,
        max: options.max,
      })
    })

    it('given an initial value was set, ti should return the initial value', () => {
      expect(instance.getValue()).toEqual(initialValue)
    })

    it('given a partial initial value was set, it should merge the intial value with the min/max values', () => {
      instance = rangeMinMax(options, { min: 3 })
      expect(instance.getValue()).toEqual({ min: 3, max: options.max })
    })
  })

  describe('setValue', () => {
    it('given the value and name are valid, it should update the correct value', () => {
      instance.setValue(5, 'min')
      expect(instance.getValue()).toHaveProperty('min', 5)
    })

    it('given the value is valid but the name is not, it should not update the value', () => {
      instance.setValue(4, undefined as any)
      instance.setValue(4, null as any)
      instance.setValue(4, 'test' as any)
      expect(instance.getValue()).toEqual(initialValue)
    })

    it('given the value is invalid, it should not update the value', () => {
      instance.setValue(undefined as any, 'min')
      instance.setValue(null as any, 'min')
      instance.setValue('test' as any, 'min')
      instance.setValue(NaN as any, 'min')
      instance.setValue(100, 'min') /* out of the min max range */
      instance.setValue(9, 'min') /* same as initial max value */
      instance.setValue(3, 'max') /* same as initial min value */
      expect(instance.getValue()).toEqual(initialValue)
    })
  })

  describe('destroy', () => {
    it('should not throw', () => {
      expect(() => instance.destroy()).not.toThrow()
    })
  })
})
