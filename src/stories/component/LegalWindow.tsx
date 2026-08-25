import { useState } from 'react'

import { Button } from './Button'
import type { WindowMode, WindowProps } from './Window'
import Window from './Window'

export type LegalDocument = 'privacy' | 'terms' | 'faq'

export type LegalWindowProps = {
  mode?: WindowMode
  initialDocument?: LegalDocument
  standalone?: boolean
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
  faq: {
    label: 'FAQ',
    title: '常見問題',
    body: '動物公報是什麼？\n動物公報是一份以動物行為學為主題的季刊。\n\n要如何閱讀季刊？\n點選桌面上的「季刊」圖示，即可瀏覽目前收錄的文章。\n\n可以投稿或聯絡編輯嗎？\n可以，請從「聯絡我」視窗寄信給我們。',
  },
}

function LegalWindow({
  mode = 'desktop',
  initialDocument = 'privacy',
  standalone = false,
  className = '',
  onClose,
}: LegalWindowProps) {
  const [activeDocument, setActiveDocument] = useState<LegalDocument>(initialDocument)
  const selectedDocument = documentCopy[activeDocument]
  const isMobile = mode === 'mobile'

  return (
    <Window
      mode={mode}
      title={standalone ? 'FAQ' : '網站資訊'}
      className={`h-full min-h-0 ${className}`}
      onClose={onClose}
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col text-ink-primary">
        {!standalone && (
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
                  textSize="small"
                  ariaLabel={`查看${document.label}`}
                  onClick={() => setActiveDocument(documentId)}
                />
              )
            })}
          </nav>
        )}

        <div className="retroScrollArea min-h-0 min-w-0 flex-1 overflow-y-auto p-space-md">
          <article className={`site-info-content grid gap-space-md font-body${isMobile ? ' text-small' : ''}`}>
            <h3 className="font-body font-regular">{selectedDocument.title}</h3>
            <p className="whitespace-pre-wrap">{selectedDocument.body}</p>
          </article>
        </div>
      </div>
    </Window>
  )
}

export default LegalWindow
