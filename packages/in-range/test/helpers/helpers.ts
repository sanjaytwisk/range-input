export const createElements = (name: string = 'test') => {
  const selector = document.createElement('div')
  const thumb = document.createElement('label')
  const input = document.createElement('input')
  selector.setAttribute('data-in-range-name', name)
  selector.setAttribute('data-in-range', 'value')
  thumb.setAttribute('data-in-range-thumb', '')
  input.setAttribute('data-in-range-input', '')
  selector.append(thumb)
  selector.append(input)
  return selector
}

export const createRangeElement = (name: string = 'test') => {
  const root = document.createElement('div')
  const minElements = createElements('min')
  const maxElements = createElements('max')
  root.setAttribute('data-in-range', 'minmax')
  root.setAttribute('data-in-range-name', name)
  root.append(minElements)
  root.append(maxElements)
  return root
}
