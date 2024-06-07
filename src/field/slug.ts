import _ from 'lodash'
import type { FieldHook } from 'payload/types'
import type { Field } from 'payload/types'
import { deepMerge } from '../util/deepMerge'


const formatSlug =
  (fallback: string): FieldHook =>
    ({ operation, value, originalDoc, data }) => {
      if (operation === 'create' || operation == 'update') {
        const fallbackData = data?.[fallback] || originalDoc?.[fallback]

        if (fallbackData && typeof fallbackData === 'string') {
          return _.kebabCase(fallbackData)
        }
      }

      return value
    }

export type Slug = (fieldToUse?: string, overrides?: Partial<Field>) => Field

export const slugField: Slug = (fieldToUse = 'title', overrides = {}) =>
  deepMerge<Field, Partial<Field>>(
    {
      name: 'slug',
      label: 'Slug',
      type: 'text',
      index: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug(fieldToUse)],
      },
    },
    overrides,
  )
