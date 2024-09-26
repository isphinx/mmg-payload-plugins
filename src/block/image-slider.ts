import type { Block } from 'payload'

export const ImageSlider: Block = {
  slug: 'imageSlider',
  fields: [
    {
      name: 'slider',
      type: 'array',
      fields: [
        { name: 'tag', type: 'text' },
        { admin: { language: 'css' }, type: 'code', name: 'tagStyle' },
        {
          type: 'row',
          fields: [
            { name: 'title', type: 'text' },
            {
              name: 'mask',
              type: 'select',
              options: [
                { label: 'None', value: '' },
                { label: 'Mask1', value: 'mask1' },
                { label: 'Mask2', value: 'mask2' },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            { name: 'buttonName', type: 'text' },
            { name: 'buttonLink', type: 'text' },
          ],
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        { admin: { language: 'css' }, type: 'code', name: 'imageStyle' },
      ],
    },
  ],
}
