import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'issue',
  title: 'Quarterly Issue',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Display title',
      type: 'string',
      description: 'For example: 2026 秋季號（創刊號）',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(1900),
    }),
    defineField({
      name: 'quarter',
      title: 'Quarter',
      type: 'string',
      options: {
        list: [
          { title: 'Q1 · 第一季', value: 'Q1' },
          { title: 'Q2 · 第二季', value: 'Q2' },
          { title: 'Q3 · 第三季', value: 'Q3' },
          { title: 'Q4 · 第四季', value: 'Q4' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      year: 'year',
      quarter: 'quarter',
    },
    prepare({ title, year, quarter }) {
      return { title, subtitle: `${year} · ${quarter}` }
    },
  },
})
