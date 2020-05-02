export const createElements = (name: string = 'test') => {
  const selector = document.createElement('div')
  const thumb = document.createElement('label')
  const input = document.createElement('input')
  selector.setAttribute('data-range', name)
  thumb.setAttribute('data-range-thumb', '')
  input.setAttribute('data-range-input', '')
  selector.append(thumb)
  selector.append(input)
  return selector
}

export const createRangeElement = () => {
  const root = document.createElement('div')
  const minElements = createElements('min')
  const maxElements = createElements('max')
  root.append(minElements)
  root.append(maxElements)
  return root
}
