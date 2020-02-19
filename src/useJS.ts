import * as React from 'react'

export const useJS = () => {
  React.useEffect(() => {
    if (!document.documentElement.classList.contains('has-js')) {
      document.documentElement.classList.add('has-js')
    }
  }, [])
}
