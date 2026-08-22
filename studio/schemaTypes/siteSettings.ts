import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Contact title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'contactCopy',
      title: 'Contact copy',
      type: 'text',
      rows: 4,
      description: 'Use line breaks to control the intro copy in the Contact window.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'supportCopy',
      title: 'Support copy',
      type: 'text',
      rows: 4,
      description: 'Use line breaks to control the copy above the support link.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Contact email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'supportLinkText',
      title: 'Support link text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'supportLinkUrl',
      title: 'Support link URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      email: 'email',
    },
    prepare({ title, email }) {
      return { title, subtitle: email }
    },
  },
})
