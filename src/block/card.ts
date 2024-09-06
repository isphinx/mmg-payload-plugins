import type { Block } from 'payload'


export const Card: Block = {
  slug: 'card',
  fields: [
    {
      type: 'row',
      fields: [
        { type: 'text', name: "title" },
        { type: 'text', name: "button" },
      ]
    },
    { type: 'text', name: "description" },
    {
      type: 'row',
      fields: [
        {
          name: 'width',
          type: 'number',
          defaultValue: 1,
          required: true,
          max: 5,
          min: 1
        },
        { type: 'text', name: "link" },
      ]
    },
    { admin: { language: 'css' }, type: 'code', name: 'style' },
    {
      type: 'upload',
      name: 'image',
      relationTo: 'media',
    },
    { admin: { language: 'css' }, type: 'code', name: "imageStyle" },
  ],
}
