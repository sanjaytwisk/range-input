export type MockEvent<T = string> = {
  target: {
    name: string
    value: T
  }
}
