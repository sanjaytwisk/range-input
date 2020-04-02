interface FillState {
  start: number
  end: number
}
export class Fill {
  private state: FillState
  constructor(
    private element: HTMLDivElement,
    init: FillState = { start: 0, end: 0 }
  ) {
    this.state = init
    this.update(this.state)
  }

  private update({ start, end }: FillState) {
    this.element.setAttribute(
      'style',
      `width: ${end - start}%; left: ${start}%`
    )
  }

  public setState(nextState: Partial<FillState>) {
    this.state = {
      ...this.state,
      ...nextState,
    }
    this.update(this.state)
  }
}
