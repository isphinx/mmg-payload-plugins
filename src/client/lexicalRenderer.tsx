import _ from 'lodash'
import React, { CSSProperties } from 'react'

export type AbstractNode<Type extends string> = {
  format?: '' | 'start' | 'center' | 'right' | 'justify' | number
  type: Type
  version: number
}

export type AbstractElementNode<Type extends string> = {
  direction: 'ltr' | 'rtl' | null
  indent: number
} & AbstractNode<Type>

export type AbstractTextNode<Type extends string> = {
  detail: number // what is this
  format: '' | number
  mode: 'normal' // what is this
  style: string
  text: string
} & AbstractNode<Type>

export type BlockNode<
  BlockData extends Record<string, unknown>,
  BlockType extends string,
> = {
  fields: {
    id: string
    blockName: string
    blockType: BlockType
  } & BlockData
} & AbstractElementNode<'block'>

type UnknownBlockNode = {
  fields: {
    id: string
    blockName: string
    blockType: string
    [key: string]: unknown
  }
} & AbstractNode<'block'>

export type Root = {
  children: Node[]
} & AbstractElementNode<'root'>

export type Mark = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  subscript?: boolean
  superscript?: boolean
  highlight?: boolean
}

export type TextNode = AbstractTextNode<'text'>
export type Linebreak = AbstractNode<'linebreak'>
export type Tab = AbstractTextNode<'tab'>

export type LinkNode = {
  children: TextNode[]
  fields:
    | {
      linkType: 'custom'
      newTab: boolean
      url: string
    }
    | {
      doc: {
        relationTo: string
        value: unknown
      }
      linkType: 'internal'
      newTab: boolean
      url: string
    }
} & AbstractElementNode<'link'>

export type AutoLinkNode = {
  children: TextNode[]
  fields: {
    linkType: 'custom'
    newTab?: boolean
    url: string
  }
} & AbstractElementNode<'autolink'>

export type HeadingNode = {
  tag: string
  children: TextNode[]
} & AbstractElementNode<'heading'>

export type ParagraphNode = {
  children: (TextNode | Linebreak | Tab | LinkNode | AutoLinkNode)[]
} & AbstractElementNode<'paragraph'>

export type ListItemNode = {
  children: (TextNode | ListNode)[]
  value: number
} & AbstractElementNode<'listitem'>

export type ListNode = {
  tag: string
  listType: 'number' | 'bullet' | 'check'
  start: number
  children: ListItemNode[]
} & AbstractElementNode<'list'>

export type QuoteNode = {
  children: TextNode[]
} & AbstractElementNode<'quote'>

export type UploadNode<
  MediaType = {
    id: string
    alt: string
    updatedAt: string
    createdAt: string
    url?: string
    filename?: string
    mimeType?: string
    filesize?: number
    width?: number
    height?: number
  },
> = {
  fields: null
  relationTo: 'media'
  value: MediaType
} & AbstractElementNode<'upload'>

export type Node =
  | HeadingNode
  | ParagraphNode
  | UploadNode
  | TextNode
  | ListNode
  | ListItemNode
  | QuoteNode
  | Linebreak
  | Tab
  | LinkNode
  | UnknownBlockNode
  | AutoLinkNode

export type ElementRenderers = {
  heading: (
    props: { children: React.ReactNode } & Omit<HeadingNode, 'children'>,
  ) => React.ReactNode
  list: (
    props: { children: React.ReactNode } & Omit<ListNode, 'children'>,
  ) => React.ReactNode
  listItem: (
    props: { children: React.ReactNode } & Omit<ListItemNode, 'children'>,
  ) => React.ReactNode
  paragraph: (
    props: { children: React.ReactNode } & Omit<ParagraphNode, 'children'>,
  ) => React.ReactNode
  quote: (
    props: { children: React.ReactNode } & Omit<QuoteNode, 'children'>,
  ) => React.ReactNode
  link: (
    props: { children: React.ReactNode } & Omit<LinkNode, 'children'>,
  ) => React.ReactNode
  autolink: (
    props: { children: React.ReactNode } & Omit<AutoLinkNode, 'children'>,
  ) => React.ReactNode
  linebreak: () => React.ReactNode
  tab: () => React.ReactNode
  upload: (props: UploadNode) => React.ReactNode
}

