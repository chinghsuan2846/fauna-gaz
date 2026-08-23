import type { MouseEventHandler, ReactNode } from 'react'

export type ButtonAppearance = 'outline' | 'text'
export type ButtonPadding = 'default' | 'footer' | 'close' | 'close-mobile'
export type ButtonSize = 'large' | 'small'
export type ButtonState = 'default' | 'hover' | 'disabled' | 'loading'
export type ButtonTextSize = 'body' | 'small' | 'caption'
export type ButtonTone = 'default' | 'brand' | 'close'
export type PixelIconName =
  | 'menu'
  | 'message'
  | 'chevron-left'
  | 'chevron-right'
  | 'coffee'
  | 'music-on'
  | 'music-off'
  | 'volume-on'
  | 'volume-off'
  | 'close'
  | 'loading'
export type ButtonIconPosition = 'left' | 'right'

export type PixelIconProps = {
  name?: PixelIconName
  size?: ButtonSize
  className?: string
}

export type ButtonProps = {
  appearance?: ButtonAppearance
  label?: string
  icon?: PixelIconName
  iconPosition?: ButtonIconPosition
  iconSize?: ButtonSize
  iconOnly?: boolean
  padding?: ButtonPadding
  textSize?: ButtonTextSize
  tone?: ButtonTone
  size?: ButtonSize
  state?: ButtonState
  ariaLabel?: string
  href?: string
  className?: string
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const iconShapes: Record<PixelIconName, ReactNode> = {
  menu: (
    <>
      <rect x="2" y="3" width="12" height="1" />
      <rect x="2" y="7" width="12" height="1" />
      <rect x="2" y="11" width="12" height="1" />
    </>
  ),
  message: (
    <>
      <rect x="2" y="3" width="12" height="1" />
      <rect x="2" y="4" width="1" height="7" />
      <rect x="13" y="4" width="1" height="7" />
      <rect x="3" y="10" width="10" height="1" />
      <rect x="3" y="11" width="1" height="1" />
      <rect x="4" y="12" width="2" height="1" />
      <rect x="5" y="6" width="1" height="1" />
      <rect x="7" y="6" width="1" height="1" />
      <rect x="9" y="6" width="1" height="1" />
    </>
  ),
  'chevron-left': (
    <>
      <rect x="6" y="2" width="2" height="2" />
      <rect x="4" y="4" width="2" height="2" />
      <rect x="2" y="6" width="2" height="4" />
      <rect x="4" y="10" width="2" height="2" />
      <rect x="6" y="12" width="2" height="2" />
    </>
  ),
  'chevron-right': (
    <>
      <rect x="8" y="2" width="2" height="2" />
      <rect x="10" y="4" width="2" height="2" />
      <rect x="12" y="6" width="2" height="4" />
      <rect x="10" y="10" width="2" height="2" />
      <rect x="8" y="12" width="2" height="2" />
    </>
  ),
  coffee: (
    <>
      <rect x="3" y="6" width="8" height="7" />
      <rect x="11" y="8" width="2" height="4" />
      <rect x="5" y="4" width="1" height="2" />
      <rect x="8" y="3" width="1" height="3" />
      <rect x="2" y="13" width="10" height="1" />
    </>
  ),
  'music-on': (
    <>
      <rect x="10" y="2" width="2" height="9" />
      <rect x="8" y="2" width="6" height="2" />
      <rect x="7" y="9" width="5" height="3" />
      <rect x="5" y="11" width="6" height="3" />
    </>
  ),
  'music-off': (
    <>
      <rect x="10" y="2" width="2" height="9" />
      <rect x="8" y="2" width="6" height="2" />
      <rect x="7" y="9" width="5" height="3" />
      <rect x="5" y="11" width="6" height="3" />
      <rect x="3" y="4" width="1" height="2" />
      <rect x="5" y="6" width="1" height="2" />
      <rect x="7" y="8" width="1" height="2" />
      <rect x="9" y="10" width="1" height="2" />
      <rect x="11" y="12" width="1" height="2" />
    </>
  ),
  'volume-on': (
    <>
      <rect x="2" y="6" width="3" height="4" />
      <rect x="5" y="5" width="2" height="6" />
      <rect x="7" y="3" width="2" height="10" />
      <rect x="10" y="5" width="1" height="1" />
      <rect x="11" y="6" width="1" height="4" />
      <rect x="10" y="10" width="1" height="1" />
      <rect x="12" y="3" width="1" height="1" />
      <rect x="13" y="4" width="1" height="2" />
      <rect x="14" y="6" width="1" height="4" />
      <rect x="13" y="10" width="1" height="2" />
      <rect x="12" y="12" width="1" height="1" />
    </>
  ),
  'volume-off': (
    <>
      <rect x="2" y="6" width="3" height="4" />
      <rect x="5" y="5" width="2" height="6" />
      <rect x="7" y="3" width="2" height="10" />
      <rect x="10" y="4" width="1" height="2" />
      <rect x="11" y="5" width="1" height="2" />
      <rect x="12" y="6" width="1" height="2" />
      <rect x="13" y="7" width="1" height="2" />
      <rect x="12" y="8" width="1" height="2" />
      <rect x="11" y="9" width="1" height="2" />
      <rect x="10" y="10" width="1" height="2" />
    </>
  ),
  loading: (
    <>
      <rect x="7" y="1" width="2" height="3" />
      <rect x="11" y="3" width="2" height="2" />
      <rect x="12" y="7" width="3" height="2" />
      <rect x="11" y="11" width="2" height="2" />
      <rect x="7" y="12" width="2" height="3" />
      <rect x="3" y="11" width="2" height="2" />
      <rect x="1" y="7" width="3" height="2" />
      <rect x="3" y="3" width="2" height="2" />
    </>
  ),
  close: (
    <>
      <rect x="2" y="3" width="2" height="2" />
      <rect x="4" y="5" width="2" height="2" />
      <rect x="6" y="7" width="4" height="2" />
      <rect x="10" y="5" width="2" height="2" />
      <rect x="12" y="3" width="2" height="2" />
      <rect x="2" y="11" width="2" height="2" />
      <rect x="4" y="9" width="2" height="2" />
      <rect x="10" y="9" width="2" height="2" />
      <rect x="12" y="11" width="2" height="2" />
    </>
  ),
}

const iconSizeClasses: Record<ButtonSize, string> = {
  large: 'h-space-lg w-space-lg',
  small: 'h-space-md w-space-md',
}

export function PixelIcon({ name = 'menu', size = 'large', className = '' }: PixelIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={`${iconSizeClasses[size]} shrink-0 ${className}`}
      fill="currentColor"
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
    >
      {iconShapes[name]}
    </svg>
  )
}

