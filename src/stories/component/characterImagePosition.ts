export type CharacterImagePosition =
  | 'default'
  | 'left'
  | 'slightly-left'
  | 'slightly-left-bottom'
  | 'far-left'
  | 'extra-left'
  | 'right'

const profileImagePositionOverrides: Record<string, CharacterImagePosition> = {
  R先生: 'extra-left',
  阿雀: 'right',
  四月: 'far-left',
  一五: 'right',
}

const bubbleImagePositionOverrides: Record<string, CharacterImagePosition> = {
  R先生: 'slightly-left',
  阿雀: 'right',
  四月: 'slightly-left-bottom',
  一五: 'right',
}

const desktopBubbleImagePositionOverrides: Record<string, CharacterImagePosition> = {
  四月: 'right',
}

export const characterImagePositionClasses: Record<CharacterImagePosition, string> = {
  default: '-translate-x-space-xs',
  left: '-translate-x-space-sm',
  'slightly-left': '-translate-x-space-sm sm:-translate-x-[0.75rem]',
  'slightly-left-bottom': '-translate-x-space-xs sm:-translate-x-[0.75rem]',
  'far-left': '-translate-x-space-md',
  'extra-left': '-translate-x-space-lg',
  right: 'translate-x-space-xs',
}

export const characterImageScaleClasses: Record<CharacterImagePosition, string> = {
  default: 'scale-125',
  left: 'scale-125',
  'slightly-left': 'scale-125',
  'slightly-left-bottom': 'scale-125',
  'far-left': 'scale-125',
  'extra-left': 'scale-110',
  right: 'scale-125',
}

export const characterImageFitClasses: Record<CharacterImagePosition, string> = {
  default: 'object-cover',
  left: 'object-cover',
  'slightly-left': 'object-cover',
  'slightly-left-bottom': 'object-cover',
  'far-left': 'object-cover',
  'extra-left': 'object-contain',
  right: 'object-cover',
}

export const characterImageObjectPositionClasses: Record<CharacterImagePosition, string> = {
  default: 'object-top',
  left: 'object-top',
  'slightly-left': 'object-right-top',
  'slightly-left-bottom': 'object-right-bottom',
  'far-left': 'object-top',
  'extra-left': 'object-top',
  right: 'object-top',
}

export function getProfileImagePosition(name?: string): CharacterImagePosition {
  return profileImagePositionOverrides[name ?? ''] ?? 'default'
}

export function getBubbleImagePosition(
  name?: string,
  viewport: 'desktop' | 'tablet' | 'mobile' = 'desktop',
): CharacterImagePosition {
  if (viewport === 'desktop') {
    return desktopBubbleImagePositionOverrides[name ?? ''] ?? bubbleImagePositionOverrides[name ?? ''] ?? 'default'
  }

  return bubbleImagePositionOverrides[name ?? ''] ?? 'default'
}