export type RenderMark = (mark: Mark) => React.ReactNode

export type LexicalReactRendererContent = {
  root: Root
}

export type LexicalReactRendererProps<Blocks extends { [key: string]: any }> = {
  content: LexicalReactRendererContent
  elementRenderers?: Partial<ElementRenderers>
  renderMark?: RenderMark
  blockRenderers?: {
    [BlockName in Extract<keyof Blocks, string>]?: (
      props: BlockNode<Blocks[BlockName], BlockName>,
    ) => React.ReactNode
  }
}

// This copy-and-pasted from somewhere in lexical here: https://github.com/facebook/lexical/blob/c2ceee223f46543d12c574e62155e619f9a18a5d/packages/lexical/src/LexicalConstants.ts
const IS_BOLD = 1
const IS_ITALIC = 1 << 1
const IS_STRIKETHROUGH = 1 << 2
const IS_UNDERLINE = 1 << 3
const IS_CODE = 1 << 4
const IS_SUBSCRIPT = 1 << 5
const IS_SUPERSCRIPT = 1 << 6
const IS_HIGHLIGHT = 1 << 7

export function GetElementStyle<Type extends string>({
  indent,
  format,
}: AbstractElementNode<Type>): CSSProperties {
  const style: CSSProperties = {}

  if (indent > 0) {
    style.marginLeft = `${indent * 20}px`
  }

  if (format === 'right' || format === 'center' || format === 'justify') {
    style.textAlign = format
  }

  return style
}

export const defaultElementRenderers: ElementRenderers = {
  heading: (element) => {
    return React.createElement(
      element.tag,
      {
        style: {
          ...GetElementStyle<'heading'>(element),
          ...({
            h1: { fontSize: '1.875rem', lineHeight: '2.25rem' },
            h2: { fontSize: '1.5rem', lineHeight: '2.0rem' },
            h3: { fontSize: '1.25rem', lineHeight: '1.75rem' },
            h4: { fontSize: '1.125rem', lineHeight: '1.75rem' },
            h5: { fontSize: '1.0rem', lineHeight: '1.5rem' },
            h6: { fontSize: '0.875rem', lineHeight: '1.25rem' },
          }[element.tag] || {}),
        },
      },
      element.children,
    )
  },
  list: (element) => {
    return React.createElement(
      element.tag,
      {
        style: {
          ...GetElementStyle<'list'>(element),
          ...(_.get({
            'number': { listStyleType: 'decimal', listStylePosition: 'inside' },
            'bullet': { listStyleType: 'disc', listStylePosition: 'inside' },
          }, element.listType)
            || {}),
        },
      },
      element.children,
    )
  },
  listItem: (element) => {
    return (
      <li style={GetElementStyle<'listitem'>(element)}>{element.children}</li>
    )
  },
  paragraph: (element) => {
    return (
      <p
        style={{
          ...GetElementStyle<'paragraph'>(element),
          display: 'block',
          marginBlockStart: '1em',
          marginBlockEnd: '1em',
          minHeight: '25px',
        }}
      >
        {element.children}
      </p>
    )
  },
  link: (element) => (
    <a
      href={element.fields.url}
      target={element.fields.newTab ? '_blank' : '_self'}
      style={GetElementStyle<'link'>(element)}
    >
      {element.children}
    </a>
  ),
  autolink: (element) => (
    <a
      href={element.fields.url}
      target={element.fields.newTab ? '_blank' : '_self'}
      style={GetElementStyle<'autolink'>(element)}
    >
      {element.children}
    </a>
  ),
  quote: (element) => (
    <blockquote style={GetElementStyle<'quote'>(element)}>
      {element.children}
    </blockquote>
  ),
  linebreak: () => <br />,
  tab: () => <br />,
  upload: (element) => {
    if (element.value.mimeType?.includes('image')) {
      return <img src={element.value.url} alt={element.value.alt} />
    }
  },
}

