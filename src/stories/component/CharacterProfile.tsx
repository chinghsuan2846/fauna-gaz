import type { ReactNode } from 'react'
import {
  characterImageFitClasses,
  characterImageObjectPositionClasses,
  characterImagePositionClasses,
  characterImageScaleClasses,
  getProfileImagePosition,
  type CharacterImagePosition,
} from './characterImagePosition'

export type CharacterProfileVariant = 'full' | 'compact'
export type CharacterProfileImageScale = 'default' | 'large'

export type CharacterProfileProps = {
  imageSrc: string
  imageAlt?: string
  name: string
  role: string
  species: string
  variant?: CharacterProfileVariant
  imageScale?: CharacterProfileImageScale
  imagePosition?: CharacterImagePosition
  className?: string
}

const variantClasses: Record<CharacterProfileVariant, string> = {
  full: 'grid justify-items-center gap-space-lg text-center',
  compact: 'grid grid-cols-[auto_1fr] items-start gap-space-md text-left',
}

const imageFrameClasses: Record<CharacterProfileVariant, string> = {
  full: 'h-avatar-full w-avatar-full',
  compact: 'h-space-2xl w-space-2xl',
}

const imageScaleClasses: Record<CharacterProfileVariant, Record<CharacterProfileImageScale, string>> = {
  full: {
    default: '',
    large: 'origin-top translate-y-space-sm',
  },
  compact: {
    default: 'translate-y-space-xs',
    large: 'origin-top translate-y-space-xs',
  },
}

const compactProfileImageOverrides: Partial<
  Record<CharacterImagePosition, { fit: string; scale: string; position: string; objectPosition?: string }>
> = {
  'far-left': {
    fit: 'object-cover',
    scale: 'scale-125',
    position: '-translate-x-space-xs sm:-translate-x-space-sm',
    objectPosition: 'object-right-bottom',
  },
  'extra-left': {
    fit: 'object-contain',
    scale: 'scale-125 translate-y-space-xs',
    position: '-translate-x-space-sm',
  },
}

function CharacterImage({
  imageSrc,
  imageAlt,
  variant,
  imageScale,
  imagePosition,
}: Pick<CharacterProfileProps, 'imageSrc' | 'imageAlt' | 'imageScale' | 'imagePosition'> & {
  variant: CharacterProfileVariant
}) {
  const resolvedImagePosition = imagePosition ?? 'default'
  const compactOverride = variant === 'compact' ? compactProfileImageOverrides[resolvedImagePosition] : undefined
  const imageFit = compactOverride?.fit ?? characterImageFitClasses[resolvedImagePosition]
  const imageScaleClass = compactOverride?.scale ?? imageScaleClasses[variant][imageScale ?? 'default']
  const characterImageScale = compactOverride ? '' : characterImageScaleClasses[resolvedImagePosition]
  const imagePositionClass = compactOverride?.position ?? characterImagePositionClasses[resolvedImagePosition]
  const objectPositionClass = compactOverride?.objectPosition ?? characterImageObjectPositionClasses[resolvedImagePosition]

  return (
    <div className={`${imageFrameClasses[variant]} overflow-hidden border-thin border-line-strong bg-scrollbar-track`}>
      <img
        className={`block h-full w-full ${objectPositionClass} ${imageFit} ${imageScaleClass} ${characterImageScale} ${imagePositionClass}`}
        src={imageSrc}
        alt={imageAlt}
        draggable="false"
      />
    </div>
  )
}

function FullProfile({ role, name, species }: Pick<CharacterProfileProps, 'role' | 'name' | 'species'>) {
  return (
    <div className="grid gap-space-sm">
      <p className="font-ui text-small text-ink-secondary">{role}</p>
      <h2 className="font-ui text-lead font-medium text-ink-primary">{name}</h2>
      <p className="font-ui text-small text-ink-primary">{species}</p>
    </div>
  )
}

function CompactProfile({ name, role, species }: Pick<CharacterProfileProps, 'name' | 'role' | 'species'>) {
  return (
    <div className="grid gap-space-xs pt-space-xs">
      <div className="flex flex-wrap items-baseline gap-x-space-md gap-y-space-xs">
        <h2 className="font-ui text-small font-medium text-ink-primary">{name}</h2>
        <p className="font-ui text-small text-ink-secondary">{role}</p>
      </div>
      <p className="font-ui text-small text-ink-primary">{species}</p>
    </div>
  )
}

export function CharacterProfile({
  imageSrc,
  imageAlt,
  name,
  role,
  species,
  variant = 'full',
  imageScale = 'default',
  imagePosition,
  className = '',
}: CharacterProfileProps) {
  const resolvedImagePosition = imagePosition ?? getProfileImagePosition(name)
  const content: ReactNode =
    variant === 'full' ? (
      <FullProfile role={role} name={name} species={species} />
    ) : (
      <CompactProfile name={name} role={role} species={species} />
    )

  return (
    <article className={`${variantClasses[variant]} font-ui text-ink-primary ${className}`}>
      <CharacterImage
        imageSrc={imageSrc}
        imageAlt={imageAlt ?? `${name}角色插圖`}
        imageScale={imageScale}
        imagePosition={resolvedImagePosition}
        variant={variant}
      />
      {content}
    </article>
  )
}

export default CharacterProfile
