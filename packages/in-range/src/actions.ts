import { Actions } from './types'

export const createSetRect = ({ left, width }: DOMRect) => ({
  type: Actions.SET_RECT,
  payload: { left, width },
})

export const createSetValue = (nextValue: number, name: string) => ({
  type: Actions.SET_VALUE,
  payload: {
    name,
    value: nextValue,
  },
})
