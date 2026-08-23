export const articleProjection = `
  _id,
  title,
  excerpt,
  body,
  publishedAt,
  coverImage,
  "slug": slug.current,
  "issue": issue->{
    title,
    year,
    quarter,
    "slug": slug.current
  },
  "categories": categories[]->{
    title,
    "slug": slug.current
  }
`

export const articleListQuery = `*[
  _type == "article" && defined(slug.current)
] | order(issue->year desc, issue->quarter asc, publishedAt desc){
  ${articleProjection}
}`

export const articleSlugsQuery = `*[
  _type == "article" && defined(slug.current)
]{
  "slug": slug.current
}`

export const siteSettingsQuery = `*[
  _type == "siteSettings"
][0]{
  title,
  contactCopy,
  supportCopy,
  email,
  supportLinkText,
  supportLinkUrl
}`

export const characterProjection = `
  _id,
  name,
  role,
  species,
  characterType,
  "slug": slug.current,
  "imageUrl": image.asset->url,
  "imageAlt": image.alt,
  dialogueStart,
  dialogue[]{
    id,
    text,
    options[]{
      label,
      nextNode
    }
  }
`

export const characterListQuery = `*[
  _type == "character" && defined(slug.current)
] | order(name asc){
  ${characterProjection}
}`
