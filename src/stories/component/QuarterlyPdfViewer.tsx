import { useEffect, useState } from 'react'

import { Button } from './Button'

export type QuarterlyPdfViewerProps = {
  url: string
  pageCount: number
  fileName?: string
  mobile?: boolean
}

function QuarterlyPdfViewer({ url, pageCount, fileName, mobile = false }: QuarterlyPdfViewerProps) {
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const safePageCount = Math.max(1, pageCount)

  useEffect(() => {
    setPage(1)
    setIsLoading(true)
  }, [url])

  useEffect(() => {
    setIsLoading(true)
  }, [page])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') setPage((current) => Math.max(1, current - 1))
      if (event.key === 'ArrowRight') setPage((current) => Math.min(safePageCount, current + 1))
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [safePageCount])

  const pdfSrc = `${url}#page=${page}&view=FitH&toolbar=0&navpanes=0&scrollbar=0`
  const buttonSize: 'small' | 'large' = mobile ? 'small' : 'large'
  const buttonPadding: 'close' | 'close-mobile' = mobile ? 'close-mobile' : 'close'

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-ink-primary">
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <iframe
          key={pdfSrc}
          title={fileName ? `PDF：${fileName}` : '季刊 PDF'}
          src={pdfSrc}
          className="h-full w-full border-0 bg-window-surface"
          onLoad={() => setIsLoading(false)}
        />

        {isLoading && (
          <div className="pointer-events-none absolute inset-0 grid place-items-center bg-ink-primary px-space-xl text-center font-ui text-small text-ink-inverse">
            <span role="status">PDF 載入中…</span>
          </div>
        )}

        <Button
          icon="chevron-left"
          iconOnly
          iconSize={buttonSize}
          size="small"
          padding={buttonPadding}
          ariaLabel="PDF 上一頁"
          state={page > 1 ? 'default' : 'disabled'}
          className="absolute left-space-sm top-1/2 z-10 -translate-y-1/2 shadow-window"
          onClick={() => setPage((current) => Math.max(1, current - 1))}
        />
        <Button
          icon="chevron-right"
          iconOnly
          iconSize={buttonSize}
          size="small"
          padding={buttonPadding}
          ariaLabel="PDF 下一頁"
          state={page < safePageCount ? 'default' : 'disabled'}
          className="absolute right-space-sm top-1/2 z-10 -translate-y-1/2 shadow-window"
          onClick={() => setPage((current) => Math.min(safePageCount, current + 1))}
        />
      </div>

      <div className="flex shrink-0 items-center justify-center gap-space-sm border-t-thin border-line-strong bg-window-surface px-space-sm py-space-xs font-ui text-caption text-ink-primary">
        <span aria-live="polite">第 {page} / {safePageCount} 頁</span>
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
  )
}

export default QuarterlyPdfViewer
