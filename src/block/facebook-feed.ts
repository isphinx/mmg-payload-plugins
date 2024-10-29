import type { Block } from 'payload'

export const FacebookFeed: Block = {
  slug: 'facebookFeed',
  fields: [
    {
      type: 'row',
      fields: [
        {
          type: 'number',
          name: 'width',
          defaultValue: 1,
          required: true,
          max: 5,
          min: 1,
        },
        { name: 'appID', type: 'text' },
      ],
    },
    { name: 'token', type: 'text' },
  ],
}
