import { useState } from 'react'

import type { WindowMode, WindowPosition, WindowProps } from './Window'
import { Button } from './Button'
import Window from './Window'

export type NewsletterWindowProps = {
  mode?: WindowMode
  initialPosition?: WindowPosition
  onClose?: WindowProps['onClose']
}

export type NewsletterFormProps = {
  mode?: WindowMode
}

type NewsletterStatus = 'idle' | 'invalid' | 'preview'

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function NewsletterForm({ mode = 'desktop' }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<NewsletterStatus>('idle')

  const previewEmail = () => {
    if (!isValidEmail(email)) {
      setStatus('invalid')
      return
    }

    setStatus('preview')
  }

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col font-body text-ink-primary">
      <div className="retroScrollArea min-h-0 min-w-0 flex-1 overflow-y-auto">
        <div className={`grid gap-space-lg ${mode === 'mobile' ? 'p-space-md text-small' : 'p-space-lg text-body'}`}>
          <div className="grid gap-space-sm">
            <h2 className="font-medium leading-compact">訂閱電子報</h2>
            <p>每期動物公報、新文章與發刊消息，寄到你的信箱。</p>
          </div>

          <div className="grid gap-space-sm">
            <label htmlFor="newsletter-email">電子信箱</label>
            <div className="flex w-full min-w-0 items-center gap-space-sm border-thin border-line-strong bg-window-surface p-space-sm font-ui text-small">
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                placeholder="name@example.com"
                aria-invalid={status === 'invalid'}
                aria-describedby="newsletter-status"
                className="min-w-0 flex-1 bg-transparent text-ink-primary outline-none placeholder:text-ink-secondary"
                onChange={(event) => {
                  setEmail(event.target.value)
                  if (status !== 'idle') setStatus('idle')
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') previewEmail()
                }}
              />
              <Button
                appearance="outline"
                label="留下 Email"
                size="small"
                textSize="small"
                className="shrink-0"
                onClick={previewEmail}
              />
            </div>
            <p id="newsletter-status" className="min-h-5 text-small text-ink-secondary" role="status" aria-live="polite">
              {status === 'invalid'
                ? '請輸入有效的 Email。'
                : status === 'preview'
                  ? '已完成填寫預覽；目前尚未送出 Email。'
                  : '目前先完成填寫介面，尚未連接寄送服務。'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function NewsletterWindow({
  mode = 'desktop',
  initialPosition,
  onClose,
}: NewsletterWindowProps) {
  return (
    <Window
      mode={mode}
      title="電子報"
      headerIcon="mail"
      initialPosition={initialPosition}
      onClose={onClose}
    >
      <NewsletterForm mode={mode} />
    </Window>
  )
}

export default NewsletterWindow
