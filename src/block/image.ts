import type { Block } from 'payload'


export const Image: Block = {
  slug: 'image',
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'width',
          type: 'number',
          defaultValue: 1,
          required: true,
          max: 5,
          min: 1,
          admin: { width: '20%' }
        },
        {
          name: 'link',
          type: 'text'
        },
      ]
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
  ],
}
