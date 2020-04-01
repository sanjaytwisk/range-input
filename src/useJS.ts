import { useEffect } from 'react'
import { withJS } from './utils'

export const useJS = () => {
  useEffect(withJS, [])
}
