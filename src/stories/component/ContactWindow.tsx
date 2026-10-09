import { useState } from 'react'

import type { ContactInfo } from '../../lib/contentAdapter'
import type { WindowMode, WindowPosition, WindowProps } from './Window'
import { Button } from './Button'
import ContactContent from './ContactContent'
import { NewsletterForm } from './NewsletterWindow'
import Window from './Window'

type ContactTab = 'contact' | 'newsletter'

export type ContactWindowProps = {
  mode?: WindowMode
  contact?: ContactInfo
  initialPosition?: WindowPosition
  onClose?: WindowProps['onClose']
  onSupport?: WindowProps['onSupport']
}

function ContactWindow({
  mode = 'mobile',
  contact,
  initialPosition,
  onClose,
  onSupport,
}: ContactWindowProps) {
  const [activeTab, setActiveTab] = useState<ContactTab>('contact')
  const isMobile = mode === 'mobile'

  return (
    <Window
      mode={mode}
      title={contact?.title ?? '聯絡我'}
      initialPosition={initialPosition}
      onClose={onClose}
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col text-ink-primary">
        <nav
          className="flex shrink-0 flex-wrap gap-space-xs border-b-thin border-line-strong bg-window-surface p-space-sm"
          aria-label="聯絡選單"
        >
          <Button
            label="聯絡我"
            appearance={activeTab === 'contact' ? 'outline' : 'text'}
            size="small"
            textSize="small"
            ariaLabel="查看聯絡方式"
            onClick={() => setActiveTab('contact')}
          />
          <Button
            label="訂閱電子報"
            appearance={activeTab === 'newsletter' ? 'outline' : 'text'}
            size="small"
            textSize="small"
            ariaLabel="訂閱電子報"
            onClick={() => setActiveTab('newsletter')}
          />
        </nav>

        {activeTab === 'contact' && contact ? (
          <ContactContent contact={contact} isMobile={isMobile} onSupport={onSupport} />
        ) : activeTab === 'newsletter' ? (
          <NewsletterForm mode={mode} />
        ) : (
          <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center p-space-md font-body text-small text-ink-secondary">
            目前沒有聯絡資訊。
          </div>
        )}
      </div>
    </Window>
  )
}

export default ContactWindow
