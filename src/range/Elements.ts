import { RangeState, Range } from './Range'
import { getElement, Rect } from './utils'
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

  private fill: Fill
  private timeout = 0
  private state: { rect: Rect; isMouseDown: boolean } = {
    rect: { left: 0, width: 0 },
    isMouseDown: false,
  }

  constructor(
    private rangeInstane: Range,
    private range: HTMLDivElement,
    private input: HTMLInputElement,
    private thumb: HTMLLabelElement,
    fillElement: HTMLDivElement | null
  ) {
    this.addEventListeners()
    this.setRect()
    if (fillElement) {
      this.fill = new Fill(fillElement)
    }
  }

  private addEventListeners() {
    this.thumb.addEventListener('mousedown', this.onMouseDown)
    this.thumb.addEventListener('touchstart', this.onMouseDown)
    this.thumb.addEventListener('touchend', this.onMouseUp)
    this.thumb.addEventListener('touchmove', this.onTouchMove)
    this.range.addEventListener('click', this.onClick)
    this.input.addEventListener('change', this.onInputChange)
    document.addEventListener('mouseup', this.onMouseUp)
    document.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('resize', this.onResize)
  }

  private removeEventListeners() {
    this.thumb.removeEventListener('mousedown', this.onMouseDown)
    this.thumb.removeEventListener('touchstart', this.onMouseDown)
    this.thumb.removeEventListener('touchend', this.onMouseUp)
    this.thumb.removeEventListener('touchmove', this.onTouchMove)
    this.range.removeEventListener('click', this.onClick)
    this.input.removeEventListener('change', this.onInputChange)
    document.removeEventListener('mouseup', this.onMouseUp)
    document.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('resize', this.onResize)
  }

  private onMouseDown = () => {
    this.state.isMouseDown = true
  }

  private onMouseUp = () => {
    this.state.isMouseDown = false
  }

  private onClick = (evt: MouseEvent) => {
    const { clientX } = evt
    this.rangeInstane.setPosition(clientX)
  }

  private onMouseMove = (evt: MouseEvent) => {
    const { clientX } = evt
    if (this.state.isMouseDown) {
      this.rangeInstane.setPosition(clientX)
    }
  }

  private onTouchMove = (evt: TouchEvent) => {
    const { clientX } = evt.targetTouches[0]
    if (this.state.isMouseDown) {
      this.rangeInstane.setPosition(clientX)
    }
  }

  private onInputChange = (evt: Event) => {
    const target = evt.target as HTMLInputElement
    if (!target) return
    const nextValue = parseFloat(target.value)
    this.rangeInstane.setValue(nextValue)
  }

  private onResize = () => {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = window.setTimeout(this.setRect, 400)
  }

  private setRect = () => {
    const { left, width } = this.range.getBoundingClientRect()
    this.state.rect = { left, width }
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

  public get rect() {
    return this.state.rect
  }
}
