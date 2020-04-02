export const withJS = () => {
  if (!document.documentElement.hasAttribute('data-has-js')) {
    document.documentElement.setAttribute('data-has-js', '')
  }
}

export const detectInputDevice = () => {
  if (typeof window === 'undefined') return
  const handlers = {
    firstTab: (evt: KeyboardEvent) => {
      if (evt.keyCode === 9) {
        document.documentElement.setAttribute('data-input-keyboard', '')
        document.documentElement.removeAttribute('data-input-mouse')

        window.removeEventListener('keydown', handlers.firstTab)
        window.addEventListener('mousedown', handlers.mouseDown)
      }
    },
    mouseDown: () => {
      document.documentElement.setAttribute('data-input-mouse', '')
      document.documentElement.removeAttribute('data-input-keyboard')

      window.removeEventListener('mousedown', handlers.mouseDown)
      window.addEventListener('keydown', handlers.firstTab)
    },
  }

  window.addEventListener('keydown', handlers.firstTab)
}
