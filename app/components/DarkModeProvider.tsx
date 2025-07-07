'use client'

import { useEffect } from 'react'

export default function DarkModeProvider() {
  useEffect(() => {
    // Check if the user prefers dark mode
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches

    // Apply dark mode class to html element if user prefers dark mode
    if (prefersDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    // Listen for changes in color scheme preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }

    mediaQuery.addEventListener('change', handleChange)

    // Clean up event listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [])

  return null
}
