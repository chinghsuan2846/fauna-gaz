import { useState } from 'react'

import { faqContent, privacyPolicy, termsOfUse, type LegalBlock, type LegalDocumentContent } from '../../lib/legalContent'
import { Button } from './Button'
import type { WindowMode, WindowProps } from './Window'
import Window from './Window'

export type LegalDocument = 'privacy' | 'terms' | 'faq'

const legalDocumentIds: LegalDocument[] = ['privacy', 'terms']

export type LegalWindowProps = {
  mode?: WindowMode
  initialDocument?: LegalDocument
  standalone?: boolean
  className?: string
  onClose?: WindowProps['onClose']
}

const documentCopy: Record<LegalDocument, LegalDocumentContent> = {
  privacy: privacyPolicy,
  terms: termsOfUse,
  faq: faqContent,
}

function renderLegalBlock(block: LegalBlock, index: number) {
  if (block.type === 'list') {
    return (
      <ul key={`list-${index}`} className="legal-document-list">
        {block.items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    )
  }

  return <p key={`paragraph-${index}`}>{block.text}</p>
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
            {legalDocumentIds.map((documentId) => {
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
          <article className={`site-info-content legal-document font-body${isMobile ? ' text-small' : ''}`}>
            <header className="legal-document-header">
              <h3>{selectedDocument.title}</h3>
              {selectedDocument.updatedAt && <p className="legal-document-updated">{selectedDocument.updatedAt}</p>}
              {selectedDocument.intro && <p className="legal-document-intro">{selectedDocument.intro}</p>}
            </header>

            <div className="legal-document-sections">
              {selectedDocument.sections.map((section, sectionIndex) => (
                <section key={section.heading ?? `section-${sectionIndex}`} className="legal-document-section">
                  {section.heading && <h4>{section.heading}</h4>}
                  <div className="legal-document-blocks">{section.blocks.map(renderLegalBlock)}</div>
                </section>
              ))}
            </div>
          </article>
        </div>
      </div>
    </Window>
  )
}

export default LegalWindow
