import { useEffect } from 'react'

// Custom hook: Ctrl/Cmd + K focuses search; Escape closes the details view.
export default function useKeyboardShortcuts({ onSearch, onEscape }) {
  useEffect(() => {
    function handleKeyDown(event) {
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)

      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        onSearch?.()
      }

      if (event.key === 'Escape') {
        onEscape?.()
        if (isTyping) event.target.blur()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onSearch, onEscape])
}