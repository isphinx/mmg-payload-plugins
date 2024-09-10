import React from 'react'
import { Media, Page } from '@/payload-types'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from 'client/ui/carousel'
import Link from 'next/link'
import { Button } from 'client/ui/button'
import CloudinaryMedia from '../_components/cloudinaryMedia'

type Layout = NonNullable<Page['layout']>[0]

interface Props {
  block: Layout
}

export default function ImageSlider(props: Props) {
  const { slider } = props.block as Extract<Layout, { blockType: 'imageSlider' }>
  // console.log(slider)

  if (!slider) return null

  return (
    <>
      <Carousel className="w-full -z-10">
        <CarouselContent>
          {slider.map((s, index) => (
            <CarouselItem key={index}>
              <div className="aspect-[504/327] md:aspect-[320/96]">
                <div className="relative z-20 bg-muted-foreground bg-opacity-0 md:bg-opacity-100 md:w-1/3 h-full">
                  <svg
                    className="hidden md:block absolute -right-20 inset-y-0 h-full w-40 text-muted-foreground transform translate-x-1/2"
                    fill="currentColor"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <polygon points="0,0 100,100 0,100" />
                  </svg>
                  <svg
                    className="hidden md:block absolute -right-20 inset-y-0 h-full w-40 text-primary transform translate-x-1/2"
                    fill="currentColor"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <polygon points="0,0 5,0 100,100 95,100" />
                  </svg>
                  <div className="flex flex-col h-full justify-center px-3 md:px-20 space-y-10">
                    <div className="font-f1 font-bold text-2xl md:text-5xl text-c1 md:text-white">
                      {s.title}
                    </div>
                    <div>
                      {s.buttonLink && (
                        <Link href={s.buttonLink || ''}>
                          <Button>{s.buttonName}</Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
                <Link href={s.buttonLink || ''}>
                  {s.media && (
                    <CloudinaryMedia
                      media={s.media as Media}
                      className="items-center absolute inset-y-0 right-0 w-full md:w-2/3 z-10 h-full md:object-right object-cover bg-black aspect-[11/7] md:aspect-[20/9]"
                    />
                  )}
                </Link>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/*
      <CarouselPrevious />
      <CarouselNext />
    */}
      </Carousel>
    </>
  )
}
