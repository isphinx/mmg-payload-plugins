'use client'
import React, { useCallback, useEffect } from 'react'

import {
  FieldLabel,
  TextInput,
  useField,
  useFieldProps,
  useFormFields,
} from '@payloadcms/ui'

import { formatSlug } from './formatSlug'
// import './index.scss'
import { TextFieldClientProps } from 'payload'

type SlugComponentProps = {
  fieldToUse: string
  checkboxFieldPath: string
} & TextFieldClientProps

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

  const { value: checkboxValue, setValue: setCheckboxValue } = useField<
    boolean
  >({
    path: checkboxFieldPath,
  })

  const fieldToUseValue = useFormFields(([fields]) => {
    return fields[fieldToUse]?.value as string
  })

  useEffect(() => {
    if (checkboxValue) {
      if (fieldToUseValue) {
        const formattedSlug = formatSlug(fieldToUseValue)

        if (value !== formattedSlug) setValue(formattedSlug)
      } else {
        if (value !== '') setValue('')
      }
    }
  }, [fieldToUseValue, checkboxValue, setValue, value])

  const handleLock = useCallback(
    (e: any) => {
      e.preventDefault()

      setCheckboxValue(!checkboxValue)
    },
    [checkboxValue, setCheckboxValue],
  )

  const readOnly = readOnlyFromProps || checkboxValue

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...(field.admin?.position == 'sidebar' ? {} : { width: '50%' }),
      }}
      className='field-type'
    >
      <div className='label-wrapper'>
        <FieldLabel field={field} htmlFor={`field-${path}`} label={label} />

        <div
          style={{ margin: 0, paddingBottom: '0.3125rem' }}
          onClick={handleLock}
        >
          {checkboxValue ? 'Unlock' : 'Lock'}
        </div>
      </div>

      <TextInput
        label={''}
        value={value}
        onChange={setValue}
        path={path}
        readOnly={readOnly}
      />
    </div>
  )
}
