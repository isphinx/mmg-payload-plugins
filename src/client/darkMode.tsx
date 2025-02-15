'use client'

import {
  faMoonStars,
  faSunBright,
} from '@awesome.me/kit-3425da5abb/icons/duotone/solid'
import { FontAwesomeIcon as I } from '@fortawesome/react-fontawesome'
import React from 'react'
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
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark')
    } else document.documentElement.classList.remove('dark')
  }, [])

  React.useEffect(() => {
    if (
      darkMode == 'system' && navigator.cookieEnabled && localStorage.darkmode
    ) {
      if (localStorage.darkmode == 'dark') setDark()
      else if (localStorage.darkmode == 'light') setLight()
    } else if (window.matchMedia && darkMode == 'system') {
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark')
      } else document.documentElement.classList.remove('dark')

      const darkmodeHandle = (e: MediaQueryListEvent) => {
        if (e.matches) document.documentElement.classList.add('dark')
        else document.documentElement.classList.remove('dark')
      }

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener(
        'change',
        darkmodeHandle,
      )

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
    if (darkMode == 'light') {
      return (
        <I
          icon={faSunBright}
          fixedWidth
          className='hover:text-primary text-4xl h-8'
          style={{
            '--fa-primary-color': 'hsl(var(--primary))',
            '--fa-secondary-color': 'hsl(var(--secondary))',
          } as React.CSSProperties}
        />
      )
    } else if (darkMode == 'dark') {
      return (
        <I
          icon={faMoonStars}
          fixedWidth
          className='hover:text-primary text-4xl h-8'
          style={{
            '--fa-primary-color': 'hsl(var(--primary))',
            '--fa-secondary-color': 'hsl(var(--secondary))',
          } as React.CSSProperties}
        />
      )
    } else if (
      typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return (
        <I
          icon={faMoonStars}
          fixedWidth
          className='hover:text-primary text-4xl h-8'
        />
      )
    } else {return (
        <I
          icon={faSunBright}
          fixedWidth
          className='hover:text-primary text-4xl h-8'
        />
      )}
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label='dark-mode-toggle'
        className='px-4 z-40 border-r outline-none'
      >
        {renderIcon()}
      </DropdownMenuTrigger>
      <DropdownMenuContent className=''>
        <DropdownMenuItem onClick={() => setLight()}>Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setDark()}>Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSystem()}>System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
