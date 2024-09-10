import React, { Fragment } from 'react'
import { Page } from '@/payload-types'

import ImageSlider from './image-slider'
import ProductSlider from './product-slider'
import GridContent from './grid-content'


const blockComponents = {
  imageSlider: ImageSlider,
  productSlider: ProductSlider,
  gridContent: GridContent,
}

export default function Blocks({ blocks }: { blocks: Page['layout'] }) {

  if (!blocks || !Array.isArray(blocks) || blocks.length == 0)
    return null

  return (
    <Fragment>
      {blocks.map((block, i) => {
        const { blockType } = block

        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType]
          return (<Block key={i} block={block} />)
        } else {
          return (<div key={i}>cant find block for {blockType} </div>)
        }
      })}
    </Fragment>
  )
}

