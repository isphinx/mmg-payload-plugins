import type { Block } from 'payload'
import { Card } from './card'
import { FacebookFeed } from './facebook-feed'
import { GoogleMap } from './google-map'
import { Image } from './image'
import { RichText } from './rich-text'
import { StoreInfo } from './store-info'

export const GridContent: Block = {
  slug: 'gridContent',
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
        },
        { type: 'text', name: 'title' },
      ],
    },
    { name: 'background', type: 'upload', relationTo: 'media' },
    { admin: { language: 'css' }, type: 'code', name: 'style' },
    {
      name: 'content',
      type: 'blocks',
      blocks: [Image, RichText, Card, StoreInfo, GoogleMap, FacebookFeed],
    },
  ],
}
