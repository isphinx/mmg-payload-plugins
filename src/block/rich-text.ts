import type { Block } from 'payload'

export const RichText: Block = {
  slug: 'richText',
  fields: [
    {
      name: 'width',
      type: 'number',
      defaultValue: 1,
      required: true,
      max: 5,
      min: 1,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      admin: { language: 'css' },
      type: 'code',
      name: 'style',
    },
  ],
}
