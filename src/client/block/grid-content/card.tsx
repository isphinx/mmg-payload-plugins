import React from 'react'
import { Media, Page } from '@/payload-types'
import { cn } from 'shared/cn'
import { Card } from 'client/ui/card'
import CloudinaryMedia from '@/app/(app)/_components/cloudinaryMedia'
import { Button } from 'client/ui/button'
import { generateStyle } from '@/shared/util'

type Layout = NonNullable<Page['layout']>[0]
type GridContent = Extract<Layout, { blockType: 'gridContent' }>
type Content = NonNullable<GridContent['content']>[0]
type CardProp = Extract<Content, { blockType: 'card' }>

interface Props {
  content: Content
  className: string
}

export default function CardBlock({ content, className }: Props) {
  const card = content as CardProp

  return (
    <Card style={generateStyle(card.style)} className={cn('rounded-sm space-y-3', className)}>
      {card.image && <CloudinaryMedia media={card.image as Media} />}
      <div className="relative group w-full px-4">
        <div style={generateStyle(card.imageStyle)}>
          <a href={card.link || '#'} className="hover:text-c1">
            {card.title}
          </a>
        </div>
        <div className="mt-2 line-clamp-3 text-sm leading-6 whitespace-pre-wrap break-words">
          {card.description}
        </div>
      </div>
      <Button className="bottom-3" asChild>
        <a href={card.link || '#'}>{card.button}</a>
      </Button>
    </Card>
  )
}
