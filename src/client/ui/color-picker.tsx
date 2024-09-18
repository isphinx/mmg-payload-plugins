'use client'

import { Paintbrush } from 'lucide-react'
import React from 'react'
import { cn } from '../../util/cn'
import { Button } from './button'
import { Input } from './input'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

export function GradientPicker({
  background,
  setBackground,
  className,
}: {
  background: string
  setBackground: (background: string) => void
  className?: string
}) {
  const solids = [
    '#E2E2E2',
    '#ff75c3',
    '#ffa647',
    '#ffe83f',
    '#9fff5b',
    '#70e2ff',
    '#cd93ff',
    '#09203f',
  ]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[220px] justify-start text-left font-normal',
            !background && 'text-muted-foreground',
            className,
          )}
        >
          <div className='flex w-full items-center gap-2'>
            {background
              ? (
                <div
                  className='h-4 w-4 rounded transition-all'
                  style={{ background }}
                >
                </div>
              )
              : <Paintbrush className='h-4 w-4' />}
            <div className='flex-1 truncate'>
              {background ? background : 'Pick a color'}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-64'>
        <div className='inline-flex space-x-1'>
          {solids.map((s) => (
            <div
              key={s}
              style={{ background: s }}
              className='h-6 w-6 cursor-pointer rounded-md active:scale-105'
              onClick={() => setBackground(s)}
            />
          ))}
        </div>

        <Input
          id='custom'
          value={background}
          className='col-span-2 mt-4 h-8'
          onChange={(e) => setBackground(e.currentTarget.value)}
        />
      </PopoverContent>
    </Popover>
  )
}
