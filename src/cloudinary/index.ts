import type { Config } from 'payload/config'
import type { PluginOptions } from './types'

import { getBeforeChange } from './cloudniary'


export const cloudinaryPlugin = ({ cloudName, apiKey, apiSecret, uploadDir }: PluginOptions) =>
  (incomingConfig: Config): Config => {
    const config = { ...incomingConfig }

    return {
      ...config,
      collections: (config.collections || []).map((existingCollection) => {

        if (existingCollection.upload === true) {
          return {
            ...existingCollection,
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
                const idx = url.slice(1).indexOf('/') + 2;
                return `${url.slice(0, idx)}c_limit,w_180/${url.slice(idx)}`
              }
            },
          }
        }

        return existingCollection
      }),
    }
  }
