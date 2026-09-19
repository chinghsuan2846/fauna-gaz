import { useEffect, useRef, useState } from 'react'
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist'

export type QuarterlyPdfViewerProps = {
  url: string
  pageCount: number
  fileName?: string
  mobile?: boolean
  onLoadingChange?: (isLoading: boolean) => void
}

type PdfJsModule = typeof import('pdfjs-dist')
type PdfLoadingTask = ReturnType<PdfJsModule['getDocument']>
type PageSize = {
  width: number
  height: number
}

const pdfWorkerUrl = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

function getPdfSource(url: string) {
  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.hostname !== 'cdn.sanity.io') return url
    return `/__sanity-pdf${parsedUrl.pathname}${parsedUrl.search}`
  } catch {
    return url
  }
}

function QuarterlyPdfViewer({ url, pageCount, fileName, mobile = false, onLoadingChange }: QuarterlyPdfViewerProps) {
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null)
  const [loadedPageCount, setLoadedPageCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const [pageSizes, setPageSizes] = useState<PageSize[]>([])
  const [visiblePageNumbers, setVisiblePageNumbers] = useState<Set<number>>(() => new Set([1]))
  const [retryCount, setRetryCount] = useState(0)
  const viewerRef = useRef<HTMLDivElement>(null)
  const canvasRefs = useRef(new Map<number, HTMLCanvasElement>())
  const pageContainerRefs = useRef(new Map<number, HTMLDivElement>())
  const renderTasksRef = useRef(new Map<number, RenderTask>())
  const renderGenerationRef = useRef(0)
  const renderedPageNumbersRef = useRef(new Set<number>())
  const pendingPageNumbersRef = useRef(new Set<number>())
  const lastRenderWidthRef = useRef(0)
  const hasRenderedFirstPageRef = useRef(false)
  const safePageCount = Math.max(1, loadedPageCount ?? pageCount)
  const pdfSource = getPdfSource(url)

  useEffect(() => {
    onLoadingChange?.(isLoading)
  }, [isLoading, onLoadingChange])

  useEffect(() => {
    let cancelled = false
    let loadingTask: PdfLoadingTask | undefined
    let loadedDocument: PDFDocumentProxy | undefined

    setPdfDocument(null)
    setLoadedPageCount(null)
    setIsLoading(true)
    setLoadError(false)
    setPageSizes([])
    setVisiblePageNumbers(new Set([1]))
    renderedPageNumbersRef.current.clear()
    pendingPageNumbersRef.current.clear()
    lastRenderWidthRef.current = 0
    hasRenderedFirstPageRef.current = false

    const loadDocument = async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        if (cancelled) return

        pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl
        loadingTask = pdfjs.getDocument({ url: pdfSource })
        loadedDocument = await loadingTask.promise

        if (cancelled) return

        const nextPageSizes = await Promise.all(
          Array.from({ length: loadedDocument.numPages }, async (_, index) => {
            const page = await loadedDocument!.getPage(index + 1)
            const viewport = page.getViewport({ scale: 1 })
            page.cleanup()
            return { width: viewport.width, height: viewport.height }
          }),
        )

        if (cancelled) return

        setPdfDocument(loadedDocument)
        setLoadedPageCount(loadedDocument.numPages)
        setPageSizes(nextPageSizes)
      } catch {
        if (cancelled) return
        setIsLoading(false)
        setLoadError(true)
      }
    }

    void loadDocument()

    return () => {
      cancelled = true
      void loadingTask?.destroy()
      loadedDocument?.cleanup()
    }
  }, [pdfSource, retryCount])

  useEffect(() => {
    if (!pdfDocument || pageSizes.length === 0) return

    const scrollRoot = viewerRef.current?.closest<HTMLElement>('.retroScrollArea') ?? null
    const observer = new IntersectionObserver((entries) => {
      setVisiblePageNumbers((current) => {
        const next = new Set(current)

        entries.forEach((entry) => {
          const pageNumber = Number((entry.target as HTMLElement).dataset.pdfPage)
          if (!Number.isInteger(pageNumber) || pageNumber <= 0) return

          if (entry.isIntersecting) {
            next.add(pageNumber)
            return
          }

          next.delete(pageNumber)
          renderedPageNumbersRef.current.delete(pageNumber)
          const canvas = canvasRefs.current.get(pageNumber)
          if (canvas) {
            canvas.width = 0
            canvas.height = 0
          }
        })

        return next.size === current.size ? current : next
      })
    }, { root: scrollRoot, rootMargin: '800px 0px' })

    pageContainerRefs.current.forEach((container) => observer.observe(container))
    return () => observer.disconnect()
  }, [pdfDocument, pageSizes])

  useEffect(() => {
    const element = viewerRef.current
    if (!element) return

    const updateSize = () => {
      const styles = window.getComputedStyle(element)
      const horizontalPadding = Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight)

      setContainerWidth(Math.max(0, element.clientWidth - horizontalPadding))
    }

    updateSize()
    const observer = new ResizeObserver(updateSize)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!pdfDocument || pageSizes.length === 0 || containerWidth <= 0) return

    let cancelled = false
    const generation = renderGenerationRef.current + 1
    renderGenerationRef.current = generation

    if (lastRenderWidthRef.current !== containerWidth) {
      renderedPageNumbersRef.current.clear()
      pendingPageNumbersRef.current.clear()
      canvasRefs.current.forEach((canvas) => {
        canvas.width = 0
        canvas.height = 0
      })
      lastRenderWidthRef.current = containerWidth
    }

    renderTasksRef.current.forEach((task) => task.cancel())
    renderTasksRef.current.clear()

    const renderPages = async () => {
      if (!hasRenderedFirstPageRef.current) setIsLoading(true)

      try {
        const pagesToRender = [...visiblePageNumbers].sort((left, right) => left - right)

        for (const pageNumber of pagesToRender) {
          if (cancelled || renderGenerationRef.current !== generation) return
          if (renderedPageNumbersRef.current.has(pageNumber) || pendingPageNumbersRef.current.has(pageNumber)) continue

          const canvas = canvasRefs.current.get(pageNumber)
          if (!canvas) continue

          pendingPageNumbersRef.current.add(pageNumber)
          let pdfPage: Awaited<ReturnType<PDFDocumentProxy['getPage']>> | undefined

          try {
            pdfPage = await pdfDocument.getPage(pageNumber)
            if (cancelled || renderGenerationRef.current !== generation) return

            const pageSize = pageSizes[pageNumber - 1]
            const scale = containerWidth / pageSize.width
            const outputScale = Math.min(Math.max(window.devicePixelRatio || 1, 1.5), mobile ? 1.5 : 2)
            const renderViewport = pdfPage.getViewport({ scale: scale * outputScale })
            const context = canvas.getContext('2d')

            if (!context) throw new Error('Canvas is unavailable')

            canvas.width = Math.floor(renderViewport.width)
            canvas.height = Math.floor(renderViewport.height)
            canvas.style.width = '100%'
            canvas.style.height = '100%'
            context.clearRect(0, 0, canvas.width, canvas.height)

            const renderTask = pdfPage.render({ canvasContext: context, canvas, viewport: renderViewport })
            renderTasksRef.current.set(pageNumber, renderTask)
            if (pageNumber === 1 && !hasRenderedFirstPageRef.current) {
              hasRenderedFirstPageRef.current = true
              setIsLoading(false)
            }
            await renderTask.promise
            renderedPageNumbersRef.current.add(pageNumber)
          } finally {
            const renderTask = renderTasksRef.current.get(pageNumber)
            if (renderTask && renderTasksRef.current.get(pageNumber) === renderTask) {
              renderTasksRef.current.delete(pageNumber)
            }
            pendingPageNumbersRef.current.delete(pageNumber)
            pdfPage?.cleanup()
          }
        }

        if (!cancelled && renderGenerationRef.current === generation && hasRenderedFirstPageRef.current) setIsLoading(false)
      } catch (renderError) {
        if (cancelled || renderGenerationRef.current !== generation || (renderError as { name?: string }).name === 'RenderingCancelledException') return
        setIsLoading(false)
        setLoadError(true)
      }
    }

    void renderPages()

    return () => {
      cancelled = true
      renderTasksRef.current.forEach((task) => task.cancel())
      renderTasksRef.current.clear()
    }
  }, [containerWidth, mobile, pageSizes, pdfDocument, visiblePageNumbers])

  return (
    <div className="flex w-full min-w-0 flex-col bg-ink-primary">
      <div ref={viewerRef} className="relative flex min-w-0 flex-col items-center bg-ink-primary p-space-sm">
        <div className="flex min-w-0 w-full flex-col items-center gap-space-sm">
          {loadError ? (
            <div
              role="alert"
              className="grid min-h-[16rem] w-full place-items-center gap-space-md bg-window-surface p-space-xl text-center font-ui text-small text-ink-primary"
            >
              <div className="grid gap-space-sm">
                <strong className="font-medium">PDF 載入失敗</strong>
                <span>目前無法在此視窗顯示這份 PDF，請稍後再試。</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-space-md">
                <button
                  type="button"
                  className="text-action-link underline decoration-action-link underline-offset-2"
                  onClick={() => setRetryCount((count) => count + 1)}
                >
                  重新載入
                </button>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-action-link underline decoration-action-link underline-offset-2"
                >
                  開啟原始 PDF
                </a>
              </div>
            </div>
          ) : (
            Array.from({ length: safePageCount }, (_, index) => index + 1).map((pageNumber) => (
              <div
                key={pageNumber}
                ref={(container) => {
                  if (container) pageContainerRefs.current.set(pageNumber, container)
                  else pageContainerRefs.current.delete(pageNumber)
                }}
                data-pdf-page={pageNumber}
                style={pageSizes[pageNumber - 1] ? { aspectRatio: `${pageSizes[pageNumber - 1].width} / ${pageSizes[pageNumber - 1].height}` } : undefined}
                className="relative block min-h-[16rem] w-full max-w-full overflow-hidden bg-window-surface shadow-window"
              >
                <canvas
                  ref={(canvas) => {
                    if (canvas) canvasRefs.current.set(pageNumber, canvas)
                    else canvasRefs.current.delete(pageNumber)
                  }}
                  aria-label={fileName ? `PDF：${fileName}，第 ${pageNumber} 頁` : `季刊 PDF，第 ${pageNumber} 頁`}
                  className="absolute inset-0 block h-full w-full max-w-full"
                />
              </div>
            ))
          )}
        </div>

      </div>

      <div className="flex shrink-0 items-center justify-center gap-space-sm border-t-thin border-line-strong bg-window-surface px-space-sm py-space-xs font-ui text-caption text-ink-primary">
        <span aria-live="polite">共 {safePageCount} 頁</span>
        {fileName && <span className="min-w-0 max-w-[45%] truncate" title={fileName}>{fileName}</span>}
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="text-action-link underline decoration-action-link underline-offset-2"
        >
          開啟 PDF
        </a>
      </div>
    </div>
  )
}

export default QuarterlyPdfViewer
