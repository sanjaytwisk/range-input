import {
  getElement,
  isValidValue,
  validateValue,
  positionToValue,
  valueToPosition,
  getRootElement,
  getElements,
} from '../src/utils'

describe('utils', () => {
  describe('getElement()', () => {
    const root = document.createElement('div')
    const element = document.createElement('div')
    element.setAttribute('data-range-fill', '')
    root.append(element)
    it('should return a range input element given a element type', () => {
      const result = getElement(root, '[data-range-fill]')
      expect(result).toBeInstanceOf(HTMLDivElement)
    })

    it('should throw an error if the element is not found', () => {
      expect(() => getElement(root, 'test')).toThrow()
      expect(() => getElement(root, '')).toThrow()
    })
  })

  describe('getRootElement()', () => {
    const element = document.createElement('div')
    element.setAttribute('data-range', '')
    document.body.append(element)
    it('should return a element given a element selector', () => {
      const result = getRootElement('[data-range]')
      expect(result).toBeInstanceOf(HTMLDivElement)
    })

    it('should return a element given a element', () => {
      const result = getRootElement(element)
      expect(result).toBeInstanceOf(HTMLDivElement)
    })

    it('should throw an error if the element is not found', () => {
      expect(() => getRootElement('.test')).toThrow()
    })
  })

  describe('getElements', () => {
    let element: HTMLElement
    let thumb: HTMLElement
    let input: HTMLElement
    beforeEach(() => {
      element = document.createElement('div')
      element.setAttribute('data-range', '')
      thumb = document.createElement('label')
      input = document.createElement('input')
      thumb.setAttribute('data-range-thumb', '')
      input.setAttribute('data-range-input', '')
      element.append(thumb)
      element.append(input)
      document.body.innerHTML = ''
      document.body.append(element)
    })
    it('given a root element and all required elements exist in the DOM, it should return an object of elements', () => {
      const result = getElements(element)
      expect(result).toHaveProperty('root', element)
      expect(result).toHaveProperty('thumb', thumb)
      expect(result).toHaveProperty('input', input)
      expect(result).toHaveProperty('fill', null)
    })

    it('given a valid element selector and all required elements exist in the DOM, it should return an object of elements', () => {
      const result = getElements('[data-range]')
      expect(result).toHaveProperty('root', element)
      expect(result).toHaveProperty('thumb', thumb)
      expect(result).toHaveProperty('input', input)
      expect(result).toHaveProperty('fill', null)
    })

    it('given the fill element exists in the DOM, it should return the fill element', () => {
      const fill = document.createElement('div')
      fill.setAttribute('data-range-fill', '')
      element.append(fill)
      const result = getElements(element)
      expect(result).toHaveProperty('fill', fill)
    })

    it('given the root element cannot be found, it should throw an error', () => {
      expect(() => getElements('.test')).toThrow()
    })

    it('given any of the required elements cannot be found, it should throw an error', () => {
      element.removeChild(input)
      expect(() => getElements(element)).toThrow()
    })
  })

  describe('validateValue()', () => {
    it('should return true if the given value is the same or between the given bounds', () => {
      const values = [1, 3, 8, 16]
      const bounds = { name: 'test', min: 1, max: 20, step: 1 }
      values.forEach((value) =>
        expect(validateValue(value, bounds)).toEqual(true)
      )
    })

    it('should return false if the given value is outside the given bounds', () => {
      const values = [-40, -4, 100, 11]
      const bounds = { name: 'test', min: 0, max: 10, step: 1 }
      values.forEach((value) =>
        expect(validateValue(value, bounds)).toEqual(false)
      )
    })

    it('should call the given validation method if provided', () => {
      const value = 4
      const onValidate = jest.fn(() => false)
      const bounds = { name: 'test', min: 0, max: 5, step: 1, onValidate }
      expect(validateValue(value, bounds)).toEqual(false)
      expect(onValidate.mock.calls.length).toEqual(1)
    })
  })

  describe('isValidValue()', () => {
    const options = {
      name: 'test',
      min: 0,
      max: 10,
      step: 2,
    }
    it('should return false if the given value is the same as the current value', () => {
      const value = 6
      const currentValue = 6
      expect(isValidValue(value, currentValue, options)).toEqual(false)
    })

    it('should return false if the given value is not dividable by the step size', () => {
      const values = [3, 5, 7]
      const currentValue = 4
      values.forEach((value) =>
        expect(isValidValue(value, currentValue, options)).toEqual(false)
      )
    })

    it('should return true for all other cases', () => {
      const values = [0, 2, 4, 6, 8]
      const currentValue = 10
      values.forEach((value) =>
        expect(isValidValue(value, currentValue, options)).toEqual(true)
      )
    })

    it('should work with a step size smaller than 1', () => {
      const values = [1.1, 5.7, 8.4]
      const invalidValue = 5.5
      const currentValue = 5.5
      const localOptions = { ...options, step: 0.1 }
      values.forEach((value) =>
        expect(isValidValue(value, currentValue, localOptions)).toEqual(true)
      )
      expect(isValidValue(invalidValue, currentValue, localOptions)).toEqual(
        false
      )
    })
  })

  describe('positionToValue()', () => {
    const width = 400

    const bounds = {
      min: 0,
      max: 20,
      step: 1,
    }

    it('should return a value based on a given position, width and bounds', () => {
      const positions = [100, 200, 330, 340, 350, 400]
      const outcomes = [5, 10, 17, 17, 18, 20]
      positions.forEach((position, index) =>
        expect(positionToValue(position, width, bounds)).toEqual(
          outcomes[index]
        )
      )
    })

    it('should return the given min value for negative positions', () => {
      const positions = [-10, -20, -100]
      const outcome = 0
      positions.forEach((position) =>
        expect(positionToValue(position, width, bounds)).toEqual(outcome)
      )
    })

    it('should round to 0.1 if the step size is smaller than 1', () => {
      const localWidth = 100
      const localBounds = {
        min: 0,
        max: 10,
        step: 0.1,
      }
      const positions = [0, 5, 18, 57, 87]
      const outcomes = [0.0, 0.5, 1.8, 5.7, 8.7]
      positions.forEach((position, index) =>
        expect(positionToValue(position, localWidth, localBounds)).toEqual(
          outcomes[index]
        )
      )
    })
  })

  describe('valueToPosition', () => {
    const bounds = {
      min: -5,
      max: 5,
      step: 1,
    }
    it('should return the given value as a percentage of the bounds', () => {
      const values = [-4, 0, 2]
      const outcomes = [10, 50, 70]
      values.forEach((value, index) =>
        expect(valueToPosition(value, bounds)).toEqual(outcomes[index])
      )
    })
  })
})
