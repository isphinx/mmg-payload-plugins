import type { Config } from 'payload'
import type { PluginOptions } from './types'

import { getBeforeChange } from './cloudniary'

export const cloudinaryPlugin =
  ({ cloudName, apiKey, apiSecret, uploadDir }: PluginOptions) =>
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }

    return {
      ...config,
      collections: (config.collections || []).map((existingCollection) => {
        if (existingCollection.upload === true) {
          return {
            ...existingCollection,
            fields: [
              ...existingCollection.fields,
              {
                admin: { disabled: true },
                type: 'text',
                name: 'cloudinary',
                required: true,
              },
              {
                type: 'select',
                name: 'effect',
                defaultValue: 'trim',
                options: [
                  { label: 'N/A', value: '' },
                  { label: 'Trim', value: 'trim' },
                ],
              },
            ],
            hooks: {
              ...(existingCollection.hooks || {}),
              afterDelete: [
                ...(existingCollection.hooks?.afterDelete || []),
                // getAfterDeleteHook({ adapter, collection: existingCollection }),
              ],
              beforeChange: [
                ...(existingCollection.hooks?.beforeChange || []),
                getBeforeChange({ cloudName, apiKey, apiSecret, uploadDir }),
              ],
            },
            upload: {
              crop: false,
              disableLocalStorage: true,
              adminThumbnail: ({ doc }) => {
                const url = doc.url as string
                const idx = url.slice(1).indexOf(cloudName) + cloudName.length
                  + 1
                return `${url.slice(0, idx)}/c_limit,w_180${url.slice(idx)}`
              },
            },
          }
        }

        return existingCollection
      }),
    }
  }
