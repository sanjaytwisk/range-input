import { Ref } from './utils'
import { SetFn } from './range'

export const createOnMouseDown = (mouseDownRef: Ref<boolean>) => () => {
  mouseDownRef.current = true
}

export const createOnMouseUp = (mouseDownRef: Ref<boolean>) => () => {
  mouseDownRef.current = false
}

export const createOnClick = (setPosition: SetFn) => (evt: MouseEvent) => {
  const { clientX } = evt
  setPosition(clientX)
}

export const createOnMouseMove = (
  mouseDownRef: Ref<boolean>,
  setPosition: SetFn
) => (evt: MouseEvent) => {
  const { clientX } = evt
  if (mouseDownRef.current) {
    setPosition(clientX)
  }
}

export const createOnTouchMove = (
  mouseDownRef: Ref<boolean>,
  setPosition: SetFn
) => (evt: TouchEvent) => {
  const { clientX } = evt.targetTouches[0]
  if (mouseDownRef.current) {
    setPosition(clientX)
  }
}

export const createOnInputChange = (setValue: SetFn) => (evt: Event) => {
  const target = evt.target as HTMLInputElement
  if (!target) return
  setValue(parseFloat(target.value))
}

export const createOnResize = (
  timeoutRef: Ref<number>,
  setRect: () => void
) => () => {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current)
  }
  timeoutRef.current = window.setTimeout(setRect, 400)
}
