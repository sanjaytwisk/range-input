import { useEffect } from 'react'
import { withJS } from '@twisk/in-range'

export const useJS = () => {
  useEffect(withJS, [])
}
