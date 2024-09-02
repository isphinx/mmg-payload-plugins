'use client'
import React, { useCallback, useEffect } from 'react'

import {
  useField,
  useFieldProps,
  // Button,
  TextInput,
  FieldLabel,
  useFormFields,
} from '@payloadcms/ui'

import type { TextFieldProps } from 'payload'

import { formatSlug } from './formatSlug'
// import './index.scss'

type SlugComponentProps = {
  fieldToUse: string
  checkboxFieldPath: string
} & TextFieldProps

export const SlugComponent: React.FC<SlugComponentProps> = ({
  field,
  fieldToUse,
  checkboxFieldPath: checkboxFieldPathFromProps,
}) => {
  const { label } = field
  const { path, readOnly: readOnlyFromProps } = useFieldProps()

  const checkboxFieldPath = path.includes('.')
    ? `${path}.${checkboxFieldPathFromProps}`
    : checkboxFieldPathFromProps

  const { value, setValue } = useField<string>({ path })

  const { value: checkboxValue, setValue: setCheckboxValue } = useField<boolean>({
    path: checkboxFieldPath,
  })

  const fieldToUseValue = useFormFields(([fields, dispatch]) => {
    return fields[fieldToUse].value as string
  })

  useEffect(() => {
    if (checkboxValue && fieldToUseValue) setValue(formatSlug(fieldToUseValue))
  }, [fieldToUseValue, checkboxValue])

  const handleLock = useCallback(
    (e: any) => {
      e.preventDefault()

      setCheckboxValue(!checkboxValue)
    },
    [checkboxValue, setCheckboxValue],
  )

  const readOnly = readOnlyFromProps || checkboxValue

  return (
    <div className="field-type slug-field-component">
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <FieldLabel field={field} htmlFor={`field-${path}`} label={label} />

        <div style={{ paddingBottom: '0.3125rem', cursor: 'pointer' }} onClick={handleLock}>
          {checkboxValue ? 'Unlock' : 'Lock'}
        </div>
      </div>

      <TextInput label={''} value={value} onChange={setValue} path={path} readOnly={readOnly} />
    </div>
  )
}
