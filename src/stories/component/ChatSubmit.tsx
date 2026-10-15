import { useId, useState } from 'react'

import { Button } from './Button'

export type ChatSubmitProps = {
  placeholder?: string
  submitLabel?: string
  errorMessage?: string
  className?: string
  onSubmit?: (message: string) => void
}

export function ChatSubmit({
  placeholder = '寫點什麼吧',
  submitLabel = '送出',
  errorMessage,
  className = '',
  onSubmit,
}: ChatSubmitProps) {
  const [value, setValue] = useState('')
  const errorId = useId()

  const submitMessage = () => {
    const message = value.trim()
    if (!message) return

    onSubmit?.(message)
    setValue('')
  }

  return (
    <div className="grid w-full gap-space-xs">
      <div
        className={`flex w-full items-center gap-space-sm border-thin ${errorMessage ? 'border-action-close-hover' : 'border-line-strong'} bg-window-surface p-space-sm font-ui text-small ${className}`}
      >
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          aria-label={placeholder}
          aria-invalid={Boolean(errorMessage)}
          aria-describedby={errorMessage ? errorId : undefined}
          className="min-w-0 flex-1 bg-transparent text-ink-primary outline-none placeholder:text-ink-secondary"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') submitMessage()
          }}
        />
        <Button
          appearance="outline"
          label={submitLabel}
          size="small"
          textSize="small"
          className="shrink-0"
          onClick={submitMessage}
        />
      </div>
      {errorMessage ? (
        <p id={errorId} className="text-caption text-action-close-hover" role="alert">
          {errorMessage}
        </p>
      ) : null}
    </div>
  )
}

export default ChatSubmit
