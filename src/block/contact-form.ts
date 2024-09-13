import type { Block } from 'payload'

export const ContactForm: Block = {
  slug: 'contactForm',
  fields: [
    {
      name: 'width',
      type: 'number',
      defaultValue: 1,
      required: true,
      max: 5,
      min: 1,
    },
    {
      admin: { language: 'css' },
      type: 'code',
      name: 'style',
    },
  ],
}
