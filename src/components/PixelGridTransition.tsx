import { useEffect, useRef, useState } from 'react'

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
  revealCells: GridCell[]
}

type CanvasFrame = {
  context: CanvasRenderingContext2D
  width: number
  height: number
}

const PIXEL_GRID_UNIT = 12.27
const DESKTOP_BREAKPOINT = 768
const DESKTOP_PIXEL_SCALE = 1
const COVER_TRANSITION_DURATION = 620
const REVEAL_TRANSITION_DURATION = 620
const CELL_ANIMATION_DURATION = 90
const RESIZE_DEBOUNCE_DURATION = 120
const MAX_CANVAS_DEVICE_PIXEL_RATIO = 2

function shuffle<T>(values: readonly T[]) {
  const result = [...values]

  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[result[index], result[randomIndex]] = [result[randomIndex], result[index]]
  }

  return result
}

function getCellSize(width: number) {
  // Keep the existing small pixel unit so the visual density does not change.
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
  const cells = coverOrder.map(({ column, row }, index) => ({
    column,
    row,
    coverDelay: (index / Math.max(coverOrder.length - 1, 1)) * coverDelayRange,
    revealDelay:
      ((revealIndices.get(`${column}:${row}`) ?? 0) / Math.max(revealOrder.length - 1, 1)) *
      revealDelayRange,
  }))

  return {
    cellSize,
    cells,
    revealCells: [...cells].sort((left, right) => left.revealDelay - right.revealDelay),
  }
}

function prepareCanvas(canvas: HTMLCanvasElement): CanvasFrame | null {
  const width = window.innerWidth
  const height = window.innerHeight
  const devicePixelRatio = Math.min(window.devicePixelRatio || 1, MAX_CANVAS_DEVICE_PIXEL_RATIO)

  canvas.width = Math.ceil(width * devicePixelRatio)
  canvas.height = Math.ceil(height * devicePixelRatio)

  const context = canvas.getContext('2d')
  if (!context) return null

  context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
  context.imageSmoothingEnabled = false

  return { context, width, height }
}

function drawCell(context: CanvasRenderingContext2D, cell: GridCell, cellSize: number) {
  context.fillRect(
    cell.column * cellSize,
    cell.row * cellSize,
    cellSize,
    cellSize,
  )
}

function clearCell(context: CanvasRenderingContext2D, cell: GridCell, cellSize: number) {
  context.clearRect(
    cell.column * cellSize,
    cell.row * cellSize,
    cellSize,
    cellSize,
  )
}

function PixelGridTransition({
  stage,
  onCoverComplete,
  onRevealComplete,
}: PixelGridTransitionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stageRef = useRef(stage)
  const completionRef = useRef({ onCoverComplete, onRevealComplete })
  const pendingResizeRef = useRef(false)
  const resizeTimerRef = useRef<number | null>(null)
  const [grid, setGrid] = useState<PixelGrid | null>(null)

  stageRef.current = stage
  completionRef.current = { onCoverComplete, onRevealComplete }

  useEffect(() => {
    setGrid(createGrid(window.innerWidth, window.innerHeight))

    const updateGrid = () => {
      if (stageRef.current) {
        pendingResizeRef.current = true
        return
      }

      if (resizeTimerRef.current !== null) window.clearTimeout(resizeTimerRef.current)
      resizeTimerRef.current = window.setTimeout(() => {
        resizeTimerRef.current = null
        setGrid(createGrid(window.innerWidth, window.innerHeight))
      }, RESIZE_DEBOUNCE_DURATION)
    }

    window.addEventListener('resize', updateGrid)

    return () => {
      window.removeEventListener('resize', updateGrid)
      if (resizeTimerRef.current !== null) window.clearTimeout(resizeTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (stage || !pendingResizeRef.current) return

    pendingResizeRef.current = false
    setGrid(createGrid(window.innerWidth, window.innerHeight))
  }, [stage])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !grid) return undefined

    const frame = prepareCanvas(canvas)
    if (!frame) return undefined

    const { context, width, height } = frame
    context.clearRect(0, 0, width, height)

    if (!stage) return undefined

    const cells = stage === 'covering' ? grid.cells : grid.revealCells
    const delayKey = stage === 'covering' ? 'coverDelay' : 'revealDelay'
    const transitionDuration = stage === 'covering'
      ? COVER_TRANSITION_DURATION
      : REVEAL_TRANSITION_DURATION
    const startedAt = performance.now()
    let nextCellIndex = 0
    let animationFrame = 0
    let completed = false

    context.fillStyle = '#000'
    if (stage === 'revealing') context.fillRect(0, 0, width, height)

    const renderFrame = (timestamp: number) => {
      const elapsed = timestamp - startedAt

      while (
        nextCellIndex < cells.length
        && elapsed >= cells[nextCellIndex][delayKey] + CELL_ANIMATION_DURATION
      ) {
        const cell = cells[nextCellIndex]
        if (stage === 'covering') {
          drawCell(context, cell, grid.cellSize)
        } else {
          clearCell(context, cell, grid.cellSize)
        }
        nextCellIndex += 1
      }

      if (elapsed >= transitionDuration) {
        if (!completed) {
          completed = true
          if (stage === 'covering') completionRef.current.onCoverComplete()
          else completionRef.current.onRevealComplete()
        }
        return
      }

      animationFrame = window.requestAnimationFrame(renderFrame)
    }

    animationFrame = window.requestAnimationFrame(renderFrame)

    return () => window.cancelAnimationFrame(animationFrame)
  }, [grid, stage])

  if (!grid) return null

  return (
    <div
      className={`pixel-grid-transition pixel-grid-transition--${stage ?? 'idle'}`}
      aria-hidden="true"
      style={{ visibility: stage ? 'visible' : 'hidden' }}
    >
      <canvas ref={canvasRef} className="pixel-grid-transition__canvas" aria-hidden="true" />
    </div>
  )
}

export default PixelGridTransition
