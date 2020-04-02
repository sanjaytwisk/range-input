import { Options, Range, Init } from './Range'
import { Fill } from './Fill'
import { MockEvent } from 'index'
import { valueToPosition } from './utils'

interface DynamicValue {
  min: number
  max: number
}

export class DynamicRange {
  private rangeInstances: { min: Range; max: Range }
  private state: DynamicValue
  private fill?: Fill

  public static create(options: Options, init?: DynamicValue) {
    return new DynamicRange(options, init)
  }

  constructor(
    private options: Options,
    init: DynamicValue = { min: options.min, max: options.max }
  ) {
    this.state = init
    this.createRangeInstances(init)
    this.createFill(options.selector)
  }

  private createRangeInstances(init: DynamicValue) {
    this.rangeInstances = {
      min: Range.create(...this.getRangeValues('min', init)),
      max: Range.create(...this.getRangeValues('max', init)),
    }
  }

  private createFill(selector: string) {
    const element = document.querySelector<HTMLDivElement>(selector)
    const fillElement = element?.querySelector<HTMLDivElement>(
      '[data-range-fill]'
    )
    if (fillElement) {
      const start = valueToPosition(this.state.min, this.options)
      const end = valueToPosition(this.state.max, this.options)
      this.fill = new Fill(fillElement, { start, end })
    }
  }

  private getRangeValues = (
    type: 'min' | 'max',
    init: DynamicValue
  ): [Options, Init] => {
    return [
      {
        ...this.options,
        name: `${this.options.name}[${type}]`,
        selector: `[data-range-${type}="${this.options.name}"]`,
        onValidate: this.onValidate(type),
        onValueChange: this.onValueChange(type),
      },
      { value: init[type] },
    ]
  }

  private onValidate = (type: 'min' | 'max') => (nextValue: number) => {
    const compareToInstance =
      type === 'min' ? this.rangeInstances.max : this.rangeInstances.min
    return type === 'min'
      ? nextValue < compareToInstance.value
      : nextValue > compareToInstance.value
  }

  private onValueChange = (type: 'min' | 'max') => (evt: MockEvent<number>) => {
    const { value } = evt.target
    this.state = {
      ...this.state,
      [type]: value,
    }
    const start = valueToPosition(this.state.min, this.options)
    const end = valueToPosition(this.state.max, this.options)
    this.fill?.setState({ start, end })
  }

  public setValue(nextValue: Partial<DynamicValue>) {
    Object.entries(nextValue).forEach(([type, value]) => {
      this.rangeInstances[type].setValue(value)
    })
  }

  public get value() {
    return {
      min: this.rangeInstances.min.value,
      max: this.rangeInstances.max.value,
    }
  }
}
