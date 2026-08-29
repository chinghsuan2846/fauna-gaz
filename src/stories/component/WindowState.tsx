import type { ButtonProps, PixelIconName } from './Button'
import { Button, PixelIcon } from './Button'

export type WindowStateKind = 'empty' | 'error'

export type WindowStateProps = {
  kind?: WindowStateKind
  title?: string
  message?: string
  detail?: string
  actionLabel?: string
  actionHref?: string
  actionIcon?: PixelIconName
  onAction?: ButtonProps['onClick']
  className?: string
}

const defaultCopy: Record<WindowStateKind, { title: string; message: string; icon: PixelIconName; label: string }> = {
  empty: {
    title: '目前沒有內容',
    message: '這個視窗還沒有可顯示的內容。',
    icon: 'box-empty',
    label: 'EMPTY',
  },
  error: {
    title: '內容載入失敗',
    message: '發生一點問題，請稍後再試。',
    icon: 'alert-triangle',
    label: 'ERROR',
  },
}

function WindowState({
  kind = 'empty',
  title,
  message,
  detail,
  actionLabel,
  actionHref,
  actionIcon = 'chevron-right',
  onAction,
  className = '',
}: WindowStateProps) {
  const copy = defaultCopy[kind]
  const isError = kind === 'error'
  const hasAction = isError && Boolean(actionLabel && (actionHref || onAction))

  return (
    <div
      className={`grid min-h-0 flex-1 place-items-center p-space-lg text-center ${className}`}
      role={isError ? 'alert' : 'status'}
    >
      <div className="grid w-full max-w-[26rem] justify-items-center gap-space-lg">
        <div
          className="grid h-space-2xl w-space-2xl place-items-center"
          aria-hidden="true"
        >
          <PixelIcon
            name={copy.icon}
            size="large"
            className={`${isError ? '!h-space-2xl !w-space-2xl text-action-close-hover' : '!h-space-2xl !w-space-2xl text-ink-secondary'}`}
          />
        </div>

        <div className="grid gap-space-sm">
          <p className="font-ui text-caption uppercase tracking-display text-ink-secondary">{copy.label}</p>
          <h3 className="font-ui text-title font-medium leading-compact">{title ?? copy.title}</h3>
          <p className="font-body text-small text-ink-secondary">{message ?? copy.message}</p>
          {detail && <p className="font-body text-caption text-ink-secondary">{detail}</p>}
        </div>

        {hasAction && (
          <Button
            appearance="outline"
            label={actionLabel}
            icon={actionIcon}
            iconPosition="right"
            iconSize="small"
            size="large"
            textSize="small"
            className="mt-0"
            href={actionHref}
            ariaLabel={actionLabel}
            onClick={onAction}
          />
        )}
      </div>
    </div>
  )
}

export default WindowState
