import { useEffect, useState } from 'react'

const leafClasses = new Set([
  'cls-1',
  'cls-2',
  'cls-4',
  'cls-6',
  'cls-9',
  'cls-10',
  'cls-11',
  'cls-12',
  'cls-14',
  'cls-16',
  'cls-17',
  'cls-18',
  'cls-19',
  'cls-20',
  'cls-21',
  'cls-24',
  'cls-26',
])

function getAttribute(tag, attribute) {
  return tag.match(new RegExp(`${attribute}="([^"]*)"`))?.[1] ?? ''
}

function getPixelData(tag) {
  const classes = getAttribute(tag, 'class').split(/\s+/)
  const y = Number.parseFloat(getAttribute(tag, 'y') || '0')
  const x = Number.parseFloat(getAttribute(tag, 'x') || '0')
  const width = Number.parseFloat(getAttribute(tag, 'width') || '0')
  const height = Number.parseFloat(getAttribute(tag, 'height') || '0')
  const id = Number.parseInt(getAttribute(tag, 'id').replace(/\D/g, ''), 10) || 0
  const seed = Math.abs(Math.round(x + y + width + height) + id * 13)
  const isSmallLeaf = width <= 24.54 && height <= 24.54
  const isCanopyLeaf = y < 560 && isSmallLeaf && leafClasses.has(classes[0])

  return { isCanopyLeaf, seed }
}

function isFlickerCandidate(tag) {
  const { isCanopyLeaf, seed } = getPixelData(tag)
  return isCanopyLeaf && seed % 3 === 0
}

function preparePixelForest(source) {
  const svg = source
    .replace(/<\?xml[\s\S]*?\?>\s*/i, '')
    .replace(/<!DOCTYPE[\s\S]*?>\s*/i, '')
    .replace(/<svg\b/, '<svg preserveAspectRatio="xMidYMid slice"')

  const rectTags = [...svg.matchAll(/<rect\b[^>]*>/g)].map(([tag]) => tag)
  const flickerCount = rectTags.filter(isFlickerCandidate).length
  const duration = 22
  let flickerIndex = 0

  return svg.replace(/<rect\b[^>]*>/g, (tag) => {
    if (!isFlickerCandidate(tag)) return tag

    const delay = -((flickerIndex / flickerCount) * duration).toFixed(2)
    flickerIndex += 1
    const classAttribute = tag.match(/class="[^"]*"/)
    const flickerClass = classAttribute
      ? classAttribute[0].replace(/"$/, ' forest-flicker"')
      : 'class="forest-flicker"'
    const animatedTag = classAttribute
      ? tag.replace(classAttribute[0], flickerClass)
      : tag.replace('<rect', '<rect class="forest-flicker"')

    return animatedTag.replace(/\s*\/>$/, ` style="--pixel-delay:${delay}s;--pixel-duration:${duration}s" />`)
  })
}

function PixelForest({ src }) {
  const [markup, setMarkup] = useState('')

  useEffect(() => {
    let active = true

    fetch(src)
      .then((response) => {
        if (!response.ok) throw new Error(`Unable to load ${src}`)
        return response.text()
      })
      .then((source) => {
        if (active) setMarkup(preparePixelForest(source))
      })
      .catch(() => {
        if (active) setMarkup('')
      })

    return () => {
      active = false
    }
  }, [src])

  return <div className="entry-forest-pixels" aria-hidden="true" dangerouslySetInnerHTML={{ __html: markup }} />
}

export default PixelForest
