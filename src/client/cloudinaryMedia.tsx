import { FileData } from 'payload'
import React from 'react'

interface Props {
  media: FileData & { cloudinary: string }
  className?: string
  isSmall?: boolean
}

export default function CloudinaryMedia(
  { media, className, isSmall = false }: Props,
) {
  if (media.mimeType) {
    if (media.mimeType.startsWith('image')) {
      return <Image media={media} className={className} isSmall={isSmall} />
    }
    if (media.mimeType.endsWith('video')) {
      return <Video media={media} className={className} isSmall={isSmall} />
    }
    if (media.mimeType.endsWith('pdf')) {
      return <Pdf media={media} className={className} isSmall={isSmall} />
    }
  }

  return <div>Wrong mimiType{media.mimeType}</div>
}

function Image({ media, className, isSmall }: Props) {
  const image = media
  if (!image.cloudinary) return <>Empty URL</>

  if (!isSmall && image.width && image.width > 800) {
    const idx = 49 // image.cloudinary.slice(1).indexOf('/') + 2

    return (
      <img
        className={className}
        sizes='(max-width: 1600px) 397px, 788px'
        srcSet={[
          `${image.cloudinary.slice(0, idx)}q_auto/c_scale%2Cw_397/${
            image.cloudinary.slice(idx)
          } w397`,
          `${image.cloudinary.slice(0, idx)}q_auto/c_scale%2Cw_788/${
            image.cloudinary.slice(idx)
          } w788`,
        ].join(',\n')}
        src={image.cloudinary}
        alt={image.filename || ''}
      />
    )
  }

  return (
    <img
      className={className}
      src={image.cloudinary}
      alt={image.filename || ''}
    />
  )
}

function Video({ media }: Props) {
  return <>video</>
}

function Pdf({ media }: Props) {
  return <img src={media.cloudinary} alt={media.filename || ''} />
}
