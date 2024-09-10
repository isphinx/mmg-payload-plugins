import React from 'react'
import { Page } from '@/payload-types'
import { cn } from 'shared/cn'

import {
  LexicalReactRenderer,
  LexicalReactRendererContent,
} from '../../_components/richTextLexicalRenderer'

type Layout = NonNullable<Page['layout']>[0]
type GridContent = Extract<Layout, { blockType: 'gridContent' }>
type Content = NonNullable<GridContent['content']>[0]
type RichTextProps = Extract<Content, { blockType: 'richText' }>

interface Props {
  content: Content
  className: string
}

export default function RichText({ content, className }: Props) {
  const richText = content as RichTextProps

  return (
    <div className={cn(className)}>
      <LexicalReactRenderer content={richText.content as LexicalReactRendererContent} />
    </div>
  )
}