const variantStateClasses: Record<ButtonAppearance, Record<ButtonState, string>> = {
  outline: {
    default: 'border-thin border-ink-primary bg-window-surface text-ink-primary hover:bg-ink-primary-hover hover:text-ink-primary',
    hover: 'border-thin border-ink-primary bg-ink-primary-hover text-ink-primary',
    disabled: 'border-thin border-line-subtle bg-window-surface text-ink-muted',
    loading: 'border-thin border-ink-primary bg-window-surface text-ink-primary',
  },
  text: {
    default: 'text-ink-primary hover:bg-ink-primary-hover hover:text-ink-primary',
    hover: 'bg-ink-primary-hover text-ink-primary',
    disabled: 'text-ink-muted',
    loading: 'text-ink-primary',
  },
}

const brandStateClasses: Record<ButtonState, string> = {
  default: 'bg-window-header text-ink-inverse hover:bg-window-header hover:text-ink-inverse',
  hover: 'bg-window-header text-ink-inverse',
  disabled: 'bg-window-header text-ink-muted',
  loading: 'bg-window-header text-ink-inverse',
}

const closeStateClasses: Record<ButtonState, string> = {
  default: 'bg-ink-inverse text-window-header hover:bg-action-close-hover hover:text-window-header',
  hover: 'bg-action-close-hover text-window-header',
  disabled: 'bg-ink-inverse text-ink-muted',
  loading: 'bg-ink-inverse text-window-header',
}

const sizeClasses: Record<ButtonSize, string> = {
  large: 'px-space-button-lg-x py-space-sm',
  small: 'px-space-sm py-space-xs',
}

const paddingClasses: Record<ButtonPadding, string> = {
  default: '',
  footer: 'min-h-space-button-footer-h px-space-md py-space-sm',
  close: 'px-space-sm py-space-sm',
  'close-mobile': 'px-space-xs py-space-xs',
}

const textSizeClasses: Record<ButtonTextSize, string> = {
  body: 'text-body',
  small: 'text-small',
  caption: 'text-caption',
}

export function Button({
  appearance = 'outline',
  label = '',
  icon,
  iconPosition = 'left',
  iconSize,
  iconOnly = false,
  padding = 'default',
  textSize = 'body',
  tone = 'default',
  size = 'large',
  state = 'default',
  ariaLabel,
  href,
  className = '',
  onClick,
}: ButtonProps) {
  const isLoading = state === 'loading'
  const isUnavailable = state === 'disabled' || isLoading
  const resolvedIcon = isLoading ? 'loading' : icon
  const showIcon = iconOnly || Boolean(resolvedIcon) || isLoading
  const resolvedIconPosition: ButtonIconPosition = isLoading ? 'left' : iconPosition
  const resolvedIconSize = iconSize ?? size
  const classes = [
    'inline-flex items-center justify-center gap-space-xs font-ui font-regular leading-compact transition-colors',
    sizeClasses[size],
    paddingClasses[padding],
    textSizeClasses[textSize],
    tone === 'brand'
      ? brandStateClasses[state]
      : tone === 'close'
        ? closeStateClasses[state]
        : variantStateClasses[appearance][state],
    className,
  ].join(' ')

  const content = (
    <>
      {showIcon && resolvedIconPosition === 'left' && (
        <PixelIcon name={resolvedIcon} size={resolvedIconSize} className={isLoading ? 'animate-pulse' : ''} />
      )}
      {!iconOnly && label}
      {showIcon && resolvedIconPosition === 'right' && (
        <PixelIcon name={resolvedIcon} size={resolvedIconSize} className={isLoading ? 'animate-pulse' : ''} />
      )}
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        aria-disabled={isUnavailable || undefined}
        aria-label={iconOnly ? ariaLabel || label : undefined}
      >
        {content}
      </a>
    )
  }

  return (
    <button
      type="button"
      className={classes}
      disabled={isUnavailable}
      aria-busy={isLoading}
      aria-label={iconOnly ? ariaLabel || label : undefined}
      onClick={onClick}
    >
      {content}
    </button>
  )
}
