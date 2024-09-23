'use client'

import React from 'react'
import { Toaster as Sonner } from 'sonner'
import { useDarkMode } from '../darkMode'

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { darkMode } = useDarkMode()
  const [position, setPosition] = React.useState<ToasterProps['position']>(
    'top-right',
  )

  React.useEffect(() => {
    if (window.innerWidth >= 768) setPosition('bottom-right')
  }, [position])

  return (
    <Sonner
      position={position}
      richColors={true}
      theme={darkMode}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