const defaultRenderMark: RenderMark = (mark) => {
  const style: CSSProperties = {}

  if (mark.bold) {
    style.fontWeight = 'bold'
  }

  if (mark.italic) {
    style.fontStyle = 'italic'
  }

  if (mark.underline) {
    style.textDecoration = 'underline'
  }

  if (mark.strikethrough) {
    style.textDecoration = 'line-through'
  }

  if (mark.code) {
    return <code>{mark.text}</code>
  }

  if (mark.highlight) {
    return <mark style={style}>{mark.text}</mark>
  }

  if (mark.subscript) {
    return <sub style={style}>{mark.text}</sub>
  }

  if (mark.superscript) {
    return <sup style={style}>{mark.text}</sup>
  }

  if (Object.keys(style).length === 0) {
    return <>{mark.text}</>
  }

  return <span style={style}>{mark.text}</span>
}

export function LexicalReactRenderer<Blocks extends { [key: string]: any }>({
  content,
  elementRenderers,
  renderMark = defaultRenderMark,
  blockRenderers = {},
}: LexicalReactRendererProps<Blocks>) {
  const renderElement = React.useCallback(
    (node: Node, children?: React.ReactNode) => {
      const theRenderers = elementRenderers
        ? { ...defaultElementRenderers, ...elementRenderers }
        : defaultElementRenderers

      if (node.type === 'link' && node.fields) {
        return theRenderers.link({
          ...node,
          children,
        })
      }

      if (node.type === 'autolink' && node.fields) {
        return theRenderers.autolink({
          ...node,
          children,
        })
      }

      if (node.type === 'heading') {
        return theRenderers.heading({
          ...node,
          children,
        })
      }

      if (node.type === 'paragraph') {
        return theRenderers.paragraph({
          ...node,
          children,
        })
      }

      if (node.type === 'list') {
        return theRenderers.list({
          ...node,
          children,
        })
      }

      if (node.type === 'listitem') {
        return theRenderers.listItem({
          ...node,
          children,
        })
      }

      if (node.type === 'quote') {
        return theRenderers.quote({
          ...node,
          children,
        })
      }

      if (node.type === 'linebreak') {
        return theRenderers.linebreak()
      }

      if (node.type === 'tab') {
        return theRenderers.tab()
      }

      if (node.type === 'upload') {
        return theRenderers.upload(node)
      }

      throw new Error(`Missing element renderer for node type '${node.type}'`)
    },
    [elementRenderers],
  )

  const renderText = React.useCallback(
    (node: TextNode): React.ReactNode | null => {
      if (!renderMark) {
        throw new Error("'renderMark' prop not provided.")
      }

      if (!node.format) {
        return renderMark({
          text: node.text,
        })
      }

      return renderMark({
        text: node.text,
        bold: (node.format & IS_BOLD) > 0,
        italic: (node.format & IS_ITALIC) > 0,
        underline: (node.format & IS_UNDERLINE) > 0,
        strikethrough: (node.format & IS_STRIKETHROUGH) > 0,
        code: (node.format & IS_CODE) > 0,
        subscript: (node.format & IS_SUBSCRIPT) > 0,
        superscript: (node.format & IS_SUPERSCRIPT) > 0,
        highlight: (node.format & IS_HIGHLIGHT) > 0,
      })
    },
    [renderMark],
  )

  const serialize = React.useCallback(
    (children: Node[]): React.ReactNode[] | null =>
      children.map((node, index) => {
        if (node.type === 'text') {
          return <React.Fragment key={index}>{renderText(node)}</React.Fragment>
        }

        if (node.type === 'block') {
          const renderer = blockRenderers[node.fields.blockType] as (
            props: unknown,
          ) => React.ReactNode

          if (typeof renderer !== 'function') {
            throw new Error(
              `Missing block renderer for block type '${node.fields.blockType}'`,
            )
          }

          return <React.Fragment key={index}>{renderer(node)}</React.Fragment>
        }

        if (
          node.type === 'linebreak' || node.type === 'tab'
          || node.type === 'upload'
        ) {
          return (
            <React.Fragment key={index}>{renderElement(node)}</React.Fragment>
          )
        }

        return (
          <React.Fragment key={index}>
            {renderElement(node, serialize(node.children))}
          </React.Fragment>
        )
      }),
    [renderElement, renderText, blockRenderers],
  )

  return <>{serialize(content.root.children)}</>
}
