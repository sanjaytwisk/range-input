import { useEffect } from 'react'
import { withJS } from '@twisk/range-input'

export const useJS = () => {
  useEffect(withJS, [])
}
