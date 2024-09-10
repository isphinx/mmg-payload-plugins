import React from 'react'
import Link from 'next/link'
import { Carousel, CarouselContent, CarouselDots, CarouselItem } from 'client/ui/carousel'
import { Media, Page, Product } from '@/payload-types'
import { Button } from 'client/ui/button'
import { newProducts, promoProducts } from '@/app/(app)/_util/getDoc'
import ProductHero from '@/app/(app)/_components/productHero'
import TitleBar from '@/app/(app)/_components/titleBar'

type Layout = NonNullable<Page['layout']>[0]
type TypeProductSlider = Extract<Layout, { blockType: 'productSlider' }>

async function getProducts(productsSlider: TypeProductSlider): Promise<Product[]> {
  if (productsSlider.type == 'product')
    return (productsSlider.pickProduct?.products || []) as Product[]

  if (productsSlider.type == 'new') return await newProducts()

  if (productsSlider.type == 'pormotion') return await promoProducts()

  return []
}

export default async function ProductSlider({ block }: { block: Layout }) {
  const productsSlider = block as TypeProductSlider
  const products = await getProducts(productsSlider)

  const bg = productsSlider.background as Media

  return (
    <div
      style={productsSlider.background ? { backgroundImage: `url("${bg.cloudinary}")` } : {}}
      className="py-5 bg-cover bg-repeat-y dark:bg-black/50"
    >
      {productsSlider.title && <TitleBar>{productsSlider.title}</TitleBar>}
      <Carousel className="w-full md:container" opts={{ slidesToScroll: 'auto' }}>
        <CarouselContent className="py-5">
          {products.map((p, i) => (
            <CarouselItem key={i} className="pl-3 basis-2/3 md:basis-1/5">
              <ProductHero product={p} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="inline-flex justify-center items-center w-full">
          <div className="min-w-[8rem] space-x-1">
            <CarouselDots className="px-0 py-0 w-1 md:w-8 h-1" />
          </div>
          <Button asChild className="h-8">
            <Link href={productsSlider.buttonLink || '#'}>{productsSlider.buttonTitle}</Link>
          </Button>
        </div>
      </Carousel>
    </div>
  )
}
