'use client'
import * as React from 'react'

import { cn } from '../../util/cn'
import { useFormField } from './form'
import { Input } from './input'
import { Label } from './label'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>
{}

function FloatingInput(
  { className, ...props }: InputProps,
) {
  return (
    <Input
      placeholder=' '
      className={cn('peer', className)}
      {...props}
    />
  )
}

FloatingInput.displayName = 'FloatingInput'

function FloatingLabel(
  { className, ...props }: React.ComponentProps<typeof Label>,
) {
  return (
    <Label
      className={cn(
        'peer-focus:secondary peer-focus:dark:secondary absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-background px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 dark:bg-background rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4',
        className,
      )}
      {...props}
    />
  )
}
FloatingLabel.displayName = 'FloatingLabel'

type FloatingLabelInputProps = InputProps & { label?: string }

function FloatingLabelInput(
  { id, label, className, children, ...props }: FloatingLabelInputProps,
) {
  const { error } = useFormField()
  // const body = error ? String(error?.message) : children

  return (
    <div className='relative'>
      <FloatingInput id={id} {...props} />
      <FloatingLabel
        className={cn(error && 'text-destructive', className)}
        htmlFor={id}
      >
        {label}
      </FloatingLabel>
    </div>
  )
}
FloatingLabelInput.displayName = 'FloatingLabelInput'

function FloatingLabelInputRsc(
  { id, label, children, ...props }: FloatingLabelInputProps,
) {
  return (
    <div className='relative'>
      <FloatingInput id={id} {...props} />
      <FloatingLabel htmlFor={id}>
        {label}
      </FloatingLabel>
    </div>
  )
}
FloatingLabelInput.displayName = 'FloatingLabelInputRsc'

export {
  FloatingInput,
  FloatingLabel,
  FloatingLabelInput,
  FloatingLabelInputRsc,
}
