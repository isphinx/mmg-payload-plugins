'use client'
import React from 'react'

type DARK_MODE = 'dark' | 'light' | 'system'

export function useDarkMode() {
  const [darkMode, SetDarkMode] = React.useState<DARK_MODE>('system')

  const setLight = React.useCallback(() => {
    SetDarkMode('light')
    localStorage.setItem('darkmode', 'light')
    document.documentElement.classList.remove('dark')
  }, [])

  const setDark = React.useCallback(() => {
    SetDarkMode('dark')
    localStorage.setItem('darkmode', 'dark')
    document.documentElement.classList.add('dark')
  }, [])

  const setSystem = React.useCallback(() => {
    SetDarkMode('system')
    localStorage.removeItem('darkmode')
    if (window.matchMedia('(prefers-color-scheme: dark)').matches)
      document.documentElement.classList.add('dark')
    else document.documentElement.classList.remove('dark')
  }, [])

  React.useEffect(() => {
    if (darkMode == 'system' && navigator.cookieEnabled && localStorage.darkmode) {
      if (localStorage.darkmode == 'dark') setDark()
      else if (localStorage.darkmode == 'light') setLight()
    } else if (window.matchMedia && darkMode == 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches)
        document.documentElement.classList.add('dark')
      else document.documentElement.classList.remove('dark')

      const darkmodeHandle = (e: MediaQueryListEvent) => {
        if (e.matches) document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
      }

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', darkmodeHandle)

      return () => {
        window
          .matchMedia('(prefers-color-scheme: dark)')
          .removeEventListener('change', darkmodeHandle)
      }
    }
  }, [])

  return {
    darkMode,
    setLight,
    setDark,
    setSystem,
  }
}
