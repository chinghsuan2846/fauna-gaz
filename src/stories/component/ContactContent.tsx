import type { ContactInfo } from '../../lib/contentAdapter'
import type { ButtonProps } from './Button'
import { Button } from './Button'

export const SUPPORT_LINKS = {
  international: 'https://ko-fi.com/ningc77',
  taiwan: 'https://portaly.cc/ningc77',
} as const

export type ContactContentProps = {
  contact: ContactInfo
  isMobile?: boolean
  onSupport?: ButtonProps['onClick']
}

function renderCopy(copy: string) {
  return copy.split(/\r?\n/).map((line, index, lines) => (
    <span key={`${line}-${index}`}>
      {line.split(/(\*\*[^*]+\*\*)/g).map((part, partIndex) => {
        const boldMatch = part.match(/^\*\*(.+)\*\*$/)
        return boldMatch ? (
          <strong key={`${part}-${partIndex}`} className="font-medium">{boldMatch[1]}</strong>
        ) : (
          <span key={`${part}-${partIndex}`}>{part}</span>
        )
      })}
      {index < lines.length - 1 && <br />}
    </span>
  ))
}

function ContactContent({ contact, isMobile = false, onSupport }: ContactContentProps) {
  const contentTextClass = isMobile ? 'text-small' : 'text-body'
  const contentPaddingClass = isMobile ? 'p-space-md' : 'p-space-lg'

  return (
    <div className={`flex min-h-0 min-w-0 flex-1 flex-col font-body ${contentTextClass} text-ink-primary`}>
      <div className="retroScrollArea min-h-0 min-w-0 flex-1 overflow-x-auto overflow-y-auto">
        <div className={`grid min-w-0 gap-space-md ${contentPaddingClass} break-words`}>
          <p>{renderCopy(contact.contactCopy)}</p>
          <a className="w-fit max-w-full break-words font-body text-action-link underline" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>

          <div role="separator" className="border-t-thin border-dashed border-line-subtle" />

          <p>{renderCopy(contact.supportCopy)}</p>
        </div>
      </div>

      <div className="window-footer grid min-h-[3rem] shrink-0 grid-cols-2 gap-space-md p-space-md">
        <Button
          appearance="outline"
          label="Support Us"
          subLabel="International Readers"
          href={SUPPORT_LINKS.international}
          size="small"
          textSize="small"
          padding="footer-hug"
          className="window-footer-action w-full min-w-0 whitespace-normal"
          ariaLabel="Support Us, International Readers"
          onClick={onSupport}
        />
        <Button
          appearance="outline"
          label="支持我們"
          subLabel="台灣讀者"
          href={SUPPORT_LINKS.taiwan}
          size="small"
          textSize="small"
          padding="footer-hug"
          className="window-footer-action w-full min-w-0 whitespace-normal"
          ariaLabel="支持我們，台灣讀者"
          onClick={onSupport}
        />
      </div>
    </div>
  )
}

export default ContactContent
