import { useEffect } from 'react'

export const useJS = () => {
  useEffect(() => {
    if (!document.documentElement.classList.contains('has-js')) {
      document.documentElement.classList.add('has-js')
    }
  }, [])
}
