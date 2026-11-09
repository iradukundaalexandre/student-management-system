import { useCallback, useRef } from 'react'

// Prevents a handler from running repeatedly during the delay window.
export default function useThrottle(callback, delay = 1200) {
  const lastRun = useRef(0)

  return useCallback((...args) => {
    const now = Date.now()
    if (now - lastRun.current < delay) return false
    lastRun.current = now
    callback(...args)
    return true
  }, [callback, delay])
}