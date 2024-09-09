'use client'

import React from 'react'
import { FontAwesomeIcon as I } from '@fortawesome/react-fontawesome'
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

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

export function DarkMode() {
  const { darkMode, setLight, setDark, setSystem } = useDarkMode()

  function renderIcon() {
    if (darkMode == 'light') return <I icon={faSun} fixedWidth className="text-h1 text-4xl h-8" />
    else if (darkMode == 'dark')
      return <I icon={faMoon} fixedWidth className="text-h1 text-4xl h-8" />
    else if (
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
      return <I icon={faMoon} fixedWidth className="text-h1 text-4xl h-8" />
    else return <I icon={faSun} fixedWidth className="text-h1 text-4xl h-8" />
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="px-4 z-40 border-r outline-none">{renderIcon()}</button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="">
        <DropdownMenuItem onClick={() => setLight()}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDark()}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSystem()}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
