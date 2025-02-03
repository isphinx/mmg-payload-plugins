import { FileData } from 'payload'
import React from 'react'

interface Props {
  media: FileData & { cloudinary: string }
  className?: string
  style?: React.CSSProperties
  isSmall?: boolean
  children?: React.ReactNode
}

export default function CloudinaryMedia(
  { media, className, style, children, isSmall = false }: Props,
) {
  if (media.mimeType) {
    if (media.mimeType.startsWith('image')) {
      return (
        <Image
          media={media}
          className={className}
          style={style}
          isSmall={isSmall}
        >
          {children}
        </Image>
      )
    }
    if (media.mimeType.endsWith('video')) {
      return (
        <Video
          media={media}
          className={className}
          style={style}
          isSmall={isSmall}
        >
          {children}
        </Video>
      )
    }
    if (media.mimeType.endsWith('pdf')) {
      return (
        <Pdf
          media={media}
          className={className}
          style={style}
          isSmall={isSmall}
        >
          {children}
        </Pdf>
      )
    }
  }

  return <div>Wrong mimiType{media.mimeType}</div>
}

function Image({ media, className, style, isSmall, children }: Props) {
  const image = media
  if (!image.cloudinary) return <>Empty URL</>

  if (!isSmall && image.width && image.width > 800) {
    const idx = 49 // image.cloudinary.slice(1).indexOf('/') + 2

    return (
      <img
        loading='lazy'
        className={className}
        style={style}
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
      >
        {children}
      </img>
    )
  }

  return (
    <img
      className={className}
      style={style}
      src={image.cloudinary}
      alt={image.filename || ''}
    >
      {children}
    </img>
  )
}

function Video({ media, children }: Props) {
  return (
    <video>
      <source src={media.cloudinary} type={media.mimeType} />
      {children}
    </video>
  )
}

function Pdf({ media, children }: Props) {
  return (
    <img src={media.cloudinary} alt={media.filename || ''}>
      {children}
    </img>
  )
}
