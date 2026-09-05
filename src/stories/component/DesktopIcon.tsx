import type { MouseEventHandler } from 'react'

export const desktopIconNames = ['R先生', '一五', '老莫', '阿雀', '季刊', '四月', '老鼠洞'] as const

export type DesktopIconName = (typeof desktopIconNames)[number]
export type DesktopIconSize = 'small' | 'medium' | 'large'

export type DesktopIconProps = {
  name: DesktopIconName
  label?: string
  imageSrc?: string
  imageAlt?: string
  size?: DesktopIconSize
  labelGap?: 'default' | 'tight'
  onActivate?: MouseEventHandler<HTMLButtonElement>
  className?: string
}

export const desktopIconSources: Record<DesktopIconName, string> = {
  R先生: '/assets/editor-icons/R先生.png',
  一五: '/assets/editor-icons/二號.png',
  老莫: '/assets/editor-icons/老莫.png',
  阿雀: '/assets/editor-icons/阿雀.png',
  季刊: '/assets/editor-icons/季刊.png',
  四月: '/assets/editor-icons/一號.png',
  老鼠洞: '/assets/editor-icons/老鼠洞.png',
}

const iconSizeClasses: Record<DesktopIconSize, string> = {
  small: 'h-space-2xl w-space-2xl',
  medium: 'h-space-3xl w-space-3xl',
  large: 'h-space-4xl w-space-4xl',
}

const iconImageScaleClasses: Record<DesktopIconName, string> = {
  R先生: '',
  一五: 'scale-75',
  老莫: '',
  阿雀: 'scale-125',
  季刊: 'scale-110 translate-y-space-xs',
  四月: 'scale-125',
  老鼠洞: 'scale-125 translate-y-space-sm',
}

export function DesktopIcon({
  name,
  label = name,
  imageSrc,
  imageAlt = '',
  size = 'medium',
  labelGap = 'default',
  onActivate,
  className = '',
}: DesktopIconProps) {
  const labelGapClass = labelGap === 'tight' ? 'gap-0' : 'gap-space-xs'

  return (
    <button
      type="button"
      className={`group inline-grid justify-items-center ${labelGapClass} bg-transparent px-space-sm py-space-xs font-ui text-caption text-ink-inverse transition-transform hover:scale-95 focus-visible:outline-2 focus-visible:outline-ink-primary ${className}`}
      aria-label={label}
      title={label}
      onClick={onActivate}
    >
      <span className={`${iconSizeClasses[size]} grid place-items-center`}>
        <img
          className={`block h-full w-full object-contain ${iconImageScaleClasses[name]}`}
          src={imageSrc ?? desktopIconSources[name]}
          alt={imageAlt}
          draggable="false"
        />
      </span>
      <span className="max-w-full truncate bg-overlay-label px-space-sm py-space-xs text-ink-inverse">{label}</span>
    </button>
  )
}

export default DesktopIcon
