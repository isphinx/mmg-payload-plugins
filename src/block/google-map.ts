import type { Block } from 'payload'

export const GoogleMap: Block = {
  slug: 'googleMap',
  fields: [
    {
      type: 'number',
      name: 'width',
      defaultValue: 1,
      required: true,
      max: 5,
      min: 1,
    },
    {
      admin: { language: 'css' },
      type: 'code',
      name: 'style',
    },
  ],
}
