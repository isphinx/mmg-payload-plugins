import type { Block } from 'payload'


export const ImageSlider: Block = {
  slug: 'imageSlider',
  fields: [
    {
      name: 'slider',
      type: 'array',
      fields: [
        { name: 'title', type: 'text' },
        { name: 'buttonName', type: 'text' },
        { name: 'buttonLink', type: 'text' },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ]
    },
  ],
}
