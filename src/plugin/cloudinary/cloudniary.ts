import { v2 } from 'cloudinary'
import _ from 'lodash'

import type { CollectionBeforeChangeHook, FileData, TypeWithID } from 'payload'

interface File {
  buffer: Buffer
  filename: string
  filesize: number
  mimeType: string
  tempFilePath?: string
}

export const getBeforeChange = ({ cloudName, apiKey, apiSecret, uploadDir }: {
  cloudName: string
  apiKey: string
  apiSecret: string
  uploadDir: string
}): CollectionBeforeChangeHook<FileData & TypeWithID> =>
async ({ data, req }) => {
  const file = req.file

  if (
    data && file && data.filename && data.mimeType
    && cloudName && apiKey && apiSecret && uploadDir
  ) {
    const cloudres = await upload2cloudiary({
      cloudName,
      apiKey,
      apiSecret,
      uploadDir,
      file: {
        buffer: file.data,
        filename: data.filename,
        filesize: file.size,
        mimeType: data.mimeType,
        tempFilePath: file.tempFilePath,
      },
    })
    // if (process.env.NODE_ENV != 'production')
    // console.log(cloudres, data)

    data['url'] =
      `https://res.cloudinary.com/${cloudName}/${cloudres.public_id}`
    data['width'] = cloudres.width
    data['height'] = cloudres.height
    data['filesize'] = cloudres.bytes
    data = _.set(
      data,
      'cloudinary',
      `https://res.cloudinary.com/${cloudName}/${cloudres.public_id}`,
    )
    if (cloudres.format == 'pdf' && !!cloudres.pages) {
      data['filename'] = data.filename + `-page-${cloudres.pages}`
    } else {
      data['filename'] = data.filename
    }
  }
  return data
}

// const checkCloudinaryFolder = async ({ v2, uploadDir }:
//   { v2: any, uploadDir: string }) => {
//   const folderList = await v2.api.root_folders()
//
//   if (folderList.folders &&
//     !folderList.folders.find((f: any) => f.name == uploadDir)) {
//     await v2.api.create_folder(uploadDir)
//   }
// }

const upload2cloudiary = async (
  { file, cloudName, apiKey, apiSecret, uploadDir }: {
    file: File
    cloudName: string
    apiKey: string
    apiSecret: string
    uploadDir: string
  },
) => {
  v2.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })
  // await checkCloudinaryFolder({ v2, uploadDir })

  return await v2.uploader.upload(
    `data:${file.mimeType};base64,${file.buffer.toString('base64')}`,
    {
      folder: uploadDir,
      overwrite: false,
      ...(file.mimeType.startsWith('image')
        ? {
          effect: 'trim',
          format: 'webp',
          transformation: { crop: 'limit', height: 1600, weight: 1600 },
        }
        : {}),
      ...(file.mimeType.startsWith('video') ? { resource_type: 'video' } : {}),
      context: {
        caption: file.filename,
      },
      tags: [uploadDir],
    },
  )
}
