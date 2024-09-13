import type { Block } from 'payload'

export const ProductSlider: Block = {
  slug: 'productSlider',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'title', type: 'text' },
        {
          name: 'type',
          type: 'select',
          defaultValue: 'product',

          options: [
            { label: 'Pick Product', value: 'product' },
            { label: 'Category', value: 'category' },
            { label: 'Promotion', value: 'pormotion' },
            { label: 'New Product(order by create time)', value: 'new' },
          ],
        },
        { name: 'buttonTitle', type: 'text' },
        { name: 'buttonLink', type: 'text' },
      ],
    },
    {
      name: 'background',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'categoryProduct',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'category',
      },
      fields: [
        {
          name: 'categories',
          label: 'Category to link to',
          type: 'relationship',
          relationTo: 'categories',
          hasMany: true,
        },
      ],
    },
    {
      name: 'pickProduct',
      type: 'group',
      admin: {
        condition: (_, siblingData) => siblingData?.type === 'product',
      },
      fields: [
        {
          name: 'products',
          type: 'relationship',
          relationTo: 'products',
          hasMany: true,
        },
      ],
    },
  ],
}
