import { useState } from 'react'

import { Button } from './Button'
import type { WindowMode, WindowProps } from './Window'
import Window from './Window'

export type LegalDocument = 'privacy' | 'terms'

export type LegalWindowProps = {
  mode?: WindowMode
  initialDocument?: LegalDocument
  className?: string
  onClose?: WindowProps['onClose']
}

const documentCopy: Record<LegalDocument, { label: string; title: string; body: string }> = {
  privacy: {
    label: '隱私權政策',
    title: '隱私權政策',
    body: '這是動物公報預留的隱私權政策內容。正式上線前，請由內容管理者補上完整政策內容。',
  },
  terms: {
    label: '使用條款',
    title: '使用條款',
    body: '這是動物公報預留的使用條款內容。正式上線前，請由內容管理者補上完整條款內容。',
  },
}

function LegalWindow({
  mode = 'desktop',
  initialDocument = 'privacy',
  className = '',
  onClose,
}: LegalWindowProps) {
  const [activeDocument, setActiveDocument] = useState<LegalDocument>(initialDocument)
  const selectedDocument = documentCopy[activeDocument]
  const isMobile = mode === 'mobile'

  return (
    <Window
      mode={mode}
      title="網站資訊"
      className={`h-full min-h-0 ${className}`}
      onClose={onClose}
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col font-body text-ink-primary">
        <nav
          className="flex shrink-0 flex-wrap gap-space-xs border-b-thin border-line-strong bg-window-surface p-space-sm"
          aria-label="法律文件"
        >
          {(Object.keys(documentCopy) as LegalDocument[]).map((documentId) => {
            const document = documentCopy[documentId]
            const isSelected = activeDocument === documentId

            return (
              <Button
                key={documentId}
                label={document.label}
                appearance={isSelected ? 'outline' : 'text'}
                size="small"
                textSize={isMobile ? 'caption' : 'small'}
                ariaLabel={`查看${document.label}`}
                onClick={() => setActiveDocument(documentId)}
              />
            )
          })}
        </nav>

        <div className="retroScrollArea min-h-0 min-w-0 flex-1 overflow-y-auto p-space-md">
          <article className="grid gap-space-md">
            <h3 className="font-ui text-title font-regular">{selectedDocument.title}</h3>
            <p className="text-body">{selectedDocument.body}</p>
          </article>
        </div>
      </div>
    </Window>
  )
}

export default LegalWindow
