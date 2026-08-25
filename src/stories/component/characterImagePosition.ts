export type CharacterImagePosition = 'default' | 'left' | 'far-left' | 'extra-left' | 'right'

const profileImagePositionOverrides: Record<string, CharacterImagePosition> = {
  R先生: 'extra-left',
  阿雀: 'right',
  一號: 'far-left',
  二號: 'right',
}

const bubbleImagePositionOverrides: Record<string, CharacterImagePosition> = {
  R先生: 'left',
  阿雀: 'right',
  一號: 'left',
  二號: 'right',
}

export const characterImagePositionClasses: Record<CharacterImagePosition, string> = {
  default: '-translate-x-space-xs',
  left: '-translate-x-space-sm',
  'far-left': '-translate-x-space-md',
  'extra-left': '-translate-x-space-lg',
  right: 'translate-x-space-xs',
}

export const characterImageScaleClasses: Record<CharacterImagePosition, string> = {
  default: 'scale-125',
  left: 'scale-125',
  'far-left': 'scale-125',
  'extra-left': 'scale-110',
  right: 'scale-125',
}

export const characterImageFitClasses: Record<CharacterImagePosition, string> = {
  default: 'object-cover',
  left: 'object-cover',
  'far-left': 'object-cover',
  'extra-left': 'object-contain',
  right: 'object-cover',
}

export function getProfileImagePosition(name?: string): CharacterImagePosition {
  return profileImagePositionOverrides[name ?? ''] ?? 'default'
}

export function getBubbleImagePosition(name?: string): CharacterImagePosition {
  return bubbleImagePositionOverrides[name ?? ''] ?? 'default'
}
