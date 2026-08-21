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
  const coverageSeed = Math.abs(Math.round(x * 7 + y * 11 + width * 3 + height * 5) + id * 17)
  const isSmallLeaf = width <= 24.54 && height <= 24.54
  const isCanopyLeaf = y < 560 && isSmallLeaf && leafClasses.has(classes[0])

  return { isCanopyLeaf, seed, coverageSeed }
}

function isFlickerCandidate(tag) {
  const { isCanopyLeaf, coverageSeed } = getPixelData(tag)
  return isCanopyLeaf && coverageSeed % 2 === 0 && !isFallingCandidate(tag)
}

function isFallingCandidate(tag) {
  const { isCanopyLeaf, seed } = getPixelData(tag)
  const width = Number.parseFloat(getAttribute(tag, 'width') || '0')
  const height = Number.parseFloat(getAttribute(tag, 'height') || '0')
  const isSinglePixel = width <= 12.28 && height <= 12.28

  return isCanopyLeaf && isSinglePixel && seed % 23 === 0
}

function isGrassCandidate(tag) {
  const { isCanopyLeaf, coverageSeed } = getPixelData(tag)
  const y = Number.parseFloat(getAttribute(tag, 'y') || '0')
  const width = Number.parseFloat(getAttribute(tag, 'width') || '0')
  const height = Number.parseFloat(getAttribute(tag, 'height') || '0')
  const classes = getAttribute(tag, 'class').split(/\s+/)
  const isSmallGrass = width <= 24.54 && height <= 24.54

  return !isCanopyLeaf && y > 760 && isSmallGrass && leafClasses.has(classes[0]) && coverageSeed % 3 !== 1
}

function addAnimationClass(tag, className, style) {
  const classAttribute = tag.match(/class="[^"]*"/)
  const animatedClass = classAttribute
    ? classAttribute[0].replace(/"$/, ` ${className}"`)
    : `class="${className}"`
  const animatedTag = classAttribute
    ? tag.replace(classAttribute[0], animatedClass)
    : tag.replace('<rect', `<rect ${animatedClass}`)

  return animatedTag.replace(/\s*\/>$/, ` style="${style}" />`)
}

function createOverlaySvg(svg, rects) {
  const openingTag = svg.match(/<svg\b[^>]*>/i)?.[0] ?? ''
  const defs = svg.match(/<defs>[\s\S]*?<\/defs>/i)?.[0] ?? ''

  return `${openingTag}${defs}<g shape-rendering="crispEdges">${rects.join('')}</g></svg>`
}

function preparePixelForest(source) {
  const svg = source
    .replace(/<\?xml[\s\S]*?\?>\s*/i, '')
    .replace(/<!DOCTYPE[\s\S]*?>\s*/i, '')
    .replace(/<svg\b/, '<svg preserveAspectRatio="xMidYMid slice"')

  const rectTags = [...svg.matchAll(/<rect\b[^>]*>/g)].map(([tag]) => tag)
  const flickerCount = rectTags.filter(isFlickerCandidate).length
  const fallingCount = rectTags.filter(isFallingCandidate).length
  const grassCount = rectTags.filter(isGrassCandidate).length
  const duration = 26
  const grassDuration = duration
  let flickerIndex = 0
  let fallingIndex = 0
  let grassIndex = 0
  const flickerRects = []
  const fallingRects = []
  const grassRects = []

  rectTags.forEach((tag) => {
    if (isFallingCandidate(tag)) {
      const { seed } = getPixelData(tag)
      const fallDuration = 30 + (fallingIndex % 3) * 4
      const fallPhaseIndex = (fallingIndex * 5) % Math.max(fallingCount, 1)
      const fallDelay = -((fallPhaseIndex / Math.max(fallingCount, 1)) * fallDuration).toFixed(2)
      const fallX = ((seed % 7) - 3) * 4
      const fallY = 210 + (seed % 5) * 24
      fallingIndex += 1

      fallingRects.push(addAnimationClass(
        tag,
        'forest-fall',
        `--fall-delay:${fallDelay}s;--fall-duration:${fallDuration}s;--fall-x:${fallX}px;--fall-y:${fallY}px`,
      ))
      return
    }

    if (isGrassCandidate(tag)) {
      const { seed } = getPixelData(tag)
      const grassPhaseIndex = (grassIndex * 29) % Math.max(grassCount, 1)
      const grassDelay = -((grassPhaseIndex / Math.max(grassCount, 1)) * grassDuration).toFixed(2)
      const grassX = (seed % 2 === 0 ? 1 : -1) * 1.5
      grassIndex += 1

      grassRects.push(addAnimationClass(
        tag,
        'forest-grass',
        `--grass-delay:${grassDelay}s;--grass-duration:${grassDuration}s;--grass-x:${grassX}px`,
      ))
      return
    }

    if (!isFlickerCandidate(tag)) return

    const flickerPhaseIndex = (flickerIndex * 37) % Math.max(flickerCount, 1)
    const delay = -((flickerPhaseIndex / Math.max(flickerCount, 1)) * duration).toFixed(2)
    flickerIndex += 1

    flickerRects.push(addAnimationClass(tag, 'forest-flicker', `--pixel-delay:${delay}s;--pixel-duration:${duration}s`))
  })

  return {
    flicker: createOverlaySvg(svg, flickerRects),
    falling: createOverlaySvg(svg, fallingRects),
    grass: createOverlaySvg(svg, grassRects),
  }
}

function PixelForest({ src }) {
  const [markup, setMarkup] = useState({ flicker: '', falling: '', grass: '' })

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

  return (
    <>
      <div className="entry-forest-pixels" aria-hidden="true" dangerouslySetInnerHTML={{ __html: markup.flicker }} />
      <div className="entry-forest-falling-pixels" aria-hidden="true" dangerouslySetInnerHTML={{ __html: markup.falling }} />
      <div className="entry-forest-grass-pixels" aria-hidden="true" dangerouslySetInnerHTML={{ __html: markup.grass }} />
    </>
  )
}

export default PixelForest
