import { useEffect, useRef, useState } from 'react'
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist'

export type QuarterlyPdfViewerProps = {
  url: string
  pageCount: number
  fileName?: string
  mobile?: boolean
}

type PdfJsModule = typeof import('pdfjs-dist')
type PdfLoadingTask = ReturnType<PdfJsModule['getDocument']>

const pdfWorkerUrl = new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url).toString()

function getPdfSource(url: string) {
  if (!import.meta.env.DEV) return url

  try {
    const parsedUrl = new URL(url)
    if (parsedUrl.hostname !== 'cdn.sanity.io') return url
    return `/__sanity-pdf${parsedUrl.pathname}${parsedUrl.search}`
  } catch {
    return url
  }
}

function QuarterlyPdfViewer({ url, pageCount, fileName, mobile = false }: QuarterlyPdfViewerProps) {
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null)
  const [loadedPageCount, setLoadedPageCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [containerWidth, setContainerWidth] = useState(0)
  const viewerRef = useRef<HTMLDivElement>(null)
  const canvasRefs = useRef(new Map<number, HTMLCanvasElement>())
  const renderTasksRef = useRef(new Map<number, RenderTask>())
  const renderGenerationRef = useRef(0)
  const safePageCount = Math.max(1, loadedPageCount ?? pageCount)
  const pdfSource = getPdfSource(url)

  useEffect(() => {
    let cancelled = false
    let loadingTask: PdfLoadingTask | undefined
    let loadedDocument: PDFDocumentProxy | undefined

    setPdfDocument(null)
    setLoadedPageCount(null)
    setIsLoading(true)
    setLoadError(false)

    const loadDocument = async () => {
      try {
        const pdfjs = await import('pdfjs-dist')
        if (cancelled) return

        pdfjs.GlobalWorkerOptions.workerSrc = pdfWorkerUrl
        loadingTask = pdfjs.getDocument({ url: pdfSource })
        loadedDocument = await loadingTask.promise

        if (cancelled) return

        setPdfDocument(loadedDocument)
        setLoadedPageCount(loadedDocument.numPages)
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
  }, [pdfSource])

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
    if (!pdfDocument || containerWidth <= 0) return

    let cancelled = false
    const generation = renderGenerationRef.current + 1
    renderGenerationRef.current = generation
    renderTasksRef.current.forEach((task) => task.cancel())
    renderTasksRef.current.clear()

    const renderPages = async () => {
      setIsLoading(true)

      try {
        for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
          if (cancelled || renderGenerationRef.current !== generation) return

          const canvas = canvasRefs.current.get(pageNumber)
          if (!canvas) continue

          const pdfPage = await pdfDocument.getPage(pageNumber)
          if (cancelled || renderGenerationRef.current !== generation) {
            pdfPage.cleanup()
            return
          }

          const baseViewport = pdfPage.getViewport({ scale: 1 })
          const scale = containerWidth / baseViewport.width
          const outputScale = Math.min(window.devicePixelRatio || 1, mobile ? 1.25 : 2)
          const renderViewport = pdfPage.getViewport({ scale: scale * outputScale })
          const context = canvas.getContext('2d')

          if (!context) {
            pdfPage.cleanup()
            throw new Error('Canvas is unavailable')
          }

          canvas.width = Math.floor(renderViewport.width)
          canvas.height = Math.floor(renderViewport.height)
          canvas.style.width = '100%'
          canvas.style.height = 'auto'
          context.clearRect(0, 0, canvas.width, canvas.height)

          const renderTask = pdfPage.render({ canvasContext: context, canvas, viewport: renderViewport })
          renderTasksRef.current.set(pageNumber, renderTask)

          try {
            await renderTask.promise
          } finally {
            if (renderTasksRef.current.get(pageNumber) === renderTask) {
              renderTasksRef.current.delete(pageNumber)
            }
            pdfPage.cleanup()
          }
        }

        if (!cancelled && renderGenerationRef.current === generation) setIsLoading(false)
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
  }, [containerWidth, loadedPageCount, mobile, pdfDocument])

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-ink-primary">
      <div ref={viewerRef} className="retroScrollArea relative flex min-h-0 min-w-0 flex-1 flex-col items-center overflow-x-hidden overflow-y-auto bg-ink-primary p-space-sm">
        <div className="flex min-w-0 w-full flex-col items-center gap-space-sm">
          {loadError ? (
            <div className="flex min-h-full w-full flex-col bg-window-surface">
              <iframe
                src={url}
                title={fileName ? `PDF：${fileName}` : '季刊 PDF'}
                className="min-h-[32rem] w-full flex-1 border-0 bg-window-surface"
              />
              <p className="shrink-0 p-space-md text-center font-ui text-small text-ink-primary">
                若 PDF 沒有自動顯示，請使用下方連結開啟原始檔案。
              </p>
            </div>
          ) : (
            Array.from({ length: safePageCount }, (_, index) => index + 1).map((pageNumber) => (
              <canvas
                key={pageNumber}
                ref={(canvas) => {
                  if (canvas) canvasRefs.current.set(pageNumber, canvas)
                  else canvasRefs.current.delete(pageNumber)
                }}
                aria-label={fileName ? `PDF：${fileName}，第 ${pageNumber} 頁` : `季刊 PDF，第 ${pageNumber} 頁`}
                className="block h-auto w-full max-w-full bg-window-surface shadow-window"
              />
            ))
          )}
        </div>

        {isLoading && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-ink-primary/80 px-space-xl text-center font-ui text-small text-ink-inverse">
            <span role="status">PDF 載入中…</span>
          </div>
        )}
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
