import { RangeState, Range } from './Range'
import { getElement } from './utils'
import { Fill } from './Fill'

export class Elements {
  public static create(
    selector: string | HTMLDivElement,
    rangeInstance: Range
  ) {
    const range =
      typeof selector === 'string'
        ? document.querySelector<HTMLDivElement>(selector)
        : selector
    if (!range) {
      throw new Error(`Couldn not find element ${selector}`)
    }
    const input = getElement<HTMLInputElement>(range, 'input')
    const thumb = getElement<HTMLLabelElement>(range, 'thumb')
    const fill = range.querySelector<HTMLDivElement>('[data-range-fill]')
    return new Elements(rangeInstance, range, input, thumb, fill)
  }

  private isMouseDown = false
  private fill: Fill

  constructor(
    private rangeInstane: Range,
    private range: HTMLDivElement,
    private input: HTMLInputElement,
    private thumb: HTMLLabelElement,
    fillElement: HTMLDivElement | null
  ) {
    this.addEventListeners()
    if (fillElement) {
      this.fill = new Fill(fillElement)
    }
  }

  private addEventListeners() {
    this.thumb.addEventListener('mousedown', this.onMouseDown)
    this.range.addEventListener('click', this.onClick)
    this.input.addEventListener('change', this.onInputChange)
    document.addEventListener('mouseup', this.onMouseUp)
    document.addEventListener('mousemove', this.onMouseMove)
  }

  private removeEventListeners() {
    this.thumb.removeEventListener('mousedown', this.onMouseDown)
    this.range.removeEventListener('click', this.onClick)
    this.input.removeEventListener('change', this.onInputChange)
    document.removeEventListener('mouseup', this.onMouseUp)
    document.removeEventListener('mousemove', this.onMouseMove)
  }

  private onMouseDown = () => {
    this.isMouseDown = true
  }

  private onMouseUp = () => {
    this.isMouseDown = false
  }

  private onClick = (evt: MouseEvent) => {
    const { clientX } = evt
    this.rangeInstane.setPosition(clientX)
  }

  private onMouseMove = (evt: MouseEvent) => {
    const { clientX } = evt
    if (this.isMouseDown) {
      this.rangeInstane.setPosition(clientX)
    }
  }

  private onInputChange = (evt: Event) => {
    const target = evt.target as HTMLInputElement
    if (!target) return
    const nextValue = parseFloat(target.value)
    this.rangeInstane.setValue(nextValue)
  }

  public update({ value, position }: RangeState) {
    this.input.value = value.toString()
    this.thumb.setAttribute('style', `--range-thumb-left: ${position}%`)
    if (this.fill) {
      this.fill.setState({ end: position })
    }
  }

  public destroy() {
    this.removeEventListeners()
  }

  public getRect() {
    const { left, width } = this.range.getBoundingClientRect()
    return { left, width }
  }
}
