import { defineField, defineType } from 'sanity'

const characterTypes = [
  { title: '鳥類', value: 'bird' },
  { title: '貓', value: 'cat' },
  { title: '鼠', value: 'mouse' },
]

const dialogueOption = defineType({
  name: 'dialogueOption',
  title: 'Dialogue option',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Option label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'nextNode',
      title: 'Next node ID',
      type: 'string',
      description: 'Leave empty when this option ends the conversation.',
    }),
  ],
})

const dialogueNode = defineType({
  name: 'dialogueNode',
  title: 'Dialogue node',
  type: 'object',
  fields: [
    defineField({
      name: 'id',
      title: 'Node ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'text',
      title: 'Character text',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'options',
      title: 'Options',
      type: 'array',
      of: [{ type: 'dialogueOption' }],
    }),
  ],
})

export default defineType({
  name: 'character',
  title: 'Character',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: '角色中文名',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'species',
      title: '物種名稱（學名）',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: '職稱',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'characterType',
      title: '角色類型',
      type: 'string',
      options: { list: characterTypes, layout: 'radio' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: '角色插圖',
      type: 'image',
      options: { hotspot: true },
      fields: [defineField({ name: 'alt', title: 'Alternative text', type: 'string' })],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dialogueStart',
      title: '起始節點 ID',
      type: 'string',
      initialValue: 'intro',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'dialogue',
      title: '對話腳本',
      type: 'array',
      of: [{ type: 'dialogueNode' }],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
      media: 'image',
    },
  },
})

export { dialogueNode, dialogueOption }
