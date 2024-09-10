import React from 'react'
import { Media, Page } from '@/payload-types'
import { cn } from 'shared/cn'
import Image from './image'
import RichText from './rich-text'
import CardBlock from './card'
import { generateStyle } from '@/shared/util'
import TitleBar from '@/app/(app)/_components/titleBar'

type Layout = NonNullable<Page['layout']>[0]
type GridContent = Extract<Layout, { blockType: 'gridContent' }>

interface Props {
  block: Layout
}

const blockComponents = {
  image: Image,
  richText: RichText,
  card: CardBlock,
}

export default function GridContent(props: Props) {
  const { title, width, content, style, background } = props.block as GridContent

  const gridCols = [
    '',
    'md:grid-cols-1',
    'md:grid-cols-2',
    'md:grid-cols-3',
    'md:grid-cols-4',
    'md:grid-cols-5',
  ]

  const colSpanX = ['', 'col-span-1', 'col-span-2', 'col-span-3', 'col-span-4', 'col-span-5']

  if (!content) return null

  return (
    <div
      style={background ? { backgroundImage: `url("${(background as Media).cloudinary}")` } : {}}
      className="py-5 bg-cover bg-repeat-y"
    >
      {title && <TitleBar>{title}</TitleBar>}
      <div style={generateStyle(style)} className={cn('container', 'grid', gridCols[width])}>
        {content &&
          content?.length > 0 &&
          content.map((c, i) => {
            const Block = blockComponents[c.blockType]

            return <Block key={i} className={cn(colSpanX[c.width])} content={c} />
          })}
      </div>
    </div>
  )
}
