import { Button } from './Button'

export type ChatSubmitProps = {
  placeholder?: string
  submitLabel?: string
  className?: string
}

export function ChatSubmit({
  placeholder = '寫點什麼吧',
  submitLabel = '送出',
  className = '',
}: ChatSubmitProps) {
  return (
    <div
      className={`flex w-full items-center gap-space-sm border-thin border-line-strong bg-window-surface p-space-sm font-ui text-small ${className}`}
    >
      <span className="min-w-0 flex-1 break-words text-ink-secondary">{placeholder}</span>
      <Button
        appearance="outline"
        label={submitLabel}
        size="small"
        textSize="small"
        className="shrink-0"
      />
    </div>
  )
}

export default ChatSubmit
