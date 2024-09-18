'use client'
import React from 'react'
import { post } from '../util/api/fetch'
import { Button } from './ui/button'

export default function Draft({ isDraft }: { isDraft: boolean }) {
  if (isDraft) {
    return (
      <div className='container'>
        <div className='inline-flex justify-between w-full py-3'>
          <div className='text-primary text-2xl font-bold'>Draft Mode</div>
          <Button
            variant='destructive'
            onClick={async () => {
              await post('/draft', {})
              location.reload()
            }}
          >
            DISABLE DRAFT
          </Button>
        </div>
      </div>
    )
  }

  return <></>
}
