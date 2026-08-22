import { useEffect, useState } from 'react'
import type { CSSProperties } from 'react'

type TransitionStage = 'covering' | 'revealing' | null

type PixelGridTransitionProps = {
  stage: TransitionStage
  onCoverComplete: () => void
  onRevealComplete: () => void
}

type GridPosition = {
  column: number
  row: number
}

type GridCell = GridPosition & {
  coverDelay: number
  revealDelay: number
}

type PixelGrid = {
  cellSize: number
  cells: GridCell[]
}

type TransitionStyles = CSSProperties & Record<`--${string}`, string | number>

const PIXEL_GRID_UNIT = 12.27
const DESKTOP_BREAKPOINT = 768
const DESKTOP_PIXEL_SCALE = 1
const COVER_TRANSITION_DURATION = 620
const REVEAL_TRANSITION_DURATION = 620
const CELL_ANIMATION_DURATION = 80

function shuffle<T>(values: readonly T[]) {
  const result = [...values]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }

  return result
}

function getCellSize(width: number) {
  // Fractional cell edges can be rasterised as 1px seams on mobile browsers.
  // Keep the same small integer pixel unit across mobile and desktop.
  const pixelScale = width >= DESKTOP_BREAKPOINT ? DESKTOP_PIXEL_SCALE : 1
  return Math.max(1, Math.round(PIXEL_GRID_UNIT * pixelScale))
}

function createBalancedOrder(columns: number, rows: number): GridPosition[] {
  const regionColumns = Math.min(8, columns)
  const regionRows = Math.min(8, rows)
  const regions: GridPosition[][] = Array.from({ length: regionColumns * regionRows }, () => [])

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const regionColumn = Math.min(regionColumns - 1, Math.floor((column / columns) * regionColumns))
      const regionRow = Math.min(regionRows - 1, Math.floor((row / rows) * regionRows))
      const regionIndex = regionRow * regionColumns + regionColumn
      regions[regionIndex].push({ column, row })
    }
  }

  const shuffledRegions = shuffle(regions.map((region) => shuffle(region)))
  const order: GridPosition[] = []
  const longestRegion = Math.max(...shuffledRegions.map((region) => region.length))

  for (let index = 0; index < longestRegion; index += 1) {
    shuffledRegions.forEach((region) => {
      if (region[index]) order.push(region[index])
    })
  }

  return order
}

function createGrid(width: number, height: number): PixelGrid {
  const cellSize = getCellSize(width)
  const columns = Math.ceil(width / cellSize)
  const rows = Math.ceil(height / cellSize)
  const coverOrder = createBalancedOrder(columns, rows)
  const revealOrder = createBalancedOrder(columns, rows)
  const revealIndices = new Map(revealOrder.map(({ column, row }, index) => [`${column}:${row}`, index]))
  const coverDelayRange = COVER_TRANSITION_DURATION - CELL_ANIMATION_DURATION
  const revealDelayRange = REVEAL_TRANSITION_DURATION - CELL_ANIMATION_DURATION

  return {
    cellSize,
    cells: coverOrder.map(({ column, row }, index) => ({
      column,
      row,
      coverDelay: (index / Math.max(coverOrder.length - 1, 1)) * coverDelayRange,
      revealDelay:
        ((revealIndices.get(`${column}:${row}`) ?? 0) / Math.max(revealOrder.length - 1, 1)) *
        revealDelayRange,
    })),
  }
}

function PixelGridTransition({
  stage,
  onCoverComplete,
  onRevealComplete,
}: PixelGridTransitionProps) {
  const [grid, setGrid] = useState<PixelGrid | null>(() => {
    if (typeof window === 'undefined') return null
    return createGrid(window.innerWidth, window.innerHeight)
  })

  useEffect(() => {
    const updateGrid = () => setGrid(createGrid(window.innerWidth, window.innerHeight))
    if (!grid) updateGrid()
    window.addEventListener('resize', updateGrid)

    return () => window.removeEventListener('resize', updateGrid)
  }, [grid])

  useEffect(() => {
    if (!grid || !stage) return undefined

    const complete = stage === 'covering' ? onCoverComplete : onRevealComplete
    const duration = stage === 'covering' ? COVER_TRANSITION_DURATION : REVEAL_TRANSITION_DURATION
    const timer = window.setTimeout(complete, duration)

    return () => window.clearTimeout(timer)
  }, [grid, onCoverComplete, onRevealComplete, stage])

  if (!grid) return null

  return (
    <div
      className={`pixel-grid-transition pixel-grid-transition--${stage ?? 'idle'}`}
      aria-hidden="true"
      style={
        {
          '--transition-cell-size': `${grid.cellSize}px`,
          visibility: stage ? 'visible' : 'hidden',
        } as TransitionStyles
      }
    >
      {grid.cells.map(({ column, row, coverDelay, revealDelay }) => (
        <span
          key={`${column}:${row}`}
          className="pixel-grid-transition__cell"
          style={
            {
              '--transition-column': column,
              '--transition-row': row,
              '--transition-cover-delay': `${coverDelay}ms`,
              '--transition-reveal-delay': `${revealDelay}ms`,
            } as TransitionStyles
          }
        />
      ))}
    </div>
  )
}

export default PixelGridTransition
