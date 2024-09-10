import React from 'react'
import { Media, Page } from '@/payload-types'
import { cn } from 'shared/cn'
import CloudinaryMedia from '../../_components/cloudinaryMedia'

type Layout = NonNullable<Page['layout']>[0]
type GridContent = Extract<Layout, { blockType: 'gridContent' }>
type Content = NonNullable<GridContent['content']>[0]
type Image = Extract<Content, { blockType: 'image' }>

interface Props {
  content: Content
  className: string
}

export default function Image({ content, className }: Props) {
  const image = content as Image

  if (typeof image.media != 'object') return <>no image</>

  const media = image.media as Media

  return (
    <div className={cn('m-auto', className)}>
      <CloudinaryMedia media={media} />
    </div>
  )
}
